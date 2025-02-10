import React, { useContext, useEffect, useRef, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { CgBorderStyleDashed } from "react-icons/cg";
import axios from 'axios';
import { formatDistanceToNow } from "date-fns";
import UserContext from '../context/UserContext';
import { IoMdSend } from "react-icons/io";
import { FaRegHeart, FaRegComment, FaHeart } from "react-icons/fa";
import { Button, Modal } from 'antd';
import { toast } from 'react-toastify';
import { MdDelete } from "react-icons/md";
import { io } from "socket.io-client";

const Home = () => {
  let url=import.meta.env.VITE_DEPLOYEMENT==="production"?import.meta.env.VITE_BACKEND_URL:"http://localhost:5002";
  let Endpoint = url
  const socketRef = useRef();


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [getPost, setPost] = useState([]);
  // console.log(getPost)
  const [posts, setPosts] = useState('');
  const [SelectedCommentPost, setSelectedCommentPost] = useState('');
  const [postComment, setPostComment] = useState('');

  const ctx = useContext(UserContext);
  // console.log(ctx.like)
  const user = ctx?.userInfo?.user || {};
  // console.log(user._id)
  const token = ctx?.userInfo?.token || '';

  const getAllPost = async () => {
    try {
      const res = await axios.get(url+"/api/posts/allGet");
      setPost(res.data.Posts || []);
    } catch (error) {
      // console.error(error);
    }
  };

  useEffect(() => {
    getAllPost();
  }, []);

  const handleComments = (post) => {
    setSelectedCommentPost(post);
    setIsModalOpen(true);
  };

  const commentPost = async (post) => {
    if (!postComment.trim()) return;
    try {
      const obj = { text: postComment };
      const res = await axios.post(url+`/api/posts/comments/${post._id}`,
        obj,
        { headers: { Authorization: token } }
      );
      setPostComment('');
      getAllPost();
      toast[res.data.success ? 'success' : 'error'](res.data.msg, { position: 'top-right' });
    } catch (error) {
      // console.error(error);
    }
  };

  const handleDeleteComment = async (comment, selectObj) => {
    try {
      const res = await axios.delete(
        url+`/api/posts/deleteComment/${comment._id}/${selectObj._id}`
      );
      if (res.data.success) {
        const updatedComments = SelectedCommentPost.comments.filter((c) => c._id !== comment._id);
        setSelectedCommentPost({ ...SelectedCommentPost, comments: updatedComments });
        getAllPost();
        toast.success(res.data.msg, { position: 'top-right' });
      }
    } catch (error) {
      // console.error(error);
    }
  };

  const handlelike = async (postId, post, like) => {
    if (like) {
      socketRef.current.emit('likeNotification', { postId, userId: { name: user.name, profilePic: user.profilePic }, friendId: post.userId._id, Id: user._id })
    }

    try {
      const res = await axios.put(
        url+`/api/posts/likeDislike/${postId}`,
        {},
        { headers: { Authorization: token } }
      );
      if (res.data.success) {
        getAllPost();
        toast.success(res.data.msg, { position: 'top-right' });
      }
    } catch (error) {
      console.error('error',error);
    }
  };
  useEffect(() => {

    if (user?._id) {
      socketRef.current = io(Endpoint, { transports: ['websocket'] });
      socketRef.current.emit('addUser', user?._id)
    }
  }, [user?._id])

  useEffect(() => {
    // console.log(socketRef.current.id)
    if (user?._id) {
      socketRef.current.on('getLikeNotification', (ans) => {
        // console.log(ans)
        ctx.like(ans)
      })
    }
  }, [user?._id])

  return (
    <div>
      <Sidebar getAllPost={getAllPost} />
      <div className="sm:ml-[200px] pb-[50px] p-2">
        {getPost.map((post, id) => (
          <div key={id} className="max-w-sm h-[530px] mt-2 sm:mt-2  overflow-hidden sm:m-auto  bg-white rounded-lg shadow-md  dark:bg-gray-800">
            <div className="mt-4 flex justify-between p-2">
              <div className="flex items-center">
                <img
                  className="object-cover h-10 rounded-full "
                  src={post.userId?.profilePic}
                  alt="Avatar"
                />
                <p className="mx-2 font-semibold text-gray-700 dark:text-gray-200">{post.userId?.name}</p>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                </p>

              </div>
              <CgBorderStyleDashed className="text-2xl pr-6 cursor-pointer" />
            </div>
            {post.file?.includes('image') && (
              <img className="object-contain w-full h-[250px]" src={post.file} alt="Post" />
            )}
            {post.file?.includes('video') && (
              <video className="object-contain w-full h-[250px]" src={post.file} controls></video>
            )}
            <div className="p-6">
              <div className="flex gap-5">
                <span className='flex'>
                  <sup>{post.like.length}</sup>
                  {post.like?.includes(user._id) ? (
                    <FaHeart
                      onClick={() => handlelike(post._id, post)}
                      className="text-2xl cursor-pointer text-red-500"
                    />
                  ) : (
                    <FaRegHeart onClick={() => handlelike(post._id, post,'like')} className="text-2xl cursor-pointer" />
                  )}
                </span>
                <span className='flex'>
                  <sup>{post.comments.length}</sup>
                  <FaRegComment
                    onClick={() => handleComments(post)}
                    className="text-2xl cursor-pointer"
                  />
                </span>
              </div>
              <h2 className="mt-2 text-xl font-semibold text-gray-800 dark:text-white">
                {post.title}
              </h2>

              <p className={`mt-2 text-sm text-gray-600 dark:text-gray-400`}>
                {posts._id === post._id ? post.description : post.description.slice(0, 100)}
              </p>
              {posts._id !== post._id && post.description.length > 100 && (
                <button onClick={() => setPosts(post)} className="text-sm text-blue-500">
                  Read more
                </button>
              )}
              <div className="flex gap-3 mt-3 items-center">
                <img
                  className="h-7 w-7 rounded-full cursor-pointer"
                  src={ctx?.userInfo?.user?.profilePic}
                  alt=""
                />
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={postComment}
                  onChange={(e) => setPostComment(e.target.value)}
                  className="flex-1 border rounded-full p-2"
                />
                <IoMdSend
                  onClick={() => commentPost(post)}
                  className="text-2xl cursor-pointer"
                />
              </div>
            </div>
          </div>
        ))}
        <Modal className='top-28'
          title="Comments"
          visible={isModalOpen}
          onOk={() => setIsModalOpen(false)}
          onCancel={() => setIsModalOpen(false)}
        >
          {SelectedCommentPost?.comments?.length ? (
            SelectedCommentPost.comments.map((comment, id) => (
              <div key={id} className="mb-4">
                <div className="flex items-center gap-2">
                  <img
                    src={comment?.users?.profilePic}
                    alt=""
                    className="h-6 w-6 rounded-full"
                  />
                  <p>{comment?.users?.name}</p>
                </div>
                <div className="flex justify-between">
                  <p>{comment.text}</p>
                  {user._id === comment?.users?._id && (
                    <MdDelete
                      onClick={() => handleDeleteComment(comment, SelectedCommentPost)}
                      className="text-xl cursor-pointer"
                    />
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No comments</p>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default Home;
