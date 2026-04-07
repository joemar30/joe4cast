# Lab Activity No. 8: Backend Mapping (Django MVT)

This document explains how the **Vibeo Backend** features map to the Django MVT (Model-View-Template) architecture as per Task 1 of Lab Activity 8.

## 🏆 Feature 1: Global Leaderboard
**Objective**: Fetch and display a ranked list of users based on their streaks or total watch time.

*   **Model**: `UserStat` (in `movies/models.py`)
    *   Stores `total_watch_time`, `current_streak`, and `highest_streak` in a relational PostgreSQL database.
*   **View**: `LeaderboardViewSet` (in `movies/views.py`)
    *   Queries `UserStat` objects, orders them by `-total_watch_time`, and limits to the Top 50.
*   **URL**: `/api/leaderboard/` (in `movies/urls.py`)

## 🔄 Feature 2: User Stats Synchronization
**Objective**: Synchronize real-time user progress from Firebase (NoSQL) to the relational SQL database for leaderboard aggregation.

*   **Model**: `UserStat` (in `movies/models.py`)
    *   Updates or creates user records based on the incoming `firebase_uid`.
*   **View**: `SyncStatsView` (in `movies/views.py`)
    *   An APIView that receives a `POST` payload containing user streaks and watch time, and performs an `update_or_create` on the model.
*   **URL**: `/api/sync-stats/` (in `movies/urls.py`)

## 🔐 Feature 3: Authentication & User Management
**Objective**: Secure the system and allow users to register and sign in.

*   **Model**: `User` (Django Core Auth Model)
    *   Handles the user identity, email, and password hashing.
*   **View**: `RegisterView` and `LoginView` (in `movies/views.py`)
    *   Uses DRF generic views to handle token-based authentication (DRF Authtoken).
*   **URL**: `/api/register/` and `/api/login/` (in `movies/urls.py`)

---
**Note**: Since this is a REST API backend, the "Template" layer is replaced by **JSON Serializers** (`serializers.py`), which format the Model data for the React frontend.
