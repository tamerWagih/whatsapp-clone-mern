import { Avatar, IconButton } from '@material-ui/core';
import { AttachFile, MoreVert, SearchOutlined } from '@material-ui/icons';
import { useParams } from 'react-router-dom';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic';
import Pusher from 'pusher-js';
import React, { useEffect, useState } from 'react';
import axios from './axios';
import './Chat.css';
import { useStateValue } from './StateProvider';

function Chat() {
  const [seed, setSeed] = useState('');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [roomName, setRoomName] = useState('');
  const [{ user }] = useStateValue();
  const { roomId } = useParams();

  useEffect(() => {
    if (roomId) {
      axios
        .get(`/rooms/${roomId}`)
        .then((res) => {
          setRoomName(res.data.name);
        })
        .then(() => {
          axios.get(`/messages/${roomName}`).then((res) => {
            setMessages(res.data);
          });
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  }, [roomId, roomName]);

  useEffect(() => {
    const pusher = new Pusher('5b4dcda63a37c5694550', {
      cluster: 'eu',
    });

    const messageChannel = pusher.subscribe('messages');
    messageChannel.bind('inserted', (newMessage) => {
      setMessages([...messages, newMessage]);
    });

    return () => {
      messageChannel.unbind_all();
      messageChannel.unsubscribe();
    };
  }, [messages]);

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, [roomId]);

  const sendMessage = async (e) => {
    e.preventDefault();

    await axios.post('/messages/new', {
      message: input,
      name: user?.displayName,
      roomName: roomName,
    });

    setInput('');
  };

  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
        <div className="chat__headerInfo">
          <h3>{roomName}</h3>
          <p>last seen at {messages[messages.length - 1]?.timestamp}</p>
        </div>
        <div className="chat__headerRight">
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>

      <div className="chat__body">
        {messages?.map((message) => (
          <p
            key={Math.random() * 1000}
            className={`chat__message ${
              message.name === user.displayName && 'chat__reciever'
            }`}
          >
            <span className="chat__name">{message.name}</span>
            {message.message}
            <span className="chat__timestamp">{message.timestamp}</span>
          </p>
        ))}
      </div>

      <div className="chat__footer">
        <InsertEmoticonIcon />
        <form>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Type a message"
          />
          <button onClick={sendMessage} type="submit">
            Send a message
          </button>
        </form>
        <MicIcon />
      </div>
    </div>
  );
}

export default Chat;
