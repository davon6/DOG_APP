// src/redux/selectors.ts
import { createSelector } from 'reselect';
import { RootState } from '@/redux/store';
import { Message, Conversation } from './slices/messagingSlice'; // Adjust import based on actual file structure
/*
// Memoized selector for messages in the state
const selectMessages = (state: RootState) => state.messaging.messages;

// Memoized selector for conversations in the state
const selectConversations = (state: RootState) => state.messaging.conversations;




*/






const selectConversations = (state: RootState) => state.messaging.conversations ?? {};

/*ATTENTION
export const selectConversationsList = createSelector(
  [selectConversations],
  (conversations) => Object.values(conversations).slice()
);
*/
export const selectConversationsList = createSelector(
  [selectConversations],
  (conversations) => {
    const values = Object.values(conversations);
    return values.length ? values.slice() : values;
  }
);


// Selector for users
const selectUsers = (state: RootState) => state.messaging.users;
export const selectMemoizedUsers = createSelector(
  [selectUsers],
  (users) => users ?? []
);

// Selector for messages
const selectMessages = (state: RootState) => state.messaging.messages ?? {};

export const selectMemoizedMessages = createSelector(
  [selectMessages],
  (messages) => messages  ?? {}
);




// Memoized selector for a specific conversation's messages
export const selectMessagesForConversation = (conversationId: string) =>
  createSelector(
    [selectMessages, selectConversations],
    (messages, conversations) => {
      const messageIds = conversations[conversationId]?.messages || [];
      // Use map only if messageIds changes, ensuring that a new reference isn’t created unnecessarily.
      return messageIds.map(id => messages[id]).filter(Boolean);
    }
  );


/*
  const selectAllMessages = (state) => state.messaging.conversations;

  // Then, create a memoized selector to get messages for a specific conversation
  const selectMessagesForConversation = (conversationId) =>
    createSelector(
      [selectAllMessages],
      (conversations) => conversations[conversationId]?.messages || []
    );
    */

// Memoized selector for the active conversation ID
export const selectActiveConversation = (state: RootState) => state.messaging.activeConversation;

// Memoized selector for the active conversation's messages
export const selectActiveConversationMessages = createSelector(
  selectActiveConversation,
  selectMessages,
  selectConversations,
  (activeConversation, messages, conversations) => {
    // If no active conversation, return an empty array
    if (!activeConversation) return [];

    // Get the message IDs for the active conversation, default to an empty array if undefined
    const messageIds = conversations[activeConversation]?.messages || [];
    return messageIds.map(id => messages[id]).filter(Boolean); // Get messages by ID and filter out undefined ones
  }
);

// Memoized selector to check if there are more messages to load for a conversation
export const selectHasMoreForConversation = (conversationId: string) =>
  createSelector(
    (state: RootState) => state.messaging.conversations[conversationId]?.hasMore,
    (hasMore) => hasMore || false  // Default to `false` if hasMore is undefined
  );

export const messagingSelectors = {
  selectMessagesForConversation,
  selectHasMoreForConversation,
  selectActiveConversation,
  selectActiveConversationMessages,
  selectConversations,
  selectUsers,
  selectMessages,
  selectConversationsList
};
