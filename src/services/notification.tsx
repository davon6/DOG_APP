import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import Toast from "react-native-toast-message";
import { Dispatch } from "redux";
import notificationTemplates from './notifications.json';
import { updateNotificationResponse } from '@/redux/slices/notificationsSlice';
import { useMessagePopup } from '@/services';
import { startConversation } from '@/redux/slices/messagingSlice';



// TypeScript Interfaces
interface Notification {
  id: string;
  type: string;
  isRead: boolean;
  relatedUsername: string;
  text?: string; // Optional for msg type
}

interface ToastProps {
  sender: string;
  onAccept?: () => void; // Optional, not used for msg type
  onDecline?: () => void; // Optional, not used for msg type
  onClick?: () => void; // Optional for msg click handling
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

  let newText =
    response === "accept"
      ? notificationTemplates.friend_accepted.replace('{demanding_user}', notification.relatedUsername)
      : notificationTemplates.friend_declined.replace('{demanding_user}', notification.relatedUsername);

  // Dispatch action (example: update state for friend requests)
  /*dispatch({
    type: 'UPDATE_NOTIFICATION_RESPONSE',
    payload: {
      notificationId: notification.id,
      response,
      newText,
      username,
      relatedUsername: notification.relatedUsername,
    },
  });*/
  console.log('dispatch(updateNotificationResponse({'+notification.id, response, newText, username,notification.relatedUsername );

   dispatch(updateNotificationResponse({ notificationId: notification.id, response, newText, username,  relatedUsername: notification.relatedUsername }));
  Toast.hide(); // Hide the toast
};

// Notify Friend Request
export const notifyFriendRequest = (
  dispatch: Dispatch,
  username: string,
  notifications: Notification[]
) => {
  console.log("Friend request notifications:", notifications);

  const unreadFriendRequests = Array.isArray(notifications)
    ? notifications.filter(
        (notification) => !notification.isRead && notification.type === "friend_request"
      )
    : [];

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
        onAccept: () =>
          handleFriendRequestResponse(dispatch, notification, "accept", username),
        onDecline: () =>
          handleFriendRequestResponse(dispatch, notification, "decline", username),
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

// Notify Event (for messages or other notification types)
export const notifyEvent = (
  dispatch: Dispatch,
  username: string,
  notifications: Notification[]
) => {
  console.log("General event notifications:", notifications);

  const messageNotifications = Array.isArray(notifications)
    ? notifications.filter(
        (notification) => !notification.isRead && notification.type === "msg"
      )
    : [];

  messageNotifications.forEach((notification) => {
    Toast.show({
      type: "custom_message",
      position: "top",
      text1: `New Message from ${notification.senderUsername}`,
      text2: `${notification.text}`,
      props: {
        sender: notification.relatedUsername,
        onClick: async () => {
             const conversationId = await dispatch(startConversation(username, user.username));

              console.log('Opening message popup...');
              showMessagePopup({
                senderUsername: username,
                receiverUsername: user.username,
                conversationId :conversationId,
                onClose: () => {
                  console.log('Message popup closed');
                },
              });
        },
      },
      autoHide: true,
      visibilityTime: 4000,
    });
  });
};

// Toast Config
export const toastConfig = {
  custom_friend_request: ({
    text1,
    text2,
    props,
  }: {
    text1: string;
    text2: string;
    props: ToastProps;
  }) => (
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
  custom_message: ({
    text1,
    text2,
    props,
  }: {
    text1: string;
    text2: string;
    props: ToastProps;
  }) => (
    <TouchableOpacity
      onPress={props.onClick}
      style={{ padding: 15, backgroundColor: "#f0f0f0", borderRadius: 10 }}
    >
      <Text style={{ fontWeight: "bold" }}>{text1}</Text>
      <Text>{text2}</Text>
    </TouchableOpacity>
  ),
  info: ({ text1, text2 }: { text1: string; text2: string }) => (
    <View style={{ padding: 15, backgroundColor: "#f0f0f0", borderRadius: 10 }}>
      <Text style={{ fontWeight: "bold" }}>{text1}</Text>
      <Text>{text2}</Text>
    </View>
  ),
};
