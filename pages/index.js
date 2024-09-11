import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

let socket;

const StreamPage = () => {
  const [login, setLogin] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null); // Ref pour auto-scroll

  useEffect(() => {
    // Initialiser la connexion Socket.IO
    socket = io();

    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleLogin = () => {
    if (login.trim()) {
      setIsLoggedIn(true);
    }
  };

  const sendMessage = () => {
    if (message.trim() && isLoggedIn) {
      socket.emit('message', { user: login, text: message });
      setMessage('');
    }
  };

  // Fonction pour gérer la touche "Entrée" lors du login
  const handleLoginKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  // Fonction pour gérer la touche "Entrée" lors de l'envoi de message
  const handleMessageKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="flex h-screen">
      {/* Section vidéo */}
      <div className="p-4 flex flex-col w-full h-full">
        <h1 className="text-2xl font-bold mb-4">Stream Video</h1>
        <div className="w-full h-full border border-gray-300">
          <iframe
            src="/api/stream"
            className="w-full h-full"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        </div>
      </div>

      {/* Section chat */}
      <div className="w-1/4 border-l border-gray-300 p-4 flex flex-col h-full">
        {!isLoggedIn ? (
          <div className="flex items-center justify-center h-full">
          <div className="w-full max-w-sm">
            <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
            <input
              type="text"
              placeholder="Enter your login"
              className="border border-gray-300 p-2 rounded w-full mb-4 text-black"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              onKeyDown={handleLoginKeyPress}
            />
            <button
              className="bg-blue-500 text-white p-2 rounded w-full"
              onClick={handleLogin}
            >
              Login
            </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <h2 className="text-xl font-bold mb-2">Chat</h2>
            <div className="flex-1 overflow-y-auto border border-gray-300 mb-4 p-2 rounded">
              {messages.map((msg, index) => (
                <div key={index} className="mb-2">
                  <strong>{msg.user}:</strong> {msg.text}
                </div>
              ))}
              {/* Référence pour auto-scroll */}
              <div ref={messagesEndRef}></div>
            </div>
            <input
              type="text"
              placeholder="Type a message"
              className="border border-gray-300 p-2 rounded w-full mb-2 text-black"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleMessageKeyPress}
              autoFocus
            />
            <button
              className="bg-blue-500 text-white p-2 rounded w-full"
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StreamPage;
