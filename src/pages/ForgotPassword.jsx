import axios from 'axios'
import React, { useRef } from 'react'
import { toast } from 'react-toastify'

const ForgotPassword = () => {
    let url=import.meta.env.VITE_DEPLOYEMENT==="production"?import.meta.env.VITE_BACKEND_URL:"http://localhost:5002";
    let emailRef=useRef()
    const handleSubmit=async(e)=>{
       e.preventDefault()
        let obj={
            email:emailRef.current.value
        }
        // console.log(obj)

        let res=axios.post(url+'/api/users/forgotPassword',obj)
        // console.log(res)

        let dataShow=(await res).data
        // console.log(dataShow)

        if(dataShow.success){
         toast.success(dataShow.msg,{position:'top-center'})
        }
        else{
            toast.error(dataShow.msg,{position:'top-center'})
        }
    }
    return (
        <>
            <section className="flex flex-col max-w-3xl mx-auto overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800 md:flex-row md:h-48">
                <div className="md:flex md:items-center md:justify-center md:w-1/2 md:bg-gray-700 md:dark:bg-gray-800">
                    <div className="px-6 py-6 md:px-8 md:py-0">
                        <h2 className="text-lg font-bold text-gray-700 dark:text-white md:text-gray-100">Email for <span className="text-blue-600 dark:text-blue-400 md:text-blue-300">Password</span> Forgot</h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 md:text-gray-400">Enter your email for getting your Email</p>
                    </div>
                </div>
                <div className="flex items-center justify-center pb-6 md:py-0 md:w-1/2">
                    <form>
                        <div className="flex flex-col p-1.5 overflow-hidden border rounded-lg dark:border-gray-600 lg:flex-row dark:focus-within:border-blue-300 focus-within:ring focus-within:ring-opacity-40 focus-within:border-blue-400 focus-within:ring-blue-300">
                            <input ref={emailRef}  className="px-6 py-2 text-gray-700 placeholder-gray-500 bg-white outline-none dark:bg-gray-800 dark:placeholder-gray-400 focus:placeholder-transparent dark:focus:placeholder-transparent" type="text" name="email" placeholder="Enter your email" aria-label="Enter your email" />
                            <button onClick={(e)=>handleSubmit(e)} className="px-4 py-3 text-sm font-medium tracking-wider text-gray-100 uppercase transition-colors duration-300 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:bg-gray-600 focus:outline-none">Submit</button>
                        </div>
                    </form>
                </div>
            </section>


        </>
    )
}

export default ForgotPassword
