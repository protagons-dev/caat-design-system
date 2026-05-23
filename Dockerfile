# ─────────────────────────────────────────────────────────────────────────────
# CAAT Design System – Production Image
# Serves the static design system / prototype via nginx
# ─────────────────────────────────────────────────────────────────────────────
FROM nginx:1.27-alpine

LABEL maintainer="CAAT Web Team"
LABEL description="CAAT Design System & Prototype – static site served via nginx"

# Port nginx listens on. Railway overrides this with its injected $PORT at
# runtime; this default keeps local `docker run` / compose working.
ENV PORT=80

# Remove default nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy site files
COPY public/ /usr/share/nginx/html/

# Copy the nginx config as a template. The nginx-alpine entrypoint runs
# envsubst over /etc/nginx/templates/*.template (only substituting variables
# present in the environment, so nginx's own $uri/$host are left intact) and
# writes the result to /etc/nginx/conf.d/ before starting.
COPY docker/default.conf.template /etc/nginx/templates/default.conf.template

# Documentation only; Railway maps the real port dynamically.
EXPOSE 80

# Health check (local/dev convenience — Railway uses its own healthcheck)
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- "http://localhost:${PORT}/health" || exit 1

# Keep the default nginx entrypoint (it processes templates) and command.
CMD ["nginx", "-g", "daemon off;"]
