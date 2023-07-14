import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

function ChatWindow() {
  const location = useLocation();
  const seller = location.state;
  const [email, setEmail] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [name, setName] = useState("");
  const [selectedChatId, setSelectedChatId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmail(user.email);
      } else {
        alert("Not Logged in");
      }
    });

    const fetchName = async () => {
      const ref = doc(db, "Profile", email);
      const docRef = await getDoc(ref);
      const docData = docRef.data();
      setName(docData.name);
    };

    unsubscribe();
    fetchName();
  }, []);

  const handleChatClick = (chatId) => {
    setSelectedChatId(chatId);

    const msgRef = collection(db, "Rooms", chatId, "Messages");
    const queryMessages = query(msgRef, orderBy("createdAt"));
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
    const queryChats = query(chatsRef, where("participants", "array-contains", email));

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

  return (
    <div className="chat-app">
      <div className="chat-list-container">
        <div className="chat-list">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className="chat-item"
              onClick={() =>
                handleChatClick(`${chat.participants[0]}_${chat.participants[1]}`)
              }
            >
              <span className="chat-name">
                {chat.participants[0] === email ? chat.username[1] : chat.username[0]}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="chatbox-container">
        <div className="messages">
          {messages.map((message) => (
            <div key={message.id} className="message">
              <span className="user">{message.user}:</span> {message.text}
            </div>
          ))}
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
  );
}

export default ChatWindow;
