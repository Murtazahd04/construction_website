import axios from 'axios';

const api = axios.create({
  baseURL: 'https://construction-website-vgvh.onrender.com/api', // Matches your backend port
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;