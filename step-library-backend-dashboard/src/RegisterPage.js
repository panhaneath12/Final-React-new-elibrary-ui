import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
export default function RegisterPage() {
  const data = useLocation().state.userData;
  const [user, addUser] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [validation, setValidation] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    isUserExisted: false,
  });
  const register = (e) => {
    e.preventDefault();
    if(user.confirmPassword === user.password){
    const formData = new FormData();
    formData.append("imageFile", user.imageFile);
    formData.append("imagePath", user.imagePath);
    formData.append("username", user.username);
    formData.append("password", user.password);
    formData.append("role", 'Teacher');
    fetch("https://localhost:7287/api/Users", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${data.token}`, // librarian token
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 400) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
          });
        } else {
          console.log(data);
          console.log(data.status);
          if (data.status !== "error") {
            Swal.fire({
              title: "Your teacher account has been created successfully!",
              text: "You clicked the button!",
              icon: "success",
            });
            addUser({ username: "", password: "", confirmPassword: "", imageFile: null, imagePath: "" });
            document.getElementById('formFileLg').value = '';
            setValidation({ ...validation, isUserExisted: false, confirmPassword: "" });
          } else {
            setValidation({ ...validation, isUserExisted: true });
          }
        }
      });
    }
  };
  const handleUsernameInput = (e) => {
    if (e.target.name === "username" && e.target.value.length > 15)
      setValidation({
        ...validation,
        [e.target.name]: "Username must contain 15 characters",
      });
    else setValidation({ ...validation, [e.target.name]: "" });
    addUser({ ...user, [e.target.name]: e.target.value });
    setValidation({ ...validation, isUserExisted: false });
  };
  const handlePasswordInput = (e) => {
    console.log(e.target.value);
    console.log("cp: " + user.confirmPassword + "p: " + user.password);
    if (e.target.name === "password" && e.target.value.length !== 6) {
      setValidation({
        ...validation,
        [e.target.name]: "Password must contain 6 characters",
        confirmPassword:
          user.confirmPassword !== user.password
            ? "Password is not matched"
            : "",
      });
    } else
      setValidation({
        ...validation,
        [e.target.name]: "",
      });

    addUser({ ...user, [e.target.name]: e.target.value });

    console.log(user.confirmPassword + " " + user.password);
  };
  const handleConfirmPasswordInput = (e) => {
    console.log(user.confirmPassword);
    if (user.password !== e.target.value) {
      setValidation({
        ...validation,
        [e.target.name]: "Password is not matched",
      });
    } else setValidation({ ...validation, [e.target.name]: "" });
    addUser({ ...user, [e.target.name]: e.target.value });
  };
  const showPreview = (e) => {
    if (e.target.files && e.target.files[0]) {
      let imageFile = e.target.files[0];

      console.log(imageFile);
      const reader = new FileReader();
      reader.onload = (x) => {
        addUser({ ...user, imageFile: imageFile, imagePath: x.target.result });
      };
      reader.readAsDataURL(imageFile);
    }
  };
  return (
    <div className="d-flex flex-column  vh-100">
      <div className="bg-dark text-white text-center mb-5 "></div>
      <div className="container">
        <div className="row d-flex align-items-center justify-content-center h-100">
          <div className="col-md-7 col-lg-5 col-xl-5 offset-xl-1">
            <div className="">
              <div className="card mb-4 mb-xl-0">
                <div className="card-header">Profile Picture</div>
                <div className="card-body text-center">
                  <img
                    className="card-img-top"
                    src={user.imagePath}
                    alt=""
                  ></img>

                  {/* <button className="btn btn-primary" type="button" >
                    Upload new image
                  </button>
                  <div> */}
                  <input
                    className="form-control form-control-lg"
                    id="formFileLg"
                    type="file"
                    accept="image/*"
                    onChange={showPreview}
                  ></input>
                </div>
              </div>
            </div>
            <br></br>
            <form
              className="d-flex flex-column justify-content-center"
              onSubmit={register}
            >
              <div className="form-outline mb-4 ">
                <label className="form-label" htmlFor="username">
                  Username
                </label>
                <input
                  value={user.username}
                  name="username"
                  type="text"
                  id="username"
                  className="form-control form-control-lg"
                  onChange={handleUsernameInput}
                />
              </div>
              {validation.username !== "" && (
                <span className="text-danger">{validation.username}</span>
              )}
              <div className="form-outline mb-4">
                <label className="form-label" htmlFor="password">
                  Password
                </label>
                <input
                  value={user.password}
                  name="password"
                  type="password"
                  id="password"
                  className="form-control form-control-lg"
                  onChange={handlePasswordInput}
                  autoComplete='true'
                />
              </div>
              {validation.password !== "" && (
                <span className="text-danger">{validation.password}</span>
              )}
              <div className="form-outline mb-4">
                <label className="form-label" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <input
                  value={user.confirmPassword}
                  name="confirmPassword"
                  type="password"
                  id="confirmPassword"
                  className="form-control form-control-lg"
                  onChange={handleConfirmPasswordInput}
                  autoComplete='true'
                />
              </div>
              {validation.confirmPassword !== "" && (
                <span className="text-danger">
                  {validation.confirmPassword}
                </span>
              )}
              <div className="text-danger"></div>

              <div className="d-flex justify-content-around align-items-center mb-4"></div>

              {validation.isUserExisted === true && (
                <span className="text-danger">Username already exits</span>
              )}
              <button
                type="submit"
                className="btn btn-primary btn-lg btn-block"
              >
                Sign up
              </button>
            </form>
            <br></br>
          </div>
        </div>
      </div>
    </div>
  );
}
