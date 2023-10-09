import React, { useRef, useState, useEffect } from "react";
import ChatBox from "../../components/Conversation/ChatBox";
import Conversation from "../../components/Conversation/Conversation";
import { createChat, getAdminFirst, userChats } from "../../api/ChatRequest";
import "./Chat.css";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

const Chat = () => {
  const user = useSelector((state) => state.userr);
  const { error, admin } = useSelector((state) => state.admin);
  const [chats, setChats] = useState([]);
  const [adminid, setAdminID] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [sendMessage, setSendMessage] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState(null);
  const socket = useRef();

  const user_id = user.user.UserDoc._id;

  // Fetch admin ID when the component mounts
  useEffect(() => {
    const fetchAdminId = async () => {
      try {
        const response = await getAdminFirst();
        const { adminId } = response.data;
        setAdminID(adminId);
      } catch (error) {
        console.error("Error fetching admin ID:", error);
      }
    };

    fetchAdminId();
  }, []);

  // Connect to Socket.io when the user ID changes
  useEffect(() => {
    socket.current = io("//localhost:4000");
    socket.current.emit("new-user-add", user_id);
    socket.current.on("get-users", (users) => {
      setOnlineUsers(users);
    });
  }, [user_id]);

  // Listen for received messages from the socket server
  useEffect(() => {
    socket.current.on("recieve-message", (data) => {
      setReceivedMessage(data);
    });
  }, []);

  // Send a message to the socket server when `sendMessage` changes
  useEffect(() => {
    if (sendMessage !== null) {
      socket.current.emit("send-message", sendMessage);
    }
  }, [sendMessage]);

  // Fetch user chats when the component mounts and when `user_id` changes
  useEffect(() => {
    const getChats = async () => {
      try {
        const { data } = await userChats(user_id);
        setChats(data);
      } catch (error) {
        console.error("Error fetching user chats:", error);
      }
    };

    getChats();
  }, [user_id]);

  const getChats = async () => {
    try {
      const { data } = await userChats(user_id);
      setChats(data);
    } catch (error) {
      console.error("Error fetching user chats:", error);
    }
  };


  // Function to create a new chat
  const createNewChat = async () => {
    const chatData = {
      user_id: user_id,
      adminid: adminid,
      // Other properties you want to include in the chat data
    };

    try {
      const data = await createChat(chatData);
      // After creating a new chat, fetch the updated list of chats
      getChats();
    } catch (error) {
      console.error("Error creating a new chat:", error);
    }
  };

  // Function to check if a chat is online
  const isChatOnline = (chat) => {
    return admin ? true : false;
  };

  return (
    <div className="Chat">
      {/* Left Side */}
      <div className="Left-side-chat">
        <div className="Chat-container">
          <h2 className="chatName">Chats</h2>
          <div className="Chat-list">
            {chats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => {
                  setCurrentChat(chat);
                }}
              >
                <Conversation
                  data={chat}
                  currentUser={user_id}
                  online={isChatOnline(chat)}
                />
              </div>
            ))}

            {chats.length === 0 && (
              <span>
                <button onClick={createNewChat}>New Chat</button>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="Right-side-chat">
        <div style={{ width: "20rem", alignSelf: "flex-end" }}></div>
        <ChatBox
          chat={currentChat}
          currentUser={user_id}
          setSendMessage={setSendMessage}
          receivedMessage={receivedMessage}
        />
      </div>
    </div>
  );
};

export default Chat;
