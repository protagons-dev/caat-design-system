# CAAT Design System & Prototype

A Bootstrap 5 component library and website prototype for the CAAT Pension Plan website.

---

## 📁 Project Structure

```
caat-design-system/
├── public/                  # Static site files (served by nginx)
│   ├── index.html           # Root entry point that opens the component library
│   ├── archive/             # Archived legacy one-file root page
│   └── assets/
│       ├── css/             # Custom stylesheets
│       ├── js/              # Custom scripts
│       └── images/          # Local images and icons
├── src/                     # Source / working files (tokens, partials, etc.)
├── docker/
│   └── default.conf.template # nginx config (envsubst'd with $PORT at runtime)
├── Dockerfile               # Production Docker image
├── docker-compose.yml       # Local development orchestration
├── railway.json             # Railway deployment config
├── package.json             # npm scripts
├── .dockerignore
└── .gitignore
```

---

## 🚀 Quick Start

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

### Start the design system
```bash
npm start
# or
docker compose up -d
```

Open **http://localhost:3000** in your browser. The root entry point opens the
component library at **/components/**.

### Stop
```bash
npm stop
# or
docker compose down
```

---

## 🛠 Available Scripts

| Script | Description |
|---|---|
| `npm start` | Build & start the Docker container |
| `npm stop` | Stop and remove containers |
| `npm run docker:build` | Build the Docker image |
| `npm run docker:rebuild` | Full clean rebuild (no cache) |
| `npm run docker:logs` | Stream nginx logs |
| `npm run docker:shell` | Open a shell inside the container |
| `npm run open` | Open the site in your browser (Windows) |

---

## 🎨 Design Tokens

Core CAAT brand tokens are defined as CSS custom properties in `public/assets/css/tokens.css`:

| Token | Value | Usage |
|---|---|---|
| `--caat-blue` | `#0f6791` | Primary brand blue |
| `--caat-blue-900` | `#003750` | Deep navy (headings, buttons) |
| `--caat-green` | `#55a546` | Secondary / success green |
| `--caat-lime` | `#95e35c` | Accent / selection |
| `--caat-teal` | `#12a7b8` | Teal accent |
| `--caat-ink` | `#102637` | Body text |
| `--caat-muted` | `#506273` | Secondary text |

---

## 🧩 Components Documented

- Buttons (all states, sizes, variants)
- Alerts & Badges
- Cards & Content Cards
- Navigation (desktop + mobile)
- Hero sections (composable, full-bleed, slight-overlap)
- Forms (contact, pension solutions)
- Tables (responsive)
- Modals, Offcanvas, Dropdowns
- Accordions, Tabs, Pills
- Pagination, Progress bars
- Toasts, Popovers, Tooltips
- Icons (Bootstrap Icons library)
- Blog/Content listing + article layout
- Testimonials
- Data visualization guidance
- Typography scale
- Layout grid & spacing
- Page templates (editorial, SEO)

---

## 🐳 Docker Details

- **Base image:** `nginx:1.27-alpine`
- **Port:** `3000` (host) → `80` (container) locally; on Railway nginx listens on the injected `$PORT`
- **Health check:** `GET /health` every 30s
- **Volume mounts in dev:** `./public` mounted read-only for live edits without rebuilding
- **Config:** `docker/default.conf.template` is processed by the nginx-alpine entrypoint (`envsubst`), substituting `${PORT}` before nginx starts

---

## ☁️ Deploy to Railway

The app is a static site served by nginx and deploys from the `Dockerfile`.
Railway injects a `$PORT` env var that the container must bind to — the nginx
config template handles this automatically.

### Option A — Railway dashboard (GitHub)
1. Push this repo to GitHub.
2. In Railway: **New Project → Deploy from GitHub repo** and select it.
3. Railway reads `railway.json`, builds the Dockerfile, and serves on the
   generated domain. Health checks hit `/health`.

### Option B — Railway CLI
```bash
npm i -g @railway/cli
railway login
railway init        # create/link a project
railway up          # build & deploy from the Dockerfile
```

No environment variables are required — `PORT` is supplied by Railway.

---

## 📐 Design System Direction

See **[`docs/design-system-recommendations.md`](docs/design-system-recommendations.md)** for a
comprehensive gap analysis and prioritized recommendations — token architecture,
missing foundations (type/spacing/motion/z-index scales), cross-cutting decisions
(eyebrows, interaction states, bilingual EN/FR, accessibility), missing components,
and a phased roadmap grounded in AODA/WCAG 2.2 and current design-system practice.

---

## 📋 Roadmap

- [ ] Extract CSS tokens to `src/tokens.css`
- [ ] Split components into individual HTML partials (`src/components/`)
- [ ] Add a build step (PostCSS / SCSS)
- [ ] Prototype pages (Home, DBplus, Joindecaisse, About)
- [ ] Bilingual (EN/FR) routing
- [ ] CI/CD pipeline (GitHub Actions → Docker Hub)
