import axios from 'axios';

const client = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach Token
client.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 (Unauthorized)
client.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Force redirect to login if we are in a protected route? 
            // Better to let the React components react to the missing token, 
            // but for safety in admin panel we can force reload or redirect.
            // We'll dispatch a custom event or check current path.
            // For now, simple logic: if 401, clear session. 
            // The ProtectedRoute or AuthContext will eventually catch this.

            // Optional: window.location.href = '/admin'; // Force redirect
        }
        return Promise.reject(error);
    }
);

export default client;
