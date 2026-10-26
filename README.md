# Cloud App — Michael James Schuler

A small React application built for a Utah Valley University Cloud Computing
assignment. It is a national-park-themed personal site with a header that links
to five pages, and it is packaged as a Docker container so it can be deployed to any
cloud platform that runs containers.

## What it shows

| Field      | Value                                              |
| ---------- | -------------------------------------------------- |
| Name       | Michael James Schuler                              |
| University | Utah Valley University                             |
| Major      | Information Systems and Technology                 |
| Education  | Associate Degree (completed), Bachelor's (in progress) |

## Pages

| Path           | Page        | Content                                       |
| -------------- | ----------- | --------------------------------------------- |
| `/`            | Home        | Park-sign card with name, ID, major, degrees  |
| `/about`       | About Me    | Short bio and quick facts                     |
| `/assignments` | Assignments | Cards for each class assignment               |
| `/assignments/<slug>` | Write-up | Full write-up for one assignment        |
| `/photos`      | Photos      | Photo gallery                                 |
| `/other`       | Other       | Interests, skills, contact                    |

## Tech stack

- **React 19** + **Vite** for the front end
- **React Router** for the pages
- **nginx** (Alpine) to serve the production build
- **Docker** multi-stage build (Node builds the app, nginx serves it)

The landscape and the UVU badge are inline SVG drawn in the app, so there are no
external images, fonts, or network calls at runtime. The badge is a simple
text-based mark, not the official UVU logo.

## Project structure

```
.
├── Dockerfile          # multi-stage build: node -> nginx
├── docker-compose.yml  # site + Grafana, Loki, Alloy
├── .env.example        # Grafana admin login (copy to .env)
├── monitoring/         # Loki, Alloy, Grafana config + dashboard
├── nginx.conf          # static hosting, JSON logs, downloads, /healthz
├── index.html          # Vite entry page
├── photos-src/         # original photos (not in git or Docker)
├── scripts/
│   └── process_photos.py
├── package.json
├── vite.config.js
├── public/
│   ├── favicon.svg
│   └── photos/         # generated web copies (npm run photos)
└── src/
    ├── main.jsx        # React entry point + router
    ├── App.jsx         # route table
    ├── App.css         # forest green / national park styling
    ├── data/
    │   ├── student.js      # personal info
    │   ├── photos.json     # generated photo list + captions
    │   └── assignments.js  # assignment cards + write-ups
    ├── components/     # Layout (header/nav), Landscape, UvuMark, Panel
    └── pages/          # Home, About, Assignments, AssignmentDetail, Photos, Other, NotFound
```

## Run locally (without Docker)

Requires Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev
```

Open <http://localhost:5173>.

To build and preview the production bundle:

```bash
npm run build
npm run preview
```

## Run with Docker

Build the image:

```bash
docker build -t cloudapp .
```

Run the container (maps port 8080 on your machine to port 80 in the container):

```bash
docker run -d --name cloudapp -p 8080:80 cloudapp
```

Open <http://localhost:8080>.

Stop and remove it:

```bash
docker rm -f cloudapp
```

## Run with monitoring (Grafana + Loki)

`docker-compose.yml` runs the site together with Grafana, Loki, and Grafana
Alloy, which collect nginx's access logs and show page traffic and photo
downloads on a dashboard:

```bash
cp .env.example .env          # set GRAFANA_ADMIN_PASSWORD
docker compose up -d --build
```

The site is on port 8080 as before. Grafana is only reachable from the server
itself (use an SSH tunnel). Full setup, queries, alerts, and security notes are
in [monitoring/README.md](monitoring/README.md).

## Deploying to the cloud

The container listens on **port 80** and exposes a health check at `/healthz`
(returns `200 ok`), which can be used for load balancer or container health
probes.

General steps for any provider (AWS ECS/App Runner, Azure Container Apps,
Google Cloud Run, etc.):

1. Build the image for the platform's CPU architecture. On an Apple Silicon Mac,
   most cloud hosts need `linux/amd64`:

   ```bash
   docker build --platform linux/amd64 -t <registry>/<repo>/cloudapp:1.0 .
   ```

2. Push it to a container registry (Docker Hub, ECR, ACR, Artifact Registry):

   ```bash
   docker push <registry>/<repo>/cloudapp:1.0
   ```

3. Create a service from that image with container port **80** open to the
   internet and the health check path set to `/healthz`.

## Customizing

Personal info lives in `src/data/student.js` (`student`: name, ID, major,
degrees).

Assignments live in `src/data/assignments.js`. Each one has a `slug` (its URL,
`/assignments/<slug>`) and a list of `sections`. A section has a `title`, a
`guide` checklist (shown until the section has a paragraph), and `blocks` of
content: paragraphs, lists, steps, code, images, tables, problem/solution pairs,
and links. The block types are documented at the top of the file. Empty code,
image, and table blocks show as placeholders. Screenshots go in
`public/assignments/<slug>/`.

### Photos

Original photos go in `photos-src/`, one folder per album (subfolders are
fine, e.g. `photos-src/Landscapes/Oregon:Washington/`). Then run:

```bash
npm run photos
```

This runs `scripts/process_photos.py` (needs Python 3 with Pillow:
`python3 -m pip install Pillow`), which writes to `public/photos/`:

- a full-size copy of each photo (long edge capped at 2560 px) for the
  Download button
- a small thumbnail for the gallery grid

and lists everything in `src/data/photos.json`. The copies are re-encoded
**without EXIF metadata**, so the GPS location and camera details in phone
photos are not published. `photos-src/` is excluded from git and from the Docker
image, so the originals never leave your machine.

To add captions, edit the `caption` fields in `src/data/photos.json`. They are
kept the next time the script runs. Photos without a caption show the date they
were taken.

The Other page has placeholder text to replace in `src/pages/Other.jsx`.

Page links work when visited directly (for example `/photos`) because
`nginx.conf` sends unknown paths back to `index.html`.

Colors are CSS variables at the top of `src/App.css` (`--forest` is forest
green, `#228b22`).

## Author

Michael James Schuler — Utah Valley University, Information Systems and Technology
