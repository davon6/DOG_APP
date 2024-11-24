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
import Icon from 'react-native-vector-icons/FontAwesome';

interface NewDoggiePopupProps {
  onClose: () => void;
  onSelectDoggie: (doggieName: string) => void;
}

const NewDoggiePopup: React.FC<NewDoggiePopupProps> = ({ onClose, onSelectDoggie }) => {
  const [doggieSearch, setDoggieSearch] = useState('');
  const tempDoggieList = [
    { name: 'Buddy', status: 'none' },
    { name: 'Max', status: 'requested' },
    { name: 'Charlie', status: 'friends' },
    { name: 'Bella', status: 'none' },
    { name: 'Luna', status: 'requested' },
  ];

  const [filteredDoggies, setFilteredDoggies] = useState(tempDoggieList);

  const handleCheckUser = () => {
    Alert.alert('Search Doggies', `Searching for "${doggieSearch}" on server...`);
    // Mock function to simulate a server search
  };

  // Filter doggies and trigger server call on `doggieSearch` change
  useEffect(() => {
    setFilteredDoggies(
      tempDoggieList.filter((doggie) =>
        doggie.name.toLowerCase().includes(doggieSearch.toLowerCase())
      )
    );

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
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <TouchableOpacity
              style={styles.userButton}
              onPress={() => onSelectDoggie(item.name)}
            >
              <Text style={styles.buttonText}>{item.name}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => {
                if (item.status === 'none') {
                  Alert.alert('Friend Request', `Friend request sent to ${item.name}!`);
                }
              }}
            >
              <Icon
                name={item.status === 'none' ? 'plus' : item.status === 'requested' ? 'clock-o' : 'check'}
                size={20}
                color={item.status === 'none' ? '#333' : item.status === 'requested' ? '#FFA500' : '#32CD32'}
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
