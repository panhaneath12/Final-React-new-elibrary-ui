import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook,faDownload,faChalkboardUser,faUsersRectangle} from "@fortawesome/free-solid-svg-icons";
export default function LibrarianPage() {
  const navigate = useNavigate();
  const data = useLocation().state.userData;
  const [users, setUsers] = useState([]);
  const [totalGroups, setTotalGroups] = useState();
  const [totalBooks, setTotalBooks] = useState();
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [totalDownloaded, setTotalDownloaded] = useState(0);
  //search
  const [query, setQuery] = useState("");
  const handleSearch = (event) => {
    setQuery(event.target.value);
    var usersFound = users.filter(
      (user) => user.username === event.target.value
    );
    if (usersFound.length === 0)
      usersFound = users.filter(
        (user) =>
          user.username.toLowerCase().charAt(0) ===
          event.target.value.toLowerCase().charAt(0)
      );
    if (usersFound.length > 0) setUsers(usersFound);
    else refreshData();
  };

  useEffect(() => {
    if (typeof Cookies.get("roleToken") === "undefined") navigate("/");
    refreshData();
    getGroups();
    getBooks();
  }, []);
  const refreshData = () => {
    fetch("https://localhost:7287/api/Users", {
      headers: {
        Authorization: `Bearer ${data.token}`, // librarian token
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setTotalTeachers(data.filter((user) => user.role === "Teacher").length);
        console.log(data);
      });
  };
  const getBooks = () => {
    fetch(`https://localhost:7287/api/Books`, {
      headers: {
        Authorization: `Bearer ${data.token}`, // librarian or teacher token
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setTotalBooks(data);
        var count = 0;
        data.map(book=> count += book.totalDownloaded)
        setTotalDownloaded(count);
      });
  };
  const getGroups = () => {
    fetch(`https://localhost:7287/api/Groups`, {
      headers: {
        Authorization: `Bearer ${data.token}`, // librarian token
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.length);
        setTotalGroups(data.length);
      });
  };
  const deleteUser = (userId) => {
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
        fetch(`https://localhost:7287/api/Users/${userId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${data.token}`, // librarian token
          },
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            console.log(data.token);
            Swal.fire({
              title: "Deleted!",
              text: "Your user has been deleted.",
              icon: "success",
            });
            refreshData();
          });
      }
    });
  };
  return (
    <div>
      <div class="container">
      <div class="row">
        <div class="col-12 col-sm-12 col-md-6 col-xl-3 mt-4">
        <div class="card" id="stylecard">
          <div class="card-content">
            <div class="card-body">
              <div class="media d-flex justify-content-between px-2">
                <div className="mt-3">
                <FontAwesomeIcon icon={faChalkboardUser} fontSize={"40"} />
                </div>
                <div class="media-body text-right mt-3">
                  <h3>{totalTeachers}</h3>
                  <span>Teachers</span>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
        <div class="col-12 col-sm-12 col-md-6 col-xl-3 mt-4">
        <div class="card" id="stylecard1">
          <div class="card-content">
            <div class="card-body">
              <div class="media d-flex justify-content-between px-2">
                <div className="mt-3">
                <FontAwesomeIcon icon={faBook} fontSize={"40"}/>
                </div>
                <div class="media-body text-right mt-3">
                  <h3>{totalBooks ? totalBooks.map((book) => book).length : "waiting"}</h3>
                  <span>Books</span>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      <div class="col-12 col-sm-12 col-md-6 col-xl-3 mt-4">
        <div class="card" id="stylecard2">
          <div class="card-content">
            <div class="card-body">
              <div class="media d-flex justify-content-between px-2">
                <div className="mt-3">
                <FontAwesomeIcon icon={faDownload} fontSize={"40"} />
                </div>
                <div class="media-body text-right mt-3">
                  <h3>{totalDownloaded}</h3>
                  <span>Total Books Download</span>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
        <div class="col-12 col-sm-12 col-md-6 col-xl-3 mt-4">
        <div class="card" id="stylecard3">
          <div class="card-content">
            <div class="card-body">
              <div class="media d-flex justify-content-between px-2">
                <div className="mt-3">
                <FontAwesomeIcon icon={faUsersRectangle} fontSize={"40"} />
                </div>
                <div class="media-body text-right mt-3">
                  <h3>{totalGroups ? totalGroups : "waiting"}</h3>
                  <span>Groups</span>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div><br/>
  
      </div>
      <div className="tab-content" id="myTabContent">
        <div
          className="tab-pane fade show active"
          id="home-tab-pane"
          role="tabpanel"
          aria-labelledby="home-tab"
          tabIndex="0"
        >
          ...
        </div>
        <div
          className="tab-pane fade"
          id="profile-tab-pane"
          role="tabpanel"
          aria-labelledby="profile-tab"
          tabIndex="0"
        >
          ...
        </div>
        <div
          className="tab-pane fade"
          id="contact-tab-pane"
          role="tabpanel"
          aria-labelledby="contact-tab"
          tabIndex="0"
        >
          ...
        </div>
        <div
          className="tab-pane fade"
          id="disabled-tab-pane"
          role="tabpanel"
          aria-labelledby="disabled-tab"
          tabIndex="0"
        >
          ...
        </div>
      </div>
      {/*  */}

      <div className="container">
        <div
          className="input-group d-flex justify-content-end"
          style={{ marginRight: "10px" }}
        >
          <div className="form-outline" data-mdb-input-init>
            <label className="form-label" htmlFor="form1">
              Search
            </label>
            <input
              type="search"
              className="form-control"
              id="query"
              name="query"
              defaultValue={query}
              onChange={handleSearch}
            />
          </div>
        </div>
        <br></br>
        <div className="row ">
          <div className="col-12 mb-3 mb-lg-5">          
            <div className={query? ("card table-nowrap table-card"): users.length > 10?('card table-nowrap table-card h-50'):("card table-nowrap table-card") }>
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">User list</h5>
              </div>
              <div className="table-responsive" >
                <table className="table mb-0 table-striped" >
                  <thead className="small text-uppercase bg-body text-muted">
                    <tr>
                      <th>Id</th>
                      <th>Profile</th>
                      <th>username</th>
                      <th>PassWord</th>
                      <th>Role</th>
                      <th className="text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users ? (
                      users.map((user) => (
                        <tr className="align-middle" key={user.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div>
                                <div className="h6 mb-0 lh-1">{user.id}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <img
                              src={`https://localhost:7287/images/userprofiles/${user.imagePath}`}
                              className="rounded-circle "
                              alt="Customer"
                              style={{ width: "80px", height: "80px" }}
                            ></img>
                          </td>

                          <td>{user.username}</td>
                          <td>
                            <span>{user.password}</span>
                          </td>
                          <td>
                            {" "}
                            <span className="d-inline-block align-middle">
                              {user.role}
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
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  className="bi bi-list"
                                  viewBox="0 0 16 16"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
                                  />
                                </svg>
                              </button>
                              <ul className="dropdown-menu">
                                <li>
                                  <button
                                    className="dropdown-item"
                                    onClick={() =>
                                      navigate("/librarianPage/viewDetail", {
                                        state: {
                                          userDetail: user,
                                          userData: data,
                                        },
                                      })
                                    }
                                  >
                                    View detail
                                  </button>
                                </li>
                                <li>
                                  <button
                                    className="dropdown-item"
                                    onClick={() =>
                                      navigate("/librarianPage/edit", {
                                        state: {
                                          userData: data,
                                          userId: user.id,
                                          isEditStudentGroup: false,
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
                                    onClick={() => deleteUser(user.id)}
                                  >
                                    Delete
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
}
