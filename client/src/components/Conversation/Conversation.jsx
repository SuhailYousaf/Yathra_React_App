import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { getAdmin } from "../../api/ChatRequest";

const REACT_APP_PUBLIC_FOLDER = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTskehyk9AJiwtau3OKZKzbAIsVyn8-2mc38W8qiaU&s";

const Conversation = ({ data, currentUser, online }) => {
  const [adminData, setAdminData] = useState(null); // Changed variable name to camelCase
  const dispatch = useDispatch();

  useEffect(() => {
    const adminId = data.members.find((id) => id !== currentUser); // Changed variable name to camelCase
    console.log('adminIdddddd',adminId)
    const getAdminData = async () => {
      try {
        const {data} = await getAdmin(adminId); // Changed variabl name to camelCase
        // const { data: admin } = response; 
        setAdminData(data);
        console.log('data',data)
        dispatch({type:"SAVE_USER", data:data})
        
      } catch (error) {
        console.log(error);
      }
    };

    getAdminData();
  }, [currentUser]); // Added currentUser as a dependency for useEffect

  return (
    <>
      <div className="follower conversation">
    
        <div>
          {online && <div className="online-dot"></div>}
          <img
            src={adminData?.profilePicture ? REACT_APP_PUBLIC_FOLDER + adminData.profilePicture : REACT_APP_PUBLIC_FOLDER + "defaultProfile.png"}
            alt="Profile"
            className="followerImage"
            style={{ width: "50px", height: "50px" }}
          />
          <div className="name" style={{ fontSize: '0.8rem' }}>
            <span> {adminData?.name} {adminData?.lastname}</span>
            <span style={{ color: online ? "#51e200" : "" }}>{online ? "Online" : "Offline"}</span>
          </div>
        </div>
      </div>
      <hr style={{ width: "85%", border: "0.1px solid #ececec" }} />
    </>
  );
};

export default Conversation;
