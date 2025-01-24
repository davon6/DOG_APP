import { useRef, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { handleNotification } from "./notificationWebsocket";

export const useWebSocket = (url, username, location, radius, maxRetryLimit = 5) => {
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
  const heartbeatInterval = useRef<NodeJS.Timeout | null>(null);
  const connectionTimeout = useRef<NodeJS.Timeout | null>(null);
  const logoutFlag = useRef(false);
  const dispatch = useDispatch();

  const [isConnected, setIsConnected] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [friend, setFriend] = useState(null);
  const [users2, setUsers2] = useState(null);

  const connectWebSocket = () => {
    if (logoutFlag.current || (ws.current && ws.current.readyState === WebSocket.OPEN)) {
      return;
    }

    ws.current = new WebSocket(`${url}?username=${username}`);
    console.log("Attempting WebSocket connection...");

    // Timeout to close WebSocket if it doesn't open in time
    connectionTimeout.current = setTimeout(() => {
      if (ws.current && ws.current.readyState !== WebSocket.OPEN) {
        console.warn("WebSocket connection timeout, closing.");
        ws.current.close();
      }
    }, 10000);

    ws.current.onopen = () => {
      console.log("WebSocket connected.");
      clearTimeout(connectionTimeout.current);
      setIsConnected(true);
      setRetryCount(0);

      // Heartbeat
      heartbeatInterval.current = setInterval(() => {
        if (ws.current?.readyState === WebSocket.OPEN) {
          ws.current.send(JSON.stringify({ type: "heartbeat" }));
        }
      }, 15000);
    };

    ws.current.onmessage = (event) => {
      const receivedData = JSON.parse(event.data);
      if (receivedData.notification) {
        handleNotification(receivedData.notification, dispatch, setFriend, setUsers2);
      }
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.current.onclose = () => {
      console.log("WebSocket closed.");
      setIsConnected(false);
      clearInterval(heartbeatInterval.current);

      if (!logoutFlag.current && retryCount < maxRetryLimit) {
        const retryDelay = Math.min(1000 * Math.pow(2, retryCount), 30000); // Exponential backoff
        console.log(`Reconnecting in ${retryDelay / 1000}s (Attempt ${retryCount + 1})`);
        reconnectTimeout.current = setTimeout(() => {
          setRetryCount((prev) => prev + 1);
          connectWebSocket();
        }, retryDelay);
      }
    };
  };

  const closeWebSocket = () => {
    logoutFlag.current = true;
    console.log("Closing WebSocket...");
    clearInterval(heartbeatInterval.current);
    clearTimeout(connectionTimeout.current);
    clearTimeout(reconnectTimeout.current);

    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
    setIsConnected(false);
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      console.log("Cleaning up WebSocket...");
      closeWebSocket();
    };
  }, [url, username]);

  useEffect(() => {
    if (location && ws.current?.readyState === WebSocket.OPEN) {
      const locationUpdate = {
        type: "updateLocation",
        username,
        lat: location.latitude,
        long: location.longitude,
        radius,
      };
      ws.current.send(JSON.stringify(locationUpdate));
    }
  }, [location]);

  return { isConnected, closeWebSocket, friend, users2 };
};
