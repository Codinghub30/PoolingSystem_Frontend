import React, { useEffect, useState } from "react";
import axiosInstance from "../api/apiConfig";

const chatMessagesData = [
  {
    id: 1,
    sender: "User 1",
    text: "Hey There , how can I help?",
    incoming: true,
  },
  {
    id: 2,
    sender: "User 2",
    text: "Nothing bro..just chill!!",
    incoming: false,
  },
];

const Chats = () => {
  const [activeTab, setActiveTab] = useState("chat");
  const [participants, setParticipants] = useState([]);
  const [loadingParticipants, setLoadingParticipants] = useState(true);
  const [showModal, setShowModal] = useState(true); // Control modal visibility
  const role = sessionStorage.getItem("role");

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        setLoadingParticipants(true);
        const response = await axiosInstance.get("/student/get-students");
        setParticipants(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingParticipants(false);
      }
    };

    fetchParticipants();
  }, []);

  const handleKickStudent = async (studentId) => {
    if (!window.confirm("Are you sure you want to kick out this student?")) {
      return;
    }
    try {
      await axiosInstance.delete(`/student/kickout-students/${studentId}`);
      setParticipants((prev) => prev.filter((p) => p._id !== studentId));
      sessionStorage.removeItem("studentId");
      sessionStorage.removeItem("studentName");
      // optionally also clear sessionId or other keys if any

      alert("Student kicked out successfully");
    } catch (error) {
      console.error("Failed to kick out student:", error);
      alert("Failed to kick out student");
    }
  };

  if (!showModal) return null; // Don't render modal if hidden

  return (
    <>
      <div
        className="modal-overlay"
        onClick={() => setShowModal(false)} // close on overlay click
      />
      <div
        className="modal-container"
        role="dialog"
        aria-modal="true"
        aria-labelledby="chat-modal-title"
      >
        {/* Tabs */}
        <div className="tabs-header">
          <button
            className={`tab-button ${activeTab === "chat" ? "active" : ""}`}
            onClick={() => setActiveTab("chat")}
            aria-selected={activeTab === "chat"}
            aria-controls="tab-chat"
            id="tab-chat-button"
          >
            <strong>Chat</strong>
          </button>
          <button
            className={`tab-button ${
              activeTab === "participants" ? "active" : ""
            }`}
            onClick={() => setActiveTab("participants")}
            aria-selected={activeTab === "participants"}
            aria-controls="tab-participants"
            id="tab-participants-button"
          >
            Participants
          </button>
        </div>

        {/* Tab Content */}
        <div className="tabs-content">
          {activeTab === "chat" && (
            <div
              id="tab-chat"
              role="tabpanel"
              aria-labelledby="tab-chat-button"
              className="tab-panel"
            >
              <div className="chat-messages">
                {chatMessagesData.map((msg) => (
                  <div
                    key={msg.id}
                    className={`chat-message ${
                      msg.incoming ? "incoming" : "outgoing"
                    }`}
                  >
                    <span className="chat-sender">{msg.sender}</span>
                    <div className="chat-bubble">{msg.text}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "participants" && (
            <div
              id="tab-participants"
              role="tabpanel"
              aria-labelledby="tab-participants-button"
              className="tab-panel"
            >
              <table className="participants-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map((p) => (
                    <tr key={p._id}>
                      <td>
                        <strong>{p.studentName || "Unknown"}</strong>
                      </td>
                      <td>
                        {role === "teacher" && (
                          <button
                            className="kick-button"
                            onClick={() => handleKickStudent(p._id)}
                            type="button"
                          >
                            Kick out
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.15);
          z-index: 1000;
        }
        .modal-container {
          position: fixed;
          right: 3rem;
          width: 370px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 6px 16px rgb(0 0 0 / 0.15);
          z-index: 1100;
          display: flex;
          flex-direction: column;
          font-family: Arial, sans-serif;
          font-size: 14px;
          user-select: none;
          bottom: 7rem;
          height: 380px;
          padding: 0 0 12px 0;
          overflow: hidden;
        }
        .modal-close-button {
          position: absolute;
          top: 8px;
          right: 12px;
          background: none;
          border: none;
          font-size: 22px;
          font-weight: 700;
          cursor: pointer;
          color: #555;
          line-height: 1;
          user-select: none;
          z-index: 1200;
        }
        .modal-close-button:hover {
          color: #000;
        }
        .tabs-header {
          display: flex;
          border-bottom: 1px solid #ccc;
        }
        .tab-button {
          flex: 1;
          padding: 12px 0;
          background: none;
          border: none;
          border-bottom: 3px solid transparent;
          cursor: pointer;
          font-weight: 400;
          font-size: 15px;
          color: #333;
          outline-offset: 2px;
          transition: border-color 0.2s ease;
        }
        .tab-button.active {
          border-bottom: 3px solid #7b6ef6; /* purple */
          font-weight: 600;
          color: #333;
        }
        .tab-button:hover:not(.active) {
          color: #7b6ef6;
        }
        .tabs-content {
          padding: 12px 16px;
          overflow-y: auto;
          max-height: 300px;
        }

        /* Chat styling */
        .chat-messages {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .chat-message {
          max-width: 75%;
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 14px;
          user-select: text;
        }
        .chat-message.incoming {
          align-self: flex-start;
        }
        .chat-message.outgoing {
          align-self: flex-end;
          text-align: right;
        }
        .chat-bubble {
          padding: 10px 16px;
          border-radius: 12px;
          max-width: 100%;
          word-wrap: break-word;
          box-shadow: 0 0 6px rgb(0 0 0 / 0.1);
          font-size: 14px;
          line-height: 1.3;
          user-select: text;
        }
        .chat-message.incoming .chat-bubble {
          background-color: #333;
          color: white;
          border-top-left-radius: 0;
        }
        .chat-message.outgoing .chat-bubble {
          background-color: #9e83ff; /* lighter purple */
          color: white;
          border-top-right-radius: 0;
        }
        .chat-sender {
          font-size: 12px;
          font-weight: 600;
          color: #5a33ff; /* bright purple */
          user-select: text;
          user-drag: none;
        }

        /* Participants table */
        .participants-table {
          width: 100%;
          border-collapse: collapse;
        }
        .participants-table th,
        .participants-table td {
          text-align: left;
          padding: 8px 10px;
          border-bottom: 1px solid #eee;
        }
        .participants-table th {
          font-weight: 600;
          font-size: 14px;
          color: #555;
        }
        .kick-button {
          background: none;
          border: none;
          color: #165fa0;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          text-decoration: underline;
          padding: 0;
        }
        .kick-button:hover {
          color: #0b3a5c;
        }
      `}</style>
    </>
  );
};

export default Chats;
