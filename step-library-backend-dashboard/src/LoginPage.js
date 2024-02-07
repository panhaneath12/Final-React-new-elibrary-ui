import React, { useEffect, useState } from "react";
import {  useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import Swal from "sweetalert2";

export default function LoginPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState({username: '', password: ''});
  const [validation, setValidation] = useState({username: '', password: ''})
  const [userStatus, setUserStatus] = useState(null);
  useEffect(()=>{
     if(typeof(Cookies.get('roleToken')) !== 'undefined')
     isUserTokenExpired(Cookies.get('roleToken'));
  }, []);
  const isUserTokenExpired=(tokenValue)=>{
    fetch(`https://localhost:7287/api/Users/token`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({value: tokenValue})
     
    })
      .then((res) => res.json())
      .then((data) => {
        if(data.role !== 'Teacher'){
          navigate('/librarianPage', {state: {userData: data}}); 
         
        }       
        else if(data.role !== 'Librarian') navigate('/teacherPage', {state: {userData: data}});        
        console.log(data);
      });
      
  }
  const login = (e) => {
    e.preventDefault();
    console.log(user.username)
    console.log(user.password)
    if(user.username.length > 0 && user.password.length === 6){
    fetch(`https://localhost:7287/api/Users/${user.username}/${user.password}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if(data.role === 'Librarian'){
          console.log('true');
         // getUsers(data.token)
         Cookies.set('roleToken', data.token);
         navigate('/librarianPage', {state: {userData: data}}); 
        }else if(data.role === 'Teacher'){
          Cookies.set('roleToken', data.token);
          navigate('/teacherPage', {state: {userData: data}}); 
        }else if(data.title === 'Not Found'){
          console.log('no found');
          setUserStatus('check your input again');
        }
        console.log(data.token);
      });
    }else{
      Swal.fire({
        title: "Check your username and password again",
        text: "invalid fields",
        icon: "info",
      });
    }
  };
  
  const handleUsernameInput=(e)=>{
      if(e.target.name === 'username' && e.target.value.length > 15) setValidation({...validation, [e.target.name]: 'Username must contain 15 digits'});
      else setValidation({...validation, [e.target.name]: ''});
      setUser({...user, [e.target.name]: e.target.value}) 
      setUserStatus('');
  }
  const handlePasswordInput=(e)=>{
    if(e.target.name === 'password' && e.target.value.length < 6) setValidation({...validation, [e.target.name]: 'Password must contain 6 digits'});
    else setValidation({...validation, [e.target.name]: ''});
    setUser({...user, [e.target.name]: e.target.value}) 
    setUserStatus('');
    
}
  return (
    <>

    <div className="d-flex flex-column justify-content-center align-items-center  " style={{height:"90vh"}}>
      <div className="shadow-lg p-5 rounded w-25">
      <div className="d-flex justify-content-center aling-items-center   "> <h1>Login </h1></div>
            <form className="d-flex flex-column justify-content-center align-items-center gap-3 "
              onSubmit={login}
            >
              <div className=" w-75">
                <label className="form-label " htmlFor="username">
                  Username
                </label>
                <input
                  value={user.username}
                  name="username"
                  type="text"
                  id="username"
                  className="form-control w-100"
                  onChange={handleUsernameInput}
                 
                />
              </div>
             {validation.username !== '' && <span className="text-danger">{validation.username}</span>}
              <div className=" d-flex justify-content-center flex-column w-75">
                <label className="form-label" htmlFor="password">
                  Password
                </label>
                <input
                 value={user.password}
                  name="password"
                  type="password"
                  id="password"
                  className="form-control w-100"
                  onChange={handlePasswordInput}
                  autoComplete="current-complete"
                />
              </div>
             {validation.password !== '' && <span className="text-danger">{validation.password}</span>}
             {userStatus !== '' && <span className = "text-danger">{userStatus}</span>}
              <div className="text-danger"></div>
              <div className="d-flex justify-content-center aling-items-center mb-4 ">
                
              <button
                type="submit"
                className="btn btn-primary btn-lg"
              >
                Login
              </button>
              </div>
              
            </form>
      </div>
    </div>
      
      </>
    
    
  );
}
