from rest_framework import serializers
from django.contrib.auth.models import User
from .models import WatchlistItem, Favorite, WatchHistory, UserStat

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class WatchlistItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = WatchlistItem
        fields = '__all__'
        read_only_fields = ('user',)

class FavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorite
        fields = '__all__'
        read_only_fields = ('user',)

class WatchHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = WatchHistory
        fields = '__all__'
        read_only_fields = ('user',)

class UserStatSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserStat
        fields = '__all__'