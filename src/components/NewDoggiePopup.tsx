import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';
import { UserContext } from '@/services/Context';

import { getFriendStatuses as getUsersFriendshipStatus, sendFriendRequest} from '@/api/apiService';

import Icon from 'react-native-vector-icons/FontAwesome';

interface NewDoggiePopupProps {
  onClose: () => void;
  onSelectDoggie: (doggieName: string) => void;
   userName: string;
}

const NewDoggiePopup: React.FC<NewDoggiePopupProps> = ({ onClose, onSelectDoggie, userName }) => {
  const [doggieSearch, setDoggieSearch] = useState('');
 const [filteredDoggies, setFilteredDoggies] = useState<any[]>([]);  // Store filtered doggies
  const [friendStatuses, setFriendStatuses] = useState<any[]>([]);  // Store friend statuses
  const [error, setError] = useState<string | null>(null);  // Error state for API call
  const [loading, setLoading] = useState<boolean>(false);  // Load


 useEffect(() => {
    // Asynchronous function to fetch the friend statuses
    const fetchFriendStatuses = async () => {
      setLoading(true);
      setError(null);
      try {

        const data = await getUsersFriendshipStatus(userName);  // Get friend statuses for a specific user

       console.log("here we goooo"+ JSON.stringify(data));

        setFriendStatuses(data);  // Set the response data to the state
      } catch (err) {
        setError('Error fetching friend statuses.');
      } finally {
        setLoading(false);  // Set loading to false when done
      }
    };

    fetchFriendStatuses();
  }, []);  // Empty dependency array so this runs once when component mounts

  useEffect(() => {
    // Filter doggies based on search input
    setFilteredDoggies(
      friendStatuses.filter((doggie) =>
        doggie.username.toLowerCase().includes(doggieSearch.toLowerCase())
      )
    );
  }, [doggieSearch, friendStatuses]);  // Re-run filter when search or friendStatuses changes


/*
  const tempDoggieList = [
    { username: 'Buddy via charley', relationship: 'none' },
    { username: 'Max via steeve', relationship: 'requested' },
    { username: 'Charlie via elise', relationship: 'friends' },
    { username: 'Bella via tony', relationship: 'none' },
    { username: 'Luna via jerome', relationship: 'requested' },
  ];
*/

 // const [filteredDoggies, setFilteredDoggies] = useState(tempDoggieList);

  const handleCheckUser = () => {
    Alert.alert('Search Doggies', `Searching for "${doggieSearch}" on server...`);
    // Mock function to simulate a server search
  };

  // Filter doggies and trigger server call on `doggieSearch` change

  useEffect(() => {
  /*  setFilteredDoggies(
      tempDoggieList.filter((doggie) =>
        doggie.username.toLowerCase().includes(doggieSearch.toLowerCase())
      )
    );
*/

    // Trigger server-side search mock
    if (doggieSearch.trim() !== '') {
      handleCheckUser();
    }
  }, [doggieSearch]);

  return (
    <View style={styles.popupContainer}>
      <View style={styles.popupHeader}>
        <Text style={styles.headerText}>Find a New Doggie Friend</Text>
        <TouchableOpacity onPress={onClose}>
          <Icon name="close" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Search doggies..."
        value={doggieSearch}
        onChangeText={setDoggieSearch} // Updates search state
      />
      <FlatList
        data={filteredDoggies}
        keyExtractor={(item) => item.username}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <TouchableOpacity
              style={styles.userButton}
              onPress={() => onSelectDoggie(item.username)}
            >
              <Text style={styles.buttonText}>{item.dog_name} via {item.username} </Text>
            </TouchableOpacity>
         <TouchableOpacity
           style={styles.iconButton}
           onPress={() => {
             if (item.relationship === 'none') {
               sendFriendRequest(userName, item.username)
                 .then(() => {
                   Alert.alert('Friend Request', `Friend request sent to ${item.username}!`);
                   // Update state to change the relationship to 'pending'
                   setFriendStatuses((prevStatuses) =>
                     prevStatuses.map((status) =>
                       status.username === item.username ? { ...status, relationship: 'pending' } : status
                     )
                   );
                 })
                 .catch((err) => {
                   console.error('Error sending friend request:', err);
                   Alert.alert('Error', 'Failed to send friend request.');
                 });
             }
           }}
         >
           <Icon
             name={
               item.relationship === 'none'
                 ? 'plus'
                 : item.relationship === 'pending'
                 ? 'clock-o'
                 : 'check'
             }
             size={20}
             color={
               item.relationship === 'none'
                 ? '#333'
                 : item.relationship === 'pending'
                 ? '#FFA500'
                 : '#32CD32'
             }
           />
         </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.doggieList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  popupContainer: {
    position: 'absolute',
    top: '10%',
    left: '5%',
    width: '90%',
    height: '80%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
    zIndex: 2000,
  },
  popupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  doggieList: {
    flexGrow: 1,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  userButton: {
    flex: 1,
    backgroundColor: '#87CEEB',
    padding: 12,
    borderRadius: 8,
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  iconButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
});

export default NewDoggiePopup;
