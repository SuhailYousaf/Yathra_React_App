import axios from 'axios'


const API = axios.create({ baseURL: 'http://localhost:4000' });

export const createChat = (data) => API.post('/createChat/', data);

export const userChats = (id) => API.get(`/userChats/${id}`);

export const adminChats = (id) => API.get(`/admin/adminChats/${id}`);

export const getAdminFirst = () => {return API.get('/admin/adminid');};

export const getAdmin = (AdminId) => API.get(`/admin/admin/${AdminId}`);

export const getUser = (userId) => API.get(`/getUser/${userId}`);


export const getMessages = (id) => API.get(`/getMessages/${id}`);

export const addMessage = (data) => API.post('/addMessage/', data);

// export const findChat = (firstId, secondId) => API.get(`/chat/find/${firstId}/${secondId}`);