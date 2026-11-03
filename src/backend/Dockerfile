# Builds the Spring Boot backend into a small image that only contains Java + our app.
# It has two "stages": the first one builds the jar, the second one only runs it.

# ---------- Stage 1: build the jar (this image has Maven + a full JDK, it is big) ----------
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copy the dependency list first, then the code
COPY pom.xml .
COPY src ./src

# Build the jar. The cache mount keeps downloaded libraries between builds, so the next build is fast.
# Tests are skipped here: they need a running database. They will run from the check script (Milestone 4).
RUN --mount=type=cache,target=/root/.m2 mvn -B -q -DskipTests package

# ---------- Stage 2: run the jar (only a Java runtime, much smaller) ----------
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Run as a normal user instead of "root", so a bug in the app can't take over the whole container
RUN addgroup -S app && adduser -S app -G app

# Take ONLY the finished jar from stage 1. Maven, the JDK and the source code stay behind.
COPY --from=build /app/target/*.jar app.jar

USER app
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]