import React, { useState } from "react";
import "./styles.css";

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

  return (
    <div className="poll-result-container">
      <h3>Question</h3>
      <div className="question-box">
        Which planet is known as the Red Planet?"
        <div className="option-row">
          <span className="option-number">1</span>
          <div className="option-bar filled">Mars</div>
        </div>
        <div className="option-row">
          <span className="option-number">2</span>
          <div className="option-bar">Venus</div>
        </div>
        <div className="option-row">
          <span className="option-number">3</span>
          <div className="option-bar">Jupiter</div>
        </div>
        <div className="option-row">
          <span className="option-number">4</span>
          <div className="option-bar half-filled">Saturn</div>
        </div>
      </div>

      <button className="ask-new-btn">+ Ask a new question</button>

      <div className={`chat-popup ${chatOpen ? "open" : ""}`}>
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
            {/* Add participants list here */}
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
      </div>

      <button className="chat-toggle-btn" onClick={toggleChat}>
        💬
      </button>
    </div>
  );
};

export default PollResultWithChats;
