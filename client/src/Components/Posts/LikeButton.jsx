// components/Posts/LikeButton.jsx
import React, { useState } from 'react';
import { AiOutlineLike, AiFillLike } from 'react-icons/ai';
import AxiosInstance from '../AxiosInstance';

const LikeButton = ({ post, comment }) => {
  const [liked, setLiked] = useState(post?.has_liked || comment?.has_liked || false);
  const [count, setCount] = useState(post?.likes_count || comment?.likes_count || 0);

  const contentType = post ? 'post' : 'comment';
  const objectId = post?.id || comment?.id;

  const toggleLike = async () => {
    try {
      const response = await AxiosInstance.post('likes/toggle/', {
        content_type: contentType,
        object_id: objectId,
      });

      if (response.data.liked) {
        setLiked(true);
        setCount(prev => prev + 1);
      } else {
        setLiked(false);
        setCount(prev => prev - 1);
      }
    } catch (error) {
      console.error('Error liking:', error);
    }
  };

  return (
    <button
      onClick={toggleLike}
      className={`
        flex items-center gap-1 px-3 py-1 rounded-md font-medium
        transition-colors duration-200
        ${liked ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
      `}
    >
      {liked ? <AiFillLike className="text-blue-600" /> : <AiOutlineLike />}
      <span>{count}</span>
    </button>
  );
};

export default LikeButton;
