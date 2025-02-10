import React, { useContext, useState } from 'react'
import { Button, Modal } from 'antd';
import axios from 'axios';
import { MdNavigateNext } from "react-icons/md";
import UserContext from '../context/UserContext';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
// import { IoMdAddCircleOutline } from "react-icons/io";

import { IoMdHome } from "react-icons/io";
import { IoMdAlert } from "react-icons/io";
// import { FaSearch } from "react-icons/fa";
import { MdPersonSearch } from "react-icons/md";
import { MdVideoLibrary } from "react-icons/md";
import { FaSearchPlus } from "react-icons/fa";
import { MdMessage } from "react-icons/md";
import { IoMdNotifications } from "react-icons/io";
import { IoMdSettings } from "react-icons/io";
import { IoMdAddCircleOutline } from "react-icons/io";
import { GiShadowFollower } from "react-icons/gi";




const Sidebar = ({ getAllPost }) => {

    let url=import.meta.env.VITE_DEPLOYEMENT==="production"?import.meta.env.BACKEND_URL:"http://localhost:5002";
    // console.log(getAllPost)

    let userTokenCtx = useContext(UserContext)
    // console.log(userTokenCtx.arr)
    let array = userTokenCtx.arr
    // console.log(array)
    let count = 0
    array.forEach((ele) => {
        if (ele.read === false) {
            count = count + 1

        }
    })

    // console.log(userTokenCtx.userInfo.token)
    // console.log(userTokenCtx.userInfo.userId)
    let id = userTokenCtx.userInfo.userId



    let ctx = useContext(UserContext)
    // console.log(ctx.userInfo.user.profilePic)

    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const [getFriend, setGetFriends] = useState([])
    // console.log(getFriend)

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

    const handleSearch = () => {
        setIsModalOpens(false);
    }

    const handelUserGet = async (e) => {
        // console.log(e.target.value)

        let res = await axios.get(url+`/api/users/getUser?q=${e.target.value}`)
        let data = res.data
        // console.log(data)
        setGetFriends(data)
    }


    const [userDetail, setUserDetail] = useState({
        title: "",
        description: "",
        file: ""
    })
    // console.log(userDetail)



    const handelInputChanger = (e) => {
        // console.log(e.target)
        // console.log(e.target.name)
        setUserDetail({
            ...userDetail, [e.target.name]: e.target.value
        })
    }

    // const handleFileSubmit=(e)=>{
    //  let file=e.target.files[0]
    //  let reader=new FileReader()
    //  reader.readAsDataURL(file)
    //  reader.onload=()=>{
    //  setUserDetail({
    //     ...userDetail,file:reader.result
    //  })
    //  }
    //  reader.onerror=()=>{
    //   console.log(reader.error)
    //  }
    // }


    const [loading, setLoading] = useState(false)

    const handleFileSubmit = async (e) => {
        setLoading(true)
        let file = e.target.files[0]
        // console.log(file)


        let formData = new FormData()
        formData.append("file", file)
        formData.append("upload_preset", 'arunv2003')

        let res = await axios.post("https://api.cloudinary.com/v1_1/da8kfd56d/upload", formData)
        let data = res.data
        // console.log(data.secure_url)
        if (data.secure_url) {
            setLoading(false)
        }
        setUserDetail({
            ...userDetail, file: data.secure_url
        })
    }

    const handleSubmit = async () => {

        let res = await axios.post(url+'/api/posts/create', userDetail, {
            headers: {
                'Authorization': userTokenCtx.userInfo.token
            }
        })
        let resData = res.data
        // console.log(resData)
        if (resData.success === true) {
            toast.success(resData.msg, { position: "top-right" })
            setIsModalOpen(false);
            setUserDetail({
                title: "",
                description: "",
                file: ""
            })
            getAllPost()
        }
        else {
            toast.error(resData.msg, { position: "top-right" })
            setIsModalOpen(false);
        }
    }

    return (
        <div className='sm:bg-gray-800 sm:border-r-2 fixed z-50   sm:border-gray-700  text-white  left-0 top-[72px]  '>
            <div className='sm:z-40 -z-50 lg:w-[240px] h-full w-[100px]  '>
                <ul className='pb-4 sm:block hidden'>
                    <li onClick={showModal} className='text-center p-2 border-b-2  border-gray-700 border-t-2 cursor-pointer'>Create </li>
                </ul>
                <div className='sm:block hidden'>
                    <ul className="flex flex-col gap-6 pb-7 ">
                        <Link to={"/"} className="p-2   cursor-pointer gap-5 flex justify-between items-center pr-5 hover:pr-2 rounded-lg  text-gray-800 mx-2 focus:outline-none hover:bg-gray-300 bg-white">
                            <span className='flex items-center'><IoMdHome className='size-5' />Home</span>   <MdNavigateNext />
                        </Link>
                        <Link to={'/about'} className="p-2 cursor-pointer rounded-lg gap-5 flex justify-between items-center pr-5 hover:pr-2  focus:outline-none mx-2 bg-white hover:bg-gray-300 text-gray-800">
                            <span className='flex items-center'><IoMdAlert className='size-5' />About</span>  <MdNavigateNext />
                        </Link>
                        <li onClick={showModals} className="p-2 cursor-pointer rounded-lg gap-5 flex justify-between items-center pr-5 hover:pr-2  focus:outline-none mx-2 bg-white hover:bg-gray-300 text-gray-800">
                            <span className='flex items-center'>< MdPersonSearch className='size-5' />Search</span><MdNavigateNext />
                        </li>
                        <Link to={'/reel'} className="p-2 cursor-pointer rounded-lg gap-5 flex justify-between items-center pr-5 hover:pr-2  focus:outline-none mx-2 bg-white hover:bg-gray-300 text-gray-800">
                            <span className='flex items-center'><MdVideoLibrary className='size-[18px]' />Reels</span>   <MdNavigateNext />
                        </Link>
                        {/* <Link to={'/friendUser'} className="p-2 cursor-pointer rounded-lg gap-5 flex justify-between items-center pr-5 hover:pr-2  focus:outline-none mx-2 bg-white hover:bg-gray-300 text-gray-800">
                            <span className='flex items-center'>< GiShadowFollower className='size-4' /> Friends </span><MdNavigateNext />
                        </Link> */}
                        <Link to={'/notification'} state={array} className="p-2 cursor-pointer rounded-lg gap-5 flex justify-between items-center pr-5 hover:pr-2  focus:outline-none mx-2 bg-white hover:bg-gray-300 text-gray-800">
                            <span className='flex items-center' ><IoMdNotifications className='size-5' />Notification <sup>{count}</sup> </span> <MdNavigateNext />
                        </Link>
                        <Link to={'/setting'} className="p-2 cursor-pointer rounded-lg gap-5 flex justify-between items-center pr-5 hover:pr-2  focus:outline-none mx-2 bg-white hover:bg-gray-300 text-gray-800">
                            <span className='flex items-center'><IoMdSettings className='size-5' /> Setting</span> <MdNavigateNext />
                        </Link>
                        <Link to={"/profile"} className="p-2 cursor-pointer rounded-lg gap-5 pr-5 items-center hover:pr-2 justify-between flex focus:outline-none mx-2 bg-white hover:bg-gray-300 text-gray-800">
                            <span className='flex items-center'><img className='h-5 w-5 rounded-full' src={ctx?.userInfo?.user?.profilePic} alt="" />Profile</span>   <MdNavigateNext />
                        </Link>
                    </ul>
                </div>
            </div>
            <div className='sm:hidden block z-50'>
                <ul className="flex fixed bottom-0 py-3    w-full gap-0 justify-evenly  bg-gray-800 p-[3px] ">
                    <Link to={"/"} className="  cursor-pointer gap-5 flex justify-between items-center pr-5 hover:pr-2 rounded-lg  text-gray-800  focus:outline-none">
                        <span className='flex items-center'><IoMdHome className='size-6 text-gray-50' /></span>
                    </Link>
                    <Link to={'/about'} className=" cursor-pointer rounded-lg gap-5 flex justify-between items-center pr-5 hover:pr-2  focus:outline-none  text-gray-800">
                        <span className='flex items-center'><IoMdAlert className='size-6 text-gray-50' /></span>
                    </Link>
                    <li onClick={showModals} className=" cursor-pointer rounded-lg gap-5 flex justify-between items-center pr-5 hover:pr-2  focus:outline-none  text-gray-800">
                        <span className='flex items-center'>< MdPersonSearch className='size-6 text-gray-50' /></span>
                    </li>
                    <Link to={'/reel'} className=" cursor-pointer rounded-lg gap-5 flex justify-between items-center pr-5 hover:pr-2  focus:outline-none  text-gray-800">
                        <span className='flex items-center'><MdVideoLibrary className='size-[22px] text-gray-50' /></span>
                    </Link>
                    {/* <Link to={'/friendUser'} className=" cursor-pointer rounded-lg gap-5 flex justify-between items-center pr-5 hover:pr-2  focus:outline-none  text-gray-800">
                        <span className='flex items-center'>< GiShadowFollower className='size-[22px] text-gray-50' /></span>
                    </Link> */}
                    <li onClick={showModal} className=" cursor-pointer rounded-lg gap-5 flex justify-between items-center pr-5 hover:pr-2  focus:outline-none    text-gray-800">
                        <span className='flex items-center'><IoMdAddCircleOutline className='size-5 text-gray-50' /> </span>
                    </li>
                    <Link to={'/notification'} state={array} className=" cursor-pointer rounded-lg gap-5 flex justify-between items-center pr-5 hover:pr-2  focus:outline-none   hover:bg-gray-300 text-gray-800">
                        <span className='flex items-center' ><IoMdNotifications className='size-6 text-gray-50' /><sup className='text-white'>{count}</sup> </span>
                    </Link>
                    <Link to={'/setting'} className=" cursor-pointer rounded-lg gap-5 flex justify-between items-center pr-5 hover:pr-2  focus:outline-none   text-gray-800">
                        <span className='flex items-center'><IoMdSettings className='size-6 text-gray-50' /> </span>
                    </Link>
                    <Link to={"/profile"} className="cursor-pointer rounded-lg gap-5 pr-3 items-center hover:pr-2 justify-between flex focus:outline-none   text-gray-800">
                        <span className='flex items-center'><img className='h-6 w-14 rounded-full' src={ctx?.userInfo?.user?.profilePic} alt="" /></span>
                    </Link>
                </ul>
            </div>
            <Modal title="Post Your Video" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <div className='flex flex-col gap-3 '>
                    <label htmlFor="">Title</label>
                    <input onChange={handelInputChanger} value={userDetail.title} name='title' className='border-2 border-gray-300 py-2 px-4 outline-none' type="text" />

                    <label htmlFor="">Description</label>
                    <textarea onChange={handelInputChanger} value={userDetail.description} className='border-2 border-gray-300 outline-none' name="description" id=""></textarea>

                    <label className='bg-gray-700 px-4 py-2 cursor-pointer text-white rounded-md hover:bg-gray-900 transition-all transition-2s w-max' required htmlFor="file">Upload Image/Video</label>
                    <input onChange={handleFileSubmit} className='border-2 border-gray-300' id='file' type="file" hidden />

                    <div>
                        {
                            loading === true ? "Loading..." :
                                userDetail.file && <div>
                                    {
                                        userDetail.file.includes('image')
                                            ?
                                            <img src={userDetail.file} alt="" />
                                            :
                                            <video className='h-56 w-full' controls src={userDetail.file}></video>
                                    }
                                </div>

                        }
                    </div>

                    <button onClick={handleSubmit} className='bg-green-700 px-4 py-2 cursor-pointer text-white rounded-md hover:bg-green-800 transition-all transition-2s w-full'>Submit</button>

                </div>
            </Modal>
            <Modal title="Search..." open={isModalOpens} onOk={handleOks} onCancel={handleCancels}>
                <div className='flex flex-col gap-3 '>
                    <label htmlFor="">Friends</label>

                    <input onChange={handelUserGet} placeholder='Search...' className=' rounded-lg py-2 px-4 outline-none border-2 border-gray-300 ' type="text" />

                    {
                        getFriend.map((friend) => {
                            return friend._id !== id &&
                                <Link to={'/friend'} state={friend._id} key={id} className='flex gap-6 cursor-pointer border-b-2 pb-1 border-b-gray-300 rounded-lg'>

                                    <img src={friend.profilePic} className='h-10 w-10 text-white rounded-full' alt="" />
                                    <p className='text-gray-900'>{friend.name}</p>
                                </Link>
                        })

                    }
                </div>
            </Modal>
        </div>
    )
}

export default Sidebar
