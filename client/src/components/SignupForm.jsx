import React, { useState } from "react";
import axios from "axios";
import { useUserContext } from "../contexts/UserContext";
import {useNavigate} from 'react-router-dom'

function SignupForm() {

    const { setUser } = useUserContext();
    const [msg, setMsg] = useState("");
    const [visible, setVisible] = useState(false);
    const nav = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        let formData = new FormData();

        formData.append(e.target.email);
        formData.append(e.target.password);
        formData.append(e.target.username);

        try{
            let res = await axios.post("/api/signup", formData);
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
    <div className="container">
        <div>{msg}</div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label for="exampleInputEmail1" className="form-label">
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
          <label for="exampleInputPassword1" className="form-label">
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
          <label className="form-check-label" for="exampleCheck1">
            Show Password
          </label>
        </div>

        <div className="mb-3">
          <label for="exampleInputEmail1" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            name="username"
          />
          <div id="emailHelp" className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}

export default SignupForm;
