import axios from 'axios';

export const fetchUsrs = async () => {
  try {
    const response = await axios.get('http://172.20.10.8:3000/users', {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 5000, // Optional: set a timeout
    });
    return response.data;
  } catch (error) {
    console.error('Axios error:', error);
    throw error;
  }
};
