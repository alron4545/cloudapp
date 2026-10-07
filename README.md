# Cloud App — Michael James Schuler

A small React application built for a Utah Valley University Cloud Computing
assignment. It displays a national-park-style "trail sign" with my student
information and is packaged as a Docker container so it can be deployed to any
cloud platform that runs containers.

## What it shows

| Field      | Value                                              |
| ---------- | -------------------------------------------------- |
| Name       | Michael James Schuler                              |
| Student ID | 10866702                                           |
| University | Utah Valley University                             |
| Major      | Information Systems and Technology                 |
| Education  | Associate Degree (completed), Bachelor's (in progress) |

## Tech stack

- **React 19** + **Vite** for the front end
- **nginx** (Alpine) to serve the production build
- **Docker** multi-stage build (Node builds the app, nginx serves it)

The landscape and the UVU badge are inline SVG drawn in the app, so there are no
external images, fonts, or network calls at runtime. The badge is a simple
text-based mark, not the official UVU logo.

## Project structure

```
.
├── Dockerfile          # multi-stage build: node -> nginx
├── nginx.conf          # static hosting, SPA fallback, /healthz
├── index.html          # Vite entry page
├── package.json
├── vite.config.js
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx        # React entry point
    ├── App.jsx         # page content (edit student info here)
    └── App.css         # forest green / national park styling
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

All displayed information lives in the `student` object at the top of
`src/App.jsx`. Colors are CSS variables at the top of `src/App.css`
(`--forest` is forest green, `#228b22`).

## Author

Michael James Schuler — Utah Valley University, Information Systems and Technology
