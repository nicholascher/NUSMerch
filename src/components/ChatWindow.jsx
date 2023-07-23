import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db, auth } from "../../firebase/firebase";
import {
  collection,
  addDoc,
  where,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  getDoc,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "./Navbar";
import ProfileDefault from "../../Images/Profile Default.png";
import { message } from "antd";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import { storage } from "../../firebase/firebase";

function ChatWindow() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [profilePictures, setProfilePictures] = useState({});
  const [otherUserData, setOtherUserData] = useState(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setEmail(user.email);
        const userRef = doc(db, "Profile", user.email);
        const userSnapshot = await getDoc(userRef);
        const userData = userSnapshot.data();
        const userName = userData.name;
        setName(userName);
      } else {
        message.error("Not Logged in");
      }
    });

    unsubscribe();
  }, []);

  const handleChatClick = async (chatId) => {
    setSelectedChatId(chatId);

    const roomRef = doc(db, "Rooms", chatId);
    const msgRef = collection(db, "Rooms", chatId, "Messages");
    const queryMessages = query(msgRef, orderBy("createdAt"));

    const roomSnapshot = await getDoc(roomRef);
    if (roomSnapshot.exists()) {
      const roomData = roomSnapshot.data();
      const unread = roomData.unread || {};
      unread[email] = 0;

      await updateDoc(roomRef, {
        unread: unread,
      });
    }

    onSnapshot(queryMessages, (snapshot) => {
      let messages = [];
      snapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      setMessages(messages);
    });
  };

  useEffect(() => {
    const chatsRef = collection(db, "Rooms");
    const queryChats = query(
      chatsRef,
      where("participants", "array-contains", email)
    );

    const unsubscribe = onSnapshot(queryChats, (snapshot) => {
      let chatList = [];
      snapshot.forEach((doc) => {
        const chatData = { id: doc.id, ...doc.data() };
        chatList.push(chatData);
      });
      setChats(chatList);
    });

    return unsubscribe;
  }, [email]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (newMessage === "") return;

    const currentUser = auth.currentUser;

    if (currentUser) {
      const userRef = doc(db, "Profile", currentUser.email);
      const userSnapshot = await getDoc(userRef);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        const userName = userData.name;

        await addDoc(messageRef, {
          text: newMessage,
          createdAt: serverTimestamp(),
          user: userName,
        });
      }
      const chat = chats.find((chat) => chat.id === selectedChatId);
      const otherUserEmail = chat.participants.find(
        (participant) => participant !== email
      );
      const roomRef = doc(db, "Rooms", selectedChatId);
      const roomSnapshot = await getDoc(roomRef);
      if (roomSnapshot.exists()) {
        const roomData = roomSnapshot.data();
        const unread = roomData.unread || {};
        unread[email] = 0;
        unread[otherUserEmail] = (unread[otherUserEmail] || 0) + 1;

        await updateDoc(roomRef, {
          unread: unread,
        });
      }
    }

    setNewMessage("");
  };

  const messageRef = selectedChatId
    ? collection(db, "Rooms", selectedChatId, "Messages")
    : null;

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (selectedChatId) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatId]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "Profile"),
      async (snapshot) => {
        let profiles = {};
        snapshot.forEach((doc) => {
          const email = doc.id;
          const profilePic = doc.data().profilePic;
          profiles[email] = profilePic;
        });

        const downloadURLs = await Promise.all(
          Object.values(profiles).map(async (profilePic) => {
            if (profilePic) {
              const storageRef = ref(storage, profilePic);
              return getDownloadURL(storageRef);
            }
            return ProfileDefault;
          })
        );

        const updatedProfilePictures = {};
        Object.keys(profiles).forEach((key, index) => {
          updatedProfilePictures[key] = downloadURLs[index];
        });

        setProfilePictures(updatedProfilePictures);
      }
    );

    return unsubscribe;
  }, [email]);

  useEffect(() => {
    if (selectedChatId) {
      const chat = chats.find((chat) => chat.id === selectedChatId);
      const otherUserEmail = chat.participants.find(
        (participant) => participant !== email
      );

      const otherUser = {
        username: chat.username[chat.participants.indexOf(otherUserEmail)],
        profilePic: profilePictures[otherUserEmail],
      };

      setOtherUserData(otherUser);
    }
  }, [selectedChatId, chats, email, profilePictures]);

  const renderMessage = (message) => {
    const isUserMessage = message.user === name;
    const messageClass = isUserMessage ? "user-message" : "other-message";
    const alignClass = isUserMessage ? "message-right" : "message-left";

    return (
      <div key={message.id} className={`message ${messageClass} ${alignClass}`}>
        {message.text}
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="chat-app">
        <div className="chat-list-container">
          <div className="chat-list">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`chat-item ${
                  chat.id === selectedChatId ? "active" : ""
                }`}
                onClick={() =>
                  handleChatClick(
                    `${chat.participants[0]}_${chat.participants[1]}`
                  )
                }
              >
                {chat.participants[0] !== email && (
                  <div className="chat-pic-container">
                    <img
                      src={profilePictures[chat.participants[0]]}
                      className="chat-pic"
                    />
                    {chat.unread && chat.unread[email] > 0 && (
                      <div className="unread-count">{chat.unread[email]}</div>
                    )}
                  </div>
                )}

                {chat.participants[1] !== email && (
                  <div className="chat-pic-container">
                    <img
                      src={profilePictures[chat.participants[1]]}
                      className="chat-pic"
                    />
                    {chat.unread && chat.unread[email] > 0 && (
                      <div className="unread-count">{chat.unread[email]}</div>
                    )}
                  </div>
                )}
                <span className="chat-name">
                  {chat.participants[0] === email
                    ? chat.username[1]
                    : chat.username[0]}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="chatbox-container">
          <div>
            {otherUserData && (
              <>
                <img
                  src={otherUserData.profilePic}
                  alt="Other user"
                  className="chat-pic"
                />
                <span className="other-user-name">
                  {otherUserData.username}
                </span>
              </>
            )}
          </div>
          <div className="messages">
            {messages.map((message) => renderMessage(message))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSubmit} className="new-message-form">
            <input
              type="text"
              value={newMessage}
              onChange={(event) => setNewMessage(event.target.value)}
              className="new-message-input"
              placeholder="Type your message here..."
            />
            <button type="submit" className="send-button">
              Send
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default ChatWindow;
