from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView, LoginView, WatchlistViewSet, FavoriteViewSet, WatchHistoryViewSet, LeaderboardViewSet, SyncStatsView, HealthCheckView, MigrateDatabaseView

router = DefaultRouter()
router.register(r'watchlist', WatchlistViewSet, basename='watchlist')
router.register(r'favorites', FavoriteViewSet, basename='favorites')
router.register(r'history', WatchHistoryViewSet, basename='history')
router.register(r'leaderboard', LeaderboardViewSet, basename='leaderboard')

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('sync-stats/', SyncStatsView.as_view(), name='sync-stats'),
    path('health/', HealthCheckView.as_view(), name='health'),
    path('migrate/', MigrateDatabaseView.as_view(), name='migrate'),
    path('', include(router.urls)),
]
