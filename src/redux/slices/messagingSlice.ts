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
} = messagingSlice.actions;

export { messagingSelectors };

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

    dispatch(setMessages({ conversationId, messages, hasMore: hasMore ?? true }));
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

export const fetchAllConversations = (username: string): AppThunk => async dispatch => {
  try {


      console.log("inside fetchAllConversations");
    const response = await gAC(username);


     console.log("inside fetchAllConversations"+ JSON.stringify(response));

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
