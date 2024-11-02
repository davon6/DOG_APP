// src/redux/slices/messagingSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '@/redux/store';
import { getAllConversations as gAC, fetchUsrs as apiFetchUsers, startConversation as apiStartConversation, sendMessage as apiSendMessage, fetchMessages as apiFetchMessages } from '@/api/apiService';
import uuid from 'react-native-uuid';

interface Message {
  id: string;
  conversationId: string;
  senderUsername: string;
  text: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  participants: string[]; // Usernames or IDs
  messages: string[]; // Array of message IDs
  hasMore: boolean; // Indicates if more messages can be fetched
}
/*
interface MessagingState {
  activeConversation: string | null;
  conversations: {
    [key: string]: Conversation;
  };
  messages: {
    [key: string]: Message;
  };
}
*/
interface User {
  id: string;
  username: string;
}

interface MessagingState {
  activeConversation: string | null;
  conversations: {
    [key: string]: Conversation;
  };
  messages: {
    [key: string]: Message;
  };
  users: {
    [key: string]: User;
  };
}




const initialState: MessagingState = {
  activeConversation: null,
  conversations: {},
  messages: {},
   users: {},
};

const messagingSlice = createSlice({
  name: 'messaging',
  initialState,
  reducers: {
    setActiveConversation: (state, action: PayloadAction<string>) => {
      state.activeConversation = action.payload;
    },
    setConversations: (state, action: PayloadAction<Conversation[]>) => {
      action.payload.forEach(conv => {
        state.conversations[conv.id] = conv;
      });
    },
    addConversation: (state, action: PayloadAction<Conversation>) => {
      state.conversations[action.payload.id] = action.payload;
    },
    setMessages: (state, action: PayloadAction<{ conversationId: string; messages: Message[]; hasMore: boolean }>) => {
      const { conversationId, messages, hasMore } = action.payload;
      messages.forEach(msg => {
        state.messages[msg.id] = msg;
        if (!state.conversations[conversationId].messages.includes(msg.id)) {
          state.conversations[conversationId].messages.push(msg.id);
        }
      });
      state.conversations[conversationId].hasMore = hasMore;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      const message = action.payload;
      state.messages[message.id] = message;

      if (state.conversations[message.conversationId]) {
        state.conversations[message.conversationId].messages.push(message.id);
      }
    },
setUsers: (state, action: PayloadAction<User[]>) => {
    action.payload.forEach(user => {
     // state.users[user.id] = user;
     state.users[user.id] = user.USER_ID;
    });
  },
  },
});

export const { setActiveConversation, setConversations, addConversation, setMessages, addMessage, setUsers } = messagingSlice.actions;

// Async action to start a conversation
export const startConversation = (senderUsername: string, receiverUsername: string): AppThunk => async dispatch => {
  try {
    const conversationId = await apiStartConversation(senderUsername, receiverUsername);
    dispatch(setActiveConversation(conversationId));
    // Optionally, fetch initial messages for this conversation
    dispatch(fetchMessages(conversationId, 0, 20)); // Fetch first 20 messages
    return conversationId;
  } catch (error) {
    console.error('Error starting conversation:', error);
    throw error;
  }
};

// Async action to send a message
export const sendMessage = (conversationId: string, senderUsername: string, text: string): AppThunk => async dispatch => {
  try {

    /*const newMessage =*/
/*
const newMessage = {
      id: Date.now().toString(),  // Temporary unique ID; replace with backend ID if needed
      conversationId,
      senderUsername,
      text,
      timestamp: new Date().toISOString(),
    };

    console.log("sendMessage"+newMessage);
        console.log("sendMessage"+JSON.stringify(newMessage));
        */
//console.log("the uuid temp->"+`${Date.now()}-${Math.floor(Math.random() * 1000)}`+" the timestamp-->"+new Date().toISOString());
console.log("the uuid temp->"+uuid.v4());
    dispatch(addMessage({
                               id: uuid.v4(), // Generates a React Native-compatible UUID // Temporary unique ID; replace with backend ID if needed
                              conversationId,
                              senderUsername,
                              text,
                              timestamp: new Date().toISOString(),
                            }));

                        /*await */apiSendMessage(conversationId, senderUsername, text);
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Async action to fetch messages with pagination
export const fetchMessages = (conversationId: string, offset: number, limit: number): AppThunk => async dispatch => {
  try {
    const response = await apiFetchMessages(conversationId, offset, limit);

    console.log("now fetching messages "+ JSON.stringify(response.data));

    const { messages, hasMore } = response.data;
    dispatch(setMessages({ conversationId, messages, hasMore }));
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};


export const fetchAllConversations = (username): AppThunk => async dispatch => {
  try {

console.log("fetchAllConversations "+username);

   // const response = await api.get('/api/conversations'); // Ensure this endpoint exists

    const response = await gAC(username);

    const conversations: Conversation[] = response.data;

    /*
    dispatch(setConversations(conversations));
    // Optionally, fetch initial messages for each conversation
    conversations.forEach(conv => {
      dispatch(fetchMessages(conv.id, 0, 20));
    });
*/

if (Array.isArray(conversations)) {
      dispatch(setConversations(conversations));
      conversations.forEach(conv => {
        dispatch(fetchMessages(conv.id, 0, 20)); // Optionally fetch initial messages
      });
    } else {
      console.error("Error: API response does not contain conversations array.");
    }


  } catch (error) {
    console.error('Error fetching conversations:', error);
    throw error;
  }
};


export const fetchUsers = (): AppThunk => async dispatch => {
  try {

      /*
    const response = await api.get('/api/users'); // Ensure this endpoint exists
    const users: User[] = response.data;

    */

     const response = await apiFetchUsers();


     //console.log("ohohoh"+JSON.stringify(response));

     // const users: User[] = response.data;

     const users: User[] = response;
    dispatch(setUsers(users));
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export default messagingSlice.reducer;
