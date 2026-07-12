# server/posts/views.py

from rest_framework import viewsets, mixins, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Q
from .models import Post, Comment, Like
from .serializers import PostSerializer, CommentSerializer, LikeSerializer
from rest_framework.views import APIView



class PostViewSet(viewsets.ModelViewSet):
    
    parser_classes = [MultiPartParser, FormParser]
    serializer_class = PostSerializer

    def get_queryset(self):
        queryset = Post.objects.select_related('author').prefetch_related('comments')
        
        if self.request.user.is_authenticated:
            return queryset.filter(Q(visibility='public') | Q(author=self.request.user))
        return queryset.filter(visibility='public')


    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)




class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    
    def get_queryset(self):
        queryset = super().get_queryset()
        post_id = self.request.query_params.get('post')
        if post_id:
            queryset = queryset.filter(post_id=post_id)
        return queryset


    def perform_create(self, serializer):
        serializer.save(author=self.request.user)




class LikeViewSet(viewsets.GenericViewSet):
    # Simple Like toggle
    
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['post'])
    def toggle(self, request):
        content_type = request.data.get('content_type')
        object_id = request.data.get('object_id')
        
        like, created = Like.objects.get_or_create(
            user=request.user,
            content_type=content_type,
            object_id=object_id
        )
        
        if not created:
            like.delete()
            return Response({'liked': False})
        
        return Response({'liked': True})