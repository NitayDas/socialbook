import React, { useState } from 'react';
import LikeButton from './LikeButton';
import { FaUserCircle, FaReply } from "react-icons/fa";

const CommentList = ({ comments, onReply}) => {
  const [replyBox, setReplyBox] = useState(null);
  const [replyText, setReplyText] = useState("");


  const handleReplySubmit = (commentId) => {
    if (!replyText.trim()) return;
    onReply(commentId, replyText);
    setReplyText("");
    setReplyBox(null);
  };


  return (
    <div className="comment-list mt-2">
      {comments.map(comment => (
        <div 
          key={comment.id} 
          className={`mb-3 ${comment.parent ? "ml-9" : "ml-0"}`}
        >
          {/* Avatar + Author */}
          <div className="flex items-center gap-2 mb-1">
            <FaUserCircle className="text-gray-500" size={28} />
            <div className="comment-author font-semibold text-sm">
              {comment.author}
            </div>
          </div>

          {/* Comment content */}
          <div className="comment-content text-sm text-gray-700">
            {comment.content}
          </div>

          {/* Actions */}
          <div className="comment-actions flex gap-3 items-center mt-1">
            <LikeButton comment={comment} />
            <button
              className="text-sm text-blue-500 flex items-center gap-1"
              onClick={() => setReplyBox(replyBox === comment.id ? null : comment.id)}
            >
              <FaReply size={14} />
              Reply
            </button>
          </div>

          {/* Reply input */}
          {replyBox === comment.id && (
            <div className="reply-input mt-2 flex gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="flex-1 px-2 py-1 border rounded"
                placeholder="Write a reply..."
              />
              <button
                onClick={() => handleReplySubmit(comment.id)}
                className="px-3 py-1 bg-blue-500 text-white rounded"
              >
                Reply
              </button>
            </div>
          )}

          {/* Recursive replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="comment-replies mt-2">
              <CommentList 
                comments={comment.replies} 
                onReply={onReply}  
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CommentList;
