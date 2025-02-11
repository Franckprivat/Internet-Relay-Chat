import React, { useEffect, useState } from "react";
import "../styles/Profile.css";
import api from "../services/api.ts";
import { useNavigate } from "react-router-dom";

const Profile: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get("/auth/profile");
        setUserData(response.data);
      } catch (err) {
        console.error("Erreur lors de la récupération du profil :", err);
        setError("Impossible de récupérer les informations utilisateur.");
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!userData) {
    return <p>Chargement des informations utilisateur...</p>;
  }

  return (
    <div className="profile-container">
      <h1>Mon Profil</h1>
      <div className="profile-card">
        <div className="profile-picture">
          <img
            src="/assets/default-avatar.png"
            alt="Profil utilisateur"
          />
        </div>
        <div className="profile-info">
          <p><strong>Nom :</strong> {userData.firstName} {userData.lastName}</p>
          <p><strong>Email :</strong> {userData.email}</p>
          <p><strong>Nom d'utilisateur :</strong> {userData.nickname}</p>
        </div>
        <button className="logout-button" onClick={handleLogout}>Se déconnecter</button>
      </div>
    </div>
  );
};

export default Profile;
