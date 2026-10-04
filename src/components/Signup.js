import React, { useState } from "react";
import {useNavigate} from 'react-router-dom'

function Signup(props) {

   const [credentials, setCredentials] = useState({name:'',email:'', password:'', cpassword:''})
      const history= useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {name, email, password}=credentials;
    const response = await fetch("http://localhost:5000/api/auth/createuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({name, email, password})
      
    });
    const json = await response.json();
    console.log(json);
    if(json.success){
        //SAve the auth token and redirect
        localStorage.setItem('token', json.autoTokenData);
        history('/');
        props.showAlert('Successfully Signed up', 'success')

    }else{
        props.showAlert('Invalid Credentials', 'danger')
    }
  };


  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  return (
    <div className="container">
      <h2>HM-Notebook: Make an Account Here</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlhtmlFor="name">UserName</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            aria-describedby="emailHelp"
            onChange={onChange}
            placeholder="Enter username"
          />
          <small id="emailHelp" className="form-text text-muted">
            We'll never share your UserName with anyone else.
          </small>
        </div>
        <div className="form-group">
          <label htmlhtmlFor="email">Email address</label>
          <input
            type="email"
            className="form-control"
            name="email"
            id="email"
            onChange={onChange}
            aria-describedby="emailHelp"
            placeholder="Enter email"
          />
          <small id="emailHelp" className="form-text text-muted">
            We'll never share your email with anyone else.
          </small>
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            id="password"
            minLength={5}
            required
            onChange={onChange}
            placeholder="Password"
          />
        </div>
        <div className="form-group">
          <label htmlFor="cpassword">Confirm Password</label>
          <input
            type="password"
            name="cpassword"
            className="form-control"
            id="cpassword"
            minLength={5}
            required
            onChange={onChange}
            placeholder="Password"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}

export default Signup;
