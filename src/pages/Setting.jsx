import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../context/UserContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Setting = () => {
  let url=import.meta.env.VITE_DEPLOYEMENT==="production"?import.meta.env.VITE_BACKEND_URL:"http://localhost:5002";

  let tokenCtx = useContext(UserContext)
  // console.log(tokenCtx.userInfo.token)

  // console.log(tokenCtx.userInfo.token)
  // console.log(tokenCtx.userInfo.userId)
  let userId = tokenCtx.userInfo.userId

  const [userInfo, setUserInfo] = useState("")

  // console.log(userInfo)

  async function getUserDetail() {
    let res = await axios.get(url+'/api/users/userFound', {
      headers: {
        "Authorization":tokenCtx.userInfo.token
      }
    })
    // console.log(res)
    let data = res.data
    // console.log(data)
    setUserInfo(data.data)
  }
  useEffect(() => {
    getUserDetail()
  }, [])

  const handleInfoUpdate = (e) => {
    // e.target---->tag
    //e.target.name-->tag name
    //e.target.value-->tag value


    setUserInfo({
      ...userInfo, [e.target.name]: e.target.value

    })

  }

  const updateInfo = async (e) => {
   e.preventDefault()
      let res1 = await axios.put(url+`/api/users/update/${userId}`,userInfo,{
        headers: {
          "Authorization":tokenCtx.userInfo.token
        }
      }

      )
      let data2 = res1.data
      // console.log(data2)

      if (data2.success) {
        toast.success(data2.msg, { position: "top-right" })
        getUserDetail()
      }
      else {
        toast.error(data2.msg, { position: "top-right" })
      }

  }


  return (
    <div className='m-auto'>
      <form action="" className='flex flex-col w-1/2 m-auto text-white gap-3'>
        <label htmlFor="">Name:</label>
        <input type="text" onChange={handleInfoUpdate} name='name' value={userInfo?.name} className='p-1 outline-none text-gray-800' />
        <label htmlFor="">Bio:</label>
        <textarea name="bio" onChange={handleInfoUpdate} id="" value={userInfo.bio} className=' outline-none text-gray-800'></textarea>
        <button onClick={updateInfo} className='bg-green-900 p-1 rounded-md'>Update</button>
      </form>
    </div>
  )
}

export default Setting
