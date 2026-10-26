# Monitoring: Grafana + Loki

Log-based monitoring for the personal site, focused on page traffic and photo
downloads.

```
                 ┌──────────────────────── EC2 instance (Ubuntu) ───────────────────────┐
 Visitor ──8080──▶ web (nginx)                                                          │
                 │   │ JSON access log → stdout                                         │
                 │   ▼                                                                  │
                 │ Docker engine ──docker.sock (ro)──▶ alloy ──push──▶ loki (volume)    │
                 │                                                       ▲              │
                 │                                    LogQL queries ─────┘              │
                 │                                         grafana (127.0.0.1:3000)     │
                 └────────────────────────────────────────────▲─────────────────────────┘
 You ──SSH tunnel (port 22)───────────────────────────────────┘
```

| Service | Image | Published port | Job |
| ------- | ----- | -------------- | --- |
| `web` | built from `Dockerfile` | `8080` (public) | Serves the site, writes one JSON log line per request |
| `alloy` | `grafana/alloy:v1.8.0` | none | Discovers containers labeled `logging=alloy`, tails their logs, pushes to Loki |
| `loki` | `grafana/loki:3.5.0` | none | Stores and indexes logs on the `loki-data` volume, 30-day retention |
| `grafana` | `grafana/grafana:12.0.0` | `127.0.0.1:3000` only | Dashboard and alert rules, provisioned from files |

## Files

```
docker-compose.yml                         all four services
nginx.conf                                 JSON log format + /download/photos/ route
monitoring/
├── loki/config.yaml                       single-process Loki, filesystem storage
├── alloy/config.alloy                     Docker discovery → Loki
└── grafana/
    ├── dashboards/site-traffic.json       "Personal Site: Traffic & Downloads"
    └── provisioning/
        ├── datasources/loki.yaml          Loki data source (uid: loki)
        ├── dashboards/dashboards.yaml     loads dashboards/ into "Personal Site"
        └── alerting/alert-rules.yaml      download spike, 5xx errors, 404 burst
```

## Run it

On the EC2 instance (Ubuntu), with Docker and the Compose plugin installed:

```bash
sudo apt-get update && sudo apt-get install -y docker.io docker-compose-v2
sudo usermod -aG docker $USER   # then log out and back in
```

Copy the project to the instance, then from the project root:

```bash
cp .env.example .env
nano .env                       # set GRAFANA_ADMIN_PASSWORD
docker rm -f personalapp        # only if the old manually started container exists
docker compose up -d --build
docker compose ps
```

Compose refuses to start if `GRAFANA_ADMIN_PASSWORD` is not set.

### Open Grafana

Grafana listens only on the instance's localhost, so it is never exposed to the
internet. From your Mac, open an SSH tunnel:

```bash
ssh -i /path/to/your-key.pem -L 3000:localhost:3000 ubuntu@<EC2-PUBLIC-IP>
```

Leave that running and browse to <http://localhost:3000>. Log in with the
username and password from `.env`, then open
**Dashboards → Personal Site → Personal Site: Traffic & Downloads**.

No security group change is needed: the tunnel uses port 22.

### Check that logs are flowing

```bash
curl -s -o /dev/null http://localhost:8080/
docker compose logs web --tail 3          # should be JSON lines
docker compose logs alloy --tail 20       # no errors about Loki
```

In Grafana go to **Explore**, pick **Loki**, and run `{service="web"}`.

## Useful LogQL queries

```logql
# Every request, parsed
{service="web"} | json

# Downloads per photo in the last 24 hours
sum by (path) (count_over_time({service="web"} | json | __error__="" | path=~"/download/.*" | status < 400 [24h]))

# Requests per status code, per 5 minutes
sum by (status) (count_over_time({service="web"} | json | __error__="" [5m]))

# Most active client IPs
topk(10, sum by (remote_addr) (count_over_time({service="web"} | json | __error__="" [1h])))
```

## Alerts

Defined in `grafana/provisioning/alerting/alert-rules.yaml`, visible under
**Alerting → Alert rules → Site Alerts**:

| Rule | Fires when |
| ---- | ---------- |
| Download spike | more than 20 photo downloads in 10 minutes |
| Server errors (5xx) | any 5xx response in 5 minutes |
| Burst of 404s | more than 30 not-found responses in 5 minutes (often bots scanning) |

The rules evaluate every minute and change state in Grafana. To be notified,
add a contact point (email, Discord, Slack, etc.) under **Alerting → Contact
points** and point the default notification policy at it.

## Security notes

- **Grafana** is bound to `127.0.0.1`, reached only through SSH. The admin
  password comes from `.env` (git-ignored); sign-up and anonymous access are off.
- **Loki** has no published port and no auth (`auth_enabled: false`), so it is
  reachable only by other containers on the Compose network.
- **Docker socket**: Alloy mounts `/var/run/docker.sock` read-only to discover
  containers and read logs. Read-only on the file does not limit the Docker
  API, so anything that compromises the Alloy container effectively controls
  Docker on the host. Keep the Alloy image pinned and updated.
- **Personal data**: access logs contain visitor IP addresses and user agents.
  Loki deletes logs after 30 days (`retention_period: 720h`).
- **Security group**: only 22 (SSH, ideally limited to your IP) and 8080 need to
  be open. Do not open 3000 or 3100.

## Resource use

The four containers fit on a 1 GB instance (t2/t3.micro) at low traffic, but
it is tight. If Grafana or Loki get killed for memory (`docker compose ps` shows
restarts), add a swap file or move to a t3.small.
