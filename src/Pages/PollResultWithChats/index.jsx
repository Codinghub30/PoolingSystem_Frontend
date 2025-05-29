import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../../api/apiConfig";
import { useNavigate } from "react-router-dom";
import "./styles.css"; // We'll add the new styles here too or you can keep in this file
import { io } from "socket.io-client";
import Chats from "../../components/Chats";

// const SOCKET_SERVER_URL = "http://localhost:9000";
const SOCKET_SERVER_URL = "https://poolingsystem-backend.onrender.com";

const PollResultWithChats = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "User 1",
      text: "Hey There, how can I help?",
      incoming: true,
    },
    {
      id: 2,
      sender: "User 2",
      text: "Nothing bro..just chill!!",
      incoming: false,
    },
  ]);
  const [inputMsg, setInputMsg] = useState("");
  const [poll, setPoll] = useState(null);
  const navigate = useNavigate();
  const socketRef = useRef();

  const toggleChat = () => setChatOpen(!chatOpen);

  const sendMessage = () => {
    if (!inputMsg.trim()) return;
    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        sender: "You",
        text: inputMsg,
        incoming: false,
      },
    ]);
    setInputMsg("");
  };

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const response = await axiosInstance.get("/poll/get-current-poll");
        setPoll(response.data);
      } catch (error) {
        console.error("Error fetching poll:", error);
      }
    };

    fetchPoll();
    socketRef.current = io(SOCKET_SERVER_URL);

    // Listen for vote updates
    socketRef.current.on("vote-updated", (updatedPoll) => {
      setPoll(updatedPoll);
    });

    // Listen for new question
    socketRef.current.on("new-question", (newPoll) => {
      setPoll(newPoll);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  return (
    <div
      style={{
        marginTop: "2rem",
        display: "flex",
        alignItems: "end",
        marginLeft: "-6rem",
        flexDirection: "column",
      }}
    >
      <button
        className="view-poll-history-btn"
        style={{ position: "absolute", right: "5rem", top: "2rem" }}
        onClick={() => navigate("/poll-history")}
      >
        👁️ View Poll history
      </button>
      <div className="poll-result-container">
        <h3
          className="poll-title"
          style={{ marginLeft: "-18rem", marginBottom: "2rem" }}
        >
          Question
        </h3>
        {!poll ? (
          <p>Loading poll...</p>
        ) : (
          <div className="question-box">
            <div className="question-header">{poll.question}</div>
            {poll.options.map((option, idx) => {
              const totalVotes = poll.options.reduce(
                (sum, o) => sum + (o.votes || 0),
                0
              );
              const votePercent =
                totalVotes > 0
                  ? Math.round((option.votes / totalVotes) * 100)
                  : 0;

              // Determine if option is selected (has votes > 0)
              const isSelected = votePercent > 0;

              return (
                <div
                  key={option._id}
                  className={`option-row ${isSelected ? "selected" : ""}`}
                >
                  <div className="option-left">
                    <div className="option-num">{idx + 1}</div>
                    <div className="option-text">{option.text}</div>
                  </div>
                  <div className="option-right">{votePercent}%</div>
                </div>
              );
            })}
          </div>
        )}

        <button
          className="ask-new-btn"
          style={{ marginRight: "-6rem" }}
          onClick={() => navigate("/teacher-panel")}
        >
          + Ask a new question
        </button>

        {chatOpen && <Chats onClose={toggleChat} />}
        <button className="chat-toggle-btn" onClick={toggleChat}>
          💬
        </button>
      </div>
    </div>
  );
};

export default PollResultWithChats;
