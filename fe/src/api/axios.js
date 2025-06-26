// 📁 src/api.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api', // 🔥 Add /api only here once
});

export default instance;
