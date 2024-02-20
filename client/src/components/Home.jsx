import axios from "axios";
import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";
import logo from "../assets/logo.png";

function makeid(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

function Home() {
  const nav = useNavigate();
  const [roomID, setRoomID] = useState("");
  const [msg, setMsg] = useState("");
  const { user, setUser } = useUserContext();
  const [loading, setLoading] = useState(true);

  const handleCreateRoom = () => {
    const id = makeid(5);
    nav(`/whiteBoard/${id}`);
  };

  const handleLogout = async () => {
    try{
      let res = await axios.get("/api/logout", {baseURL:'https://collabcanvas-backend.onrender.com'});
      if(res.status === 200) {
        setUser(null);
        nav("/login");
      }else{
        setMsg("Some Error Occured !");
      }
    } catch(e) {
      console.log(e);
    }
  }

  const handleJoinRoom = async () => {
    try {
      let res = await axios.get(`/api/room/${roomID}`, {baseURL:'https://collabcanvas-backend.onrender.com'});
      if (res.data.success) {
        nav(`/whiteBoard/${roomID}`);
      } else {
        setMsg("Room does not exist");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleUser = async () => {
    if (user) return;
    try {
      let res = await axios.get("/api/user");
      if (res.data.success) {
        setUser(res.data.user);
      } else {
        setLoading((prev) => false)
        nav("/login");
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    setLoading((prev) => true);
    handleUser();
    setLoading((prev) => false);
  }, []);

  useEffect(() => {
    let input = document.getElementsByTagName("input")[0];
    let btn = document.getElementsByTagName("button");
    let img = document.getElementsByTagName("img")[0];

    if(window.innerWidth < 768) {
      img.classList.replace("w-25", "w-100");
      input.classList.replace("w-25", "w-100");
      Array.from(btn).forEach((val) => val.classList.replace("w-25", "w-100"));
    }
  }, [])

  return (
    !loading &&
    <div className="container-fluid d-flex flex-column align-items-center justify-content-center" style={{height: '100vh'}}>
        {msg?(<div className="alert alert-danger mt-4 text-center"> 
            <strong>{msg}!</strong>
        </div>):""}

       <img src={logo} className='img-fluid w-25'/>

      <input
        type="text"
        value={roomID}
        onChange={(e) => setRoomID(e.target.value)}
        placeholder="Room ID"
        className="w-25 rounded border p-2 m-5"
        id="join"
        onKeyPress={(e) => {  if(e.key === 'Enter') {
          handleJoinRoom();
        }}}
      />

      <button type="button" className="btn btn-primary w-25 m-2 py-2" onClick={handleJoinRoom}>
        Join Room
      </button>

      <button type="button" className="btn btn-outline-primary w-25 m-2 py-2" onClick={handleCreateRoom}>
        Create Room
      </button>

      <NavLink onClick={handleLogout}>Log Out</NavLink>
    </div>
  );
}

export default Home;
