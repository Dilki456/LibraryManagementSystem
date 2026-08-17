FROM eclipse-temurin:21-jdk

WORKDIR /app

RUN apt-get update && apt-get install -y maven && rm -rf /var/lib/apt/lists/*

COPY pom.xml ./pom.xml
COPY book-service/pom.xml ./book-service/pom.xml
COPY book-service/src ./book-service/src

RUN mvn -f book-service/pom.xml clean package -DskipTests

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "book-service/target/book-service-0.0.1-SNAPSHOT.jar"]
