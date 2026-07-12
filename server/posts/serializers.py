from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType
from .models import Post, Comment, Like


class PostSerializer(serializers.ModelSerializer):
    author_id = serializers.IntegerField(source='author.id', read_only=True)
    author = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    has_liked = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = '__all__'
        read_only_fields = ('author', 'created_at', 'updated_at')
        
    def get_author(self, obj):
        return f"{obj.author.first_name} {obj.author.last_name}"

    def get_likes_count(self, obj):
        post_type = ContentType.objects.get_for_model(Post)
        return Like.objects.filter(content_type='post', object_id=obj.id).count()

    def get_comments_count(self, obj):
        return obj.comments.count()

    def get_has_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Like.objects.filter(
                content_type='post', object_id=obj.id, user=request.user
            ).exists()
        return False



class CommentSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = '__all__'
        read_only_fields = ('author', 'created_at', 'updated_at')
        
        
    def get_author(self, obj):
        return f"{obj.author.first_name} {obj.author.last_name}"

    def get_likes_count(self, obj):
        return Like.objects.filter(content_type='comment', object_id=obj.id).count()
    
    


class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = '__all__'
        read_only_fields = ('user', 'created_at')
