import React, { useState, useEffect } from "react";
import "../styles/Home.css";
import Chat from "./Chat.tsx";
import socket from "../services/socket.ts";

interface Conversation {
  id: number;
  name: string;
  lastMessage: string;
  lastSender: string;
  time: string;
  unread: boolean;
}

interface User {
  id: number;
  nickname: string;
}

const Home: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeChat, setActiveChat] = useState<Conversation | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // 📡 Récupère les channels et utilisateurs
    socket.emit("listChannels");
    socket.emit("listUsers");

    // 🗂️ Récupère les channels
    socket.on("channelsList", (channels: Conversation[]) => {
      setConversations(channels);
    });

    // 👤 Récupère les utilisateurs
    socket.on("usersList", (userList: User[]) => {
      setUsers(userList);
    });

    // 🔔 Met à jour le dernier message + conversation active si besoin
    socket.on("newMessage", (msg: { channelId?: number; senderNickname: string; content: string }) => {
      if (msg.channelId) {
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === msg.channelId
              ? {
                  ...conv,
                  lastMessage: msg.content,
                  lastSender: msg.senderNickname,
                  time: new Date().toLocaleTimeString(),
                }
              : conv
          )
        );

        // 🟢 Si l'utilisateur est dans la conversation active, met aussi à jour l'affichage
        if (activeChat?.id === msg.channelId) {
          setActiveChat((prev) =>
            prev
              ? {
                  ...prev,
                  lastMessage: msg.content,
                  lastSender: msg.senderNickname,
                  time: new Date().toLocaleTimeString(),
                }
              : prev
          );
        }
      }
    });

    // ⚠️ Gestion des erreurs
    socket.on("error", (err: string) => {
      setError(err);
    });

    return () => {
      socket.off("channelsList");
      socket.off("usersList");
      socket.off("newMessage");
      socket.off("error");
    };
  }, [activeChat]);

  // 🟡 Sélection d'un channel
  const handleChannelSelect = (channel: Conversation) => {
    setSelectedUser(null); 
    setActiveChat(channel);
  };

  // 🟡 Sélection d'un utilisateur pour chat privé
  const handleUserSelect = (user: User) => {
    setActiveChat(null); 
    setSelectedUser(user);
  };

  return (
    <div className="home-container">
      <div className="sidebar">
        <h2>Discussions</h2>

        {/* 🔎 Barre de recherche */}
        <input type="text" placeholder="Rechercher..." className="search-bar" />

        {/* 💬 Liste des Channels */}
        <h3>Channels</h3>
        <ul className="conversation-list">
          {conversations.map((chat) => (
            <li
              key={chat.id}
              className={`conversation-item ${activeChat?.id === chat.id ? "active" : ""}`}
              onClick={() => handleChannelSelect(chat)}
            >
              <div className="conversation-details">
                <h4>{chat.name}</h4>
                <p>
                  <strong>{chat.lastSender ? `${chat.lastSender}:` : ""}</strong>{" "}
                  {chat.lastMessage || "Aucun message"}
                </p>
              </div>
              <span className="conversation-time">{chat.time || "--:--"}</span>
            </li>
          ))}
        </ul>

        {/* 👤 Liste des Utilisateurs */}
        <h3>Utilisateurs</h3>
        <ul className="user-list">
          {users.map((user) => (
            <li
              key={user.id}
              className={`user-item ${selectedUser?.id === user.id ? "active" : ""}`}
              onClick={() => handleUserSelect(user)}
            >
              {user.nickname}
            </li>
          ))}
        </ul>

        {error && <p className="error-message">{error}</p>}
      </div>

      {/* 💌 Composant Chat */}
      <Chat activeChat={activeChat} selectedUser={selectedUser} />
    </div>
  );
};

export default Home;
