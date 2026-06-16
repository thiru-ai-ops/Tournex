# TourNex - Firebase Firestore & Admin SDK Backend

This is the production-ready Node.js and Express.js backend for the TourNex Tourism Web App. It integrates Firebase Firestore for data storage (no MongoDB) and the Firebase Admin SDK for secure token verification and user role management.

## Tech Stack
- **Runtime:** Node.js (v16+)
- **Framework:** Express.js
- **Database:** Firebase Firestore (Admin SDK)
- **Security:** Firebase Admin SDK Token Verification
- **Configuration:** dotenv, CORS enabled

---

## Installation & Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure Environment Variables:**
   Create a `.env` file using the template:
   ```bash
   cp .env.example .env
   ```
   Add your Firebase Project configurations:
   - `FIREBASE_PROJECT_ID`: The ID of your Firebase project.
   - `FIREBASE_API_KEY`: Found in Firebase Project Settings (under general Web App settings). This key is used in the `/login` route to verify password credentials.
   - `FIREBASE_SERVICE_ACCOUNT_KEY`: Path to the service account credentials JSON.

4. **Service Account Credentials:**
   - Go to your Firebase Console -> Project Settings -> Service Accounts.
   - Click **Generate new private key** and download the JSON file.
   - Place this file inside `backend/config/` and name it `firebase-service-account.json` (or map the custom path in `.env`).

---

## Running the Application
- **Development Mode (with auto hot-reload):**
  ```bash
  npm run dev
  ```
- **Production Mode:**
  ```bash
  npm start
  ```

---

## API Documentation

All endpoints are mounted on the base URL path `/api`.

### 1. Authentication APIs (`/api/auth`)

#### Register User
- **Route:** `POST /api/auth/register`
- **Access:** Public
- **Request Body:**
  ```json
  {
    "name": "Arjun Dev",
    "email": "arjun.travels@gmail.com",
    "password": "securepassword123",
    "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
    "role": "user",
    "bio": "Himalayan explorer and ranger.",
    "location": "New Delhi, India"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "user": {
      "uid": "U1X2y3Z4...",
      "name": "Arjun Dev",
      "email": "arjun.travels@gmail.com",
      "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
      "role": "user",
      "bio": "Himalayan explorer and ranger.",
      "location": "New Delhi, India",
      "joinDate": "June 12, 2026",
      "statesVisited": 0,
      "savedTripsCount": 0,
      "reviewsCount": 0,
      "savedTotal": 0,
      "level": 1,
      "currentXp": 100,
      "maxXp": 1000
    }
  }
  ```

#### Login User
- **Route:** `POST /api/auth/login`
- **Access:** Public
- **Request Body:**
  ```json
  {
    "email": "arjun.travels@gmail.com",
    "password": "securepassword123"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "token": "FIREBASE_ID_TOKEN_JWT_HERE...",
    "user": {
      "uid": "U1X2y3Z4...",
      "name": "Arjun Dev",
      "email": "arjun.travels@gmail.com",
      "role": "user",
      "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
      "bio": "Himalayan explorer and ranger.",
      "location": "New Delhi, India",
      "joinDate": "June 12, 2026",
      "stats": {
        "statesVisited": 0,
        "savedTripsCount": 0,
        "reviewsCount": 0,
        "savedTotal": 0
      },
      "level": 1,
      "currentXp": 100,
      "maxXp": 1000
    }
  }
  ```

#### Get Current Profile
- **Route:** `GET /api/auth/profile`
- **Access:** Private (Header: `Authorization: Bearer <ID_TOKEN>`)
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "user": {
      "uid": "U1X2y3Z4...",
      "name": "Arjun Dev",
      "email": "arjun.travels@gmail.com",
      "role": "user"
      // ... rest of fields
    }
  }
  ```

---

### 2. Tour Management APIs (`/api/tours`)

#### Get All Tours
- **Route:** `GET /api/tours`
- **Access:** Public
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "count": 1,
    "tours": [
      {
        "id": "t1_document_id",
        "name": "Jaipur Fort Heritage Tour",
        "price": 4500,
        "dates": "Oct 12 - Oct 15",
        "image": "https://images.unsplash.com/photo-1599661046289-e31897846e41",
        "description": "Explore the heritage palaces and majestic forts of Jaipur.",
        "maxGroupSize": 12,
        "duration": "4 Days",
        "startLocation": "Jaipur, India",
        "difficulty": "Easy"
      }
    ]
  }
  ```

#### Get Tour By ID
- **Route:** `GET /api/tours/:id`
- **Access:** Public

#### Create Tour
- **Route:** `POST /api/tours`
- **Access:** Private/Admin (Header: `Authorization: Bearer <ID_TOKEN>`)
- **Request Body:**
  ```json
  {
    "name": "Goa Beachfront Trails",
    "price": 6000,
    "dates": "Nov 20 - Nov 24",
    "image": "https://images.unsplash.com/photo-1544735716-392fe2489ffa",
    "description": "Discover backwaters and pristine sandy beaches.",
    "maxGroupSize": 15,
    "duration": "5 Days",
    "startLocation": "Panaji, Goa",
    "difficulty": "Easy"
  }
  ```

#### Update Tour
- **Route:** `PUT /api/tours/:id`
- **Access:** Private/Admin (Header: `Authorization: Bearer <ID_TOKEN>`)

#### Delete Tour
- **Route:** `DELETE /api/tours/:id`
- **Access:** Private/Admin (Header: `Authorization: Bearer <ID_TOKEN>`)

---

### 3. Booking APIs (`/api/bookings`)

#### Create Booking
- **Route:** `POST /api/bookings`
- **Access:** Private (Header: `Authorization: Bearer <ID_TOKEN>`)
- **Request Body:**
  ```json
  {
    "tourId": "t1_document_id",
    "tourName": "Jaipur Fort Heritage Tour",
    "price": 4500,
    "dates": "Oct 12 - Oct 15",
    "bookingId": "TN-55291-JP",
    "image": "https://images.unsplash.com/photo-1599661046289-e31897846e41"
  }
  ```

#### Get User Bookings
- **Route:** `GET /api/bookings/my-bookings`
- **Access:** Private (Header: `Authorization: Bearer <ID_TOKEN>`)
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "count": 1,
    "bookings": [
      {
        "id": "b1_document_id",
        "user": "U1X2y3Z4...",
        "userName": "Arjun Dev",
        "tourId": "t1_document_id",
        "tourName": "Jaipur Fort Heritage Tour",
        "price": 4500,
        "status": "UPCOMING",
        "dates": "Oct 12 - Oct 15",
        "bookingId": "TN-55291-JP",
        "image": "https://images.unsplash.com/photo-1599661046289-e31897846e41"
      }
    ]
  }
  ```

#### Get All Bookings (Admin Only)
- **Route:** `GET /api/bookings`
- **Access:** Private/Admin (Header: `Authorization: Bearer <ID_TOKEN>`)
