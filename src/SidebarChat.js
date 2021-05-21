import { Avatar } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from './axios';
import './SidebarChat.css';

function SidebarChat({ addNewChat, name, id }) {
  const [seed, setSeed] = useState('');
  const [lastMessage, setLastMessages] = useState();
  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, []);

  useEffect(() => {
    if (id) {
      axios
        .get(`/rooms/${id}`)
        .then((res) => {
          return res.data.name;
        })
        .then((roomName) => {
          axios.get(`/messages/${roomName}`).then((res) => {
            const messages = res.data;
            if (messages.length) {
              setLastMessages(messages[messages.length - 1].message);
            }
          });
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  }, [id]);

  const createChat = async () => {
    const roomName = prompt('Please enter name for the chat room');

    if (roomName) {
      await axios.post('/rooms/new', { name: roomName });
    }
  };

  return !addNewChat ? (
    <Link to={`/rooms/${id}`}>
      <div className="sidebarChat">
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
        <div className="sidebarChat__info">
          <h2>{name}</h2>
          <p>{lastMessage}</p>
        </div>
      </div>
    </Link>
  ) : (
    <div onClick={createChat} className="sidebarChat">
      <h2>Add New Chat</h2>
    </div>
  );
}

export default SidebarChat;
