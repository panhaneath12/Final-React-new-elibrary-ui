import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faChalkboardUser } from "@fortawesome/free-solid-svg-icons";
export default function TeacherPage() {
  const navigate = useNavigate();
  const teacher = useLocation().state.userData;
  const [groups, setGroups] = useState();
  const [books, setBooks] = useState();
  useEffect(() => {
    if (typeof Cookies.get("roleToken") === "undefined") navigate("/");
    getGroups();
    getBooks();
  }, []);
  const getGroups = () => {
    fetch(`https://localhost:7287/api/Groups`, {
      headers: {
        Authorization: `Bearer ${teacher.token}`, // teacher token
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        //these groups belong to only one teacher id

        setGroups(
          data
            .filter((group) => group.userId === teacher.id)
            .map((group) => group)
        );
      });
  };
  const getBooks = () => {
    fetch(`https://localhost:7287/api/Books`, {
      headers: {
        Authorization: `Bearer ${teacher.token}`, // teacher token
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
      });
  };
  return (
    <div>
      <div class="container">
        <div class="row d-flex
    justify-content-center">
          <div class="col-12 col-sm-12 col-md-6 col-xl-3 mt-4">
            <div class="card" id="stylecard">
              <div class="card-content">
                <div class="card-body">
                  <div class="media d-flex justify-content-between px-2">
                    <div className="mt-3">
                      <FontAwesomeIcon
                        icon={faChalkboardUser}
                        fontSize={"40"}
                      />
                    </div>
                    <div class="media-body text-right mt-3">
                      <h3>
                        {groups
                          ? groups.filter((group) => {
                              return groups;
                            }).length
                          : <div className="d-flex justify-content-center">
                          <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>}
                      </h3>
                      <span>Total numbers of groups</span>
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
                      <FontAwesomeIcon icon={faBook} fontSize={"40"} />
                    </div>
                    <div class="media-body text-right mt-3">
                      <h3>
                        {books && groups ? (
                          books.filter((book) => {
                            return groups
                              .map((group) => book.groupId === group.id)
                              .includes(true);
                          }).length
                        ) : (
                          <div className="d-flex justify-content-center">
                            <div className="spinner-border" role="status">
                              <span className="visually-hidden">
                                Loading...
                              </span>
                            </div>
                          </div>
                        )}
                      </h3>
                      <span>Books</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <br />
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
      <h2>Group List</h2>
      {/*  */}
      <div className="container">
          <div className="row">
          {groups ? (
        groups.map((group) => (
         
          <div class="col-12 col-sm-12 col-md-6 col-xl-3 mb-4" key={group.id}>
              <div className="card" id="stylegroup">
                <div className="card-body d-flex justify-content-between">
                  <div className="d-flex align-items-center">
                    <div className="ms-3 " id="Text">
                      <p className=" mb-0">{group.id}</p>
                      <p className="fw-bold mb-1">Group name</p>
                      <p className=" mb-0">{group.name}</p>
                    </div>
                  </div>
                  <button
                  id="stylegroupbtn"
                    className="btn btn-success"
                    onClick={() =>
                      navigate("/teacherPage/viewGroup", {
                        state: { data: teacher, group: group },
                      })
                    }
                  >
                    View group
                  </button>
                </div>
              </div>
            </div>
         
        ))
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
    
  );
}
