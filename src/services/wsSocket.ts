import { useRef, useEffect, useState } from 'react';
import { notifyFriendRequest } from "@/services/notification";
import { useSelector, useDispatch } from 'react-redux';

export const useWebSocket = (url, username, maxRetryLimit = 5) => {
  const ws = useRef(null);
  const reconnectTimeout = useRef(null);
  const heartbeatInterval = useRef(null);
  const connectionTimeout = useRef(null);
  const dispatch = useDispatch();

  const [isConnected, setIsConnected] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const connectWebSocket = () => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      console.log("Attempting to connect to WebSocket...");

      ws.current = new WebSocket(`${url}?username=${username}`);

      connectionTimeout.current = setTimeout(() => {
        if (ws.current && ws.current.readyState !== WebSocket.OPEN) {
          console.warn("Connection timeout reached, closing WebSocket.");
          ws.current.close();
        }
      }, 10000);

      ws.current.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
        setRetryCount(0);

        clearTimeout(connectionTimeout.current);

        heartbeatInterval.current = setInterval(() => {
          if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({ type: "heartbeat" }));
          } else {
            console.warn("Cannot send heartbeat, WebSocket is not connected.");
          }
        }, 15000);
      };

      ws.current.onmessage = (event) => {
        console.log("WebSocket message received:", event.data);
         const receivedData = JSON.parse(event.data);
          if (receivedData.notification) {
            notifyFriendRequest(dispatch, username,[receivedData.notification]);
          }
      };

      ws.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      ws.current.onclose = (event) => {
        console.log(`WebSocket closed: Code ${event.code}, Reason: ${event.reason}`);
        setIsConnected(false);
        clearInterval(heartbeatInterval.current);
        clearTimeout(connectionTimeout.current);

        if (retryCount < maxRetryLimit) {
          const retryDelay = Math.min(1000 * Math.pow(2, retryCount), 30000);
          console.log(`Reconnecting in ${retryDelay / 1000} seconds... (Attempt ${retryCount + 1})`);
          reconnectTimeout.current = setTimeout(() => {
            setRetryCount((prev) => prev + 1);
            connectWebSocket();
          }, retryDelay);
        } else {
          console.error("Max reconnection attempts reached. Giving up.");
        }
      };
    }
  };

  const closeWebSocket = () => {
    if (ws.current) {
      ws.current.close();
      ws.current = null;
      setIsConnected(false);
    }
    clearTimeout(reconnectTimeout.current);
    clearInterval(heartbeatInterval.current);
    clearTimeout(connectionTimeout.current);
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      console.log("Cleaning up WebSocket resources...");
      closeWebSocket();
    };
  }, [url, username]);

  return { isConnected, closeWebSocket };
};
