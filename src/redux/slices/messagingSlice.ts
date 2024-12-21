// src/redux/slices/messagingSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '@/redux/store';
import {
  getAllConversations as gAC,
  fetchUsrs as apiFetchUsers,
  startConversation as apiStartConversation,
  sendMessage as apiSendMessage,
  fetchMessages as apiFetchMessages
} from '@/api/apiService';
import uuid from 'react-native-uuid';
import * as messagingSelectors from '@/redux/selectors';

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
  otherUser: string;
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

        console.log("setActiveConversation action.payload"+ JSON.stringify(action.payload));

      state.activeConversation = action.payload;
    },
    setConversations: (state, action: PayloadAction<Conversation[]>) => {
      action.payload.forEach(conv => {
        state.conversations[conv.id] = conv;
      });
    },

addConversation: (state, action: PayloadAction<Conversation>) => {
  const conversation = action.payload;

  console.log("addConversation payload: ", JSON.stringify(conversation));

  // Log if conversation has missing participants to help debugging
  if (!conversation.participants || conversation.participants.length === 0) {
    console.warn("Skipping incomplete conversation:", conversation);
    return;
  }

  console.log("Participants: ", JSON.stringify(conversation.participants));
  console.log("Current users: ", JSON.stringify(state.users));

  // Find the ID of the other participant (user who is not the active user)
  const otherUserId = conversation.participants.find(id => id !== state.activeUserId);
  const otherUser = otherUserId ? state.users[otherUserId] : null;

  // Check if the conversation already exists
  const existingConv = state.conversations[conversation.id];

  // Only update if there is no existing conversation
  if (!existingConv) {
    state.conversations[conversation.id] = {
      ...conversation,
      otherUser: conversation.otherUser || (otherUser ? otherUser.username : 'Unknown User'),
    };
  } else {
    // Update otherUser field if the conversation already exists and needs updating
    existingConv.otherUser = existingConv.otherUser || (otherUser ? otherUser.username : 'Unknown User');
  }
},


    setMessages: (state, action: PayloadAction<{ conversationId: string; messages: Message[]; hasMore: boolean }>) => {
      const { conversationId, messages, hasMore } = action.payload;

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
        state.users[user.id] = user;
      });
    },
   updateMessageId: (state, action: PayloadAction<{ tempId: string; messageId: string }>) => {
     const { tempId, messageId } = action.payload;
     const message = state.messages[tempId];
     if (message) {
       // Create a new message object with the real ID
       state.messages[messageId] = { ...message, id: messageId };
       delete state.messages[tempId];

       const conversation = state.conversations[message.conversationId];
       if (conversation) {
         const messageIndex = conversation.messages.indexOf(tempId);
         if (messageIndex > -1) {
           // Replace the temp ID with the real ID in the conversation messages list
           conversation.messages[messageIndex] = messageId;

           // Trigger re-render by creating a new shallow copy of the messages array
           state.conversations[message.conversationId].messages = [...conversation.messages];
         }
       }
     }
   },
      logout: (state) => {
         return {
           activeConversation: null,
           conversations: {},
           messages: {},
           users: {},
         };
       }

  },
});

export const {
  setActiveConversation,
  setConversations,
  addConversation,
  setMessages,
  addMessage,
  setUsers,
  updateMessageId,
  logout
} = messagingSlice.actions;

export { messagingSelectors };

export const startConversation = (senderUsername: string, receiverUsername: string): AppThunk => async (dispatch, getState) => {
  try {
    const conversationId = await apiStartConversation(senderUsername, receiverUsername);

    console.log("Inside startConversation with conversationId: " + conversationId);

    // Retrieve receiver user details from Redux state to get the user ID
    /*
    const state = getState();
    const receiverUser = Object.values(state.messaging.users).find(user => user.username === receiverUsername);

    if (!receiverUser) {
      console.error('Receiver user not found in state.');
      return;
    }
*/
    // Fully populate the new conversation
    console.log("dans startconversation"+JSON.stringify({
                                                              id: conversationId,
                                                              participants: [senderUsername, receiverUsername],
                                                              messages: [],
                                                              hasMore: true,
                                                              otherUser: receiverUsername,
                                                            }));

    const newConversation: Conversation = {
      id: conversationId,
      participants: [senderUsername, receiverUsername],
      messages: [],
      hasMore: true,
      otherUser: receiverUsername,
    };

    // Dispatch addConversation to update Redux state
    dispatch(addConversation(newConversation));

    // Set the active conversation
    dispatch(setActiveConversation(newConversation));

    // Optionally, pre-fetch messages for the new conversation
    dispatch(fetchMessages(conversationId, 0, 20));

    return conversationId;
  } catch (error) {
    console.error('Error starting conversation:', error);
    throw error;
  }
};


function toISOWithTimeZone(date, timeZone) {
  const options = {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3
  };

  const parts = new Intl.DateTimeFormat('en-GB', options)
    .formatToParts(date)
    .reduce((acc, part) => {
      acc[part.type] = part.value;
      return acc;
    }, {});

  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}.${String(date.getMilliseconds()).padStart(3, '0')}Z`;
}


export const sendMessage = (conversationId: string, senderUsername: string, text: string): AppThunk => async dispatch => {
  try {
    const tempId = uuid.v4().toString();
    const date = new Date();

    dispatch(
      addMessage({
        id: tempId,
        conversationId,
        senderUsername,
        text,
        timestamp: toISOWithTimeZone(date, "Europe/Paris"),
      })
    );

// Usage
/*
console.log("ISO format with specified time zone:", toISOWithTimeZone(date, "Europe/Paris"));


console.log("what a story "+ new Date().toLocaleTimeString()+ " new Date().toISOString() "+new Date().toISOString());
console.log("Timezone offset:", new Date().getTimezoneOffset()); // in minutes
console.log("Local time with explicit time zone:", new Date().toLocaleString("en-GB", { timeZone: "Europe/Paris" }));
*/
    const messageIdFromServer = await apiSendMessage(conversationId, senderUsername, text);
    dispatch(updateMessageId({ tempId, messageId: messageIdFromServer }));

/*
     dispatch(addMessage({ id: messageIdFromServer,
                                 conversationId,
                                 senderUsername,
                                 text,
                                 timestamp: new Date().toISOString()}));
*/
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const fetchMessages = (conversationId: string, offset: number, limit: number): AppThunk => async dispatch => {
  try {
    const response = await apiFetchMessages(conversationId, offset, limit);
    const { messages, hasMore } = response.data;


    //console.log("checking hasMore in fetchMessage-->"+JSON.stringify(response.data));

    dispatch(setMessages({ conversationId, messages, hasMore: hasMore ?? true }));
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

export const fetchAllConversations = (username: string): AppThunk => async dispatch => {
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
