import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import fileDownload from 'js-file-download';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
export default function ViewGroup() {
  const navigate = useNavigate();
  const group = useLocation().state.group;
  const data = useLocation().state.data;
  const [books, setBooks] = useState();
  const [book, addBook] = useState({
    title: "",
    description: "",
    pages: 0,
  });
  const [isAddBook, setIsAddBook] = useState(false);

  const [query, setQuery] = useState("");
  const handleSearch = (event) => {
    setQuery(event.target.value);
    var booksFound = books.filter((book) => book.title === event.target.value);
    if (booksFound.length === 0)
      booksFound = books.filter(
        (book) =>
          book.title.toLowerCase().charAt(0) ===
          event.target.value.toLowerCase().charAt(0)
      );
    if (booksFound.length > 0) setBooks(booksFound);
    else getBooks();
  };
  useEffect(() => {
    getBooks();
  }, []);
  const getBooks = () => {
    fetch(`https://localhost:7287/api/Books`, {
      headers: {
        Authorization: `Bearer ${data.token}`, // teacher token
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setBooks(data);
      });
  };
  const deleteBook = (bookId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`https://localhost:7287/api/Books/${bookId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${data.token}`, // teacher token
          },
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            console.log(data.token);
            Swal.fire({
              title: "Deleted!",
              text: "Your book has been deleted.",
              icon: "success",
            });
            getBooks();
          });
      }
    });
  };
  const showPreview = (e) => {
    if (e.target.files && e.target.files[0]) {
      let imageFile = e.target.files[0];

      console.log(imageFile);
      const reader = new FileReader();
      reader.onload = (x) => {
        addBook({ ...book, imageFile: imageFile, imagePath: x.target.result });
      };
      reader.readAsDataURL(imageFile);
    }
  };
  const downloadBook=(bookFileDownloadName)=>{
    fetch(`https://localhost:7287/api/Books/DownloadFile/${bookFileDownloadName}`, {
      method: "GET",
    })
      .then((res) => res.blob())
      .then((data) => {
        console.log(data);
        fileDownload(data, bookFileDownloadName);
        getBooks();
      });
  }
  const addNewBook = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", book.title);
    formData.append("imageFile", book.imageFile);
    formData.append("fileDownload", book.fileDownload);
    formData.append("description", book.description);
    formData.append("pages", book.pages);
    formData.append("groupId", group.id);
    fetch("https://localhost:7287/api/Books", {
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
            document.getElementById("formFileLg").value = "";
         //   addBook({ title: "", description: '', fileDownload: null, pages: 0 }); // still fix this
            setIsAddBook(false);
            Swal.fire({
              title: "Your new book has been created successfully!",
              text: "You clicked the button!",
              icon: "success",
            });
          getBooks();
          }
        }
      });

  };
  const handleTitleInput = (e) => {
    addBook({ ...book, title: e.target.value });
  };
  const handleDescriptionInput = (e) => {
    addBook({ ...book, description: e.target.value });
  };
  const handlePagesInput = (e) => {
    addBook({ ...book, pages: e.target.value });
  };
  const handleFileDownloadInput = (e) => {
     if (e.target.files && e.target.files[0]) {
       let fileDownload = e.target.files[0];
      console.log(fileDownload);
        addBook({ ...book, fileDownload: fileDownload  });
    }
  };
  if (isAddBook === false) {
    return (
      <div>
        <div className="d-flex m-10 justify-content-between mt-3 ms-3 mb-2">
          <button
            className="btn btn-danger btn-lg btn-block"
            onClick={() => {
              navigate("/teacherPage", { state: { userData: data } });
            }}
          >
            <FontAwesomeIcon icon={faArrowLeft} fontSize={"20"} />
          </button>
           
          <button
            className="btn btn-success btn-lg me-3 btn-block​"
            onClick={() => setIsAddBook(true)}
          >
            Add new book
          </button>
        </div>
        <div className="container">
          <div
            className="input-group d-flex justify-content-between"
            style={{ marginRight: "10px" }}
          >
            Group name: {group.name} 
            <div className="text-success"><h4>Total books: {books? books.filter(book=>book.groupId === group.id).map(book=>book).length: 'waiting'}</h4></div>
            <div className="form-outline mt-3" data-mdb-input-init>
              <input
                type="search"
                className="form-control"
                id="query"
                name="query"
                placeholder="Search by book title"
                value={query}
                onChange={handleSearch}
              />
            </div>
          </div>
          <br></br>
          <div className="row">
            <div className="col-12 mb-3 mb-lg-5">
              <div className={query? ("overflow-hidden card table-nowrap table-card"):  books ? (books.length > 10? "overflow-hidden card table-nowrap table-card h-50": "overflow-hidden card table-nowrap table-card" ): null}>
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Book list</h5>
                </div>
                <div className="table-responsive">
                  <table className="table mb-0">
                    <thead className="small text-uppercase bg-body text-muted">
                      <tr>
                        <th>Id</th>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Pages</th>
                        <th>TotalDownloaded</th>
                        <th>User id</th>
                        <th>Group id</th>
                        <th className="text-end">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {books ? (
                        books
                          .filter((book) => book.groupId === group.id)
                          .map((book) => (
                            <tr className="align-middle" key={book.id}>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div>
                                    <div className="h6 mb-0 lh-1">
                                      {book.id}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <img
                                  src={`https://localhost:7287/images/bookcovers/${book.imagePath}`}
                                  className="avatar sm me-3 flex-shrink-0"
                                  alt="Customer"
                                  style={{ width: "250px", height: "360px" }}
                                ></img>
                              </td>

                              <td>
                                <h5>{book.title}</h5></td>
                              <td>
                                <textarea value={book.description} style={{width: "20rem", height:"17rem"}}>
                                
                                </textarea>
                               
                              </td>
                              <td>
                                {" "}
                                <span className="d-inline-block align-middle">
                                  {book.pages}
                                </span>
                              </td>
                              <td>
                                {" "}
                                <span className="d-inline-block align-middle">
                                  {book.totalDownloaded}
                                </span>
                              </td>
                              <td>
                                {" "}
                                <span className="d-inline-block align-middle">
                                  {book.userId}
                                </span>
                              </td>
                              <td>
                                {" "}
                                <span className="d-inline-block align-middle">
                                  {book.groupId}
                                </span>
                              </td>
                              <td className="text-end">
                                <div className="dropdown">
                                  <button
                                    className="btn btn-secondary dropdown-toggle"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                                    |||
                                  </button>
                                  <ul className="dropdown-menu">
                                    <li>
                                      <button
                                        className="dropdown-item"
                                        onClick={() =>
                                          navigate("/teacherPage/edit", {
                                            state: {
                                              userData: data,
                                              bookId: book.id,
                                              groupIsBeingViewed: group,
                                              isEditStudentGroup: null,
                                            },
                                          })
                                        }
                                      >
                                        Edit
                                      </button>
                                    </li>
                                    <li>
                                      <button
                                        className="dropdown-item"
                                        onClick={() => deleteBook(book.id)}
                                      >
                                        Delete
                                      </button>
                                    </li>
                                    <li>
                                      <button
                                        className="dropdown-item"
                                        onClick={() => downloadBook(book.fileName)}
                                      >
                                       Download
                                      </button>
                                    </li>
                                  </ul>
                                </div>
                              </td>
                            </tr>
                          ))
                      ) : (
                        <div className="d-flex justify-content-center">
                          <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>  
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <div className="d-flex justify-content-end mt-3 me-3"><button
          className="btn btn-danger btn-lg btn-block"
          onClick={() => {
            setIsAddBook(false);
          }}
        >
          back
        </button></div>
        
        <div className="text-primary text-center mb-5 ">
          {" "}
          <h1>Add Book</h1>
        </div>
        <div className="container">
          <div className="row d-flex align-items-center justify-content-center h-100">
            <div className="col-md-7 col-lg-5 col-xl-5 offset-xl-1">
              <div className="">
                <div className="card mb-4 mb-xl-0">
                  <div className="card-header">Book cover</div>
                  <div className="card-body text-center">
                    <img
                      className="card-img-top"
                      src={book ? book.imagePath : ""}
                      alt=""
                    ></img>
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
                onSubmit={addNewBook}
              >
                <div className="form-outline mb-4 ">
                  <label className="form-label" htmlFor="title">
                    Title
                  </label>
                  <input
                    value={book.title}
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
                    defaultValue={book.fileDownload}
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
                  onClick={addNewBook}
                >
                  Done
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
