import { useEffect, useState } from "react";

const webSocketManager = ({ handleWebSocketMessage, recoverLastMessage, gameID, userID }) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);


    let newSocket = null;

    // Function to send a message via the WebSocket connection
    const sendMessage = (message) => {
        if (newSocket && newSocket.readyState === WebSocket.OPEN) {
            newSocket.send(JSON.stringify(message));
        }
    };

    useEffect(() => {
        const connectWebSocket = () => {
            if (!isConnected) {
                console.log('Creating new WebSocket connection...');
                newSocket = new WebSocket(`ws://localhost:8000/ws/${gameID}/${userID}`);

                newSocket.onopen = () => {
                    console.log('WebSocket connection opened. Game ID:', gameID, 'User ID:', userID);
                    setIsConnected(true);
                    setSocket(newSocket);
                    // Recover last message
                };

                newSocket.onmessage = handleWebSocketMessage;

                newSocket.onerror = (error) => {
                    console.error('WebSocket Error:', error);
                };

                newSocket.onclose = (event) => {
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
            if (newSocket && newSocket.readyState === WebSocket.OPEN) {
                newSocket.close();
                setIsConnected(false);
            }
        };
    }, [gameID, userID]);


    return socket;
};

export default webSocketManager;
