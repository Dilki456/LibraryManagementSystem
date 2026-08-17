FROM eclipse-temurin:21-jdk

WORKDIR /app

RUN apt-get update && apt-get install -y maven && rm -rf /var/lib/apt/lists/*

# Root parent POM
COPY pom.xml ./pom.xml

# Borrow Service
COPY borrow-service/pom.xml ./borrow-service/pom.xml
COPY borrow-service/src ./borrow-service/src

# Build Borrow Service
RUN mvn -f borrow-service/pom.xml clean package -DskipTests

EXPOSE 8083

ENTRYPOINT ["java", "-jar", "borrow-service/target/borrow-service-0.0.1-SNAPSHOT.jar"]
