import React, { useContext, useRef } from "react";
import {Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import UserContext from "../context/UserContext";
const Login = () => {
  let url=import.meta.env.VITE_DEPLOYEMENT==="production"?import.meta.env.BACKEND_URL:"http://localhost:5002";
  let addUserCtx=useContext(UserContext)
  // console.log(addUserCtx)
  
  let navigate = useNavigate();

  let emailRef = useRef();
  let passwordRef = useRef();

  const HandleLogin = async (e) => {
    e.preventDefault();
    let obj = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };
    // console.log(obj);
    let res = await axios.post(url+"/api/users/login", obj);
    // console.log(res);
    // console.log(res.data);

    // console.log(res.data.token);

    if (res.data.success) {
      addUserCtx.addUser(res.data)
      toast.success(res.data.msg,{position:"top-right"})
      navigate("/")
    } else {
      toast.error(res.data.msg,{position:"top-right"})
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto overflow-hidden bg-gray-800  rounded-lg shadow-md dark:bg-gray-800">
      <div className="px-6 py-4">
        <div className="flex justify-center mx-auto">
          <img
            className="w-auto h-7 sm:h-8"
            src="https://merakiui.com/images/logo.svg"
          />
        </div>
        <h3 className="mt-3 text-xl font-medium text-center text-gray-100 dark:text-gray-200">
          Welcome Back
        </h3>
        <p className="mt-1 text-center text-gray-100 dark:text-gray-400">
          Login Page
        </p>
        <form>
          <div className="w-full mt-4">
            <input
              ref={emailRef}
              className="block  bg-gray-800 w-full px-4 py-2 mt-2 text-gray-200 placeholder-gray-500  border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-200 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
              type="email"
              placeholder="Email Address"
              aria-label="Email Address"
            />
          </div>
          <div className="w-full mt-4">
            <input
              ref={passwordRef}
              className="block w-full bg-gray-800 px-4 py-2 mt-2 text-gray-200 placeholder-gray-500  border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
              type="password"
              placeholder="Password"
              aria-label="Password"
            />
          </div>
          <div className="flex items-center justify-between mt-4">
            <Link to={"/forgotPassword"}
              className="text-sm text-gray-100 dark:text-gray-200 hover:text-gray-100"
            >
              Forget Password?
            </Link>
            <button
              onClick={(e) => HandleLogin(e)}
              className="px-6 py-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
            >
              Login
            </button>
          </div>
        </form>
      </div>
      <div className="flex  bg-gray-700 items-center justify-center py-4 text-center  dark:bg-gray-700">
        <span className="text-sm text-gray-100 dark:text-gray-200">
          Don't have an account?{" "}
        </span>
        <Link
          to={"/signup"}
          className="mx-2 text-sm font-bold text-blue-500 dark:text-blue-400 hover:underline"
        >
          Register
        </Link>
      </div>
    </div>
  );
};

export default Login;
