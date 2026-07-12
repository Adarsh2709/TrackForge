# ==========================================
# STAGE 1: DEPENDENCIES
# ==========================================
# We use Alpine Linux because it is extremely small and secure.
# This stage only downloads dependencies.
FROM node:20-alpine AS deps
WORKDIR /app

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

# Copy package.json and package-lock.json first to leverage Docker layer caching.
COPY package.json package-lock.json ./
RUN npm ci

# ==========================================
# STAGE 2: BUILD
# ==========================================
# This stage builds the Next.js application.
FROM node:20-alpine AS builder
WORKDIR /app

# Copy the dependencies we downloaded in the first stage
COPY --from=deps /app/node_modules ./node_modules
# Copy all of our frontend source code
COPY . .

# Disable Next.js telemetry during the build
ENV NEXT_TELEMETRY_DISABLED=1

# Build the Next.js application (using the 'standalone' output we configured in next.config.ts)
RUN npm run build

# ==========================================
# STAGE 3: RUNNER (Production Image)
# ==========================================
# This is the final image that will be pushed to AWS.
FROM node:20-alpine AS runner
WORKDIR /app

# Set Node environment to production
ENV NODE_ENV=production
# Disable telemetry during runtime
ENV NEXT_TELEMETRY_DISABLED=1

# AWS Security Best Practice: Never run as root.
# We create a specific group and user for our application.
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the necessary files from the builder stage.
# We only copy the public folder and the optimized standalone build.
COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to the non-root user
USER nextjs

# Expose port 3000 (standard Next.js port)
EXPOSE 3000

# The standalone build uses server.js as the entry point.
CMD ["node", "server.js"]
