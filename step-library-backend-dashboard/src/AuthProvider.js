import { useContext, createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("site") || "");
  const navigate = useNavigate();
  const loginAction = async (user) => {
    try {
      fetch(
        `https://localhost:7287/api/Users/${user.username}/${user.password}`
      )
        .then((res) => res.json())
        .then((data) => {

           setUser(data);
           setToken(data.token);
           localStorage.setItem("site", data.token);
          navigate("/librarianPage", {state: { userData: data}});
          return;
        });
    } catch (err) {
      console.error(err);
    }
  };

  const logOut = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("site");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ token, user, loginAction, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
