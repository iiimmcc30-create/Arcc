# Build frontend
FROM node:22-bookworm-slim AS frontend
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
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
RUN corepack enable
COPY backend/package.json backend/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY backend/tsconfig.json ./
COPY backend/src ./src
RUN pnpm build

# Runtime
FROM node:22-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production
RUN corepack enable
COPY backend/package.json backend/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod
COPY --from=backend /app/backend/dist ./dist
COPY --from=frontend /app/dist ./public

EXPOSE 3000
CMD ["sh", "-c", "node dist/main.js"]
