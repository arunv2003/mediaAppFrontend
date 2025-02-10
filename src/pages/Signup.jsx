import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

const Signup = () => {

  let navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  // console.log(user);
  const handleChange = (e) => {
    // console.log(e.target.value)
    let value = e.target.value;
    // console.log(value)
    let name = e.target.name;
    // console.log(name)

    setUser({ ...user, [name]: value });
  };

  const handleUser = async (e) => {
    e.preventDefault();
    // console.log(user);
    let res = await fetch("https://mediaapp-i6ao.onrender.com/api/users/create", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(user),
    });
    let data = await res.json();
    // console.log(data);
    if (data.success) {
      toast.success(data.msg, { position: "top-right" });
      navigate("/login");
    } else {
      toast.error(data.msg, { position: "top-right" });
    }
  };
  return (
    <div className="w-full max-w-sm mx-auto overflow-hidden bg-gray-800 rounded-lg shadow-md dark:bg-gray-800">
      <div className="px-6 py-4">
        <div className="flex justify-center mx-auto">
          <img
            className="w-auto h-7 sm:h-8"
            src="https://merakiui.com/images/logo.svg"
          />
        </div>
        <h3 className="mt-3 text-xl font-medium text-center text-gray-200 dark:text-gray-200">
          Welcome Back
        </h3>
        <p className="mt-1 text-center text-gray-200 dark:text-gray-400">
          Register Page
        </p>
        <form>
          <div className="w-full mt-4">
            <input
              name="name"
              onChange={(e) => handleChange(e)}
              className="block w-full px-4 py-2 mt-2  bg-gray-800 text-gray-200 placeholder-gray-500 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
              type="text"
              placeholder="Name"
              aria-label="Email Address"
            />
          </div>
          <div className="w-full mt-4">
            <input
              name="email"
              onChange={(e) => handleChange(e)}
              className="block w-full px-4 py-2 mt-2  bg-gray-800 text-gray-200 placeholder-gray-500  border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
              type="email"
              placeholder="Email Address"
              aria-label="Email Address"
            />
          </div>
          <div className="w-full mt-4">
            <input
              name="password"
              onChange={(e) => {
                handleChange(e);
              }}
              className="block w-full px-4 py-2 mt-2 text-gray-200 placeholder-gray-500 bg-gray-800 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
              type="password"
              placeholder="Password"
              aria-label="Password"
            />
          </div>
          <div className="flex items-center justify-between mt-4">
            <Link
              to={"/forgotPassword"}
              className="text-sm text-gray-100 dark:text-gray-200 hover:text-gray-500"
            >
              Forget Password?
            </Link>
            <button
              onClick={(e) => handleUser(e)}
              className="px-6 py-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
            >
              Register
            </button>
          </div>
        </form>
      </div>
      <div className="flex items-center justify-center py-4 text-center bg-gray-700 dark:bg-gray-700">
        <span className="text-sm text-gray-100 dark:text-gray-200">
          Already have an account?{" "}
        </span>
        <Link
          to={"/login"}
          className="mx-2 text-sm font-bold text-blue-500 dark:text-blue-400 hover:underline"
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default Signup;
