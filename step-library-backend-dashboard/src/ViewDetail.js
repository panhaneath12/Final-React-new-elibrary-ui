import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
export default function ViewDetail() {
  const navigate = useNavigate();
  const userDetail = useLocation().state.userDetail;
  const data = useLocation().state.userData;
  const [groups, setGroups] = useState();
  useEffect(() => {
    fetch(`https://localhost:7287/api/Groups`, {
      headers: {
        Authorization: `Bearer ${data.token}`, // librarian token
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((groups) => {
        console.log("dfasdfas");
        setGroups(groups);
        console.log(groups);
      });
  }, []);
  return (
    <div>
      <div className="card">
        <div className="card mb-4 mb-xl-0">
          <div className="card-body">
            <button
              className="btn btn-danger"
              onClick={() =>
                navigate("/librarianPage", { state: { userData: data } })
              }
            >
              back
            </button>
          </div>
          <div className="card-body text-center">
            <img
              src={`https://localhost:7287/images/userprofiles/${userDetail.imagePath}`}
              className="img-fluid"
              style={{ width: "500px", height: "350px" }}
              alt="..."
            ></img>
          </div>
        </div>
        <div className="card-body">
          <h5 className="card-title">Id: {userDetail.id}</h5>
        </div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            Image path: {userDetail.imagePath}
          </li>
          <li className="list-group-item">Username: {userDetail.username}</li>
          <li className="list-group-item">Password: {userDetail.password}</li>
          <li className="list-group-item">Token: {userDetail.token}</li>
          <li className="list-group-item">Role: {userDetail.role}</li>
          <li className="list-group-item">has Groups: </li>
          <li className="list-group-item">
            {groups ? (
              groups
                .filter((group) => group.userId === userDetail.id)
                .map((group) => {
                  return (
                    <ol className="list-group" key={group.id}>
                      <li className="list-group-item d-flex justify-content-between align-items-start">
                        <div className="ms-2 me-auto">
                          <div className="fw-bold">{group.name}</div>
                        </div>
                      </li>
                    </ol>
                  );
                })
            ) : (
              <div className="d-flex justify-content-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
}
