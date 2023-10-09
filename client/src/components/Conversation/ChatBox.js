import React, { useEffect, useRef, useState} from 'react';
import { getAdmin } from '../../api/ChatRequest';
import { getMessages, addMessage, getAdminFirst, createChat } from '../../api/ChatRequest';
import { format } from 'timeago.js';
import InputEmoji from 'react-input-emoji';
import { useDispatch, useSelector } from "react-redux";
import './ChatBox.css';

const REACT_APP_PUBLIC_FOLDER =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTskehyk9AJiwtau3OKZKzbAIsVyn8-2mc38W8qiaU&s';

const ChatBox = ({ chat, currentUser, setSendMessage, receivedMessage }) => {
  const user = useSelector(state => state.userr)
  const [adminData, setAdminData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [adminid, setAdminID]=useState();
  const [create, setCreate]=useState([])
  const user_id =user.user.UserDoc._id
  const scroll= useRef()

  
  // Fetch admin data (assuming getAdmin returns admin details)
  useEffect(() => {
    const adminId = chat?.members?.find((id) => id !== currentUser);
     console.log('adminIdchatBOx',adminId)
    const fetchAdminData = async () => {
      try {
        const { data } = await getAdmin(adminId);
        setAdminData(data);
        console.log('dataaa',data)
      } catch (error) {
        console.log(error);
      }
    };

    if (chat !== null) {
      fetchAdminData();
    }
  }, [chat, currentUser]);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await getMessages(chat._id);
        setMessages(data);
        console.log('datamessage',data)
      } catch (error) {
        console.log(error);
      }
    };

    if (chat !== null) {
      fetchMessages();
    }
  }, [chat]);

  const handleChange = (newMessage) => {
    setNewMessage(newMessage);
  };

  //create first message
 // Fetch admin ID
useEffect(() => {
  const fetchAdminId = async () => {
    try {
      const response = await getAdminFirst();
      const { adminId } = response.data; // Extract adminId from response.data
      setAdminID(adminId);
      console.log('adminId', adminId);
    } catch (error) {
      console.log('error', error);
    }
  };

  fetchAdminId(); // Call the function to initiate the API request
}, []);


  const FirstChat = async () => {
    const chatData = {
      user_id: user_id,
      adminid: adminid, // Make sure `adminid` is defined somewhere in your component
      // Other properties you want to include in the chat data
    };
       console.log('chatData',chatData)
    try {
      const data = await createChat(chatData);
      console.log('createdata', data);
    } catch (error) {
      console.log('error', error);
    }
  };
  

  // Always scroll to last Message
  useEffect(()=> {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  },[messages])

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
          <div className="chat-header">
            <div className="follower">
              <div>
                <img
                  src={
                    adminData?.profilePicture
                      ? REACT_APP_PUBLIC_FOLDER + adminData.profilePicture
                      : REACT_APP_PUBLIC_FOLDER + 'defaultProfile.png'
                  }
                  alt="Profile"
                  className="followerImage"
                  style={{ width: '50px', height: '50px' }}
                />
                <div className="name" style={{ fontSize: '0.9rem' }}>
                  <span>{adminData?.name}</span>
                </div>
              </div>
            </div>
            <hr
              style={{
                width: '95%',
                border: '0.1px solid #ececec',
                marginTop: '20px',
              }}
            />
          </div>

          {/* chat-body */}
          <div className="chat-body">
            {messages.map((message) => (
              <div  ref={scroll}
                key={message._id} // Don't forget to add a unique key when mapping elements
                className={
                  message.senderId === currentUser ? 'message own' : 'message'
                }
              >
                <span>{message.text}</span>
                <span>{format(message.createdAt)}</span>
              </div>
            ))}
          </div>
          {/* chat-sender */}
          <div className="chat-sender">
            <div>+</div>
            <InputEmoji value={newMessage} onChange={handleChange} />
            <div className="send-button button" onClick={handleSend}>
              Send
            </div>
          </div>
        </>
      ) : (
        <>
        <span className="chatbox-empty-message">
          Tap on a chat to start a conversation...
        </span>
        <span>
        <button onClick={FirstChat} >NewChat</button>
        </span>
        </>
        
      )}
    </div>
  );
};

export default ChatBox;
