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
import  Toast  from 'react-native-toast-message';
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
  const [notificationVisible, setNotificationVisible] = useState(true);


  // Function that starts when the user presses the toast
  const handlePressIn = () => {
    setHoldStart(Date.now()); // Track the time when the press started
  };

  // Function that runs when the user releases the toast
  const handlePressOut = () => {
    const pressDuration = Date.now() - (holdStart || 0);

    if (pressDuration >= holdDuration) {
      // If the hold duration is longer than the threshold, hide the toast
      setNotificationVisible(false);
      Toast.hide();
    }
  };

  const handleClick = () => {
    setNotificationVisible(false); // You can hide the notification if you want to trigger other actions
    Toast.hide();  // Hide toast if clicked
  };


 useEffect(() => {
    // Asynchronous function to fetch the friend statuses
    const fetchFriendStatuses = async () => {
      setLoading(true);
      setError(null);
      try {

          console.log("how is it here fetchFriendStatuses "+userName);

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

  const handleCheckUser = () => {
    Alert.alert('Search Doggies', `Searching for "${doggieSearch}" on server...`);
    // Mock function to simulate a server search
  };

  // Filter doggies and trigger server call on `doggieSearch` change

  useEffect(() => {

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




             <Text style={styles.userButton}>{item.dog_name} via {item.username}</Text>

           <TouchableOpacity
             style={styles.iconButton}
             onPress={() => {
               if (item.relationship === 'none') {
                 sendFriendRequest(userName, item.username)
                   .then(() => {
                     Alert.alert('Friend Request', `Friend request sent to ${item.username}!`);
                     setFriendStatuses((prevStatuses) =>
                       prevStatuses.map((status) =>
                         status.username === item.username
                           ? { ...status, relationship: 'sent' }
                           : status
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
                   : item.relationship === 'received'
                   ? 'clock-o'
                   : item.relationship === 'sent'
                   ? 'paper-plane' // New icon for sent friend requests
                   : 'check'
               }
               size={20}
               color={
                 item.relationship === 'none'
                   ? '#333'
                   : item.relationship === 'received'
                   ? '#FFA500'
                   : item.relationship === 'sent'
                   ? '#1E90FF'
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




return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Send Friend Request Notification" onPress={handleSendNotification} />

      {/* Toast container to render notifications */}
      <Toast config={toastConfig} />
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
