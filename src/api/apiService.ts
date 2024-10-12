import axios from 'axios';

// Fetch all users (GET request)
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

// Fetch a single user (POST request)
export const fetchUser = async (username: string) => {
  try {
    const response = await fetch('http://172.20.10.8:3000/user/find', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }), // Send the username in the body
    });

    if (!response.ok) {
      throw new Error(`Error fetching user: ${response.statusText}`);
    }

    const data = await response.json(); // Parse the response JSON
    return data; // Return the fetched user data
  } catch (error) {
    console.error('Fetch error:', error);
    throw error; // Re-throw the error for handling in the hook
  }
};
