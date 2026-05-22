# ─────────────────────────────────────────────────────────────────────────────
# CAAT Design System – Production Image
# Serves the static design system / prototype via nginx
# ─────────────────────────────────────────────────────────────────────────────
FROM nginx:1.27-alpine

LABEL maintainer="CAAT Web Team"
LABEL description="CAAT Design System & Prototype – static site served via nginx"

# Remove default nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy site files
COPY public/ /usr/share/nginx/html/

# Copy custom nginx configuration
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
