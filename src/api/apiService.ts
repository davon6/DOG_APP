// src/api/apiService.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigate } from '@/navigators/navigationHelper';

const api = axios.create({
  baseURL: 'http://172.20.10.8:3000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

async function logOut() {
  try {
    await AsyncStorage.clear();
    console.log("AsyncStorage successfully cleared!");
  } catch (error) {
    console.error("Error clearing AsyncStorage:", error);
  }
  navigate('Welcome');
}

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (refreshToken) {
          const newAccessToken = await refreshTokenRequest(refreshToken);
          await AsyncStorage.setItem('userToken', newAccessToken);
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } else {
          logOut();
        }
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
        logOut();
      }
    }
    return Promise.reject(error);
  }
);

const refreshTokenRequest = async (refreshToken: string) => {
  try {
    const response = await api.post('user/token/refresh', { refreshToken });
    return response.data.accessToken;
  } catch (error) {
    console.error('Error refreshing token:', error.response ? error.response.data : error);
    throw new Error('Token refresh failed');
  }
};

// Start a new conversation or retrieve an existing one
export const startConversation = async (senderUsername: string, receiverUsername: string) => {
  try {
    const response = await api.post('/api/conversations/start-conversation', { senderUsername, receiverUsername });
    return response.data.conversationId;
  } catch (error) {
    console.error('Error starting conversation:', error);
    throw error;
  }
};

// Send a message in a conversation
export const sendMessage = async (conversationId: string, senderUsername: string, text: string) => {
  try {
    await api.post('/api/conversations/send-message', { conversationId, senderUsername, text });
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};


// Fetch all users (GET request)
export const fetchUsrs = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    console.error('Axios error:', error);
    throw error;
  }
};


// Fetch messages with pagination
export const fetchMessages = async (conversationId: string, offset: number, limit: number) => {



  try {
    const response = await api.get(`/api/conversations/${conversationId}/messages`, {
      params: { offset, limit },
    });
    return response; // { messages: Message[], hasMore: boolean }
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};


export const getAllConversations = async (username) => {

console.log("bah alors ? "+username );

    //this function requires to passs up a token
  try {

      console.log("in apiService getAllConversations");
    const response = await api.get(`/api/conversations`, {

           params: { username },
    });

    return response; // { messages: Message[], hasMore: boolean }
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

export default api;
