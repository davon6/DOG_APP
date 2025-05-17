// store/notificationsSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { deleteFriendRequest, acceptFriendRequest,fetchNotificationsApi, markNotificationAsReadApi, deleteNotificationApi } from '@/api/apiService'; // Import API methods

// Define Notification type
interface Notification {
  id: number;
  type: string;
  related_username: string;
  extraData: any;
  isRead: boolean;
  createdAt: string;
  text?: string; // Add text to allow dynamic updates in the UI
  responded?: boolean; // Add responded to track friend request responses
}

// Define the shape of the state
interface NotificationsState {
  list: Notification[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Initial State
const initialState: NotificationsState = {
  list: [],
  status: 'idle', // 'idle', 'loading', 'succeeded', 'failed'
  error: null,
};

// Async Thunks
// Fetch Notifications from the server
export const fetchNotifications = createAsyncThunk(
  'notifications/fetch',
  async (username: string, { rejectWithValue }) => {
    try {
      console.log("Fetching notifications for:", username);
      const notifications = await fetchNotificationsApi(username);
      return notifications;
    } catch (error) {
      return rejectWithValue('Failed to fetch notifications');
    }
  }
);

// Mark Notification as Read
export const markNotificationAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId: number, { rejectWithValue }) => {
    try {
      await markNotificationAsReadApi(notificationId);
      return notificationId; // Return the notification ID to update the state
    } catch (error) {
      return rejectWithValue('Failed to mark notification as read');
    }
  }
);

// Delete Notification
export const deleteNotification = createAsyncThunk(
  'notifications/delete',
  async (notificationId: number, { rejectWithValue }) => {
    try {
      await deleteNotificationApi(notificationId);
      return notificationId; // Return the notification ID to delete from state
    } catch (error) {
      return rejectWithValue('Failed to delete notification');
    }
  }
);

// Update Notification Response
export const updateNotificationResponse = createAsyncThunk(
  'notifications/updateResponse',
  async (
    { notificationId, response, newText, username, related_username }:
    { notificationId: number; response: 'accept' | 'decline'; newText: string; userId: number; friendId: number },
    { rejectWithValue }
  ) => {
    try {

        console.log("updateNotificationResponse in slice "+username, related_username, notificationId)

      if (response === 'accept') {
        // Call the acceptFriendRequest API
        await acceptFriendRequest(username, related_username, notificationId);
      } else if (response === 'decline') {
        // Call the deleteFriendRequest API (to allow sending new friend requests later)
        await deleteFriendRequest(username, related_username, notificationId);
      }

      // Mark the notification as read
      //await markNotificationAsRead(notificationId);

      // Return updated notification data for Redux
      return { notificationId, response, newText, isRead: true };
    } catch (error) {
      console.error('Error updating notification response:', error);
      return rejectWithValue('Failed to update notification response');
    }
  }
);


// Redux Slice
const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {  logout: (state) => {
                   return {
                     list: [],
                     status: 'idle',
                     error: null,
                   };
                 }}, // Remove the `updateNotificationResponse` reducer from here
  extraReducers: (builder) => {
    builder
      // Fetch Notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        console.log('Fetched Notifications:', action.payload);
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Mark as Read
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        state.list = state.list.map((notification) =>
          notification.id === action.payload
            ? { ...notification, isRead: true }
            : notification
        );
      })
      // Delete Notification
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (notification) => notification.id !== action.payload
        );
      })
      // Update Notification Response
      .addCase(updateNotificationResponse.fulfilled, (state, action) => {

          console.log("we get here");

          console.log("we get here"+ JSON.stringify( action.payload));

        const { notificationId, newText } = action.payload;
        const notification = state.list.find((n) => n.id === notificationId);
        if (notification) {
          notification.text = newText; // Update the notification text dynamically
          notification.responded = true; // Mark as responded
        }
      });
  },
});

export const { logout } = notificationSlice.actions;


export default notificationSlice.reducer;
