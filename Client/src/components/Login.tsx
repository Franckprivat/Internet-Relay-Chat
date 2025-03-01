import React, { useState, useEffect } from 'react';
import '../styles/Login.css';
import { Link, useNavigate } from 'react-router-dom';
import socket from '../services/socket.ts';

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("loginSuccess", (user) => { 

      if (user && user.id && user.nickname) {
        localStorage.setItem("token", user.token); 
        localStorage.setItem("userId", String(user.id)); 
        localStorage.setItem("nickname", user.nickname); 

        console.log("✅ Connexion réussie :", user);
        console.log("Stored User ID:", localStorage.getItem("userId"));
        console.log("Stored Nickname:", localStorage.getItem("nickname"));

        navigate("/home"); // Redirige vers la page d'accueil après connexion
      } else {
        console.error("❌ Données utilisateur invalides :", user);
        setError("Données utilisateur invalides.");
      }
    });

    // ✅ Gestion des erreurs
    socket.on("loginError", (errorMsg) => {
      console.error("❌ Erreur de connexion :", errorMsg);
      setError(errorMsg);
    });

    // 🧹 Nettoyage des listeners lors du démontage
    return () => {
      socket.off("loginSuccess");
      socket.off("loginError");
    };
  }, [navigate]);

  // ✅ Émet l'événement de connexion
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    // 💥 Envoie l'événement de login via WebSocket
    socket.emit("login", { email, password });
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
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="error-message">{error}</p>}
          <div className="login-buttons">
            <button type="submit" className="btn-primary">Se connecter</button>
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
