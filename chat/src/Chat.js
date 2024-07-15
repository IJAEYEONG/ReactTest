import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './Chat.css';

const socket = io('http://localhost:4000');

function Chat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // 서버에서 초기 메시지 리스트를 받음
    socket.on('init', (data) => {
      setMessages(data);
    });

    // 서버에서 메시지를 받을 때
    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('init');
      socket.off('message');
    };
  }, []);

  const handleSendMessage = () => {
    if (message.trim()) {
      socket.emit('message', message); // 메시지를 서버로 전송
      setMessage(''); // 입력 필드를 비움
    }
  };

  return (
    <div className="chat-container">
      <h1>채팅 앱</h1>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index}>{msg.content}</div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>전송</button>
      </div>
    </div>
  );
}

export default Chat;
