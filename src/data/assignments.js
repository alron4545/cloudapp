// The monitoring write-up shows the real config files, imported as text so the
// blog always matches what is deployed.
import composeFile from '../../docker-compose.yml?raw'
import nginxConf from '../../nginx.conf?raw'
import alloyConfig from '../../monitoring/alloy/config.alloy?raw'
import lokiConfig from '../../monitoring/loki/config.yaml?raw'

// Each assignment gets a card on /assignments and its own write-up page at
// /assignments/<slug>.
//
// A write-up is a list of sections. Each section has:
//   title   - heading shown on the page (and in the table of contents)
//   guide   - checklist of what the section should cover; shown until the
//             section has at least one paragraph ({ type: 'p' })
//   blocks  - the content, rendered in order. Block types:
//     { type: 'p', text: '...' }
//     { type: 'list', items: ['...'] }
//     { type: 'steps', items: [{ title, body, image, caption }] }
//     { type: 'code', label: 'nginx.conf', code: '...' }
//     { type: 'image', src: '/assignments/<slug>/file.png', caption: '...' }
//     { type: 'table', headers: ['...'], rows: [['...']] }
//     { type: 'qa', items: [{ problem, solution }] }
//     { type: 'links', items: [{ label, url }] }
//   Blocks left empty (no code, no src, blank cells) show as placeholders.
//
// Screenshots go in public/assignments/<slug>/.

