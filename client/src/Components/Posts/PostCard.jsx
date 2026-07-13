import React, { useState, useEffect, useRef } from "react";
import CommentList from "./CommentList";
import LikeButton from "./LikeButton";
import profile from "../../assets/images/f2.png";
import profile2 from "../../assets/images/f1.png";
import "../../Pages/NewsFeed/Feed.css";
import AxiosInstance from "../AxiosInstance";
import { FaGlobe, FaLock } from "react-icons/fa";
import { useUser } from "../../Provider/UserProvider";
import { BsThreeDots } from "react-icons/bs";
import {
  FaRegBookmark,
  FaRegBell,
  FaWindowClose,
  FaRegEdit,
  FaRegTrashAlt,
} from "react-icons/fa";
import { FaMicrophone, FaRegImage, FaShare } from "react-icons/fa";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import { FaThumbsUp, FaHeart } from "react-icons/fa";

const PostCard = ({ post }) => {
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [comments, setComments] = useState([]);
  const [latestComment, setLatestComment] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [commentsCount, setCommentsCount] = useState(post.comments_count || 0);
  const [visibility, setVisibility] = useState(post.visibility || "public"); // default public
  const [isUpdatingVisibility, setIsUpdatingVisibility] = useState(false);
  const { user } = useUser();
  const loggedInUserId = user.id;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      const response = await AxiosInstance.post("comments/", {
        post: post.id,
        content: newComment,
      });
      setLatestComment(response.data);
      setComments((prev) => [...prev, response.data]);
      setCommentsCount((prev) => prev + 1);
      setNewComment("");
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
        content: replyText,
      });

      const newReply = response.data;

      // Add reply into correct place
      const addReplyToTree = (commentsList) =>
        commentsList.map((c) => {
          if (c.id === parentId) {
            return {
              ...c,
              replies: [...(c.replies || []), newReply],
            };
          }
          return {
            ...c,
            replies: c.replies ? addReplyToTree(c.replies) : [],
          };
        });

      setComments((prev) => addReplyToTree(prev));
    } catch (err) {
      console.error(err);
    }
  };

  const getRelativeTime = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) return "Just now";

    const units = [
      { label: "year", secs: 31536000 },
      { label: "month", secs: 2592000 },
      { label: "week", secs: 604800 },
      { label: "day", secs: 86400 },
      { label: "hour", secs: 3600 },
      { label: "minute", secs: 60 },
    ];

    for (const unit of units) {
      const value = Math.floor(diffInSeconds / unit.secs);
      if (value >= 1) {
        return `${value} ${unit.label}${value > 1 ? "s" : ""} ago`;
      }
    }

    return "Just now";
  };

  // Toggle visibility between public and private
  const handleToggleVisibility = async () => {
    const newVisibility = visibility === "public" ? "private" : "public";
    setIsUpdatingVisibility(true);
    const formData = new FormData();
    formData.append("visibility", newVisibility);
    try {
      const response = await AxiosInstance.patch(`posts/${post.id}/`, formData);
      setVisibility(response.data.visibility);
    } catch (err) {
      console.error("Failed to update visibility", err);
    } finally {
      setIsUpdatingVisibility(false);
    }
  };

  return (
    <div className="post-card">
      {/* Post Header */}
      <div className="post-header flex justify-between items-center">
        <div className="post-user flex items-center gap-2 w-full justify-between">
          <div className="flex items-center gap-2">
            <img src={profile} className="user-avatar" alt="Profile" />
            <div className="user-info">
              <div className="user-name">{post.author}</div>
              <div className="user-visibility flex items-center gap-1 text-sm text-gray-500">
                <div>{getRelativeTime(post.created_at)}</div>
                {post.author_id === Number(loggedInUserId) && (
                  <button
                    onClick={handleToggleVisibility}
                    className="px-3 rounded"
                    disabled={isUpdatingVisibility}
                  >
                    {visibility === "public" ? ". public" : ". private"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Three-dot button, right end of the left section */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-400"
            >
              <BsThreeDots size={20} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white shadow-xl rounded-xl border border-gray-100 z-50 py-2">
                <button
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left"
                  onClick={() => {
                    // handle save post
                    setDropdownOpen(false);
                  }}
                >
                  <span className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-50 text-blue-500">
                    <FaRegBookmark size={16} />
                  </span>
                  <span className="text-gray-700 font-medium">Save Post</span>
                </button>

                <button
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left"
                  onClick={() => {
                    // handle turn on notification
                    setDropdownOpen(false);
                  }}
                >
                  <span className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-50 text-blue-500">
                    <FaRegBell size={16} />
                  </span>
                  <span className="text-gray-700 font-medium">
                    Turn On Notification
                  </span>
                </button>

                <button
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left"
                  onClick={() => {
                    // handle hide post
                    setDropdownOpen(false);
                  }}
                >
                  <span className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-50 text-blue-500">
                    <FaWindowClose size={16} />
                  </span>
                  <span className="text-gray-700 font-medium">Hide</span>
                </button>

                {post.author_id === Number(loggedInUserId) && (
                  <>
                    <button
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left"
                      onClick={() => {
                        // handle edit post
                        setDropdownOpen(false);
                      }}
                    >
                      <span className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-50 text-blue-500">
                        <FaRegEdit size={16} />
                      </span>
                      <span className="text-gray-700 font-medium">
                        Edit Post
                      </span>
                    </button>

                    <button
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left"
                      onClick={() => {
                        // handle delete post
                        setDropdownOpen(false);
                      }}
                    >
                      <span className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-50 text-blue-500">
                        <FaRegTrashAlt size={16} />
                      </span>
                      <span className="text-gray-700 font-medium">
                        Delete Post
                      </span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="post-content mt-2">
        <p className="text-black text-base">{post.content}</p>
        {post.image && (
          <img
            src={post.image}
            alt="Post"
            className="post-image mt-2 rounded-md"
          />
        )}
      </div>

     {/* Reaction summary row */}
     <div className="flex justify-between items-center mt-3 text-sm text-gray-500">
      <div className="flex items-center">
        {/* Reaction avatars - swap these src's with your actual reactor avatars */}
        <div className="flex -space-x-2">
          {post.reactors?.slice(0, 4).map((reactor, i) => (
            <img
              key={i}
              src={reactor.avatar}
              alt=""
              className="w-6 h-6 rounded-full border-2 border-white object-cover"
            />
          ))}
          {post.reactors?.length > 4 && (
            <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center border-2 border-white font-medium">
              9+
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <h5><span className="text-black">{commentsCount}</span> Comment</h5>
        <span><span className="text-black">22</span> Share</span>
      </div>
     </div>

     {/* Post Actions */}
     <div className="post-options mt-2 pt-2 border-t border-gray-100 flex justify-around items-center">
      <LikeButton post={post} />

      <button
        className="flex items-center gap-2 text-gray-600 font-medium hover:bg-gray-50 px-4 py-2 rounded-md flex-1 justify-center"
        onClick={toggleComments}
      >
        <HiOutlineChatBubbleLeftRight size={20} />
        Comment
      </button>

      <button className="flex items-center gap-2 text-gray-600 font-medium hover:bg-gray-50 px-4 py-2 rounded-md flex-1 justify-center">
        <FaShare size={16} />
        Share
      </button>
     </div>

    {/* Write a comment input (always visible, top) */}
    <div className="flex items-center gap-2 mt-3 bg-gray-100 rounded-full px-3 py-2">
      <img src={profile2} className="w-8 h-8 rounded-full object-cover" alt="" />
      <input
        type="text"
        placeholder="Write a comment"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
        className="flex-1 bg-transparent outline-none text-sm text-gray-600 placeholder-gray-400"
      />
      <FaMicrophone className="text-gray-400 cursor-pointer" size={16} />
      <FaRegImage className="text-gray-400 cursor-pointer" size={16} />
    </div>

    {/* View previous comments toggle */}
    {comments.length > 0 && !commentsVisible && (
      <button
        onClick={toggleComments}
        className="mt-3 text-sm font-semibold text-gray-600 hover:underline"
      >
        View {comments.length} previous comments
      </button>
    )}

    {/* Comment list */}
    {commentsVisible && comments.length > 0 && (
      <div className="mt-3 flex flex-col gap-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-2">
            <img
              src={comment.author_avatar || profile2}
              className="w-9 h-9 rounded-full object-cover flex-shrink-0"
              alt=""
            />
            <div className="flex-1">
              <div className="relative bg-gray-100 rounded-2xl px-4 py-2 inline-block max-w-full">
                <div className="font-semibold text-sm text-gray-900">
                  {comment.author}
                </div>
                <div className="text-sm text-gray-700">{comment.content}</div>

                {/* Floating like bubble */}
                {comment.likes_count > 0 && (
                  <div className="absolute -bottom-3 right-2 flex items-center gap-1 bg-white rounded-full shadow px-2 py-0.5 text-xs font-medium">
                    <FaThumbsUp className="text-blue-500" size={10} />
                    <FaHeart className="text-red-500" size={10} />
                    {comment.likes_count}
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-1.5 ml-3 text-xs font-semibold text-gray-500">
                <button className="hover:underline">Like</button>
                <button
                  className="hover:underline"
                  onClick={() => handleReply(comment)}
                >
                  Reply
                </button>
                <button className="hover:underline">Share</button>
                <span className="font-normal text-gray-400">
                  {getRelativeTime(comment.created_at)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}

    {/* Write a comment input (bottom, shown when comments expanded) */}
    {commentsVisible && (
      <div className="flex items-center gap-2 mt-3 bg-gray-100 rounded-full px-3 py-2">
        <img src={comment.author_avatar || profile2} className="w-8 h-8 rounded-full object-cover" alt="" />
        <input
          type="text"
          placeholder="Write a comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
          className="flex-1 bg-transparent outline-none text-sm text-gray-600 placeholder-gray-400"
        />
        <FaMicrophone className="text-gray-400 cursor-pointer" size={16} />
        <FaRegImage className="text-gray-400 cursor-pointer" size={16} />
      </div>
    )}
    </div>
  );
};

export default PostCard;
