# 📚 Library Management System

## 📌 Project Overview

The Library Management System is a web-based application developed using a **Spring Boot Microservices Architecture**.

The system is designed to manage library users, books, borrowing and returning books, borrowing records, and notifications.

The project uses separate microservices for different functionalities and uses MongoDB for data storage.

The complete system is containerized using Docker and Docker Compose.

---

# 🎯 Main Objective

The main objective of this project is to develop a simple, reliable, and organized system for managing library activities.

The system provides the following main functions:

- User Registration
- User Login
- User Management
- Book Management
- Book Availability Management
- Book Borrowing
- Book Returning
- Borrowing Record Management
- Notification Management
- API Gateway Routing
- MongoDB Data Storage
- Docker-based Deployment

---

# 🏗️ System Architecture

The project follows a Microservices Architecture.

```text
                         ┌─────────────────────┐
                         │      Frontend       │
                         │   HTML / CSS / JS   │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │    API Gateway      │
                         │      Port 8085       │
                         └──────────┬──────────┘
                                    │
             ┌──────────────────────┼──────────────────────┐
             │                      │                      │
             ▼                      ▼                      ▼
     ┌───────────────┐      ┌───────────────┐      ┌───────────────┐
     │ User Service  │      │ Book Service  │      │ Borrow Service│
     │   Port 8081   │      │   Port 8080   │      │   Port 8083   │
     └───────┬───────┘      └───────┬───────┘      └───────┬───────┘
             │                      │                      │
             ▼                      ▼                      ▼
      ┌────────────┐         ┌────────────┐         ┌────────────┐
      │ User       │         │ Book       │         │ Borrow     │
      │ MongoDB    │         │ MongoDB    │         │ MongoDB    │
      └────────────┘         └────────────┘         └────────────┘
                                                            │
                                                            ▼
                                                   ┌──────────────────┐
                                                   │ Notification     │
                                                   │ Service          │
                                                   │ Port 8084        │
                                                   └────────┬─────────┘
                                                            │
                                                            ▼
                                                   ┌──────────────────┐
                                                   │ Notification     │
                                                   │ MongoDB          │
                                                   └──────────────────┘
````

---

# 🧩 Microservices

## 1. API Gateway

The API Gateway acts as the main entry point to the backend services.

### Technology

* Java
* Spring Boot
* Spring Cloud Gateway
* HTTP Routing
* CORS Configuration

### Port

```text
8085
```

### Base URL

```text
http://localhost:8085
```

### Routes

```text
http://localhost:8085/books/**
        ↓
Book Service

http://localhost:8085/auth/**
        ↓
User Service

http://localhost:8085/users/**
        ↓
User Service

http://localhost:8085/api/borrow/**
        ↓
Borrow Service

http://localhost:8085/api/notifications/**
        ↓
