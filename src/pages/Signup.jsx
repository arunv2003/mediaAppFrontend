import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Signup = () => {
  const url =
    import.meta.env.VITE_DEPLOYEMENT === "production"
      ? import.meta.env.VITE_BACKEND_URL
      : "http://localhost:5002";

  let navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleUser = async (e) => {
    e.preventDefault();

    // Validate user input
    if (!user.name || !user.email || !user.password) {
      return toast.error("All fields are required", { position: "top-right" });
    }

    try {
      let res = await fetch(`${url}/api/users/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      let data = await res.json();

      if (data.success) {
        toast.success(data.msg, { position: "top-right" });
        navigate("/login");
      } else {
        toast.error(data.msg, { position: "top-right" });
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.", { position: "top-right" });
      console.error("Signup Error:", error);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto overflow-hidden bg-gray-800 rounded-lg shadow-md">
      <div className="px-6 py-4">
        <div className="flex justify-center mx-auto">
          <img className="w-auto h-7 sm:h-8" src="https://merakiui.com/images/logo.svg" alt="Logo" />
        </div>
        <h3 className="mt-3 text-xl font-medium text-center text-gray-200">Create Account</h3>
        <p className="mt-1 text-center text-gray-400">Register to continue</p>

        <form onSubmit={handleUser}>
          <div className="w-full mt-4">
            <input
              name="name"
              onChange={handleChange}
              className="block w-full px-4 py-2 mt-2 bg-gray-800 text-gray-200 placeholder-gray-500 border rounded-lg focus:border-blue-400 focus:ring focus:ring-blue-300"
              type="text"
              placeholder="Name"
            />
          </div>

          <div className="w-full mt-4">
            <input
              name="email"
              onChange={handleChange}
              className="block w-full px-4 py-2 mt-2 bg-gray-800 text-gray-200 placeholder-gray-500 border rounded-lg focus:border-blue-400 focus:ring focus:ring-blue-300"
              type="email"
              placeholder="Email Address"
            />
          </div>

          <div className="w-full mt-4">
            <input
              name="password"
              onChange={handleChange}
              className="block w-full px-4 py-2 mt-2 bg-gray-800 text-gray-200 placeholder-gray-500 border rounded-lg focus:border-blue-400 focus:ring focus:ring-blue-300"
              type="password"
              placeholder="Password"
            />
          </div>

          <div className="flex items-center justify-between mt-4">
            <Link to="/forgotPassword" className="text-sm text-gray-100 hover:text-gray-500">
              Forgot Password?
            </Link>
            <button
              type="submit"
              className="px-6 py-2 text-sm font-medium tracking-wide text-white bg-blue-500 rounded-lg hover:bg-blue-400 focus:ring focus:ring-blue-300"
            >
              Register
            </button>
          </div>
        </form>
      </div>

      <div className="flex items-center justify-center py-4 bg-gray-700">
        <span className="text-sm text-gray-100">Already have an account?</span>
        <Link to="/login" className="mx-2 text-sm font-bold text-blue-500 hover:underline">
          Login
        </Link>
      </div>
    </div>
  );
};

export default Signup;
