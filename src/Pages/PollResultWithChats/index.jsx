import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../../api/apiConfig";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import { io } from "socket.io-client";
import Chats from "../../components/Chats";

const SOCKET_SERVER_URL = "http://localhost:9000";

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
      console.log("Received vote update:", updatedPoll);
      setPoll(updatedPoll);
    });

    // Optional: listen for new question as well
    socketRef.current.on("new-question", (newPoll) => {
      console.log("Received new question:", newPoll);
      setPoll(newPoll);
    });

    // Cleanup socket on unmount
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  return (
    <div className="poll-result-container">
      <button
        className="view-poll-history-btn"
        onClick={() => navigate("/poll-history")}
      >
        👁️ View Poll history
      </button>

      <h3 className="poll-title">Question</h3>
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

            return (
              <div className="option-row" key={option._id}>
                <button
                  className="option-btn"
                  style={{
                    background: `linear-gradient(to right, #6c63ff ${votePercent}%, #f0f0f0 ${votePercent}%)`,
                    borderRadius: "0.8rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span className="option-num">{idx + 1}</span> {option.text}
                    <span className="vote-percent">{votePercent}%</span>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      )}
      <button className="ask-new-btn">+ Ask a new question</button>

      {/* <div className={`chat-popup ${chatOpen ? "open" : ""}`}>
        <div className="chat-header">
          <button
            className={activeTab === "chat" ? "active" : ""}
            onClick={() => setActiveTab("chat")}
          >
            Chat
          </button>
          <button
            className={activeTab === "participants" ? "active" : ""}
            onClick={() => setActiveTab("participants")}
          >
            Participants
          </button>
          <button className="close-btn" onClick={toggleChat}>
            &times;
          </button>
        </div>

        {activeTab === "chat" && (
          <div className="chat-messages">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chat-message ${
                  msg.incoming ? "incoming" : "outgoing"
                }`}
              >
                <div className="sender">{msg.sender}</div>
                <div className="text">{msg.text}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "participants" && (
          <div className="participants-list">
            <p>Participants will be shown here.</p>
          </div>
        )}

        <div className="chat-input-section">
          <input
            type="text"
            placeholder="Type a message..."
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div> */}
      {chatOpen && <Chats onClose={toggleChat} />}
      <button className="chat-toggle-btn" onClick={toggleChat}>
        💬
      </button>
    </div>
  );
};

export default PollResultWithChats;
