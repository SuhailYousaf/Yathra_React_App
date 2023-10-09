import React, {useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminFirst, adminChats } from '../../../api/ChatRequest';
import AdminChatBox from '../../../components/Conversation/AdminChatBox';
import AdminConver from '../../../components/Conversation/AdminConver';
import { io } from "socket.io-client";

const ChatAdmin = () => {
  const socket = useRef();
  const {error, admin } = useSelector((state) => state.admin);

  const [adminId, setAdminId] = useState(null);
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [sendMessage, setSendMessage] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState(null);


  //fetching admin
  useEffect(() => {
    const fetchAdminId = async () => {
      try {
        const response = await getAdminFirst();
        const { adminId } = response.data; // Extract adminId from response.data
        setAdminId(adminId);
        console.log('adminIddddd', adminId);
      } catch (error) {

        console.log('error', error);
      }
    };

    fetchAdminId(); // Call the function to initiate the API request
  }, []);

const adminid =admin.adminDoc._id
  
  useEffect(() => {
    socket.current = io("//localhost:4000");
    socket.current.emit("new-user-add", adminid);
    socket.current.on("get-users", (adminid) => {
      setOnlineUsers(adminid);
      console.log("onlineUserssssadmin",onlineUsers)
    });
  }, [admin]);

  console.log('onlineUsersadmin',onlineUsers)

  // Send Message to socket server
  useEffect(() => {
    if (sendMessage!==null) {
      socket.current.emit("send-message", sendMessage);}
  }, [sendMessage]);

  // Get the message from socket server
  useEffect(() => {
    socket.current.on("recieve-message", (data) => {
      console.log(data)
      setReceivedMessage(data);
    }
    );
  }, []);

  
  useEffect(() => {
    const getChats = async () => {
      try {
        if (adminId) {
         
          const { data } = await adminChats(adminId);
          setChats(data);
          console.log('admindattaaa', data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getChats();
  }, [adminId]);

  const checkOnlineStatus = (chat) => {
    if(admin){
      return true
    }else{
      return false
    }
  };

  return (
    <div className="Chat">
      {/* Left Side */}
      <div className="Left-side-chat">
        <div className="Chat-container">
          <h2>Chats</h2>
          <div className="Chat-list">
          {chats.map((chat) => (
            <div
              onClick={() => {
                setCurrentChat(chat);
              }}
            >
              <AdminConver
                data={chat}
                currentUser={adminId}
                online={checkOnlineStatus(chat)}
              />
            </div>
          ))}

          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="Right-side-chat">
        <div style={{ width: '20rem', alignSelf: 'flex-end' }}>
        </div>
        <AdminChatBox
          chat={currentChat}
          currentUser={adminId}
          setSendMessage={setSendMessage}
          receivedMessage={receivedMessage}
        />
      </div>
    </div>
  );
};

export default ChatAdmin;