Notification Service
```

### Gateway Health Check

```text
http://localhost:8085/actuator/health
```

---

# 2. 👤 User Service

The User Service manages user-related operations.

### Main Functions

* User Registration
* User Login
* User Management
* User Authentication

### Port

```text
8081
```

### Base URL

```text
http://localhost:8081
```

### Swagger UI

```text
http://localhost:8081/swagger-ui/index.html
```

### OpenAPI Documentation

```text
http://localhost:8081/v3/api-docs
```

---

# 3. 📖 Book Service

The Book Service manages library books.

### Main Functions

* Add Books
* View Books
* Update Books
* Delete Books
* Manage Book Quantity
* Manage Available Copies

### Port

```text
8080
```

### Base URL

```text
http://localhost:8080
```

### Swagger UI

```text
http://localhost:8080/swagger-ui/index.html
```

### OpenAPI Documentation

```text
http://localhost:8080/v3/api-docs
```

---

# 4. 📚 Borrow Service

The Borrow Service manages borrowing and returning books.

### Main Functions

* Borrow Books
* Return Books
* View Borrowing Records
* Track Borrowing Status
* Update Available Book Copies

### Port

```text
8083
```

### Base URL

```text
http://localhost:8083
```

### Swagger UI

```text
http://localhost:8083/swagger-ui/index.html
```

### OpenAPI Documentation

```text
http://localhost:8083/v3/api-docs
```

---

# 5. 🔔 Notification Service

The Notification Service manages user notifications.

### Main Functions

* Create Notifications
* Store Notifications
* Retrieve Notifications

### Port

```text
8084
```

### Base URL

```text
http://localhost:8084
```

### Swagger UI

```text
http://localhost:8084/swagger-ui/index.html
```

### OpenAPI Documentation

```text
http://localhost:8084/v3/api-docs
```

---

# 🔌 Service Port Summary

| Service              | Port | Base URL                                       |
| -------------------- | ---: | ---------------------------------------------- |
| Book Service         | 8080 | [http://localhost:8080](http://localhost:8080) |
| User Service         | 8081 | [http://localhost:8081](http://localhost:8081) |
| Borrow Service       | 8083 | [http://localhost:8083](http://localhost:8083) |
| Notification Service | 8084 | [http://localhost:8084](http://localhost:8084) |
| API Gateway          | 8085 | [http://localhost:8085](http://localhost:8085) |

---

# 📖 Swagger Documentation

Swagger UI can be used to view and test the REST APIs.

## User Service

```text
http://localhost:8081/swagger-ui/index.html
```

## Book Service

```text
http://localhost:8080/swagger-ui/index.html
```

## Borrow Service

```text
http://localhost:8083/swagger-ui/index.html
```

## Notification Service

```text
http://localhost:8084/swagger-ui/index.html
```

---

# 📄 OpenAPI Documentation

The OpenAPI JSON documentation can be accessed using:

```text
User Service:
http://localhost:8081/v3/api-docs

Book Service:
http://localhost:8080/v3/api-docs

Borrow Service:
http://localhost:8083/v3/api-docs

Notification Service:
http://localhost:8084/v3/api-docs
```

---

# 🗄️ MongoDB

Each major service uses a separate MongoDB database.

This provides better separation between the microservices.

## MongoDB Containers

| MongoDB              | Host Port | Container Port |
| -------------------- | --------: | -------------: |
| Borrow MongoDB       |     27017 |          27017 |
| Book MongoDB         |     27020 |          27017 |
| User MongoDB         |     27021 |          27017 |
| Notification MongoDB |     27022 |          27017 |

---

# 🔗 MongoDB Connection Information

## Borrow MongoDB

```text
mongodb://localhost:27017
```

## Book MongoDB

```text
mongodb://localhost:27020
```

## User MongoDB

```text
mongodb://localhost:27021
```

## Notification MongoDB

```text
mongodb://localhost:27022
```

---

# 🐳 Docker Containers

The complete system runs using Docker containers.

The project contains:

```text
API Gateway
User Service
Book Service
Borrow Service
Notification Service

User MongoDB
Book MongoDB
Borrow MongoDB
Notification MongoDB
```

---

# 🚀 Running the Project

## Step 1 - Start Docker Desktop

Make sure Docker Desktop is running.

## Step 2 - Open the Project

Open the project folder in Visual Studio Code.

```text
LibraryManagementSystem
```

## Step 3 - Open Terminal

Open a terminal in the project root folder.

Example:

```text
C:\Users\ACER\Desktop\LibraryManagementSystem
```

## Step 4 - Start All Services

Run:

```bash
docker compose up -d
```

## Step 5 - Check Services

Run:

```bash
docker compose ps
```

All services should show:

```text
Up
```

---

# 🛑 Stop the Project

To stop all containers:

```bash
docker compose down
```

---

# 🔄 Restart the Project

```bash
docker compose restart
```

---

# 📋 View Docker Logs

## API Gateway

```bash
docker compose logs api-gateway --tail 50
```

## User Service

```bash
docker compose logs user-service --tail 50
```

## Book Service

```bash
docker compose logs book-service --tail 50
```

## Borrow Service

```bash
docker compose logs borrow-service --tail 50
```

## Notification Service

```bash
docker compose logs notification-service --tail 50
```

---

# 📚 Book Borrowing Process

The borrowing process works as follows:

```text
User selects a book
        ↓
Borrow request
        ↓
Borrow Service
        ↓
Check available copies
        ↓
Create borrowing record
        ↓
