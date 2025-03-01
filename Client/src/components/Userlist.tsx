import React, { useEffect, useState } from "react";
import socket from "../services/socket";

interface User {
  id: number;
  nickname: string;
}

const UserList: React.FC<{ onSelectUser: (user: User) => void }> = ({ onSelectUser }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // ✅ Demande la liste des utilisateurs
    socket.emit("getAllUsers");

    // ✅ Écoute la réponse
    socket.on("usersList", (data: User[]) => setUsers(data));
    socket.on("error", (err: { message: string }) => setError(err.message));

    return () => {
      socket.off("usersList");
      socket.off("error");
    };
  }, []);

  return (
    <div className="user-list">
      <h3>Utilisateurs Inscrits</h3>
      {error && <p className="error">{error}</p>}
      <ul>
        {users.map((user) => (
          <li key={user.id} onClick={() => onSelectUser(user)}>
            {user.nickname}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
