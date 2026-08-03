# Build frontend
FROM node:22-bookworm-slim AS frontend
WORKDIR /app
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
# Prefer npm-installed pnpm over Corepack (more reliable on Railway builders).
RUN npm install -g pnpm@10.34.3
COPY package.json pnpm-lock.yaml ./
COPY .npmrc ./.npmrc
RUN pnpm install --frozen-lockfile
COPY index.html vite.config.ts tsconfig.json ./
COPY src ./src
COPY .figma ./.figma
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL
RUN pnpm build

# Build backend
FROM node:22-bookworm-slim AS backend
WORKDIR /app/backend
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN npm install -g pnpm@10.34.3
COPY backend/package.json backend/pnpm-lock.yaml ./
COPY backend/.npmrc ./.npmrc
RUN pnpm install --frozen-lockfile
COPY backend/tsconfig.json ./
COPY backend/src ./src
RUN pnpm build

# Runtime
FROM node:22-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
# Persist media on a Railway volume mounted at /data (see RAILWAY.md).
ENV UPLOAD_DIR=/data/uploads
RUN npm install -g pnpm@10.34.3 \
  && mkdir -p /data/uploads /app/uploads
COPY backend/package.json backend/pnpm-lock.yaml ./
COPY backend/.npmrc ./.npmrc
RUN pnpm install --frozen-lockfile --prod
COPY --from=backend /app/backend/dist ./dist
COPY --from=frontend /app/dist ./public

EXPOSE 3000
CMD ["node", "dist/main.js"]
