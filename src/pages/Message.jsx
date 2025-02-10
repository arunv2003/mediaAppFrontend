import React, { useContext, useEffect, useRef, useState } from 'react'
import Sidebar from '../components/Sidebar'
import { Link, useLocation } from 'react-router-dom'
import UserContext from '../context/UserContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { io } from "socket.io-client";
import ScrollToBottom from 'react-scroll-to-bottom';
import { formatDistanceToNow } from "date-fns";
import "../App.css";

const Message = () => {
    let url=import.meta.env.VITE_DEPLOYEMENT==="production"?import.meta.env.BACKEND_URL:"http://localhost:5002";
    let Endpoint = url
    const socketRef = useRef();
    //  let socket =io(Endpoint,{transports:['websocket']});

    let locution = useLocation()
    let friendId = locution.state
    let friendIdId = friendId._id

    // console.log(friendId.bio)
    // console.log(friendId.name)
    // console.log(friendId._id)

    let friendPic = friendId?.profilePic
    // console.log(friendPic)


    let userToken = useContext(UserContext)
    // console.log(userToken.userInfo.userId)
    let userId = userToken.userInfo.userId
    let token = userToken?.userInfo?.token
    // console.log(token)

    let userProfilePic = userToken?.userInfo?.user?.profilePic
    // console.log(userProfilePic)

    let inputRef = useRef()


    const [allChat, setAllChat] = useState([])
    // console.log(allChat)
    const getMessage = async () => {
        let res = await axios.get(url+`/api/message/getMessage/${friendId._id}`, {
            headers: {
                "Authorization": token
            }
        })
        let data = res.data
        // console.log(data)
        setAllChat(data.chat)
    }

    useEffect(() => {
        getMessage()
    }, [])

    useEffect(() => {
        socketRef.current = io(Endpoint, { transports: ['websocket'] });
        socketRef.current.emit('addUser', userId)
    }, [])


    const [userDetail, setUserDetail] = useState({
        file: ""
    })
    // console.log(userDetail)



    const [loading, setLoading] = useState(false)
    // console.log(loading)
    const handleFile = async (e) => {
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


    const handleMessageSend = async () => {

        socketRef.current.emit('sendMessage', { friendIdId, userId, message: inputRef.current.value })

        let value = inputRef.current.value
        // console.log(value)
        let obj = {
            text: inputRef.current.value,
            file: userDetail.file
        }
        // console.log(obj)
        let res = await axios.post(url+`/api/message/sendMessage/${friendId._id}`, obj, {
            headers: {
                "Authorization": token
            }
        })
        let data = res.data
        // console.log(data)
        if (data.success = true) {
            toast.success(data.msg, { position: 'top-right' })
            inputRef.current.value = ""
            setUserDetail({
                ...userDetail, file: ""
            })
            getMessage()
        }
        else {
            toast.error(data.msg, { position: 'top-right' })
            getMessage()
        }
    }

    const [newMessage, setNewMessage] = useState("")
    useEffect(() => {
        socketRef.current.on('getMessage', ({ userId, friendIdId, message }) => {
            // console.log({ userId, friendIdId, message })
            setNewMessage({ userId, friendIdId, text: message, createdAt: Date.now() })
        })

    }, [])

    useEffect(() => {
        if (newMessage) {
            setAllChat([...allChat, newMessage])
        }
    }, [newMessage])




    return (
        <div className='w-full m:bg-gray-800    z-30   left-0 top-[65px]'>
            <Sidebar />
            <div className='sm:w-[70%] w-full    sm:ml-[310px]   pr-8  pl-8  ' >
                <div className="flex-1 p:2 sm:p-6 justify-between flex flex-col h-[440px]">
                    <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-300">
                        <div className="relative flex items-center space-x-4">
                            <div className="relative">
                                <span className="absolute text-green-400 -right-1 -bottom-2">
                                    <svg width={20} height={20}>
                                        <circle cx={8} cy={8} r={8} fill="currentColor" />
                                    </svg>
                                </span>
                                <img className='h-12 w-12 rounded-full mt-2' src={friendPic} />
                            </div>
                            <div className="flex flex-col leading-tight">
                                <div className="text-2xl mt-1 flex items-center flex-col">
                                    <span className="text-gray-300 mr-3">{friendId.name}</span>
                                    <span className="text-gray-300 mr-3 text-xs">{friendId.bio}</span>
                                </div>
                            </div>
                        </div>

                    </div>
                    <ScrollToBottom id="messages" className="flex flex-col   no-scrollbar space-y-4 p-3  h-[340px] scrollbar-thumb-blue  scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
                        {
                            allChat.map((message, index) => {
                                return message === 0 ? <p>do not have any chat</p> : message.userId === userId ? <div id='messages' key={index} className="chat-message">
                                    <div className="flex items-end justify-end">

                                        <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
                                            <div>{
                                                message.text && <span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">{message.text}</span>
                                            }
                                                {
                                                    message.file && <div>
                                                        {
                                                            message.file.includes('image') ? <img className='sm:w-48 sm:h-52 w-28 h-32 mt-2' src={message.file} alt="" /> : <video controls className='sm:w-48 sm:h-52 w-28 h-32 mt-2' src={message.file}></video>
                                                        }
                                                    </div>
                                                }
                                                <p className="text-xs text-gray-600 dark:text-gray-300">
                                                    {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <img src={userProfilePic} alt="My profile" className="w-6 h-6 rounded-full order-2" />
                                    </div>
                                 </div> :
                                    <div key={index} className="chat-message">
                                        <div className="flex items-end">
                                            <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
                                                <div>{
                                                    message.text && <span className="px-4 py-2 rounded-lg inline-block bg-gray-300 text-gray-600">{message.text}</span>
                                                }
                                                    {
                                                        message.file && <div>
                                                            {
                                                                message.file.includes('image') ?<img className='sm:w-48 sm:h-52 w-28 h-32 mt-2' src={message.file} alt="" /> :<video controls className='sm:w-48 sm:h-52 w-28 h-32 mt-2' src={message.file}></video>
                                                            }
                                                        </div>
                                                    }
                                                    <p className="text-xs text-gray-600 dark:text-gray-300">
                                                        {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                                                    </p>
                                                </div>

                                            </div>
                                            <img className='h-6 w-6 rounded-lg' src={friendPic} />
                                        </div>
                                    </div>
                            })
                            
                        }
                    
                    </ScrollToBottom>

                </div>
                <div className="px-5 mb-2 sm:mb-0 mr-4">
                    <div className="relative flex w-full">
                        <div className='w-[90%]'><input ref={inputRef} type="text" placeholder="Write your message!" className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-1 bg-gray-200 rounded-md py-3" /></div>

                        <div className="absolute  right-0 items-center inset-y-0  sm:flex flex">
                           {
                            loading===true?"Loading":''
                           }
                            <label className=' py-2 w-8 cursor-pointer text-white rounded-md transition-all transition-2s ' required htmlFor="file">
                                <svg className="inline-flex items-center justify-center mr-3   text-gray-600 h-6 w-6 transition duration-500 ease-in-out  focus:outline-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </label>
                           
                            <input onChange={handleFile} className='border-2 border-gray-300' id='file' type="file" hidden />

                            <button onClick={handleMessageSend} type="button" className="inline-flex  items-center  justify-center rounded-r-lg px-2 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none">
                                <span className="font-bold">Send</span>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6 ml-2 transform rotate-90">
                                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Message
