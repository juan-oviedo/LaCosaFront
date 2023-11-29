import { useEffect, useState, useRef } from "react";

const useWebSocketManager = ({ handleWebSocketMessage, recoverLastMessage, gameID, userID }) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    const newSocketRef = useRef(null);

    // Function to send a message via the WebSocket connection
    // const sendMessage = (message) => {
    //     if (newSocket && newSocket.readyState === WebSocket.OPEN) {
    //         newSocket.send(JSON.stringify(message));
    //     }
    // };

    useEffect(() => {
        const connectWebSocket = () => {
            if (!isConnected) {
                console.log('Creating new WebSocket connection...');
                newSocketRef.current = new WebSocket(`wss://lacosa.adaptable.app/ws/${gameID}/${userID}`);

                newSocketRef.current.onopen = () => {
                    console.log('WebSocket connection opened. Game ID:', gameID, 'User ID:', userID);
                    setIsConnected(true);
                    setSocket(newSocketRef.current);
                    // Recover last message
                };

                newSocketRef.current.onmessage = handleWebSocketMessage;

                newSocketRef.current.onerror = (error) => {
                    console.error('WebSocket Error:', error);
                };

                newSocketRef.current.onclose = (event) => {
                    console.log('WebSocket Closed:', event);
                    setIsConnected(false);
                    // Try to reconnect in 1 second
                    setTimeout(() => {
                        connectWebSocket();
                    }, 1000);

                };
            }
        }

        if (!isConnected) {
            connectWebSocket();
        }

        return () => {
            console.log('Cleaning up WebSocket connection...');
            if (newSocketRef.current && newSocketRef.current.readyState === WebSocket.OPEN) {
                newSocketRef.current.close();
                setIsConnected(false);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameID, userID]);

    return socket;
};

export default useWebSocketManager;