export const assignments = [
  {
    slug: 'containerized-app',
    title: 'Deploy a Containerized Application',
    course: 'Cloud Computing',
    term: 'Fall 2026',
    status: 'Completed',
    description:
      'Built this React site, packaged it in a Docker image served by nginx, and deployed it to an Ubuntu instance on AWS EC2.',
    tags: ['React', 'Docker', 'nginx', 'AWS EC2'],
    sections: [
      {
        title: 'Overview',
        guide: ['What the assignment asked for and what you built.'],
        blocks: [],
      },
      {
        title: 'Process',
        guide: [],
        blocks: [
          {
            type: 'steps',
            items: [
              {
                title: 'Build the React application',
                body: 'Created a React app with Vite that displays my name, student ID, major, and degree progress.',
              },
              {
                title: 'Write the Dockerfile',
                body: 'Used a multi-stage build: a Node image builds the app, then an nginx image serves the static files on port 80.',
              },
              {
                title: 'Build and run the container locally',
                body: 'Built the image and ran it with -p 8080:80 to map port 8080 on my machine to port 80 in the container.',
              },
              {
                title: 'Deploy to an Ubuntu EC2 instance',
                body: 'Ran the container on an Ubuntu instance on AWS and opened port 8080 in the security group so the site is reachable from the internet.',
              },
            ],
          },
        ],
      },
      {
        title: 'Challenges & Solutions',
        guide: ['Anything that went wrong and how you fixed it.'],
        blocks: [],
      },
      {
        title: 'What I Learned',
        guide: ['The main concepts or skills you took away from this assignment.'],
        blocks: [],
      },
      {
        title: 'Links & Resources',
        guide: ['A GitHub repo, the live URL, or documentation you used.'],
        blocks: [],
      },
    ],
  },

  {
    slug: 'monitoring-observability',
    title: 'Monitoring & Observability with Grafana + Loki',
    course: 'Cloud Computing',
    term: 'Fall 2026',
    status: 'In Progress',
    description:
      'Added log-based monitoring to my containerized site on AWS with Grafana, Loki, and Grafana Alloy, tracking page traffic and photo downloads.',
    tags: ['Grafana', 'Loki', 'Grafana Alloy', 'nginx', 'Docker', 'AWS EC2'],
    sections: [
      {
        title: 'Introduction',
        guide: [
          'Briefly introduce the application being monitored (this React site, served by nginx in Docker on EC2).',
          'Why monitoring and observability matter for this application.',
        ],
        blocks: [],
      },
      {
        title: 'Why I Chose This Tool',
        guide: [
          'What problem does the tool solve?',
          'What type of data can it collect (metrics, logs, traces, events)?',
          'Why does it fit this application?',
          'What are its strengths and limitations?',
          'Why this tool instead of another option?',
        ],
        blocks: [
          {
            type: 'p',
            text: "For this monitoring assignment, I chose to use Grafana with Loki. This tool helps solve a problem on my site which is the lack of information regarding downloads. My website has a library of photos that I took, and I would like to know which photos are the most popular, as well as collect analytics regarding the download. Without a monitoring tool, I don’t have an easy way of tracking this type of information.",
          },
          {
            type: 'p',
            text: "Grafana specifically visualizes the data that Loki calculates. This includes data such as Downloads, distinct IP addresses, data downloaded, page loads, Requests by status code, and alerts. Grafana is very versatile as it allows connections with up to 100+ sources. Including AWS, Cloudwatch, Elasticsearch, and Prometheus. This allows a singular monitoring dashboard. The visualization is also customizable, allowing for custom solutions better tailored for individual use cases.",
          },
          {
            type: 'p',
            text: "Some drawbacks of this solution are that it requires Loki, as Grafana only visualizes and doesn’t actually store the logs. Loki actually stores the logs, which is passed in by Grafana alloy (which adds labels to the logs). Loki is a good tool for this, as it is lightweight which is appropriate for a small application such as this. Overall, I chose this option because it is easily accessible and has a plethora of documentation.",
          },
        ],
      },
      {
        title: 'Installation and Configuration',
        guide: [
          'Enough detail that another engineer could reproduce the setup.',
          'Prerequisites, important commands, configuration files, settings, and deployment steps.',
          'Explain each step in your own words, based on the official docs.',
        ],
        blocks: [
          {
            type: 'p',
            text: 'The whole setup runs in Docker on my Ubuntu EC2 instance. There are four containers: my website (nginx), Grafana Alloy, Loki, and Grafana. They are all defined in one docker-compose.yml file, so starting everything only takes one command. Here are the steps I followed.',
          },
          {
            type: 'p',
            text: 'Step 1: Install Docker. Docker runs all four containers, and the Compose plugin lets me start them together. After adding my user to the docker group, I logged out and back in so I could run docker without sudo.',
          },
          {
            type: 'code',
            label: 'Install Docker and Docker Compose',
            code: `sudo apt-get update
sudo apt-get install -y docker.io docker-compose-v2
sudo usermod -aG docker $USER`,
          },
          {
            type: 'p',
            text: 'Step 2: Get the project onto the instance. The project folder has the website code plus a monitoring folder with the Loki, Alloy, and Grafana settings. You can copy it over with git clone or scp.',
          },
          {
            type: 'p',
            text: 'Step 3: Set a Grafana password. The password goes in a .env file, which is not uploaded to GitHub. Docker Compose will not start if this password is missing, so Grafana never runs with a default password.',
          },
          {
            type: 'code',
            label: 'Create the .env file',
            code: `cp .env.example .env
nano .env    # change GRAFANA_ADMIN_PASSWORD`,
          },
          {
            type: 'p',
            text: 'Step 4: Start everything. This builds my website image and starts all four containers. Grafana automatically loads the Loki connection, the dashboard, and the alert rules from the monitoring folder, so there is nothing to set up by hand.',
          },
          {
            type: 'code',
            label: 'Start the stack',
            code: `docker compose up -d --build
docker compose ps`,
          },
          {
            type: 'p',
            text: 'Step 5: Open Grafana. For security, Grafana is not open to the internet. Instead I connect to it through an SSH tunnel from my own computer, then go to http://localhost:3000 in my browser and log in with the password from the .env file.',
          },
          {
            type: 'code',
            label: 'SSH tunnel (run on your own computer)',
            code: `ssh -i /path/to/your-key.pem -L 3000:localhost:3000 ubuntu@<EC2-PUBLIC-IP>`,
          },
          {
            type: 'p',
            text: 'Step 6: Make sure it works. I visit the site, then check that nginx is writing JSON logs and that Alloy is sending them to Loki without errors. In Grafana, the query {service="web"} in Explore should show the log lines.',
          },
          {
            type: 'code',
            label: 'Check the logs',
            code: `curl -s -o /dev/null http://localhost:8080/
docker compose logs web --tail 3
docker compose logs alloy --tail 20`,
          },
          {
            type: 'p',
            text: 'The configuration files. These are the four files that make the monitoring work. docker-compose.yml defines the four containers and which ports are open. nginx.conf makes nginx write its logs as JSON and gives downloads their own path so they can be counted. config.alloy tells Alloy which container to collect logs from and where to send them. Loki’s config.yaml sets where logs are stored and deletes them after 30 days.',
          },
          { type: 'code', label: 'docker-compose.yml', code: composeFile },
          { type: 'code', label: 'nginx.conf', code: nginxConf },
          { type: 'code', label: 'monitoring/alloy/config.alloy', code: alloyConfig },
          { type: 'code', label: 'monitoring/loki/config.yaml', code: lokiConfig },
        ],
      },
      {
        title: 'Implementation',
        guide: [
          'What are you monitoring?',
          'What metrics, logs, traces, or events are collected?',
          'Where is the monitoring data stored?',
          'How are you viewing or analyzing the data?',
          'Did you create dashboards or alerts?',
        ],
        blocks: [
          {
            type: 'table',
            headers: ['Signal', 'Source', 'Collected by', 'Stored in', 'Viewed in'],
            rows: [
              [
                'Logs',
                'nginx JSON access log and error log (container stdout/stderr)',
                'Grafana Alloy via the Docker API',
                'Loki, on a Docker volume (30-day retention)',
                'Grafana Explore and log panels',
              ],
              [
                'Metrics',
                'Derived from logs at query time with LogQL (request counts, bytes, status codes)',
                'Loki queries',
                'Not stored separately',
                'Grafana dashboard: Personal Site: Traffic & Downloads',
              ],
              ['Alerts', 'Three Grafana-managed rules on Loki queries', 'Grafana', 'Grafana', 'Grafana Alerting page'],
              ['Traces', 'Not collected (static site, no backend)', '', '', ''],
            ],
          },
          {
            type: 'list',
            items: [
              'Dashboard panels: photo downloads, unique downloaders, data downloaded, page loads, downloads over time by photo, most downloaded photos, requests by status code, page loads over time, download log, all nginx logs.',
              'Alert rules: download spike (over 20 in 10 minutes), any 5xx error in 5 minutes, burst of 404s (over 30 in 5 minutes, often bots scanning).',
              'Downloads use their own path (/download/photos/...) so they can be told apart from someone just viewing a photo.',
            ],
          },
        ],
      },
      {
        title: 'Architecture Diagram',
        guide: [
          'Must reflect what you actually built, not the generic example.',
          'Show the app/containers, EC2 and other cloud services, the monitoring tools, dashboards, and alerting.',
          'Label metrics, logs, and traces and the direction data flows.',
          'Mark the security boundaries (security group, public vs. private ports).',
        ],
        blocks: [
          {
            type: 'image',
            src: '/assignments/monitoring-observability/architecture.png',
            caption: 'Architecture: nginx logs flow through Docker and Alloy into Loki, and Grafana queries Loki for the dashboard and alerts.',
          },
        ],
      },
      {
        title: 'Show It Working',
        guide: [
          'Evidence the monitoring actually works: screenshots, dashboards, logs, metrics, alerts, or queries.',
          'A caption under each screenshot explaining what it shows.',
        ],
        blocks: [
          {
            type: 'image',
            src: '/assignments/monitoring-observability/dashboard.png',
            caption: 'The Personal Site: Traffic & Downloads dashboard during a 5-minute test: downloads per photo, page loads, status codes (including a burst of bot-style 404s), and the live download log.',
          },
          {
            type: 'image',
            src: '/assignments/monitoring-observability/explore-query.png',
            caption: 'Grafana Explore running a LogQL query for photo downloads: log volume over time and the matching nginx JSON log lines.',
          },
          {
            type: 'image',
            src: '/assignments/monitoring-observability/alert-rules.png',
            caption: 'Alert rules: Download spike and Burst of 404s firing from the test traffic, Server errors (5xx) normal.',
          },
          {
            type: 'code',
            label: 'Example query: downloads per photo, last 24 hours',
            code: 'sum by (path) (count_over_time({service="web"} | json | __error__="" | path=~"/download/.*" | status < 400 [24h]))',
          },
        ],
      },
      {
        title: 'Security Considerations',
        guide: [
          'Authentication and authorization for the monitoring UI and APIs.',
          'Which endpoints and ports are exposed, and to whom.',
          'Sensitive data that could end up in logs.',
          'How credentials are stored.',
          'Network access and data retention.',
        ],
        blocks: [
          {
            type: 'table',
            headers: ['Concern', 'Risk', 'What I did'],
            rows: [
              [
                'Authentication / authorization',
                '',
                'Grafana admin login required; sign-up and anonymous access disabled. Loki has auth off but is not reachable from outside.',
              ],
              [
                'Exposed endpoints and ports',
                '',
                'Only 8080 (site) and 22 (SSH) open in the security group. Grafana bound to 127.0.0.1:3000, Loki not published.',
              ],
              ['Sensitive log data', '', 'Access logs include visitor IP addresses and user agents.'],
              ['Credentials and secrets', '', 'Grafana password in a git-ignored .env file; Compose refuses to start without it.'],
              ['Network access', '', 'Grafana reached only through an SSH tunnel. Alloy mounts the Docker socket read-only.'],
              ['Data retention', '', 'Loki deletes logs after 30 days (retention_period: 720h).'],
            ],
          },
        ],
      },
      {
        title: 'References',
        guide: ['Official documentation used for research and implementation.'],
        blocks: [
          {
            type: 'links',
            items: [
              { label: 'Grafana Loki documentation', url: 'https://grafana.com/docs/loki/latest/' },
              { label: 'LogQL query language', url: 'https://grafana.com/docs/loki/latest/query/' },
              { label: 'Loki retention', url: 'https://grafana.com/docs/loki/latest/operations/storage/retention/' },
              {
                label: 'Grafana Alloy: discovery.docker',
                url: 'https://grafana.com/docs/alloy/latest/reference/components/discovery/discovery.docker/',
              },
              {
                label: 'Grafana Alloy: loki.source.docker',
                url: 'https://grafana.com/docs/alloy/latest/reference/components/loki/loki.source.docker/',
              },
              { label: 'Grafana provisioning', url: 'https://grafana.com/docs/grafana/latest/administration/provisioning/' },
              {
                label: 'Grafana alerting file provisioning',
                url: 'https://grafana.com/docs/grafana/latest/alerting/set-up/provision-alerting-resources/file-provisioning/',
              },
              { label: 'nginx log module (log_format)', url: 'https://nginx.org/en/docs/http/ngx_http_log_module.html' },
              { label: 'Docker Compose', url: 'https://docs.docker.com/compose/' },
            ],
          },
        ],
      },
      {
        title: 'AI Disclosure',
        guide: [],
        blocks: [
          {
            type: 'p',
            text: 'I used AI (Claude, by Anthropic) to help with the formatting, design, and research for this project. This includes organizing and formatting this blog post, designing the look of the website, and researching monitoring tools and how Grafana, Loki, and Alloy work.',
          },
        ],
      },
    ],
  },
]

export function findAssignment(slug) {
  return assignments.find((item) => item.slug === slug)
}
