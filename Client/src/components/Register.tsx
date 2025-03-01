import React, { useState, useEffect } from "react";
import "../styles/Register.css";
import { useNavigate } from "react-router-dom";
import socket from "../services/socket.ts";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    nickname: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    // ✅ Écoute les réponses après inscription
    socket.on("registerSuccess", (user) => {
      console.log("✅ Inscription réussie :", user);
      setSuccess(true);
      navigate("/"); // Redirige vers login
    });

    socket.on("registerError", (errorMsg) => {
      console.error("❌ Erreur d'inscription :", errorMsg);
      setError(errorMsg);
    });

    return () => {
      socket.off("registerSuccess");
      socket.off("registerError");
    };
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // 💥 Émettre l'événement register via WebSocket
    socket.emit("register", formData);
  };

  return (
    <div className="register-container">
      <div className="register-logo">
        <h1>TuYu</h1>
      </div>
      <form className="register-form" onSubmit={handleSubmit}>
        <div className="register-names">
          <input
            type="text"
            placeholder="Nom"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="register-input"
            required
          />
          <input
            type="text"
            placeholder="Prénom"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="register-input"
            required
          />
        </div>
        <input
          type="text"
          placeholder="Pseudo"
          name="nickname"
          value={formData.nickname}
          onChange={handleChange}
          className="register-input"
          required
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="register-input"
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="register-input"
          required
        />
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">Inscription réussie !</p>}
        <button type="submit" className="register-button">S'inscrire</button>
      </form>
    </div>
  );
};

export default Register;
