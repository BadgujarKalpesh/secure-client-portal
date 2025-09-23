import axios from 'axios';

const api = axios.create({
    // Use the full backend URL instead of the relative path
    baseURL: 'http://localhost:5001/api' 
});

// The rest of the file stays the same
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;