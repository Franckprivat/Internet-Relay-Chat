import React, { useState } from "react";
import "../styles/Register.css";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/userService.ts";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      await registerUser(formData);
      setSuccess(true);
      navigate("/");
    } catch (err: any) {
      console.error("Erreur lors de l'inscription :", err);
      setError(err.response?.data?.message || "Une erreur est survenue.");
    }
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
          />
          <input
            type="text"
            placeholder="Prénom"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="register-input"
          />
        </div>
        <input
          type="text"
          placeholder="Pseudo"
          name="nickname"
          value={formData.nickname}
          onChange={handleChange}
          className="register-input"
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="register-input"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="register-input"
        />
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">Inscription réussie !</p>}
        <button type="submit" className="register-button">
          S'inscrire
        </button>
      </form>
    </div>
  );
};

export default Register;
