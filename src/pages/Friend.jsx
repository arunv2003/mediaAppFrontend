
import axios from 'axios'
import { AiOutlineCamera } from "react-icons/ai";
import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../context/UserContext'
import { toast } from 'react-toastify';
import { Link, useLocation } from 'react-router-dom';

const Friend = () => {
  let url=import.meta.env.VITE_DEPLOYEMENT==="production"?import.meta.env.VITE_BACKEND_URL:"http://localhost:5002";
  let locution = useLocation()
  // console.log(locution.state)

  let ctxUserId = useContext(UserContext)
  
  let followerId=ctxUserId?.userInfo?.userId
  // console.log(followerId)

  let UserId = ctxUserId?.userInfo.token
  // console.log(UserId)

  const [friends, setFriends] = useState('')
  // console.log(friends)
  const friendUser = async () => {
    let res = await axios.get(url+`/api/users/getFriend/${locution.state}`)
    let data = res.data
    // console.log(data)
    setFriends(data.friend)
  }

  useEffect(() => {
    friendUser()
  }, [locution.state])


  const [friendPosts, setFriendsPost] = useState([])
  // console.log(friendPosts?.length)

  const friendPost = async () => {
    let res = await axios.get(url+`/api/posts/friendPost/${locution.state}`)
    let data = res.data
    // console.log(data.posts)
    setFriendsPost(data.posts)
  }

  useEffect(() => {
    friendPost()
  }, [locution.state])

  const handleFollow = async () => {
    let res = await axios.post(url+`/api/users/follower/${locution.state}`,{}, {
      headers: {
        'Authorization': ctxUserId.userInfo.token
      }
    })
    let data=res.data
    // console.log(data)
    if(data.success===true){
      friendUser()
      toast.success(data.msg,{position:'top-right'})
    }
    else{
      toast.error(data.msg,{position:'top-right'})
      friendUser()
    }
  }


  return (
    <div className='w-[85%] m-auto bg-gray-700 mb-6'>
      <div className='coverPicBox h-[27vw] bg-blue-800 relative'>
        <img className='h-full w-full' src={friends?.coverPic} alt="" />
        <div className='ProfilePicBox sm:h-48 sm:w-48 w-36 h-36 rounded-full absolute left-[27%] sm:left-[40.5%] lg:left-[41%] -bottom-24'>
          <img className='rounded-full w-full h-full' src={friends?.profilePic} alt="" />

          <label htmlFor="profilePic" className='absolute right-8 top-40 cursor-pointer'></label>

        </div>
      </div>

      <div className='border-b-2 border-gray-500 pb-4'>
        <h1 className='ProfilePic text-gray-300  mt-24 text-center text-2xl font-seri'>{friends?.name}</h1>


        <p className='ProfilePic text-gray-400  text-center text-xl font-seri'>{friends?.email}</p>
        <p className='ProfilePic text-gray-400  text-center  font-seri'>{friends?.bio}</p>

        <div className='flex justify-center gap-4 flex-wrap mt-2'>
          {friends?.follower?.includes(followerId)? <button onClick={handleFollow} className='bg-green-900 px-4 py-2 hover:bg-gray-800 rounded-lg text-white'>Unfollow</button> :
            <button onClick={handleFollow} className='bg-gray-900 px-4 py-2 hover:bg-gray-800 rounded-lg text-white'>follow</button>}
            <Link to={'/message'} state={friends} className='bg-gray-900 px-4 py-2 hover:bg-gray-800 rounded-lg text-white'>message</Link>
        </div>
        
      </div>
      <div className='justify-center gap-2 flex flex-wrap'>
      <button className='bg-gray-900 px-4 py-2 hover:bg-gray-800 rounded-lg text-white'><span className='font-bold'>{friendPosts?.length}</span>post</button>
            <button className='bg-gray-900 px-4 py-2 hover:bg-gray-800 rounded-lg text-white'><span className='font-bold'>{friends?.follower?.length}</span>follower</button>
            <button className='bg-gray-900 px-4 py-2 hover:bg-gray-800 rounded-lg text-white'><span className='font-bold'>{friends?.following?.length}</span>following</button>
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-4 sm:grid-cols-3 gap-1 mt-8 p-1'>
        {
          friendPosts.map((post, i) => {
            return (
              <div key={i} className="max-[400px] overflow-hidden m-auto h-[450px]  bg-white shadow-lg dark:bg-gray-800">
                <h1 className="text-xl font-bold text-center hover:underline cursor-pointer text-gray-800 uppercase dark:text-white">{post.title}</h1>
                {post.file.includes('image') ? <img className="object-contain w-[500px]  h-[350px]" src={post.file} alt="Article" /> : post.file.includes('video') ? <video className="object-contain  w-[500px] h-[350px]" src={post.file} autoFocus controls></video> : ""}

                <div className="px-1 py-2">
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{post.description}</p>
                </div>
              </div>
            )

          })
        }

      </div>
    </div>
  )
}

export default Friend
