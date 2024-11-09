// src/redux/slices/messagingSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '@/redux/store';
import { getAllConversations as gAC, fetchUsrs as apiFetchUsers, startConversation as apiStartConversation, sendMessage as apiSendMessage, fetchMessages as apiFetchMessages } from '@/api/apiService';
import uuid from 'react-native-uuid';
import * as messagingSelectors from '@/redux/selectors'; // Import selectors

export interface Message {
  id: string;
  conversationId: string;
  senderUsername: string;
  text: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  messages: string[];
  hasMore: boolean;
}

interface User {
  id: string;
  username: string;
}

interface MessagingState {
  activeConversation: string | null;
  conversations: { [key: string]: Conversation };
  messages: { [key: string]: Message };
  users: { [key: string]: User };
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

      // Ensure the conversation exists in the state
      if (!state.conversations[conversationId]) {
        state.conversations[conversationId] = {
          id: conversationId,
          participants: [],
          messages: [],
          hasMore: true,
        };
      }

      messages.forEach(msg => {
        state.messages[msg.id] = msg;
        if (!state.conversations[conversationId].messages.includes(msg.id)) {
          state.conversations[conversationId].messages.push(msg.id);
        }
      });

      // Now it’s safe to update hasMore
      state.conversations[conversationId].hasMore = hasMore;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      const message = action.payload;
      state.messages[message.id] = message;
      if (state.conversations[message.conversationId]) {
        state.conversations[message.conversationId].messages = [
          ...state.conversations[message.conversationId].messages,
          message.id,
        ];
      }
    },
    setUsers: (state, action: PayloadAction<User[]>) => {
      action.payload.forEach(user => {
        state.users[user.id] = user;
      });
    },
updateMessageId: (state, action: PayloadAction<{ tempId: string; messageId: string }>) => {
  const { tempId, messageId } = action.payload;

  // Find the temporary message with tempId
  const message = state.messages[tempId];
  if (message) {
    // Update the message with the server-provided messageId
    state.messages[messageId] = { ...message, id: messageId }; // Copy the message with the new ID
    delete state.messages[tempId]; // Remove the temporary message

    // Update the conversation's messages array to use the server-provided messageId
    const conversation = state.conversations[message.conversationId];
    const index = conversation.messages.indexOf(tempId);
    if (index > -1) {
      conversation.messages[index] = messageId;
    }
  }
},

  },
});

export const { setActiveConversation, setConversations, addConversation, setMessages, addMessage, setUsers } = messagingSlice.actions;

// Export selectors for easy use in components
export { messagingSelectors };

// Export async actions
export const startConversation = (senderUsername: string, receiverUsername: string): AppThunk => async dispatch => {
  try {
    const conversationId = await apiStartConversation(senderUsername, receiverUsername);
    dispatch(setActiveConversation(conversationId));
    dispatch(fetchMessages(conversationId, 0, 20));
    return conversationId;
  } catch (error) {
    console.error('Error starting conversation:', error);
    throw error;
  }
};

export const sendMessage = (conversationId: string, senderUsername: string, text: string): AppThunk => async dispatch => {
  try {
    //  var tempId = uuid.v4();



          const messageIdFromServer = await apiSendMessage(conversationId, senderUsername, text);


    dispatch(
      addMessage({
        id: messageIdFromServer,
        conversationId,
        senderUsername,
        text,
        timestamp: new Date().toISOString(),
      })
    );

  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const fetchMessages = (conversationId: string, offset: number, limit: number): AppThunk => async dispatch => {
  try {
    const response = await apiFetchMessages(conversationId, offset, limit);
    const { messages, hasMore } = response.data;



console.log("lets try again ->"+JSON.stringify(response.data));




    const hasMoreFinal = hasMore !== undefined ? hasMore : true;

    dispatch(setMessages({ conversationId, messages, hasMore:hasMoreFinal}));
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

export const fetchAllConversations = (username): AppThunk => async dispatch => {
  try {
    const response = await gAC(username);
    const conversations: Conversation[] = response.data;
    if (Array.isArray(conversations)) {
      dispatch(setConversations(conversations));
      conversations.forEach(conv => {
        dispatch(fetchMessages(conv.id, 0, 20));
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
    const response = await apiFetchUsers();
    const users: User[] = response;
    dispatch(setUsers(users));
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export default messagingSlice.reducer;
