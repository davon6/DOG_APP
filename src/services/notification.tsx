import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import Toast from "react-native-toast-message";
import { Dispatch } from "redux";
import { updateNotificationResponse } from "@/redux/slices/notificationsSlice";
import notificationTemplates from './notifications.json';
// TypeScript Interfaces
interface Notification {
  id: string;
  type: string;
  isRead: boolean;
  relatedUsername: string;
}

interface ToastProps {
  sender: string;
  onAccept: () => void;
  onDecline: () => void;
}

// Handle Friend Request Response
const handleFriendRequestResponse = (
  dispatch: Dispatch,
  notification: Notification,
  response: "accept" | "decline",
  username: string
) => {
  console.log(
    `Friend request from ${notification.relatedUsername} ${
      response === "accept" ? "accepted" : "declined"
    }.`
  );

console.log("just checking -->"+username);
let newText =
          response === 'accept'
            ? notificationTemplates.friend_accepted.replace('{demanding_user}', notification.relatedUsername)
            : notificationTemplates.friend_declined.replace('{demanding_user}', notification.relatedUsername);

  // Dispatch action
  dispatch(
    updateNotificationResponse({
      notificationId: notification.id,
      response,
      newText: newText,
      username,
      relatedUsername: notification.relatedUsername,
    })
  );

  Toast.hide(); // Hide the toast
};

// Notify Friend Request
export const notifyFriendRequest = (
  dispatch: Dispatch,
  username: string,
  notifications: Notification[]
) => {
  const unreadFriendRequests = notifications.filter(
    (notification) => !notification.isRead && notification.type === "friend_request"
  );

  console.log("Filtered unread friend requests:", unreadFriendRequests);

  console.log("has name gobe thru ", username);

  if (unreadFriendRequests.length === 0) {
    console.log("No unread friend requests.");
    return;
  }

  if (unreadFriendRequests.length === 1) {
    const notification = unreadFriendRequests[0];
    Toast.show({
      type: "custom_friend_request",
      position: "top",
      text1: "New Friend Request",
      text2: `${notification.relatedUsername} wants to connect with you!`,
      props: {
        sender: notification.relatedUsername,
        onAccept: () => handleFriendRequestResponse(dispatch, notification, "accept", username),
        onDecline: () => handleFriendRequestResponse(dispatch, notification, "decline", username),
      },
      autoHide: false,
      visibilityTime: 0,
    });
    return;
  }

  if (unreadFriendRequests.length > 1) {
    const count = unreadFriendRequests.length;
    Toast.show({
      type: "info",
      position: "top",
      text1: "Multiple Friend Requests",
      text2: `You have ${count} friend requests. Go check them out.`,
      autoHide: true,
      visibilityTime: 4000,
    });
  }
};

// Toast Config
export const toastConfig = {
  custom_friend_request: ({ text1, text2, props }: { text1: string; text2: string; props: ToastProps }) => (
    <View style={{ padding: 15, backgroundColor: "#fff", borderRadius: 10 }}>
      <Text style={{ fontWeight: "bold" }}>{text1}</Text>
      <Text style={{ marginBottom: 10 }}>{text2}</Text>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <TouchableOpacity
          style={{ padding: 10, backgroundColor: "#32CD32", borderRadius: 5 }}
          onPress={props.onAccept}
        >
          <Text style={{ color: "#fff" }}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ padding: 10, backgroundColor: "#FF6347", borderRadius: 5 }}
          onPress={props.onDecline}
        >
          <Text style={{ color: "#fff" }}>Decline</Text>
        </TouchableOpacity>
      </View>
    </View>
  ),
  info: ({ text1, text2 }: { text1: string; text2: string }) => (
    <View style={{ padding: 15, backgroundColor: "#f0f0f0", borderRadius: 10 }}>
      <Text style={{ fontWeight: "bold" }}>{text1}</Text>
      <Text>{text2}</Text>
    </View>
  ),
};
