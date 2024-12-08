// src/api/apiService.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigate } from '@/navigators/navigationHelper';

const api = axios.create({
  baseURL: 'http://192.168.30.1:3000',
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
    const response = await api.post('/api/conversations/send-message', { conversationId, senderUsername, text });

   /* console.log("a basic check " + JSON.stringify(response));*/

    return response.data.messageID;

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


export const getFriendStatuses = async (username: string) => {


    console.log("soooooo  !!!"+ username)

  try {
    const response = await api.post('/api/friends/status', { username });
    return response.data;  // This is the list of friend statuses returned from the server
  } catch (error) {
    console.error('Error fetching friend statuses:', error);
    throw error;  // Propagate the error for UI components to handle
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



    //this function requires to passs up a token
  try {

      console.log("in apiService getAllConversations");
    const response = await api.get(`/api/conversations`, {

           params: { username },
    });


    //console.log("bah alors ? "+JSON.stringify(response.data) );

    return response; // { messages: Message[], hasMore: boolean }



 //   return { messages: Message[], hasMore !== undefined ? hasMore : true
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

// Friends API

// Get all friends for a user
export const getFriends = async (userId: number) => {
  try {
    const response = await api.get(`/api/friends`, {
      params: { userId },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching friends:', error);
    throw error;
  }
};

// Send a friend request
export const sendFriendRequest = async (username: string, friendUsername: string) => {
  try {
    const response = await api.post(`/api/friends/request`, { username, friendUsername });
    return response.data;
  } catch (error) {
    console.error('Error sending friend request:', error);
    throw error;
  }
};

// Accept a friend request
export const acceptFriendRequest = async (userId: number, friendId: number) => {
  try {
    const response = await api.put(`/api/friends/accept`, { userId, friendId });
    return response.data;
  } catch (error) {
    console.error('Error accepting friend request:', error);
    throw error;
  }
};

// Remove a friend
export const removeFriend = async (userId: number, friendId: number) => {
  try {
    const response = await api.delete(`/api/friends/remove`, {
      data: { userId, friendId },
    });
    return response.data;
  } catch (error) {
    console.error('Error removing friend:', error);
    throw error;
  }
};

// Fetch friend requests (pending requests for the current user)
export const getFriendRequests = async (userId: number) => {
  try {
    const response = await api.get(`/api/friends/requests`, {
      params: { userId },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching friend requests:', error);
    throw error;
  }
};

// Fetch mutual friends between two users
export const getMutualFriends = async (userId: number, otherUserId: number) => {
  try {
    const response = await api.get(`/api/friends/mutual`, {
      params: { userId, otherUserId },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching mutual friends:', error);
    throw error;
  }
};

// NOTIFICATIONS API CALLS

// Fetch all notifications for the logged-in user
export const fetchNotificationsApi = async (username: string) => {
  try {
    console.log("Fetching notifications for username:", username);

    // Send the username in the request body
    const response = await api.post('/api/notifications/notifications', {
      username,  // Passed in the body, not params
    });

    console.log("Fetched notifications:");
    console.log(JSON.stringify(response.data));

    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;  // Propagate the error to be handled in the component
  }
};




// Mark a notification as read
export const markNotificationAsReadApi = async (notificationId: number) => {
  try {
    const response = await api.patch(`/api/notifications/${notificationId}`, { isRead: true });
    return response.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

// Delete a notification
export const deleteNotificationApi = async (notificationId: number) => {
  try {
    await api.delete(`/api/notifications/${notificationId}`);
    return notificationId;
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};



export default api;
