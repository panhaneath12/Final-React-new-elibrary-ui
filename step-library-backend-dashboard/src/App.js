import "./App.css";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
function App() {
  const [userData, setUserData] = useState();
  const [totalBooks, setTotalBooks] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    getUserData();
    getBooks();
  }, []);
  const getUserData = () => {
    fetch(`https://localhost:7287/api/Users/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ value: Cookies.get("roleToken") }),
    })
      .then((res) => res.json())
      .then((data) => {
        setUserData(data);
        console.log("user data");
        console.log(data);
      });
  };

  const getBooks = () => {
    fetch(`https://localhost:7287/api/Books`, {
      headers: {
        Authorization: `Bearer ${Cookies.get("roleToken")}`, // librarian or teacher token
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        console.log("books");
        setTotalBooks(data);
      });
  };

  const signOut = () => {
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, sign out!",
    }).then((result) => {
      if (result.isConfirmed) {
        Cookies.remove("roleToken");
        navigate("/");
      }
    });
  };
  return (
    <div className="App">
      <h1 >  {userData ? userData.role : "waiting" }</h1>
     
      {/* Role: {data.role} */}
      {userData ? (
        userData.role === "Librarian" ? (
          <ul
            className="d-flex justify-content-between nav nav-tabs"
            id="myTab"
            role="tablist"
          >
            <div className="d-flex justify-content">
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link active"
                  id="home-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#home-tab-pane"
                  type="button"
                  role="tab"
                  aria-controls="home-tab-pane"
                  aria-selected="true"
                  onClick={() => {
                    navigate("/librarianPage", {
                      state: { userData: userData },
                    });
                  }}
                >
                  Home
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  id="profile-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#profile-tab-pane"
                  type="button"
                  role="tab"
                  aria-controls="profile-tab-pane"
                  aria-selected="false"
                  onClick={() =>
                    navigate("/librarianPage/profile", {
                      state: { userData: userData },
                    })
                  }
                >
                  Profile
                </button>
              </li>

              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  id="disabled-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#disabled-tab-pane"
                  type="button"
                  role="tab"
                  aria-controls="disabled-tab-pane"
                  onClick={() =>
                    navigate("/librarianPage/register", {
                      state: { userData: userData },
                    })
                  }
                >
                  Register teacher
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  id="disabled-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#disabled-tab-pane"
                  type="button"
                  role="tab"
                  aria-controls="disabled-tab-pane"
                  onClick={() =>
                    navigate("/librarianPage/group", {
                      state: { userData: userData, totalBooks: totalBooks },
                    })
                  }
                >
                  Student Group
                </button>
              </li>
            </div>
            <div>
              <li className="p-3">
                <button
                  className="btn btn-danger"
                  id="home-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#home-tab-pane"
                  type="button"
                  role="tab"
                  aria-controls="home-tab-pane"
                  aria-selected="true"
                  onClick={signOut}
                >
                  Sign out
                </button>
              </li>
            </div>
          </ul>
        ) : (
          <ul
            className="nav nav-tabs d-flex justify-content-between"
            id="myTab"
            role="tablist"
          >
            <div className="d-flex justify-content">
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link active"
                  id="home-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#home-tab-pane"
                  type="button"
                  role="tab"
                  aria-controls="home-tab-pane"
                  aria-selected="true"
                  onClick={() => {
                    if (userData.role === "Teacher")
                      navigate("/teacherPage", {
                        state: { userData: userData },
                      });
                    else if (userData.role === "Librarian")
                      navigate("/librarianPage", {
                        state: { userData: userData },
                      });
                  }}
                >
                  Home
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  id="profile-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#profile-tab-pane"
                  type="button"
                  role="tab"
                  aria-controls="profile-tab-pane"
                  aria-selected="false"
                  onClick={() =>
                    navigate("/librarianPage/profile", {
                      state: { userData: userData },
                    })
                  }
                >
                  Profile
                </button>
              </li>
            </div>
            <div>
              <button
                className="btn btn-danger me-3 mb-2"
                id="home-tab"
                data-bs-toggle="tab"
                data-bs-target="#home-tab-pane"
                type="button"
                role="tab"
                aria-controls="home-tab-pane"
                aria-selected="true"
                onClick={signOut}
              >
                Sign out
              </button>
            </div>
          </ul>
        )
      ) : (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      <main>
        <Outlet></Outlet>
      </main>
    </div>
  );
}

export default App;
