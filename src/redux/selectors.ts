// src/redux/selectors.ts
import { createSelector } from 'reselect';
import { RootState } from '@/redux/store';
import { Message, Conversation } from './slices/messagingSlice'; // Adjust import based on actual file structure

// Select all messages
const selectMessages = (state: RootState) => state.messaging.messages;

// Select all conversations
const selectConversations = (state: RootState) => state.messaging.conversations;

// Select messages by conversation ID
export const selectMessagesForConversation = (conversationId: string) =>
  createSelector(
    selectMessages,
    selectConversations,
    (messages, conversations) => {
      const messageIds = conversations[conversationId]?.messages || [];
      return messageIds.map(id => messages[id]).filter(Boolean);
    }
  );


// Select active conversation ID
export const selectActiveConversation = (state: RootState) => state.messaging.activeConversation;

// Select active conversation messages
export const selectActiveConversationMessages = createSelector(
  selectActiveConversation,
  selectMessages,
  selectConversations,
  (activeConversation, messages, conversations) => {
    if (!activeConversation) return [];
    const messageIds = conversations[activeConversation]?.messages || [];
    return messageIds.map(id => messages[id]).filter(Boolean);
  }
);

export const selectHasMoreForConversation = (conversationId: string) =>
  createSelector(
    (state: RootState) => state.messaging.conversations[conversationId]?.hasMore,
    (hasMore) => hasMore || false  // Default to `false` if hasMore is undefined
  );

  export const messagingSelectors = {
    selectMessagesForConversation,
    selectHasMoreForConversation,
  };