# Vibeo Backend (Django REST Framework)

This repository serves as the dedicated backend for **Vibeo**, a professional movie-streaming and tracking platform. It handles global rankings, user statistics, and data synchronization between NoSQL (Firebase) and Relational SQL (PostgreSQL).

## 🏆 System Features (Lab Activity 8)
*   **Global Leaderboard**: A ranked aggregation of all users' streaks and watch time.
*   **Relational Database Sync**: A debounced bridge that syncs real-time Firebase data into a structured PostgreSQL schema.
*   **Token Authentication**: Secure user registration and login using Django REST Framework's `authtoken`.

## 🛠️ Technical Stack
*   **Framework**: Django 5.2 & Django REST Framework (DRF)
*   **Database**: PostgreSQL (Neon Serverless)
*   **Production**: Vercel (Python Serverless Runtime)
*   **Security**: CSRF protection, HSTS headers, and masked SECRET_KEY management.

## 🚀 API Endpoints
*   `GET /api/leaderboard/`: Fetches ranked user statistics.
*   `POST /api/sync-stats/`: Updates user streaks and watch time.
*   `POST /api/register/`: New user creation.
*   `POST /api/login/`: Validates credentials and returns a token.

## 🧪 Testing with HTTPie
To verify the global leaderboard connectivity:
```bash
python -m httpie GET http://127.0.0.1:8000/api/leaderboard/
```

To sync test data:
```bash
python -m httpie POST http://127.0.0.1:8000/api/sync-stats/ firebase_uid="test_user" username="VibeoTester" total_watch_time:=45000 current_streak:=15
```

---
**Course**: AppDev (Laboratory Activity No. 8)  
**Developed by**: CyberSphinxxx
