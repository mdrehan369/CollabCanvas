import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useUserContext } from '../contexts/UserContext';
import { useState } from 'react';

function LoginForm() {

  const { setUser } = useUserContext();
  const nav = useNavigate();
  const [msg, setMsg] = useState("");
  const [visible, setVisible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formData = new FormData();

    formData.append(e.target.password);
    formData.append(e.target.username);

    try{
        let res = await axios.post("/api/login", formData);
        if(res.data.success) {
          setUser(res.data.user);
          nav("/");
        }else{
          setMsg(res.data.msg);
        }
    }catch {
        setMsg("Some Error Occured");
    }

  }

  return (
    <div className='container mx-auto my-auto'>
      <div>{msg}</div>
      <form onSubmit= {handleSubmit}>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
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
        <NavLink to="/signup">Register</NavLink><br />
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}

export default LoginForm
