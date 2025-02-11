import React, { useState } from "react";
import "../styles/Setting.css";

const Setting: React.FC = () => {

  const [formData, setFormData] = useState({
    firstName: "Jean",
    lastName: "Dupont",
    email: "jean.dupont@example.com",
    password: "",
    birthDate: "1990-01-01",
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Données mises à jour :", formData);
    alert("Vos informations ont été mises à jour !");
  };

  return (
    <div className="setting-container">
      <h1>Paramètres</h1>
      <form className="setting-form" onSubmit={handleSubmit}>
        <label htmlFor="firstName">Prénom</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          className="setting-input"
        />

        <label htmlFor="lastName">Nom</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          className="setting-input"
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="setting-input"
        />

        <label htmlFor="password">Mot de passe</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="setting-input"
          placeholder="Nouveau mot de passe"
        />

        <label htmlFor="birthDate">Date de naissance</label>
        <input
          type="date"
          id="birthDate"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleChange}
          className="setting-input"
        />

        <button type="submit" className="btn-primary">
          Enregistrer les modifications
        </button>
      </form>
    </div>
  );
};

export default Setting;
