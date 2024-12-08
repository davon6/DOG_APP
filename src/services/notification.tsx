import React from "react"; // Import React for JSX
import { View, Text, TouchableOpacity } from "react-native";
import Toast from "react-native-toast-message";

// Helper function to handle friend request responses
const handleFriendRequestResponse = (response: "accept" | "decline", sender: string) => {
  if (response === "accept") {
    console.log(`Friend request from ${sender} accepted!`);
    // Call an API or handle the logic for accepting the friend request
  } else {
    console.log(`Friend request from ${sender} declined.`);
    // Call an API or handle the logic for declining the friend request
  }
  Toast.hide();
};

// Function to trigger a custom toast notification for friend requests
export const notifyFriendRequest = (sender: string) => {
  Toast.show({
    type: "custom_friend_request",
    position: "top",
    text1: "New Friend Request",
    text2: `${sender} wants to connect with you!`,
    props: {
      sender, // Pass sender info
      onAccept: () => handleFriendRequestResponse("accept", sender),
      onDecline: () => handleFriendRequestResponse("decline", sender),
    },
   autoHide: false,  // Prevent auto hiding until the user releases
      visibilityTime: 0,  // Disable auto hide time for manual control
  });
};

// Configuration for custom toast layout
export const toastConfig = {
  custom_friend_request: ({ text1, text2, props }: any) => (
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
};
