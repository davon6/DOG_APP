import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { fetchUsrs, fetchUser as apiFetchUser } from '@/api/apiService';

export const useExampleLogic = () => {
  const [users, setUsers] = useState<any[]>([]); // Store multiple users data
  const [user, setUser] = useState<any | null>(null); // Store single user data
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null); // To store errors

  // Fetch all users logic
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const result = await fetchUsrs(); // Call the API to fetch users
      //setUsers(result); // Set fetched users to state
      setUsers(result.filter(dog => dog.LAST_LOCAT_LAT !== null && dog.LAST_LOCAT_LONG !== null));
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users');
      Alert.alert('Error', 'Failed to fetch users from the server.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch single user logic
 // Fetch single user logic
 const fetchUser = async (username: string) => {
   setLoading(true);
   try {
     console.log(`Fetching user with username: ${username}`);
     const result = await apiFetchUser(username); // Call the API to fetch the user

     // If the result is an array, extract the first user
     const userData = Array.isArray(result) && result.length > 0 ? result[0] : null;

     setUser(userData); // Set the extracted user data to state
     //console.log('Fetched user:', userData);
   } catch (error) {
     console.error('Error fetching user:', error);
     setError('Failed to fetch user');
     Alert.alert('Error', 'Failed to fetch user from the server.');
   } finally {
     setLoading(false);
   }
 };

  useEffect(() => {
    fetchUsers(); // Automatically fetch users on mount
  }, []);

  return {
    users,
    user,
    loading,
    error,
    refetchUsers: fetchUsers, // Expose refetch if needed
    fetchUser, // Expose fetchUser for fetching individual user
  };
};
