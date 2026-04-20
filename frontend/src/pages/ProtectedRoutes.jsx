import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import api from "../services/api";
const ProtectedRoute = ({ children }) => {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
   const ans= api.get("/auth/get-me", {
      withCredentials: true,
    })
     
      .then(() => setAuth(true))
      .catch(() => setAuth(false));
  }, []);

  if (auth === null) return <p>Loading...</p>;

  return auth ? children : <Navigate to="/" />;
};

export default ProtectedRoute;