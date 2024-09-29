// src/hooks/useExampleLogic.ts
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { fetchUsrs } from '@/api/apiService'; // Corrected import

export const useExampleLogic = () => {
  const [users, setUsers] = useState<any[]>([]); // Store users data
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null); // To store errors

  // Fetching users logic
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const result = await fetchUsrs(); // Call the API to fetch users
      setUsers(result); // Set fetched users to state
    //  Alert.alert('Success', 'Users fetched successfully!');
    } catch (error) {
      console.error(error);
      setError('Failed to fetch users');
      Alert.alert('Error', 'Failed to fetch users from the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(); // Automatically fetch users on mount
  }, []);

  return {
    users,
    loading,
    error,
    refetch: fetchUsers, // Expose refetch if needed
  };
};
