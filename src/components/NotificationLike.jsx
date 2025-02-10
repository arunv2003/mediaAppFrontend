import React, { useContext, useEffect } from 'react'
import axios from 'axios'
import UserContext from '../context/UserContext'
import { Link, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'

const NotificationLike = () => {

  let url=import.meta.env.VITE_DEPLOYEMENT==="production"?import.meta.env.BACKEND_URL:"http://localhost:5002";
  let ctx = useContext(UserContext)
  // console.log(ctx.arr)
  let friendLike=ctx.arr
  // console.log(ctx)
  let token =ctx.userInfo.token
  
  let locution = useLocation()
  // console.log(locution.state)
  
   
  const handleTrueUpdate= async(friend)=>{
    let id=friend._id
    let res= await axios.put(url+`/api/notification/updateGetNotify/${id}`,{read:friend.read},{
      headers:{
        'Authorization':token
      }
    })
    let data=res.data 
    ctx.getNotify()
    // console.log(data)
    if(data){
      toast.success("notification read successful")
    }

  }

  return (
    <div className=''>
      {
        friendLike.reverse().map((friend, index) => {
          return (

            <div onClick={()=>handleTrueUpdate(friend)} className='flex gap-4 mt-3 text-white'>
              <img className='h-10 w-10 rounded-full' src={friend.profilePic} alt="" />
              <span>
                <p>{friend.name}</p>
                <p className='text-gray-100'>{friend.message}</p>
              </span>
            </div>

          )
        })
      }
    </div>
  )
}

export default NotificationLike
