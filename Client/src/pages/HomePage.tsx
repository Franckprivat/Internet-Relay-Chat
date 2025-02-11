import React from "react";
import { FaUserAlt, FaCog } from "react-icons/fa";
import { Link } from "react-router-dom";
import Home from "../components/Home.tsx";

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <div className="top-logo">
        <Link to="/home" className="logo-link">
          <img src="/assets/Logo.png" alt="Logo TuYu" className="logo-image" />
        </Link>
      </div>
      <div className="main-content">
        <Home />
      </div>

      <div className="bottom-icons">
        <Link to="/profile" className="icon-link">
          <FaUserAlt size={30} />
        </Link>
        <Link to="/settings" className="icon-link">
          <FaCog size={30} />
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
