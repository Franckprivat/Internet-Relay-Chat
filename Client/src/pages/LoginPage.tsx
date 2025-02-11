import React from "react";
import Login from "../components/Login.tsx";
import { Link } from "react-router-dom";

const LoginPage: React.FC = () => {
  return (
    <div className="login-page">
      <Login />
      <div className="top-logo2">
        <Link to="/" className="logo-link2">
          <img src="/assets/Logo.png" alt="Logo TuYu" className="logo-image2" />
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
