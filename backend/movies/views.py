from rest_framework import viewsets, permissions, status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from .models import WatchlistItem, Favorite, WatchHistory, UserStat
from .serializers import UserSerializer, WatchlistItemSerializer, FavoriteSerializer, WatchHistorySerializer, UserStatSerializer

class RegisterView(generics.CreateAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'user': UserSerializer(user).data,
                'token': token.key
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user_id': user.pk,
                'email': user.email
            })
        return Response({'error': 'Invalid Credentials'}, status=status.HTTP_400_BAD_REQUEST)

class WatchlistViewSet(viewsets.ModelViewSet):
    serializer_class = WatchlistItemSerializer
    
    def get_queryset(self):
        return WatchlistItem.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Prevent duplicates
        tmdb_id = self.request.data.get('tmdb_id')
        media_type = self.request.data.get('media_type', 'movie')
        existing = WatchlistItem.objects.filter(user=self.request.user, tmdb_id=tmdb_id, media_type=media_type).first()
        if existing:
            # Update existing instead of creating
            serializer = self.get_serializer(existing, data=self.request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
        else:
            serializer.save(user=self.request.user)

class FavoriteViewSet(viewsets.ModelViewSet):
    serializer_class = FavoriteSerializer

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Simple toggle-like logic could be handled in front-end, 
        # but here we ensure unique per user/tmdb_id
        tmdb_id = self.request.data.get('tmdb_id')
        media_type = self.request.data.get('media_type', 'movie')
        existing = Favorite.objects.filter(user=self.request.user, tmdb_id=tmdb_id, media_type=media_type).first()
        if not existing:
            serializer.save(user=self.request.user)

class WatchHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = WatchHistorySerializer

    def get_queryset(self):
        return WatchHistory.objects.filter(user=self.request.user)

    # Allow posting to history too
    def create(self, request, *args, **kwargs):
        tmdb_id = request.data.get('tmdb_id')
        media_type = request.data.get('media_type', 'movie')
        # Update or create history entry
        obj, created = WatchHistory.objects.update_or_create(
            user=request.user, 
            tmdb_id=tmdb_id, 
            media_type=media_type,
            defaults={
                'title': request.data.get('title'),
                'name': request.data.get('name'),
                'poster_path': request.data.get('poster_path'),
            }
        )
        serializer = self.get_serializer(obj)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

class LeaderboardViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserStatSerializer
    
    def get_queryset(self):
        # Order by total watch time (descending) and limit to top 50 for production performance
        return UserStat.objects.all().order_by('-total_watch_time')[:50]

from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

@method_decorator(csrf_exempt, name='dispatch')
class SyncStatsView(APIView):
    permission_classes = (permissions.AllowAny,) # We use Firebase UID for internal identifying

    def post(self, request):
        firebase_uid = request.data.get('firebase_uid')
        if not firebase_uid:
            return Response({'error': 'firebase_uid is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        obj, created = UserStat.objects.update_or_create(
            firebase_uid=firebase_uid,
            defaults={
                'username': request.data.get('username'),
                'avatar_url': request.data.get('avatar_url'),
                'total_watch_time': request.data.get('total_watch_time', 0),
                'current_streak': request.data.get('current_streak', 0),
                'highest_streak': request.data.get('highest_streak', 0),
            }
        )
        return Response(UserStatSerializer(obj).data, status=status.HTTP_200_OK)
