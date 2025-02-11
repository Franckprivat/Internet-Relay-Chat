import React, { useEffect, useState } from "react";
import "../styles/Chat.css";
import socket from "../services/socket.ts";

interface ChatProps {
  activeChat: { id: number; name: string } | null;
}

interface Message {
  sender: string;
  content: string;
}

const Chat: React.FC<ChatProps> = ({ activeChat }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (!activeChat) return;

    // Récupération de l'historique des messages
    socket.emit("getMessages", { channelId: activeChat.id });

    // Réception de l'historique des messages
    socket.on("messageHistory", (data: Message[]) => {
      setMessages(data);
    });

    // Réception des nouveaux messages en temps réel
    socket.on("newMessage", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Confirmation de l'envoi du message
    socket.on("messageSent", (confirmation: Message) => {
      console.log("Message confirmé par le serveur :", confirmation);
    });

    return () => {
      socket.off("messageHistory");
      socket.off("newMessage");
      socket.off("messageSent");
    };
  }, [activeChat]);

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const messagePayload = {
      content: newMessage,
      channelId: activeChat?.id,
    };

    // Envoi du message via WebSocket
    socket.emit("sendMessage", messagePayload);
    setNewMessage(""); // Efface le champ après l'envoi
  };

  if (!activeChat) {
    return (
      <div className="no-chat-selected">
        <p>Sélectionnez une conversation pour commencer à discuter.</p>
      </div>
    );
  }

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h3>{activeChat.name}</h3>
      </div>
      <div className="chat-body">
        {messages.map((msg, index) => (
          <p key={index} className="message">
            <strong>{msg.sender || "Anonyme"} :</strong> {msg.content}
          </p>
        ))}
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Écrivez un message..."
        />
        <button onClick={handleSendMessage}>Envoyer</button>
      </div>
    </div>
  );
};

export default Chat;
