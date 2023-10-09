import React, { useEffect, useRef, useState } from 'react';
import { getUser, getMessages, addMessage } from '../../api/ChatRequest';
import { format } from 'timeago.js';
import InputEmoji from 'react-input-emoji';
import './AdminChatBox.css'
const REACT_APP_PUBLIC_FOLDER = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTskehyk9AJiwtau3OKZKzbAIsVyn8-2mc38W8qiaU&s';



const AdminChatBox = ({ chat, currentUser, setSendMessage, receivedMessage }) => {
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const scroll = useRef();


  
  // Fetching data for header
  useEffect(() => {
    const userId = chat?.members?.find((id) => id !== currentUser);
    const getUserData = async () => {
      try {
        const { data } = await getUser(userId);
        setUserData(data);
      } catch (error) {
        console.log(error);
      }
    };

    if (chat !== null) getUserData();
  }, [chat, currentUser]);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await getMessages(chat._id);
        setMessages(data);
      } catch (error) {
        console.log(error);
      }
    };

    if (chat !== null) {
      fetchMessages();
    }
  }, [chat]);

  // Always scroll to the last Message
  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleChange = (newMessage) => {
    setNewMessage(newMessage);
  };

  // Send Message
  const handleSend = async (e) => {
    e.preventDefault();
    const message = {
      senderId: currentUser,
      text: newMessage,
      chatId: chat._id,
    };
    const receiverId = chat.members.find((id) => id !== currentUser);
    // Send message to socket server
    setSendMessage({ ...message, receiverId });
    // Send message to database
    try {
      const { data } = await addMessage(message);
      setMessages([...messages, data]);
      setNewMessage('');
    } catch {
      console.log('error');
    }
  };

  useEffect(() => {
    if (receivedMessage !== null && receivedMessage.chatId === chat._id) {
      setMessages([...messages, receivedMessage]);
    }
  }, [receivedMessage]);

  return (
    <div className="ChatBox-container">
      {chat ? (
        <>
          <div className="chat-headerr">
            <div className="follower">
              <div>
                <img
                  src={
                    userData?.profilePicture
                      ? REACT_APP_PUBLIC_FOLDER + userData.profilePicture
                      : REACT_APP_PUBLIC_FOLDER + 'defaultProfile.png'
                  }
                  alt="Profile"
                  className="followerImage"
                  style={{ width: '50px', height: '50px' }}
                />
                <div className="name" style={{ fontSize: '0.8rem' }}>
                  <span>
                    {userData?.firstname} {userData?.lastname}
                  </span>
                </div>
              </div>
            </div>
            <hr style={{ width: '85%', border: '0.1px solid #ececec' }} />
          </div>

          {/* chat-body */}
          <div className="chat-body">
            {messages.map((message) => (
              <div
                key={message._id}
                ref={scroll} // Wrap each message in a <div> or another suitable container
                className={message.senderId === currentUser ? 'message own' : 'message'}
              >
                <span>{message.text}</span> <span>{format(message.createdAt)}</span>
              </div>
            ))}
          </div>

          {/* chat-sender */}
          <div className="chat-sender">
          <div style={{ color: 'black' }}>+</div>
          <InputEmoji value={newMessage} onChange={handleChange} />
          <div className="send-button button" style={{ color: 'black' }} onClick={handleSend}>
            Send
          </div>
        </div>
        
        </>
      ) : (
        <span className="chatbox-empty-message">Tap on a chat to start a conversation...</span>
      )}
    </div>
  );
};

export default AdminChatBox;
