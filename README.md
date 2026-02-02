# PlaySport - Local Development Guide

This repository contains a simple monorepo with:
- Backend: Spring Boot (Java 11), H2 in-memory DB, REST API
- Frontend: Next.js 13, React 18

## Prerequisites
- Java 11 (JDK)
- Maven 3.6+
- Node.js 16+ (Node 18 recommended)
- npm 8+

## Project Structure
- backend: Spring Boot application
- frontend: Next.js application

## Backend (Spring Boot)
- Profile: `dev`
- Port: `5555`
- Database: H2 in-memory
- CORS: allows requests from `http://localhost:3000`

### Run

```bash
SPRING_PROFILES_ACTIVE=dev mvn -f backend/pom.xml -DskipTests spring-boot:run
```

When it starts, you should see:
- Tomcat started on port 5555
- Seed data loaded into H2

### Seed Data
- User: email `demo@playsport.com`, password `demo`
- Venues: 3 demo venues
- Matches: 2 demo matches

### Key Endpoints
- GET /api/venues
- GET /api/venues/{id}
- GET /api/matches
- GET /api/matches/{id}
- POST /api/matches/{id}/join?userId={id}
- POST /api/matches/{id}/leave?userId={id}
- POST /api/auth/register
- POST /api/auth/login

Code references:
- Controllers: [VenueController.java](file:///Users/robertotolu/Desktop/playsport/backend/src/main/java/com/playsport/controller/VenueController.java), [MatchController.java](file:///Users/robertotolu/Desktop/playsport/backend/src/main/java/com/playsport/controller/MatchController.java)
- Models: [Venue.java](file:///Users/robertotolu/Desktop/playsport/backend/src/main/java/com/playsport/model/Venue.java), [Match.java](file:///Users/robertotolu/Desktop/playsport/backend/src/main/java/com/playsport/model/Match.java), [User.java](file:///Users/robertotolu/Desktop/playsport/backend/src/main/java/com/playsport/model/User.java)
- Dev config: [application-dev.yml](file:///Users/robertotolu/Desktop/playsport/backend/src/main/resources/application-dev.yml)
- Seed data: [DataLoader.java](file:///Users/robertotolu/Desktop/playsport/backend/src/main/java/com/playsport/config/DataLoader.java)
- CORS: [CorsConfig.java](file:///Users/robertotolu/Desktop/playsport/backend/src/main/java/com/playsport/config/CorsConfig.java)

## Frontend (Next.js)
- Port: `3000`
- API base URL: defaults to `http://localhost:5555`

### Run

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000

Pages:
- Home: /
- Venues: /venues
- Venue Detail: /venues/{id}
- Matches: /matches
- Match Detail: /matches/{id}
- Auth: /auth/login, /auth/register

Code references:
- API helper: [api.ts](file:///Users/robertotolu/Desktop/playsport/frontend/src/lib/api.ts)
- Pages: [layout.tsx](file:///Users/robertotolu/Desktop/playsport/frontend/src/app/layout.tsx), [home](file:///Users/robertotolu/Desktop/playsport/frontend/src/app/page.tsx), [venues](file:///Users/robertotolu/Desktop/playsport/frontend/src/app/venues/page.tsx), [venue detail](file:///Users/robertotolu/Desktop/playsport/frontend/src/app/venues/%5Bid%5D/page.tsx), [matches](file:///Users/robertotolu/Desktop/playsport/frontend/src/app/matches/page.tsx), [match detail](file:///Users/robertotolu/Desktop/playsport/frontend/src/app/matches/%5Bid%5D/page.tsx), [login](file:///Users/robertotolu/Desktop/playsport/frontend/src/app/auth/login/page.tsx), [register](file:///Users/robertotolu/Desktop/playsport/frontend/src/app/auth/register/page.tsx)

## Environment Variables
- Frontend:
  - `NEXT_PUBLIC_API_URL` (optional). If unset, uses `http://localhost:5555`.
- Backend (dev profile):
  - `security.jwt.secret` and `security.jwt.expiration` are defined in [application-dev.yml](file:///Users/robertotolu/Desktop/playsport/backend/src/main/resources/application-dev.yml)

## Troubleshooting
- Port 5555 already in use:
  - Stop existing process or change the backend port in [application-dev.yml](file:///Users/robertotolu/Desktop/playsport/backend/src/main/resources/application-dev.yml#L1-L2)
- Node version warning in Next:
  - Use Node 18+ or keep Next 13 as configured
- API fetch errors from frontend:
  - Ensure backend is running
  - Confirm BASE_URL in [api.ts](file:///Users/robertotolu/Desktop/playsport/frontend/src/lib/api.ts)

