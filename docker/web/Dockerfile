# Build stage
FROM node:18 as build
WORKDIR /app

COPY web/analytics/ .

# Install pnpm and dependencies
RUN npm ci
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY web/analytics/nginx.conf /etc/nginx/conf.d/default.conf
COPY web/analytics/robots.txt /usr/share/nginx/html/robots.txt

COPY <<'EOF' /docker-entrypoint.d/01-insert-window-variable.sh
#!/bin/sh

set -eu

cp /usr/share/nginx/html/index.html /usr/share/nginx/html/index.html.template
envsubst < /usr/share/nginx/html/index.html.template > /usr/share/nginx/html/index.html 
rm /usr/share/nginx/html/index.html.template

EOF

RUN chmod +x /docker-entrypoint.d/01-insert-window-variable.sh

EXPOSE 8000
