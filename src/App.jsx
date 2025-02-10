import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import { useContext } from "react";
import UserContext from "./context/UserContext";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import Setting from "./pages/Setting";
import Friend from "./pages/Friend";
import About from "./pages/About";
import Reel from "./pages/Reel";
import Message from "./pages/Message";
// import FriendMessageUser from "./pages/FriendMessageUser";
import NotificationLike from "./components/NotificationLike";

function App() {
  let userCtx=useContext(UserContext)
  // console.log(userCtx)
  // console.log(userCtx.userInfo.login)
  


  let login =userCtx.userInfo.login;
  return (
    <>
      <BrowserRouter>
        <div className=" mt-0, pb-[90px]">
          <Navbar />
        </div>
        <Routes>
          <Route
            path="/"
            element={login === true ? <Home /> : <Navigate to={"/login"} />}
          />
          <Route
            path="/login"
            element={login === false ? <Login /> : <Navigate to={"/"} />}
          />
          <Route
            path="/signup"
            element={login === false ? <Signup /> : <Navigate to={"/"} />}
          />
          <Route path="/forgotPassword" element={<ForgotPassword/>}/>
          <Route path="/profile" element={login===true?<Profile/>:<Navigate to={"/login"}/>}/>
          <Route path="/setting" element={<Setting/>}/>
          <Route path="/friend" element={<Friend/>}/>
          <Route path="/about" element={<About/>}/>
          <Route path="/reel" element={<Reel/>}/>
          <Route path="/message" element={<Message/>}/>
          {/* <Route path="/friendUser" element={<FriendMessageUser/>}/> */}
          <Route path="/notification" element={<NotificationLike/>}/>
          

        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </>
  );
}

export default App;
