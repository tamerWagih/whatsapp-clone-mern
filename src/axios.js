import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://chat-api-twh.herokuapp.com',
});

export default instance;
