import React, { useEffect, useState } from 'react';
import './Sidebar.css';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Avatar, IconButton } from '@material-ui/core';
import { SearchOutlined } from '@material-ui/icons';
import axios from './axios';
import SidebarChat from './SidebarChat';
import Pusher from 'pusher-js';
import { useStateValue } from './StateProvider';

function Sidebar() {
  const [rooms, setRooms] = useState([]);
  const [{ user }] = useStateValue();

  useEffect(() => {
    axios.get('/rooms/sync').then((res) => {
      setRooms(res.data);
    });
  }, []);

  useEffect(() => {
    const pusher = new Pusher('5b4dcda63a37c5694550', {
      cluster: 'eu',
    });

    const roomsChannel = pusher.subscribe('rooms');
    roomsChannel.bind('inserted', (newRoom) => {
      setRooms([...rooms, newRoom]);
    });

    return () => {
      roomsChannel.unbind_all();
      roomsChannel.unsubscribe();
    };
  }, [rooms]);

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <Avatar src={user?.photoURL} />
        <div className="sidebar__headerRight">
          <IconButton>
            <DonutLargeIcon />
          </IconButton>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>

      <div className="sidebar__search">
        <div className="sidebar__searchContainer">
          <SearchOutlined />
          <input type="text" placeholder="Search or start a new chat" />
        </div>
      </div>

      <div className="sidebar__chats">
        <SidebarChat addNewChat />
        {rooms.map((room) => (
          <SidebarChat
            key={Math.random() * 1000}
            id={room._id}
            name={room.name}
          />
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
