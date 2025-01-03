import React, { useEffect, useContext, useState } from 'react';
import {Alert} from 'react-native';
import { View, Text, StyleSheet, Animated, TouchableWithoutFeedback,TouchableOpacity, PanResponder, Dimensions, ScrollView, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import { setActiveConversation, startConversation } from '@/redux/slices/messagingSlice';
import { RootState } from '@/redux/store';
import { UserContext } from '@/services/Context';
import MessagePopup from './MessagePopup';
import NewDoggiePopup from './NewDoggiePopup';
import {updateUser as updtU }  from '@/api/apiService';
import { Toast } from 'react-native-toast-message';


import { selectConversationsList } from '@/redux/selectors';

const { width } = Dimensions.get('window');

interface SlidingMenuProps {
  activeMenu: string;
  menuAnim: Animated.Value;
  closeMenu: () => void;
}

const SlidingMenu: React.FC<SlidingMenuProps> = ({ activeMenu, menuAnim, closeMenu, data, handleLogout,    triggerSignOutPopup }) => {
const [showNewChatPopup, setShowNewChatPopup] = useState(false);
const [editableField, setEditableField] = useState(null); // Track which field is being edited
const [tempValue, setTempValue] = useState(''); // Temporary value for editing
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { user, updateUser, clearUser } = useContext(UserContext);
      const dispatch = useDispatch();
/*
  const handleLogout = async () => {

      console.log("up for some loggout");
    setIsLoggingOut(true);

         console.log("up for some loggout2");

    await logOut();
    setTimeout(() => setIsLoggingOut(false), 2000); // Show overlay for 2 seconds
  };*/


  const NewChatPopup: React.FC<{ onClose: () => void; onSelectUser: (username: string) => void }> = ({ onClose, onSelectUser }) => (
    <View style={styles.popupContainer}>
      <View style={styles.popupHeader}>
        <Text style={styles.headerText}>Start a New Chat</Text>
        <TouchableOpacity onPress={onClose}>
          <Icon name="close" size={24} color="black" />
        </TouchableOpacity>
      </View>
      {/*tempUsersPull.map((username) => (
        <TouchableOpacity key={username} style={styles.userButton} onPress={() => onSelectUser(username)}>
          <Text style={styles.buttonText}>{username}</Text>
        </TouchableOpacity>
      ))*/}


        {
          data[1] && data[1].length > 0 ? (
            data[1].map((user) => (
              <TouchableOpacity
                key={user.username}
                style={styles.userButton}
                onPress={() => onSelectUser(user.username)}
              >
                <Text style={styles.buttonText}>{user.username}</Text>
              </TouchableOpacity>
            ))
          ) : (
            Alert.alert("No doggy friends yet, go on make some new.")
             //setShowNewChatPopup(false)
          )
        }
    </View>
  );
/*Alert.alert("No doggy friends yet, go on make some new.")
  const tempUsersPull = ['rivka', 'jean', 'james', 'marvin','g','m','r','u', 'eric'];

  console.log("ready to replace "+ JSON.stringify(data[1]));
*/

  const [showPopup, setShowPopup] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [newChatReceiver, setNewChatReceiver] = useState<string | null>(null);
  //const { user } = useContext(UserContext);


  // Get conversations as an object and users as an object
  //const conversations = useSelector((state: RootState) => state.messaging.conversations);
  //const conversations = useSelector((state) => Object.values(state.messaging.conversations));

const conversations = useSelector(selectConversationsList);

  const users = useSelector((state: RootState) => state.messaging.users);
  const messages = useSelector((state: RootState) => state.messaging.messages);


  const [showDoggiePopup, setShowDoggiePopup] = useState(false);

  const handleSelectDoggie = (doggieName: string) => {
    console.log(`Selected doggie: ${doggieName}`);
    setShowDoggiePopup(false);
  };


  const openPopup = (conversationId?: string, receiverUsername?: string) => {

    if (conversationId) {


console.log("READY TO DISPATCH SETACTIVE CONV->"+receiverUsername);


      dispatch(setActiveConversation({conversationId, otherUser:receiverUsername}));
      setCurrentConversationId(conversationId);
      setNewChatReceiver(receiverUsername);
    } else if (receiverUsername) {

        console.log("new conversation ID , no exisitn so ->"+receiverUsername);

      setNewChatReceiver(receiverUsername);
    }
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setCurrentConversationId(null);
    setNewChatReceiver(null);
  };

  useEffect(() => {
    closePopup();
  }, [activeMenu]);
/*
  useEffect(() => {
    console.log(conversations); // Verify that each conversation has `otherUser` populated correctly here
  }, [conversations]);

*/
  const initiateConversation = async (username: string) => {
    if (!showPopup) {
      const conversationId = await dispatch(startConversation(user.userName, username));
      if (conversationId) {


          console.log("we always go to conversationId acquired");
        openPopup(conversationId, username);
		  setShowNewChatPopup(false);//DAVID
      } else {
	   setShowNewChatPopup(false);//DAVID
        openPopup(undefined, username); // New chat mode
      }
    }
  };

    // Handle initiating edit mode
    const handleEdit = (field, value) => {
      setEditableField(field);
      setTempValue(value);
    };

    // Handle saving the edited value
    const handleSave = async (field) => {


console.log("soooooo do we update ?"+field+ tempValue);

      const updatedUser = { ...user, [field]: tempValue };
         updateUser(updatedUser);

      // Send update to server
      try {
        const response = await updtU(user.userName,  { [field]: tempValue });
        if (!response.success) throw new Error(result.message);
      } catch (error) {
        console.error('Error updating user:', error);
      }

  console.log("no result but i may have worked");


      setEditableField(null); // Exit edit mode
    };

    const renderField = (label, field) => (
      <View style={styles.fieldContainer}>
        <Text style={styles.menuText}>{label}: </Text>

        {/* Editable Field Logic */}
        {editableField === field ? (
          <TextInput
            style={styles.inputField}
            placeholder={user[field]}
            value={tempValue}
            onChangeText={setTempValue}
          />
        ) : (
          <Text style={styles.menuText}>{user[field] || 'Not specified'}</Text>
        )}

        {/* Edit Icon */}
        {editableField === field ? (
          <TouchableOpacity onPress={() => handleSave(field)}>
            <Icon name="check" size={20} color="green" style={styles.icon} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => handleEdit(field, user[field])}>
            <Icon name="pencil" size={20} color="blue" style={styles.icon} />
          </TouchableOpacity>
        )}
      </View>
    );

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dx < -20,
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dx < 0) {
        menuAnim.setValue(gestureState.dx);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx < -width * 0.02) {
        closeMenu();
         setShowDoggiePopup(false);
      } else {
        Animated.timing(menuAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  const renderMenuContent = () => {
    // Convert conversations object to an array using Object.values()
    const conversationList = Object.values(conversations);

    switch (activeMenu) {
	     case 'user':
               return (
                 <View style={[styles.menuContent, { backgroundColor: 'rgba(255, 192, 203, 0.8)' }]}>
                   <Text style={styles.menuTitle}>Doggie Profile</Text>
                   {/*renderField('Username', 'userName')*/}
                   {renderField('Doggy Name', 'dogName')}
                    {renderField('Doggy Age', 'dogAge')}
                   {renderField('Doggy Color', 'dogColor')}
                   {renderField('Doggy Weight', 'dogWeight')}
                   {renderField('Doggy Race', 'dogRace')}
                   {renderField('Doggy Size', 'dogSize')}
                   {renderField('Doggy Vibe', 'dogPersonality')}
                   {renderField('Doggy Hobbies', 'dogHobbies')}
                 </View>
               );
      case 'msg':
        return (
          <View style={[styles.menuContent, { backgroundColor: 'rgba(173, 216, 230, 0.8)' }]}>
            <Text style={styles.menuTitle}>Messages</Text>

            <TouchableWithoutFeedback style={styles.startChatButton} onPress={() =>/* setShowPopup(true)*/setShowNewChatPopup(true)}>
              <Text style={styles.buttonText}>Start New Chat</Text>
            </TouchableWithoutFeedback>

            {conversationList.length > 0 ? (
              <ScrollView style={styles.conversationList}>
                {conversationList.map((conversation) => {
                  // Get the participant user ID(s) from the conversation
                  const participantIds = conversation.participants.filter((id) => id !== user.id);

//console.log("feeling lost "+ JSON.stringify(conversation));

                  // Get the participant's name from the users state using the ID
                  const participantName = conversation.otherUser || 'Unknown User';
                // const participantName = conversation.participants[1] || 'Unknown User';

                  // Get the last message for the conversation
                  const lastMessageId = conversation.messages[conversation.messages.length - 1];
                  const lastMessage = messages[lastMessageId];

                  // Only display conversations that have messages
                  if (!lastMessage) return null;

                  return (
                    <TouchableWithoutFeedback key={conversation.id} onPress={() => openPopup(conversation.id, participantName, )}>
                      <View style={styles.conversationItem}>
                        <View style={styles.chatHeader}>
                          {/* Light blue background for "Chat with [User]" */}
                          <Text style={styles.placeholderText}>Chat with {participantName}</Text>
                        </View>

                        {/* Last message text aligned to the left */}
                        <Text style={styles.latestMessageText}>
                          {lastMessage.text || 'No message text'}
                        </Text>
                      </View>
                    </TouchableWithoutFeedback>
                  );
                })}
              </ScrollView>
            ) : (
              <Text style={styles.noConversationText}>No conversations yet</Text>
            )}
          </View>
        );
   case 'search':
        return (
          <View style={[styles.menuContent, { backgroundColor: 'rgba(144, 238, 144, 0.8)' }]}>
            <Text style={styles.menuTitle}>Search Options</Text>
          <TouchableOpacity
                   style={styles.startChatButton}
                   onPress={() => setShowDoggiePopup(true)}
                 >
                   <Text style={styles.buttonText}>New Doggie Friends</Text>
                 </TouchableOpacity>
                 <Text style={styles.menuText}>Lost Items</Text>
                 <Text style={styles.menuText}>Event Creation/Sharing</Text>
                 <Text style={styles.menuText}>Forum</Text>
                 <Text style={styles.menuText}>Business</Text>

          </View>
        );

case 'gear':
  return (
    <View style={[styles.menuContent, { backgroundColor: 'rgba(255, 165, 0, 0.8)' }]}>
      <Text style={styles.menuTitle}>Settings</Text>
      <Text style={styles.menuText}>App Skin Choice</Text>
      <Text style={styles.menuText}>Language</Text>
      <Text style={styles.menuText}>Password & Email Management</Text>

      {/* Buttons for Logout and Signout */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.logoutButton}   onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signoutButton} onPress={() => console.log('Signout pressed')}>
          <Text style={styles.buttonText} onPress={triggerSignOutPopup}>Signout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
      default:
        return null;
    }
  };

  return (
    <Animated.View style={[styles.menu, { transform: [{ translateX: menuAnim }] }]} {...panResponder.panHandlers}>
      {renderMenuContent()}
      {showPopup && (
        <MessagePopup
          conversationId={currentConversationId || undefined}
          senderUsername={user.userName}
          receiverUsername={newChatReceiver || undefined}
          onClose={closePopup}
        />
      )}
	   {showNewChatPopup && (
         <NewChatPopup
           onClose={() => setShowNewChatPopup(false)}
           onSelectUser={(username) => initiateConversation(username)}
         />
       )}

         {showDoggiePopup && (
           <NewDoggiePopup
             onClose={() => setShowDoggiePopup(false)}
             onSelectDoggie={handleSelectDoggie}
             userName={user.userName}

           />
         )}

    </Animated.View>
  );



};

const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '65%',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    zIndex: 1000,
  },
  menuContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-evenly',
  },
    fieldContainer: {
      flexDirection: 'row', // Arrange key, value, and icon horizontally
      alignItems: 'center', // Vertically center the items
      justifyContent: 'space-between', // Distribute space between elements
      marginBottom: 10, // Add spacing between rows
    },
  menuText: {
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1, // Allow the label to occupy its space proportionally
    textAlign: 'left', // Align label to the left
  },
  valueText: {
    fontSize: 16,
    flex: 2, // Give more space to the value text
    textAlign: 'left',
  },
  inputField: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
    flex: 2,
  },
  icon: {
    marginLeft: 10, // Add a little spacing between the value/input and the icon
  },
  menuTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  conversationItem: {
    backgroundColor: '#ADD8E6', // Light blue background for the entire item
    padding: 12, // Smaller padding for a cleaner look
    borderRadius: 8,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#fff', // White border to differentiate items
  },
  chatHeader: {
    backgroundColor: '#ADD8E6', // Light blue for the header
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 5,
  },
  placeholderText: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center', // Keeping header text centered
  },
  latestMessageText: {
    color: '#555',
    fontSize: 14,
    textAlign: 'left', // Align last message text to the left
    marginTop: 5,
  },
  noConversationText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  conversationList: {
    flex: 1,
    marginTop: 20,
  },
  startChatButton: {
    backgroundColor: '#4682B4',
    padding: 8, // Smaller button
    borderRadius: 8,
    marginVertical: 8,
    alignSelf: 'center',
	},
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
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
   userButton: {
    backgroundColor: '#87CEEB',
    padding: 12,
    borderRadius: 8,
    marginVertical: 5,
  },
   buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      marginTop: 20,
    },
    logoutButton: {
      backgroundColor: '#FF6347', // Tomato red
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
    },
    signoutButton: {
      backgroundColor: '#4682B4', // Steel blue
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
    },


});

export default SlidingMenu;
