import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import messagingReducer from '@/redux/slices/messagingSlice';
import notificationsReducer from '@/redux/slices/notificationsSlice';  // Import the notifications slice

const store = configureStore({
  reducer: {
    messaging: messagingReducer,
    notifications: notificationsReducer,  // Add notifications reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true,
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;  // The type for the entire Redux state
export type AppDispatch = typeof store.dispatch;            // The type for dispatching actions

// Define AppThunk type for TypeScript
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export default store;
