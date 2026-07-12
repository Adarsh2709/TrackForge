# ==========================================
# STAGE 1: BUILD
# ==========================================
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app

# Copy gradle wrapper and config files first
# We do this before copying the source code to leverage Docker layer caching.
# If build.gradle hasn't changed, Docker won't re-download dependencies.
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .

# Make gradlew executable
RUN chmod +x gradlew

# Download dependencies (cached layer)
RUN ./gradlew dependencies --no-daemon || true

# Copy source code and build the application
# We skip tests here (-x test) because tests should ideally run in a CI pipeline before the image is built.
COPY src src
RUN ./gradlew build -x test --no-daemon

# ==========================================
# STAGE 2: RUNTIME
# ==========================================
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# AWS Security Best Practice: Create a non-root user for security
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copy the built jar from the build stage
COPY --from=build /app/build/libs/*.jar app.jar

# Statically expose port 8080 (standard Spring Boot port)
EXPOSE 8080

# The ENTRYPOINT executes when the container starts
ENTRYPOINT ["java", "-jar", "app.jar"]
