import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import { UserContext } from '@/services/Context';
import { navigate } from '@/navigators/navigationHelper';

// Create Axios instance
const api = axios.create({
  baseURL: 'http://172.20.10.8:3000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});




async function logOut () {

/*WE ARE VERY MUCH MISSING

 //const { clearUser } = useContext(UserContext);

 */
     try {
        await AsyncStorage.clear();
        console.log("AsyncStorage successfully cleared!");
      } catch (error) {
        console.error("Error clearing AsyncStorage:", error);
      }
        navigate('Welcome');
  };

// Axios request interceptor to add Authorization token
api.interceptors.request.use(
  async (config) => {
         console.log("testing  api.interceptors bouyaka")
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Axios response interceptor to handle token expiration globally
api.interceptors.response.use(
  (response) => {
      console.log("lost  api.interceptors")

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (refreshToken) {
             console.log("we have a refresh token");

          const newAccessToken = await refreshTokenRequest(refreshToken);

           console.log("we got a new access token");

          await AsyncStorage.setItem('userToken', newAccessToken);

          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } else {


            //navigate('Welcome');
            logOut()
          // Handle no refresh token case (e.g., redirect to login)
        }
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
          //navigate('Welcome');
                      logOut()
      }
    }

    return Promise.reject(error);
  }
);

// Helper function to refresh token
const refreshTokenRequest = async (refreshToken: string) => {
    try {
        console.log("Attempting token refresh with: ", refreshToken); // Log the refresh token
        const response = await api.post('user/token/refresh', { refreshToken });
        console.log("Response from token refresh: ", response.data); // Log the response
        return response.data.accessToken;
    } catch (error) {
        console.error('Error refreshing token:', error.response ? error.response.data : error);
        throw new Error('Token refresh failed');
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

// Fetch a single user (POST request)
export const fetchUser = async (username: string) => {
  try {
    const response = await api.post('/user/find', { username });
    return response.data;
  } catch (error) {
    console.error('Axios error:', error);
    throw error;
  }
};

export default api;
