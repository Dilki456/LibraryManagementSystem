FROM maven:3.9-eclipse-temurin-17

WORKDIR /app

COPY pom.xml ./pom.xml

COPY notification-service/pom.xml ./notification-service/pom.xml
COPY notification-service/src ./notification-service/src

RUN mvn -f notification-service/pom.xml clean package -DskipTests

EXPOSE 8084

ENTRYPOINT ["java", "-jar", "notification-service/target/notification-service-0.0.1-SNAPSHOT.jar"]
