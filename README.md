# CAAT Design System & Prototype

A Bootstrap 5 component library and website prototype for the CAAT Pension Plan website.

---

## 📁 Project Structure

```
caat-design-system/
├── public/                  # Static site files (served by nginx)
│   ├── index.html           # Design system documentation & component library
│   └── assets/
│       ├── css/             # Custom stylesheets
│       ├── js/              # Custom scripts
│       └── images/          # Local images and icons
├── src/                     # Source / working files (tokens, partials, etc.)
├── docker/
│   └── nginx.conf           # nginx server configuration
├── Dockerfile               # Production Docker image
├── docker-compose.yml       # Local development orchestration
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

Open **http://localhost:3000** in your browser.

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

Core CAAT brand tokens are defined as CSS custom properties in `public/index.html`:

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
- **Port:** `3000` (host) → `80` (container)
- **Health check:** `GET /health` every 30s
- **Volume mounts in dev:** `./public` mounted read-only for live edits without rebuilding

---

## 📋 Roadmap

- [ ] Extract CSS tokens to `src/tokens.css`
- [ ] Split components into individual HTML partials (`src/components/`)
- [ ] Add a build step (PostCSS / SCSS)
- [ ] Prototype pages (Home, DBplus, Joindecaisse, About)
- [ ] Bilingual (EN/FR) routing
- [ ] CI/CD pipeline (GitHub Actions → Docker Hub)