Decrease available copies
        ↓
Book successfully borrowed
```

---

# 🔄 Book Returning Process

The return process works as follows:

```text
User returns a borrowed book
        ↓
Borrow Service
        ↓
Update borrowing record
        ↓
Change status to RETURNED
        ↓
Increase available copies
        ↓
Book becomes available
```

---

# 🔔 Notification Process

```text
Notification Request
        ↓
Notification Service
        ↓
Create Notification
        ↓
Save Notification to MongoDB
        ↓
Retrieve Notification
```

---

# 🧪 API Testing

The APIs can be tested using:

* Swagger UI
* Postman
* Frontend

### Main User Operations

```text
Register User
Login User
Manage User
```

### Main Book Operations

```text
Create Book
View Books
Update Book
Delete Book
```

### Main Borrow Operations

```text
Borrow Book
View Borrowing Records
Return Book
```

### Main Notification Operations

```text
Create Notification
View Notifications
```

---

# 🌐 Frontend

The frontend is developed using:

* HTML
* CSS
* JavaScript

The frontend communicates with the backend through the API Gateway.

### Frontend Development Server

The frontend is configured to work with:

```text
http://localhost:5500
```

The API requests are sent through:

```text
http://localhost:8085
```

---

# 🛠️ Technologies Used

## Programming Language

* Java

## Backend

* Spring Boot
* Spring Cloud Gateway
* Spring Data MongoDB
* Maven

## API Gateway

* Spring Cloud Gateway
* Spring Boot
* Java
* HTTP Routing
* CORS Configuration

## Frontend

* HTML
* CSS
* JavaScript

## Database

* MongoDB

## Containerization

* Docker
* Docker Compose

## API Testing

* Swagger UI
* Postman

## Development Tools

* Visual Studio Code
* Git
* GitHub
* Docker Desktop

---

# 📂 Project Structure

```text
LibraryManagementSystem/
│
├── api-gateway/
│   ├── src/
│   ├── Dockerfile
│   └── pom.xml
│
├── user-service/
│   ├── src/
│   ├── Dockerfile
│   └── pom.xml
│
├── book-service/
│   ├── src/
│   ├── Dockerfile
│   └── pom.xml
│
├── borrow-service/
│   ├── src/
│   ├── Dockerfile
│   └── pom.xml
│
├── notification-service/
│   ├── src/
│   ├── Dockerfile
│   └── pom.xml
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── app.js
│
├── docker-compose.yml
├── pom.xml
└── README.md
```

---

# 📊 Current Project Status

| Component                 | Status      |
| ------------------------- | ----------- |
| User Service              | ✅ Completed |
| User Authentication       | ✅ Completed |
| Book Service              | ✅ Completed |
| Book Management           | ✅ Completed |
| Borrow Service            | ✅ Completed |
| Book Borrowing            | ✅ Completed |
| Book Returning            | ✅ Completed |
| Borrowing Records         | ✅ Completed |
| Notification Service      | ✅ Completed |
| API Gateway               | ✅ Completed |
| MongoDB                   | ✅ Completed |
| Docker                    | ✅ Completed |
| Docker Compose            | ✅ Completed |
| Frontend                  | ✅ Completed |
| Swagger API Documentation | ✅ Available |
| Postman API Testing       | ✅ Available |

---

# 🔐 Security

The project includes user authentication and API Gateway-based routing.

Additional security improvements can be implemented in future development.

---

# 🚀 Future Improvements

The following features can be added in future development:

* Rate Limiting
* OAuth 2.0 Security
* Advanced Authentication and Authorization
* Automated Testing
* Monitoring and Logging
* Cloud Deployment
* Improved Notification Features

---

# 👨‍💻 Project Information

**Project Name:** Library Management System

**Architecture:** Microservices Architecture

**Backend:** Java + Spring Boot

**API Gateway:** Spring Cloud Gateway

**Frontend:** HTML + CSS + JavaScript

**Database:** MongoDB

**Containerization:** Docker + Docker Compose

**API Documentation:** Swagger / OpenAPI

**API Testing:** Postman

**Version Control:** Git + GitHub

---

# 📄 License

This project was developed for educational purposes.
