import axios from 'axios';
import Reactotron from 'reactotron-react-native'; // Import Reactotron

// Create an Axios instance
const api = axios.create({
  baseURL: 'https://api.yourservice.com',
});

// Add a request interceptor to log requests
api.interceptors.request.use(request => {
  Reactotron.apiRequest(request); // Log the request with Reactotron
  return request;
});

// Add a response interceptor to log responses
api.interceptors.response.use(response => {
  Reactotron.apiResponse(response); // Log the response with Reactotron
  return response;
}, error => {
  Reactotron.apiResponse(error.response); // Log the error response with Reactotron
  return Promise.reject(error);
});

export default api;
