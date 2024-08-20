import axios from 'axios';

const api = {
  getSaltedPassword: () => axios.get(`${import.meta.env.VITE_BASE_URL}/api/users/salted-password`),
  verifyPassword: (email, crackedPassword, saltedPassword) => {
    return axios.post(`${import.meta.env.VITE_BASE_URL}/api/users/verify-password`, { email, crackedPassword, saltedPassword });
  },
  submitQuizResults: (data) => {
    return axios.post(`${import.meta.env.VITE_BASE_URL}/api/users/submit-quiz-results`, data);
  }
};

export default api;