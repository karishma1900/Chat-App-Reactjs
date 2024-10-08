import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import Logout from "./LogOut";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, receiveMessageRoute } from "../utils/APIRoutes";

export default function ChatContainer({ currentChat }) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const socket = useRef();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
    setUserData(storedUserData);
  }, []);

  useEffect(() => {
    if (userData) {
      socket.current = io("https://chat-app-backend-huiv.onrender.com/");

      socket.current.on("connect", () => {
        console.log("Connected to server");
      });

      socket.current.on("msg-receive", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });

      socket.current.emit("add-user", userData._id);

      return () => {
        socket.current.disconnect();
      };
    }
  }, [userData]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (currentChat && userData) {
        const response = await axios.post(receiveMessageRoute, {
          from: userData._id,
          to: currentChat._id,
        });
        setMessages(response.data);
      }
    };

    fetchMessages();
  }, [currentChat, userData]);

  const handleSendMsg = async (msg) => {
    if (currentChat && userData) {
      socket.current.emit("send-msg", {
        to: currentChat._id,
        from: userData._id,
        msg,
      });

      await axios.post(sendMessageRoute, {
        from: userData._id,
        to: currentChat._id,
        message: msg,
      });

      setMessages((prev) => [...prev, { fromSelf: true, message: msg }]);
    }
  };

  useEffect(() => {
    if (arrivalMessage) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!userData) {
    return <div>Please log in to continue.</div>; // Render a message if user data is not found
  }

  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          {currentChat ? (
            <>
              <div className="avatar">
                <img src={`data:image/svg+xml;base64,${currentChat.avatarImage}`} alt="" />
              </div>
              <div className="username">
                <h3>{currentChat.username}</h3>
              </div>
            </>
          ) : (
            <div>No chat selected</div>
          )}
        </div>
        <Logout />
      </div>
      <div className="chat-messages">
        {messages.map((message) => (
          <div ref={scrollRef} key={uuidv4()}>
            <div className={`message ${message.fromSelf ? "sended" : "recieved"}`}>
              <div className="content">
                <p>{message.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} />
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;

  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }

  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;

    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;

      .avatar {
        img {
          height: 3rem;
        }
      }

      .username {
        h3 {
          color: white;
        }
      }
    }
  }

  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;

    &::-webkit-scrollbar {
      width: 0.2rem;

      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }

    .message {
      display: flex;
      align-items: center;

      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;

        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }

    .sended {
      justify-content: flex-end;

      .content {
        background-color: #4f04ff21;
      }
    }

    .recieved {
      justify-content: flex-start;

      .content {
        background-color: #9900ff20;
      }
    }
  }
`;
