// store/notificationsSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchNotificationsApi, markNotificationAsReadApi, deleteNotificationApi } from '@/api/apiService';  // Import API methods


console.log("the beginning!!!!");
// Async Thunks

// Define Notification type
interface Notification {
  id: number;
  type: string;
  relatedUsername: string;
  extraData: any;
  isRead: boolean;
  createdAt: string;
}

// Define the shape of the state
interface NotificationsState {
  list: Notification[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Fetch Notifications from the server
export const fetchNotifications = createAsyncThunk(
  'notifications/fetch',
  async (username, { rejectWithValue }) => {
    try {


        console.log("bah we fetch notif ?"+ username);

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
      return notificationId;  // Return the notification ID to update the state
    } catch (error) {
      return rejectWithValue('Failed to mark notification as read');
    }
  }
);

// Delete Notification
export const deleteNotification = createAsyncThunk(
  'notifications/deleteNotification',
  async (notificationId: number, { rejectWithValue }) => {
    try {
      await deleteNotificationApi(notificationId);
      return notificationId;  // Return the notification ID to delete from state
    } catch (error) {
      return rejectWithValue('Failed to delete notification');
    }
  }
);

// Initial State
const initialState = {
  list: [],
  status: 'idle', // 'idle', 'loading', 'succeeded', 'failed'
  error: null,
};

// Redux Slice
const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
            console.log("Fetched Notifications:", action.payload)
        state.status = 'succeeded';
       // state.notifications = action.payload;
        state.list = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        state.notifications = state.notifications.map((notification) =>
          notification.id === action.payload
            ? { ...notification, isRead: true }
            : notification
        );
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.notifications = state.notifications.filter(
          (notification) => notification.id !== action.payload
        );
      });
  },
});

export default notificationSlice.reducer;
