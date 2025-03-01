import React, { useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000'); // Mets ici l'URL de ton backend

const CreateChannel = () => {
  const [channelName, setChannelName] = useState('');
  const [topic, setTopic] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [nickname, setNickname] = useState('');
  const [message, setMessage] = useState('');

  const handleCreateChannel = () => {
    if (!channelName || !topic || !nickname) {
      setMessage('Veuillez remplir tous les champs.');
      return;
    }

    const createChannelDto = {
      name: channelName,
      topic: topic,
      isPrivate: isPrivate,
      nickname: nickname,
    };

    socket.emit('createChannel', createChannelDto);

    socket.on('channelCreated', (newChannel) => {
      setMessage(`✅ Canal "${newChannel.name}" créé avec succès.`);
    });

    socket.on('error', (err) => {
      setMessage(`❌ Erreur : ${err}`);
    });
  };

  return (
    <div className="p-4 border rounded-lg shadow-md w-96 mx-auto">
      <h2 className="text-xl font-bold mb-4">Créer un Canal</h2>
      <input
        type="text"
        placeholder="Nom du canal"
        value={channelName}
        onChange={(e) => setChannelName(e.target.value)}
        className="w-full p-2 border mb-2 rounded"
      />
      <input
        type="text"
        placeholder="Sujet"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="w-full p-2 border mb-2 rounded"
      />
      <input
        type="text"
        placeholder="Votre pseudo"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        className="w-full p-2 border mb-2 rounded"
      />
      <div className="flex items-center mb-2">
        <input
          type="checkbox"
          checked={isPrivate}
          onChange={() => setIsPrivate(!isPrivate)}
          className="mr-2"
        />
        <label>Canal privé</label>
      </div>
      <button
        onClick={handleCreateChannel}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Créer le Canal
      </button>
      {message && <p className="mt-2 text-sm text-red-500">{message}</p>}
    </div>
  );
};

export default CreateChannel;
