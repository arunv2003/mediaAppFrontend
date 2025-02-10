import React, { useContext, useEffect, useState } from "react";
import UserContext from "./UserContext";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import axios from "axios";


const userState = (props) => {
  let url=import.meta.env.VITE_DEPLOYEMENT==="production"?import.meta.env.VITE_BACKEND_URL:"http://localhost:5002";
  let userCtx = useContext(UserContext);
  let userDetail = JSON.parse(localStorage.getItem("social"));
  const [userInfo, setUserInfo] = useState({
    login: userDetail ? userDetail.login : false,
    token: userDetail ? userDetail.token : "",
    userId: userDetail ? userDetail.userId : "",
    user: ""
  });
  let [arr, setArr] = useState([])

  const getNotify = async () => {
    let res = await axios.get(url+'/api/notification/getNotify', {
      headers: {
        'Authorization':userInfo.token
      }
    })
    let data = res.data
    // console.log(data)
    setArr(data)
  }
  useEffect(() => {
    if (userInfo.token) {
      getNotify()
    }
  }, [userInfo.token])

  // console.log(userInfo)
  

  const getUserDetails = async () => {
    let res = await axios.get(url+'/api/users/userFound', {
      headers: {
        "Authorization": userInfo.token
      }
    })
    let data = res.data
    // console.log(data)

    if (data.success) {
      setUserInfo({ ...userInfo, user: data.data })
      // console.log(data.data)

    }

  }

  useEffect(() => {
    if (userInfo.token) {
      getUserDetails()
    }
  }, [userInfo.token])

  const addUser = (data) => {
    // console.log(data);
    const decoded = jwtDecode(data.token);
    // console.log(decoded);
    // console.log(decoded._id);
    localStorage.setItem(
      "social",
      JSON.stringify({ login: true, token: data.token, userId: decoded._id })
    );

    setUserInfo({ login: true, token: data.token, userId: decoded._id });

  };


  
  // console.log(arr)
  const like = async (ans) => {
    // console.log(ans)
    // console.log(ans.userId)
    let obj = {
      ...ans.userId, message: ans.message
    }
    // arr.push(ans.userId, ans.message)
    setArr([...arr, obj])

  }




  const logout = () => {
    toast.success("Logout successful", { position: "top-center" })
    setTimeout(() => {
      localStorage.removeItem("social");
      setUserInfo({ login: false, token: "", userId: "" });
    }, 3000);
  };

  return (
    <UserContext.Provider value={{ userInfo, addUser, logout, getUserDetails, like,arr,getNotify }}>
      {props.children}
    </UserContext.Provider>
  );
};

export default userState;
