import React, { useState } from 'react';
import '../styles/Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/authService.ts';

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await login(email, password);
      if (response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
        navigate("/home");
      } else {
        setError("Identifiant ou mot de passe incorrect.");
      }
    } catch (error: any) {
      console.error("Erreur lors de la connexion :", error);
      setError(error.response?.data?.message || "Une erreur est survenue. Veuillez réessayer.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <h1>Un espace<br /> pour des <br />conversations <br />intéressantes</h1>
        <p>
          Communiquez avec vos proches, développez votre communauté et approfondissez vos centres d’intérêt.
        </p>
        <form className="login-form" onSubmit={handleLogin}>
          <input 
            type="email" 
            placeholder="Adresse email" 
            className="login-input" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Mot de passe" 
            className="login-input" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="error-message">{error}</p>}
          <div className="login-buttons">
            <button type="submit" className="btn-primary">
              Se connecter
            </button>
            <Link to="/register" className="btn-secondary-link">
              <button type="button" className="btn-secondary">S'inscrire</button>
            </Link>
          </div>
        </form>
        <Link to="/forgot-password" className="forgot-password">Mot de passe oublié ?</Link>
      </div>
      <div className="login-right">
        <img src="assets/message_exemple.png" alt="Chat mockup" className="mockup-image" />
      </div>
    </div>
  );
};

export default Login;
