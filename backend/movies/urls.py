from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework import permissions # <-- NEW: Needed for Swagger
from drf_yasg.views import get_schema_view # <-- NEW: Needed for Swagger
from drf_yasg import openapi # <-- NEW: Needed for Swagger
from .views import RegisterView, LoginView, WatchlistViewSet, FavoriteViewSet, WatchHistoryViewSet, LeaderboardViewSet, SyncStatsView, HealthCheckView

# --- SWAGGER SETUP STARTS HERE ---
schema_view = get_schema_view(
   openapi.Info(
      title="Vibeo API",
      default_version='v1',
      description="Interactive API documentation for the Vibeo App",
   ),
   public=True,
   permission_classes=[permissions.AllowAny],
)
# --- SWAGGER SETUP ENDS HERE ---

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
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),
    # Your Swagger UI!
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
]