FROM eclipse-temurin:17-jdk

WORKDIR /app

RUN apt-get update && apt-get install -y maven && rm -rf /var/lib/apt/lists/*

# Root parent POM
COPY pom.xml ./pom.xml

# User Service
COPY user-service/pom.xml ./user-service/pom.xml
COPY user-service/src ./user-service/src

# Build User Service
RUN mvn -f user-service/pom.xml clean package -DskipTests

EXPOSE 8081

ENTRYPOINT ["java", "-jar", "user-service/target/user-service-0.0.1-SNAPSHOT.jar"]
