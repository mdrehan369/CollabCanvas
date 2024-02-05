import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUserContext } from "../contexts/UserContext";
import {useNavigate, NavLink} from 'react-router-dom';
import logo from "../assets/logo.png";


function SignupForm() {

    const { setUser } = useUserContext();
    const [msg, setMsg] = useState("");
    const [visible, setVisible] = useState(false);
    const nav = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();

        const body = {
          username: e.target.username.value,
          password: e.target.password.value,
          email: e.target.email.value,
      }

        try{
            let res = await axios.post("/api/signup", {baseURL: 'https://collabcanvas-backend.onrender.com'}, {data: body});
            console.log(res);
            if(res.data.success) {
              setUser(res.data.user);
              console.log(res.data);
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
  let img = document.getElementsByTagName("img")[0];
  let msg = document.getElementById("msg");
  
  if(window.innerWidth < 768) {
    form.classList.replace("w-25", "w-100");
    img.classList.replace("w-25", "w-100");
    msg.classList.replace("w-25", "w-100");
  }
    }, [])


  return (
    <div className="container-fluid d-flex flex-column align-items-center justify-content-center" style={{height: '100vh'}}>
      <div className='w-25' id="msg">{msg?(<div className="alert alert-danger mt-4 text-center"> 
            <strong>{msg}!</strong> Please Register
        </div>):""}</div>
        <img src={logo} className="w-25 my-4" />
      <form onSubmit={handleSignup} className="w-25">
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            name="email"
          />
          <div id="emailHelp" className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input
            type={visible?"text":"password"}
            className="form-control"
            id="exampleInputPassword1"
            name="password"
          />
        </div>
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="exampleCheck1"
            onClick= {(e) => setVisible((prev) => !prev)}
          />
          <label className="form-check-label" htmlFor="exampleCheck1">
            Show Password
          </label>
        </div>

        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="exampleInputEmail12"
            aria-describedby="emailHelp"
            name="username"
          />
          <div id="emailHelp" className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>

        <NavLink to="/login">Already a user? Sign In</NavLink><br />

        <button type="submit" className="btn btn-primary mt-1">
          Submit
        </button>
      </form>
    </div>
  );
}

export default SignupForm;
