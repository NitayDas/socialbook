import React, { useState, useEffect } from 'react';
import AxiosInstance from '../../../Components/AxiosInstance';
import PostCard from '../../../Components/Posts/PostCard';
import CreatePost from './CreatePost';
import '../Feed.css';

const Post = () => {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const response = await AxiosInstance.get('posts/');
      console.log("posts", response.data);
      // Extract results array from paginated response
      setPosts(response.data.results);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostCreated = newPost => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  return (
    <div className="posts-section">

      <CreatePost onPostCreated={handlePostCreated} />

      {/* Render posts */}
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Post;
