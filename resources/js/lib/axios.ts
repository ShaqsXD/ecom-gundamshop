import axios from 'axios';

// Configure Axios defaults
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.common['Accept'] = 'application/json';

// Add CSRF token to requests
const token = document.head.querySelector('meta[name="csrf-token"]');
if (token) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = (token as HTMLMetaElement).content;
}

// Add request interceptor for authentication
axios.interceptors.request.use(
    (config) => {
        // For Sanctum, we rely on session-based authentication for SPA
        config.withCredentials = true;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Redirect to login if unauthorized
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axios;