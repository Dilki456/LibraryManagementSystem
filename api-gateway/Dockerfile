FROM eclipse-temurin:21-jdk

WORKDIR /app

RUN apt-get update && apt-get install -y maven && rm -rf /var/lib/apt/lists/*

# Root parent POM
COPY pom.xml ./pom.xml

# API Gateway
COPY api-gateway/pom.xml ./api-gateway/pom.xml
COPY api-gateway/src ./api-gateway/src

# Build API Gateway
RUN mvn -f api-gateway/pom.xml clean package -DskipTests

EXPOSE 8085

ENTRYPOINT ["java", "-jar", "api-gateway/target/api-gateway-0.0.1-SNAPSHOT.jar"]
