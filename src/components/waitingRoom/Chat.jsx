import React, { useState, useEffect } from "react";
import axios from "axios";

function Chat({gameID, userID, wsMsg}) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [lastmsg, setLastmsg] = useState(1);

  // useEffect(() => {
  //   const fetchMessages = async () => {
  //     try {
  //       const response = await axios.get(`https://lacosa.adaptable.app/chat/get_messages/${gameID}`);
  //       setMessages(response.data);
  //       setLastmsg(response.data.length);
  //     } catch (error) {
  //       console.error("Error fetching messages:", error);
  //     }
  //   };

  //   // Fetch messages initially
  //   fetchMessages();

  //   // Set up an interval to fetch messages every 10 seconds
  //   const intervalId = setInterval(fetchMessages, 10000);

  //   // Clean up the interval when the component unmounts
  //   return () => clearInterval(intervalId);
  // }, []);

  const fetchNewMessage = async () => {
    try {
      const response = await axios.get(`https://lacosa.adaptable.app/chat/get_messages_from/${gameID}/${lastmsg}`);
      setMessages(response.data);
      setLastmsg(1);
      console.log(lastmsg);
    } catch (error) { 
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    console.log(lastmsg);
    console.log(wsMsg);
    fetchNewMessage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wsMsg]);

  const handleInputChange = (event) => {
    setNewMessage(event.target.value);
  };

    const handleSubmit = () => {
    if (newMessage.trim() === "") { 
      return;
    } else {
      sendMessage();  
    }
    console.log(newMessage);
    setNewMessage("");
  };

  const sendMessage = async () => {
    const url = "https://lacosa.adaptable.app/chat/send_message";

    try {
      const response = await axios.post(url, {
        game_id: gameID,
        player_id: userID,
        text: newMessage,
      });

      if (response.status === 200) {
        console.log("Message sent");
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div>
    <h3 className="chat-title">
      CHAT
    </h3>
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div
          key={`${message.id}_${index}`} // Using a combination of message.id and index
          className={`message ${message.player_id === userID ? userID : "other"}`}
          >
            <span className="message-sender">{message.player_name}:</span> {message.text}
          </div>
        ))}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="chat-form">
        <input
          type="text"
          placeholder="Enter message..."
          value={newMessage}
          onChange={handleInputChange}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Chat;