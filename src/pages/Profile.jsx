import axios from 'axios'
import { Button, Modal } from 'antd';
import { AiOutlineCamera } from "react-icons/ai";
import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../context/UserContext'
import { toast } from 'react-toastify';
import { MdDelete } from "react-icons/md";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

const Profile = () => {
    let url=import.meta.env.VITE_DEPLOYEMENT==="production"?import.meta.env.BACKEND_URL:"http://localhost:5002";

    const [isModalOpens, setIsModalOpens] = useState(false);
    const showModals = () => {
        setIsModalOpens(true);
    };
    const handleOks = () => {
        setIsModalOpens(false);
    };
    const handleCancels = () => {
        setIsModalOpens(false);
    };




    let tokenCtx = useContext(UserContext)


    // console.log(tokenCtx.userInfo.token)

    let userId = tokenCtx.userInfo.userId

    const [userInfo, setUserInfo] = useState("")

    // console.log(userInfo?.follower)

    async function getUserDetail() {
        let res = await axios.get(url+'/api/users/userFound', {
            headers: {
                "Authorization": tokenCtx.userInfo.token
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


    const [yourPosts, setYourPost] = useState([])
    // console.log(yourPosts)
    async function yourPost() {
        let res = await axios.get(url+'/api/posts/allYourPost', {
            headers: {
                "Authorization": tokenCtx.userInfo.token
            }
        })
        let data = res.data
        // console.log("data", data.post)
        setYourPost(data.post)
    }

    useEffect(() => {
        yourPost()
    }, [])

    const handleProfileChanger = async (e) => {
        let file = e.target.files[0]
        // console.log(file)

        let formData = new FormData()
        formData.append('file', file)
        formData.append("upload_preset", 'arunv2003')

        let res = await axios.post("https://api.cloudinary.com/v1_1/da8kfd56d/upload", formData)
        let data1 = res.data
        // console.log(data1.secure_url)

        if (data1.secure_url) {
            let res1 = await axios.put(url+`/api/users/update/${userId}`, {
                profilePic: data1.secure_url
            }, {
                headers: {
                    "Authorization": tokenCtx.userInfo.token
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
        else {
            toast.error("profile not updated", { position: "top-right" })
        }
    }

    const postDelete = async (post) => {
        // console.log(post._id)

        let res = await axios.delete(url+`/api/posts/delete/${post._id}`)
        let data = res.data
        // console.log(data)
        if (data.success === true) {
            toast.success(data.msg, { position: 'top-right' })
            yourPost()

        }
    }





    const [update, setUpdate] = useState({});
    // console.log(update);

    const handleUserGet = async (e) => {
        const { name, value } = e.target; // Destructure name and value from event target

        // Create an updated object with dynamic property based on the input name
        const obj = {
            ...update, // Preserve previous state
            [name]: value, // Dynamically set the property
        };

        setUpdate(obj); // Update the state with the new object
        //console.log(obj); // Log the updated object
    };
    const [postIds, setPostId] = useState()
    const posts = async (post) => {
      //  console.log(post._id)
        setPostId(post._id)
    }

    const postUpdate = async (post) => {
        const postId = post._id
        // console.log(postId)
        const res = await axios.put(url+`/api/posts/update/${postIds}`, update)
        let data = res.data
        // console.log(data)
        if (data.success === true) {
            toast.success(data.msg, { position: 'top-center' })
            yourPost()
            setIsModalOpens(false);
            setUpdate({ title: "", description: "" })

        }
    }


    const handleBackProfileChanger = async (e) => {
        let file = e.target.files[0]
        // console.log(file)

        let formData = new FormData()
        formData.append('file', file)
        formData.append("upload_preset", 'arunv2003')

        let res = await axios.post("https://api.cloudinary.com/v1_1/da8kfd56d/upload", formData)
        let data1 = res.data
        // console.log(data1.secure_url)

        if (data1.secure_url) {
            let res1 = await axios.put(url+`/api/users/update/${userId}`, {
                coverPic: data1.secure_url
            }, {
                headers: {
                    "Authorization": tokenCtx.userInfo.token
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
        else {
            toast.error("profile not updated", { position: "top-right" })
        }
    }
    
    return (
        <div className='w-[85%] m-auto bg-gray-700 mb-6'>
            <div className='coverPicBox h-[27vw] bg-blue-800 relative'>
                <img className='h-full w-full' src={userInfo?.coverPic} alt="" />
                <label htmlFor="coverPic" className='absolute sm:right-4 right-2 sm:top-70 top-28 cursor-pointer'><AiOutlineCamera className='bg-gray-200 text-3xl p-1 rounded-full' /></label>
                <input type="file" hidden id='coverPic' onChange={handleBackProfileChanger} />

                <div className='ProfilePicBox sm:h-48 sm:w-48 w-36 h-36 rounded-full absolute left-[29%] sm:left-[40.5%] lg:left-[41%] -bottom-24'>
                    <img className='rounded-full w-full h-full' src={userInfo?.profilePic} alt="" />

                    <label htmlFor="profilePic" className='absolute sm:right-8 right-2 sm:top-40 top-28 cursor-pointer'><AiOutlineCamera className='bg-gray-200 text-2xl p-1 rounded-full' /></label>
                    <input type="file" hidden id='profilePic' onChange={handleProfileChanger} />

                </div>
            </div>
            <div className='border-b-2 border-gray-500 pb-4 '>
                <h1 className='ProfilePic text-gray-300  mt-24 text-center text-2xl font-seri'>{userInfo?.name}</h1>
                <p className='ProfilePic text-gray-400  text-center text-xl font-seri'>{userInfo?.email}</p>
                <p className='ProfilePic text-gray-400  text-center  font-seri'>{userInfo?.bio}</p>

                <div className='flex justify-center gap-4 flex-wrap'>
                    <button className='bg-gray-900 px-4 py-2 hover:bg-gray-800 rounded-lg text-white'><span className='font-bold'>{yourPosts.length}</span>posts</button>
                    <button className='bg-gray-900 px-4 py-2 hover:bg-gray-800 rounded-lg text-white '><span className='font-bold'>{userInfo?.follower?.length}</span>followers</button>
                    <button className='bg-gray-900 px-4 py-2 hover:bg-gray-800 rounded-lg text-white'><span className='font-bold'>{userInfo?.following?.length}</span>following</button>
                </div>

            </div>
            <div className='grid grid-cols-1 lg:grid-cols-4 sm:grid-cols-3 gap-1 mt-8 p-1'>
                {
                    yourPosts.map((post, i) => {
                        return (
                            <div key={i} className="max-[400px] overflow-hidden m-auto h-[450px]  bg-white shadow-lg dark:bg-gray-800">
                                <div className='flex justify-between text-2xl px-2'>
                                    <h1 className="text-xl font-bold text-center hover:underline cursor-pointer text-gray-800 uppercase dark:text-white">{post.title}</h1>
                                    <div className='flex gap-2'>
                                        <p onClick={() => posts(post)}><HiOutlineDotsHorizontal onClick={showModals} className='text-red-500' /></p>
                                        <MdDelete onClick={() => postDelete(post)} className='text-red-500' />
                                    </div>
                                </div>
                                {post.file.includes('image') ? <img className="object-contain w-[500px]  h-[350px]" src={post.file} alt="Article" /> : post.file.includes('video') ? <video className="object-contain  w-[500px] h-[350px]" src={post.file} autoFocus controls></video> : ""}

                                <div className="px-1 py-2">
                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{post.description}</p>
                                </div>
                            </div>
                        )

                    })
                }

            </div>
            <Modal title="Search..." open={isModalOpens} onOk={handleOks} onCancel={handleCancels}>
                <div className='flex flex-col gap-3 '>
                    <label htmlFor="">Friends</label>
                    <input value={update.title} name='title' onChange={handleUserGet} placeholder='title' className=' rounded-lg py-2 px-4 outline-none border-2 border-gray-300 ' type="text" />
                    <input value={update.description} name='description' onChange={handleUserGet} placeholder='description' className=' rounded-lg py-2 px-4 outline-none border-2 border-gray-300 ' type="text" />
                    <button onClick={postUpdate} className='bg-gray-900 px-4 py-2 hover:bg-gray-800 rounded-lg text-white '>Update</button>
                </div>
            </Modal>
        </div>
    )
}

export default Profile
