import React, { useState, useEffect } from 'react';
import CommentList from './CommentList';
import LikeButton from './LikeButton';
import profile from '../../assets/images/f2.png';
import '../../Pages/NewsFeed/Feed.css';
import AxiosInstance from '../AxiosInstance';
import { FaGlobe, FaLock } from 'react-icons/fa';
import { useUser } from '../../Provider/UserProvider';

const PostCard = ({ post }) => {
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [comments, setComments] = useState([]); 
  const [latestComment, setLatestComment] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [commentsCount, setCommentsCount] = useState(post.comments_count || 0);
  const [visibility, setVisibility] = useState(post.visibility || 'public'); // default public
  const [isUpdatingVisibility, setIsUpdatingVisibility] = useState(false);
  const {user} = useUser();
  const loggedInUserId = user.id;

  useEffect(() => {
    const fetchLatestComment = async () => {
      try {
        const response = await AxiosInstance.get(`comments/?post=${post.id}`);
        if (response.data.results && response.data.results.length > 0) {
          setLatestComment(response.data.results[0]);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchLatestComment();
  }, [post.id]);

  const toggleComments = async () => {
    setCommentsVisible(!commentsVisible);
    if (!commentsVisible && comments.length === 0) {
      try {
        const response = await AxiosInstance.get(`comments/?post=${post.id}`);
        setComments(response.data.results || []);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const response = await AxiosInstance.post('comments/', {
        post: post.id,
        content: newComment,
      });
      setLatestComment(response.data);
      setComments(prev => [...prev, response.data]);
      setCommentsCount(prev => prev + 1);
      setNewComment('');
      if (!commentsVisible) setCommentsVisible(true);
    } catch (err) {
      console.error(err);
    }
  };



  const handleReply = async (parentId, replyText) => {
      try {
        const response = await AxiosInstance.post("comments/", {
          post: post.id,
          parent: parentId,
          content: replyText
        });

        const newReply = response.data;

        // Add reply into correct place
        const addReplyToTree = (commentsList) =>
          commentsList.map(c => {
            if (c.id === parentId) {
              return {
                ...c,
                replies: [...(c.replies || []), newReply]
              };
            }
            return {
              ...c,
              replies: c.replies ? addReplyToTree(c.replies) : []
            };
          });

        setComments(prev => addReplyToTree(prev));
        
      } catch (err) {
        console.error(err);
      }
    };


  // Toggle visibility between public and private
  const handleToggleVisibility = async () => {
    const newVisibility = visibility === 'public' ? 'private' : 'public';
    setIsUpdatingVisibility(true);
    const formData = new FormData();
    formData.append('visibility', newVisibility);
    try {
      const response = await AxiosInstance.patch(`posts/${post.id}/`, formData);
      setVisibility(response.data.visibility);
    } catch (err) {
      console.error('Failed to update visibility', err);
    } finally {
      setIsUpdatingVisibility(false);
    }
  };

  return (
    <div className="post-card">
      {/* Post Header */}
      <div className="post-header flex justify-between items-center">
        <div className="post-user flex items-center gap-2">
          <img src={profile} className="user-avatar" alt="Profile" />
          <div className="user-info">
            <div className="user-name">{post.author}</div>
            <div className="post-time">{new Date(post.created_at).toLocaleString()}</div>
          </div>
        </div>

        {/* Only show if this is my post */}
        {post.author_id === Number(loggedInUserId) && (
          <button
            onClick={handleToggleVisibility}
            className="px-3 py-1 rounded text-gray-400"
            disabled={isUpdatingVisibility}
          >
            {visibility === 'public' ? <FaGlobe /> : <FaLock />}
          </button>
        )}
      </div>

      {/* Post Content */}
      <div className="post-content mt-2">
        <p className="text-black text-lg">{post.content}</p>
        {post.image && (
          <img src={post.image} alt="Post" className="post-image mt-2" />
        )}
      </div>

      {/* Post Actions */}
      <div className="post-options mt-2 flex gap-4 items-center">
        <LikeButton post={post} />
        <button className="text-base" onClick={toggleComments}>
          💬 Comments ({commentsCount})
        </button>
      </div>

      {/* Latest Comment */}
      {latestComment && !commentsVisible && (
        <div className="comment-card mt-2">
          <div className="comment-author text-sm font-semibold ml-2">{latestComment.author}</div>
          <div className="comment-content text-sm text-gray-800 ml-4">{latestComment.content}</div>
          <div className="comment-actions">
            <LikeButton comment={latestComment} />
          </div>
        </div>
      )}

      {/* Comment Input */}
      {commentsVisible && (
        <div className="comment-input-section mt-2 flex gap-2">
          <input
            type="text"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            onClick={handleAddComment}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Post
          </button>
        </div>
      )}

      {/* Nested Comments */}
      {commentsVisible && comments.length > 0 && (
        <CommentList comments={comments} onReply={handleReply}/>
      )}
    </div>
  );
};

export default PostCard;
