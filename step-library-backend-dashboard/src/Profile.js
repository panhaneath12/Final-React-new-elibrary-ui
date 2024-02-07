import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
export default function LibrarianProfile() {
  const userProfileData = useLocation().state.userData;
  const [userProfile, setUserProfile] = useState();
  console.log(userProfileData);
  useEffect(() => {
    fetch(`https://localhost:7287/api/Users/${userProfileData.id}`, {
      headers: {
        Authorization: `Bearer ${userProfileData.token}`, // librarian token
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setUserProfile(data);
      });
  }, []);
  return (
    <div className="container">
     
      {userProfile ? (
        <div className="d-flex justify-content-center flex-column align-items-center mt-3">
          <div className="col-md-7 col-lg-5 col-xl-5 ">
            <div className="card mb-4 mb-xl-0">
              <div className="card-header">Profile Picture</div>
              <div className="card-body text-center">
                <img
                  src={`https://localhost:7287/images/userprofiles/${userProfile.imagePath}`}
                  className="card-img-top"
                  alt=""
                ></img>
              </div>
            </div>
          </div>
          <div class="container py-5">
            <div class="row d-flex justify-content-center">
              <div class="col-lg-8">
                <div class="card mb-4">
                  <div class="card-body" id="profilestyle">
                    <div class="row">
                      <div class="col-sm-3">
                        <p class="mb-0"> Username:</p>
                      </div>
                      <div class="col-sm-9">
                        <p class="text-muted mb-0">{userProfile.username}</p>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-sm-3">
                        <p class="mb-0">Password:</p>
                      </div>
                      <div class="col-sm-9">
                        <p class="text-muted mb-0">{userProfile.password}</p>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-sm-3">
                        <p class="mb-0">Role:</p>
                      </div>
                      <div class="col-sm-9">
                        <p class="text-muted mb-0">{userProfile.role}</p>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-sm-3">
                        <p class="mb-0">Token:</p>
                      </div>
                      <div class="col-sm-9">
                        <p class="text-muted mb-0">{userProfile.token}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="d-flex justify-content-center align-items-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
}
