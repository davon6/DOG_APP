import { createSelector } from 'reselect';
import { RootState } from '@/redux/store';


import memoize from 'lodash.memoize';

const getMappedMessages = memoize((messageIds, messages) =>
  messageIds.map((id) => messages[id]).filter(Boolean)
);




// Select conversations dictionary
export const selectConversations = (state: RootState) => state.messaging.conversations;


// Select active conversation ID
export const selectActiveConversationId = (state: RootState) => state.messaging.activeConversation;

export const selectMessages = (state) => state.messaging.messages;

export const selectConversationById = (conversationId) =>
  createSelector(
    (state) => {
      //console.log('Conversations state:', state.messaging.conversations);  // <-- Debugging log here
      return state.messaging.conversations;
    },
    (conversations) => {
    //  console.log('Conversations data:', conversations);  // <-- Debugging log here
      return conversations ? conversations[conversationId] : null;
    }
  );


export const selectMessagesForConversation = (conversationId) =>
  createSelector(
    [selectMessages, selectConversationById(conversationId)],
    (messages, conversation) => {
      if (!conversation || !conversation.messages) return [];
      return getMappedMessages(conversation.messages, messages);
    }
  );


// Select messages for the active conversation
export const selectActiveConversationMessages = createSelector(
  [selectActiveConversationId, selectMessages, selectConversations],
  (activeConversationId, messages, conversations) => {
    if (!activeConversationId || !conversations[activeConversationId]) return [];
    const messageIds = conversations[activeConversationId].messageIds;
    return messageIds.map(id => messages[id]).filter(Boolean);
  }
);

// Select participants for the active conversation
export const selectActiveConversationParticipants = createSelector(
  [selectActiveConversationId, selectConversations],
  (activeConversationId, conversations) => {
    if (!activeConversationId || !conversations[activeConversationId]) return [];
    return conversations[activeConversationId].participants;
  }
);

export const selectHasMoreForConversation = (conversationId) =>
  createSelector(
    [(state) => state.messaging.conversations],
    (conversations) => {


      if (!conversationId || !conversations[conversationId]) return false;
      return conversations[conversationId].hasMore; // Assuming `hasMore` is a property
    }
  );

