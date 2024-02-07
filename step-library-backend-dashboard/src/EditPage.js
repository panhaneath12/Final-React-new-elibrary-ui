import React, { useEffect, useState } from "react";
import "./EditPage.css";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function EditPage() {
  const navigate = useNavigate();
  const data = useLocation().state.userData;
  const [teachers, setTeachers] = useState([]);
  const [preview, setPreview] = useState();
  //data from librarianPage
  const [userProfile, setUserProfile] = useState([]);
  const userId = useLocation().state.userId;

  //data from GroupPage
  const groupId = useLocation().state.groupId;
  const [group, setGroup] = useState({ id: 0, name: "", userId: 0 });
  //data from ViewGroup
  const groupIsBeingViewed = useLocation().state.groupIsBeingViewed;
  const bookId = useLocation().state.bookId;
  const [book, setBook] = useState();
  //--methods
  const getBook = () => {
    fetch(`https://localhost:7287/api/Books/${bookId}`, {
      headers: {
        Authorization: `Bearer ${data.token}`, // teacher token
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setBook(data);
      });
  };
  const [validation, setValidation] = useState({
    updateStatus: "",
  });
  const isEditStudentGroup = useLocation().state.isEditStudentGroup;
  useEffect(() => {
    if (isEditStudentGroup === false) {
      fetch(`https://localhost:7287/api/Users/${userId}`, {
        headers: {
          Authorization: `Bearer ${data.token}`, // librarian token
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setUserProfile(data);
        });
    } else if (isEditStudentGroup === true) {
      fetch(`https://localhost:7287/api/Groups/${groupId}`, {
        headers: {
          Authorization: `Bearer ${data.token}`, // librarian token
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setGroup(data);
        });

      fetch(`https://localhost:7287/api/Users`, {
        headers: {
          Authorization: `Bearer ${data.token}`, // librarian token
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("fasdf" + group.userId);
          console.log(data.map((teacher) => teacher.id));
          setTeachers(data);
        });
    } else {
      getBook();
    }
  }, []);
  const editUser = (e) => {
    e.preventDefault();
    console.log(userProfile);
    const formData = new FormData();
    formData.append("id", userProfile.id);
    formData.append("imageFile", userProfile.imageFile);
    formData.append("imagePath", userProfile.imagePath);
    formData.append("username", userProfile.username);
    formData.append("password", userProfile.password);
    formData.append("role", userProfile.role);
    formData.append("token", userProfile.token);
    formData.append("groupId", userProfile.groupId);
    fetch(`https://localhost:7287/api/Users/${userId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${data.token}`, // librarian token
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 400) {
          setValidation({
            ...validation,
            updateStatus: "password must contain 6 charaters",
          });
        } else if (data.status === "success") {
          Swal.fire({
            title: "Your teacher account has been created successfully!",
            text: "You clicked the button!",
            icon: "success",
          });
          setValidation({ ...validation, updateStatus: "" });
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
          });
          setValidation({ ...validation, updateStatus: "" });
        }
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const editStudentGroup = () => {
    fetch(`https://localhost:7287/api/Groups/${groupId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${data.token}`, // librarian token
        "Content-Type": "application/json",
      },
      body: JSON.stringify(group),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.status !== "error") {
          Swal.fire({
            title: "Student Group has been updated successfully!",
            text: "You clicked the button!",
            icon: "success",
          });
        }
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //
  const handleTitleInput = (e) => {
    setBook({ ...book, title: e.target.value });
  };
  const handleDescriptionInput = (e) => {
    setBook({ ...book, description: e.target.value });
  };
  const handlePagesInput = (e) => {
    setBook({ ...book, pages: e.target.value });
  };
  const handleFileDownloadInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      let fileDownload = e.target.files[0];
     console.log(fileDownload);
     setBook({ ...book, fileDownload: fileDownload});
   }
  };
  //for teacher editing book teacher token
  const editBook = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("id", book.id);
    formData.append("title", book.title);
    formData.append("fileName", book.fileName);
    formData.append("imagePath", book.imagePath);
    formData.append("imageFile", book.imageFile);
    formData.append("fileDownload", book.fileDownload);
    formData.append("description", book.description);
    formData.append("pages", book.pages);
    formData.append("groupId", groupIsBeingViewed.id);
    fetch(`https://localhost:7287/api/Books/${bookId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${data.token}`, // teacher token
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.status !== "error") {
          Swal.fire({
            title: "book has been updated successfully!",
            text: "You clicked the button!",
            icon: "success",
          });
        }
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleUsernameInput = (e) => {
    setUserProfile({ ...userProfile, [e.target.name]: e.target.value });
  };
  const handlePasswordInput = (e) => {
    setUserProfile({ ...userProfile, [e.target.name]: e.target.value });
  };
  const handleGroupNameInput = (e) => {
    setGroup({ ...group, name: e.target.value });
  };
  const getUsers = (e) => {
    fetch(`https://localhost:7287/api/Users`, {
      headers: {
        Authorization: `Bearer ${data.token}`, // librarian token
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setTeachers(data);
      });

    setGroup({ ...group, userId: e.target.value });
  };
  const showPreview = (e) => {
    if (e.target.files && e.target.files[0]) {
      let imageFile = e.target.files[0];

      console.log(imageFile);
      const reader = new FileReader();
      reader.onload = (x) => {
        if (isEditStudentGroup === false)
          setUserProfile({
            ...userProfile,
            imageFile: imageFile,
            imagePath: userProfile.imagePath,
          });
        else if (isEditStudentGroup === null)
          setBook({ ...book, imageFile: imageFile, imagePath: book.imagePath });
        setPreview(x.target.result);
      };
      reader.readAsDataURL(imageFile);
    }
  };
  if (isEditStudentGroup === false) {
    return (
      <div>
        <button
          type="submit"
          className="btn btn-danger btn-lg btn-block"
          onClick={() =>
            navigate("/librarianPage", { state: { userData: data } })
          }
        >
          back to librarian page
        </button>
        <div className="container-xl px-4 mt-4">
          <div className="row">
            <div className="col-xl-4">
              <div className="card mb-4 mb-xl-0">
                <div className="card-header">Profile Picture</div>
                <div className="card-body text-center">
                  <img
                    className="card-img-top"
                    src={
                      preview
                        ? preview
                        : `https://localhost:7287/images/userprofiles/${userProfile.imagePath}`
                    }
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
            <div className="col-xl-8">
              <div className="card mb-4">
                <div className="card-header">Account Details</div>
                <div className="card-body">
                  <form>
                    <div className="mb-3">
                      <label className="small" htmlFor="inputUsername">
                        id: {userId}
                      </label>
                    </div>
                    <div className="mb-3">
                      <label className="small" htmlFor="inputUsername">
                        Username
                      </label>
                      <input
                        className="form-control"
                        id="username"
                        name="username"
                        type="text"
                        placeholder="Enter your username"
                        defaultValue={userProfile.username}
                        onChange={handleUsernameInput}
                      ></input>
                    </div>
                    <div className="mb-3">
                      <label className="small mb-1" htmlFor="inputUsername">
                        Password
                      </label>
                      <input
                        className="form-control"
                        name="password"
                        id="password"
                        type="text"
                        placeholder="Enter your password"
                        defaultValue={userProfile.password}
                        onChange={handlePasswordInput}
                      ></input>
                      {validation.updateStatus !== "" && (
                        <span className="text-danger">
                          {validation.updateStatus}
                        </span>
                      )}
                    </div>
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={editUser}
                    >
                      Save changes
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (isEditStudentGroup === true) {
    return (
      <div>
        <div className="d-flex m-10 justify-content-end">
          <button
            type="submit"
            className="btn btn-danger btn-lg btn-block"
            onClick={() =>
              navigate("/librarianPage/group", { state: { userData: data } })
            }
          >
            back to student group
          </button>
        </div>
        <div className="container-xl px-4 mt-4">
          <div className="row">
            <div className="col-xl-8">
              <div className="card mb-4">
                <div className="card-header">Student Group Details</div>
                <div className="card-body">
                  <form>
                    <div className="mb-3">
                      <label className="small" htmlFor="name">
                        id: {groupId}
                      </label>
                    </div>
                    <div className="mb-3">
                      <label className="small" htmlFor="name">
                        Group name
                      </label>
                      <input
                        className="form-control"
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Enter your group name"
                        defaultValue={group.name}
                        onChange={handleGroupNameInput}
                      ></input>
                    </div>
                    <label className="small" htmlFor="name">
                      select teacher who belongs to this group
                    </label>
                    <select
                      className="form-select form-select-lg mb-3"
                      aria-label="Large select example"
                      onClick={getUsers}
                    >
                      <option value>
                        {teachers
                          .filter((teacher) => teacher.id === group.userId)
                          .map((teacher) => {
                            return teacher.username;
                          })}
                      </option>
                      {teachers.map((teacher) => {
                        if (teacher.role === "Teacher")
                          return (
                            <option key={teacher.id} value={teacher.id}>
                              {teacher.username}
                            </option>
                          );
                        return null;
                      })}
                      {/* <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option> */}
                    </select>
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={editStudentGroup}
                    >
                      Save changes
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (isEditStudentGroup === null) {
     console.log('nulll');

    return (
      
      <div>
        <button
          type="submit"
          className="btn btn-danger btn-lg btn-block"
          onClick={() =>
            navigate("/teacherPage/viewGroup", {
              state: { data: data, group: groupIsBeingViewed },
            })
          }
        >
          back to book list
        </button>
        <div className="container-xl px-4 mt-4">
          <div className="row">
            <div className="col-xl-4">
              <div className="card mb-4 mb-xl-0">
                <div className="card-header">Book cover</div>
                <div className="card-body text-center">
                  <img
                    className="card-img-top"
                    src={
                      preview ? (
                        preview
                      ) : book ? (
                        `https://localhost:7287/images/bookcovers/${book.imagePath}`
                      ) : (
                        <div className="d-flex justify-content-center">
                          <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      )
                    }
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
            <div className="col-xl-8">
              <div className="card mb-4">
                <div className="card-header">Book Details</div>
                <div className="card-body">
                  {book ? (
                    <form>
                      <div className="form-outline mb-4 ">
                        <label className="form-label" htmlFor="title">
                          Title
                        </label>

                        <input
                          defaultValue={book.title}
                          name="title"
                          type="text"
                          id="title"
                          className="form-control form-control-lg"
                          onChange={handleTitleInput}
                        />
                      </div>
                      <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="description">
                          Description
                        </label>
                        <textarea
                          defaultValue={book.description}
                          name="description"
                          type=""
                          id="description"
                          className="form-control form-control-lg"
                          onChange={handleDescriptionInput}
                        ></textarea>
                      </div>
                      <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="fileDownload">
                          File download
                        </label>
                        <input
                          title="Click here to change old file to new file"
                          name="fileDownload"
                          type="file"
                          id="fileDownload"
                          className="form-control form-control-lg"
                          onChange={handleFileDownloadInput}
                        ></input>
                      </div>
                      <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="pages">
                          Pages
                        </label>
                        <input
                          defaultValue={book.pages}
                          name="pages"
                          type="number"
                          id="pages"
                          className="form-control form-control-lg"
                          onChange={handlePagesInput}
                        />
                      </div>
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg btn-block"
                        onClick={editBook}
                      >
                        Save
                      </button>
                    </form>
                  ) : (
                    <div className="d-flex justify-content-center">
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
