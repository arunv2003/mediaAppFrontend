import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  let logoutCtx = useContext(UserContext)

  // console.log(logoutCtx?.userInfo?.user?.profilePic)
  
  let login = logoutCtx.userInfo.login
  // console.log(login)
  const [showDropDown, setShowDropDown] = useState(false);

  


  return (
    <nav className="bg-gradient-to-r fixed w-full z-50 bg-gray-900  p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-white text-2xl font-bold">
          <img className="h-10 w-24 rounded-md p-1 bg-green-600" src="https://is1-ssl.mzstatic.com/image/thumb/Purple124/v4/15/92/3a/15923a35-21a5-e10f-dcc4-b46b44fe1e50/AppIcon-0-0-1x_U007emarketing-0-0-0-10-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/434x0w.webp" alt="" />
        </Link>

       

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center bg-white text-gray-700  rounded-full hover:bg-gray-100"
          >
            <img className="h-10 w-10  rounded-full" src={logoutCtx?.userInfo?.user?.profilePic? logoutCtx.userInfo.user.profilePic:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
            alt="" />

          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-20">
              {
                login===true&&<Link to={"/profile"} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">Profile</Link>
              }
              {
                login === false && <div>
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Register
                  </Link>
                </div>
              }
              {login === true && <button
                onClick={() => logoutCtx.logout()}
                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Search Bar */}
      {/* <div className="block md:hidden mt-2">
        <input
          type="text"
          placeholder="Search..."
          className="p-2 rounded-lg w-full focus:outline-none"
        />
      </div> */}
    </nav>
  );
};

export default Navbar;
