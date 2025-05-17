// notificationHandler.js
import { notifyFriendRequest, notifyEvent } from "@/services/notification";
import { receiveMessage } from "@/redux/slices/messagingSlice";

export const handleNotification = (notification, dispatch, setFriend, setUsers2, username) => {
  switch (notification.type) {
    case "friend_request":
      notifyFriendRequest(dispatch, username, [notification]);
      break;
    case "msg":
      dispatch(
        receiveMessage({
          id: notification.messageId,
          conversationId: notification.conversationId,
          senderUsername: notification.senderUsername,
          text: notification.text,
          timestamp: notification.timestamp,
        })
      );
      notifyEvent(dispatch, notification.username, [notification]);
      break;
    case "relationship_update":
      console.log("New friend relationship update:", notification);
      setFriend(notification.username);
      break;
    case "userGeoLocated":
      console.log("User geolocated:", notification.data);
      setUsers2(notification.data);
      break;
    default:
      console.warn(`Unhandled notification type: ${notification.type}`);
  }
};
