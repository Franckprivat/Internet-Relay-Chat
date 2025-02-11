// src/components/Home.tsx
import React, { useState } from "react";
import "../styles/Home.css";
import Chat from "../components/Chat.tsx";

const Home: React.FC = () => {
  const [conversations, setConversations] = useState([
    { id: 1, name: "Solo intégral", lastMessage: "J'ai pris un peu d'eau", time: "11:02", unread: true },
    { id: 2, name: "Amélie Pelé", lastMessage: "On sort ?", time: "10:23", unread: false },
    { id: 3, name: "Club de lecture", lastMessage: "C'est une très bonne lecture...", time: "Hier", unread: false },
  ]);

  const [activeChat, setActiveChat] = useState<any>(null);

  const handleChatClick = (chat: any) => {
    setActiveChat(chat);
  };

  return (
    <div className="home-container">
      <div className="sidebar">
        <h2>Discussions</h2>
        <input type="text" placeholder="Rechercher dans Messenger" className="search-bar" />
        <ul className="conversation-list">
          {conversations.map((chat) => (
            <li
              key={chat.id}
              className={`conversation-item ${activeChat?.id === chat.id ? "active" : ""}`}
              onClick={() => handleChatClick(chat)}
            >
              <div className="conversation-details">
                <h4>{chat.name}</h4>
                <p>{chat.lastMessage}</p>
              </div>
              <span className="conversation-time">{chat.time}</span>
            </li>
          ))}
        </ul>
      </div>

      
      <Chat activeChat={activeChat} />
    </div>
  );
};

export default Home;
