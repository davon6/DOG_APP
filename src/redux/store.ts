// src/redux/store.ts
import { configureStore,  ThunkAction, Action } from '@reduxjs/toolkit';
import messagingReducer from '@/redux/slices/messagingSlice';

const store = configureStore({
  reducer: {
    messaging: messagingReducer,
  },
  middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: true,
        serializableCheck: false,
      })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Define AppThunk type for TypeScript
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export default store;
