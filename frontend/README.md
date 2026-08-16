# Library Management System — Unified Frontend

This is a separate, unified frontend for the four microservices behind the API Gateway.

## Architecture

Browser → Unified Frontend → API Gateway :8085 → Book :8080 / User :8081 / Borrow :8083 / Notification :8084

## Features

- Dashboard and service architecture view
- Book list, search, add, edit and delete
- Member list and delete
- Borrow record creation and listing
- Notification listing
- User login and registration
- API key input (default: `library123`)
- Responsive layout

## Run

### Option A — simple static server

From this `frontend` directory:

```powershell
python -m http.server 5500
```

Open:

`http://localhost:5500`

The browser calls the API Gateway at `http://localhost:8085`.

### CORS note

If the browser blocks requests because the API Gateway does not allow the frontend origin, the gateway needs a CORS configuration for `http://localhost:5500`. The microservices themselves should continue to be accessed through the gateway.

## Required services

- Book Service: 8080
- User Service: 8081
- Borrow Service: 8083
- Notification Service: 8084
- API Gateway: 8085
- MongoDB: 27017
