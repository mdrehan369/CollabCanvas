import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useUserContext } from '../contexts/UserContext';
import { useState, useEffect } from 'react';
import axios from 'axios';
import logo from "../assets/logo.png";

function LoginForm() {

  const { setUser } = useUserContext();
  const nav = useNavigate();
  const [msg, setMsg] = useState("");
  const [visible, setVisible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const body = {
      username: e.target.username.value,
      password: e.target.password.value
    }

    try{
        let res = await axios.post("/api/login", body, {baseURL: 'https://collabcanvas-backend.onrender.com'});
        console.log(res)
        if(res.data.success) {
          setUser(res.data.user);
          nav("/");
        }else{
          setMsg(res.data.msg);
        }
    }catch(e){
        console.log(e)
    }
  }

  useEffect(() => {
    let form = document.getElementsByTagName("form")[0];
let img = document.getElementById("img");

if(window.innerWidth < 768) {
  form.classList.replace("w-25", "w-100");
  img.classList.replace("w-25", "w-100");
}
  }, [])

  return (
    <div className='container-fluid d-flex flex-column align-items-center justify-content-center w-100' style={{height: '100vh'}}>
      <div className='w-25' id='img'>{msg?(<div className="alert alert-danger mt-4 text-center"> 
            <strong>{msg}!</strong> Please Register
        </div>):""}<img src={logo} className='img-fluid'/></div>
      <form className='w-25 mt-3' onSubmit= {handleSubmit}>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">Username</label>
          <input type="text" name="username" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
          <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
          <input type={visible?"text":"password"} name="password" className="form-control" id="exampleInputPassword1" />
        </div>
        <div className="mb-3 form-check">
          <input type="checkbox" onClick={(e) => setVisible((prev) => !prev)} className="form-check-input" id="exampleCheck1" />
          <label className="form-check-label" htmlFor="exampleCheck1">Show Password</label>
        </div>
        <NavLink to="/signup">New User? Register</NavLink><br />
        <button type="submit" className="btn btn-primary mt-2">Sign In</button>
      </form>
    </div>
  )
}

export default LoginForm
