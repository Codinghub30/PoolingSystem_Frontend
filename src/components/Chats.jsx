import React, { useEffect, useState } from "react";
import axiosInstance from "../api/apiConfig";

const participantsData = [
  { id: 1, name: "Rahul Arora" },
  { id: 2, name: "Pushpender Rautela" },
  { id: 3, name: "Rijul Zalpuri" },
  { id: 4, name: "Nadeem N" },
  { id: 5, name: "Ashwin Sharma" },
];

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
  const role = sessionStorage.getItem("role");

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        setLoadingParticipants(true);
        const response = await axiosInstance.get("/student/get-students"); // Replace with your actual API URL

        // Assuming data is an array of participants with id, name, and role
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
      // Remove the kicked student from local state
      setParticipants((prev) => prev.filter((p) => p._id !== studentId));
      alert("Student kicked out successfully");
    } catch (error) {
      console.error("Failed to kick out student:", error);
      alert("Failed to kick out student");
    }
  };

  return (
    <>
      <div className="modal-overlay" />
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
            Chat
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
                    {!msg.incoming && (
                      <span className="chat-sender">{msg.sender}</span>
                    )}
                    <div className="chat-bubble">{msg.text}</div>
                    {msg.incoming && (
                      <span className="chat-sender">{msg.sender}</span>
                    )}
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
          width: 320px;
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
          font-weight: 600;
          font-size: 15px;
          color: #333;
          outline-offset: 2px;
          transition: border-color 0.2s ease;
        }
        .tab-button.active {
          border-bottom: 3px solid #7b6ef6; /* purple */
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
          gap: 14px;
        }
        .chat-message {
          max-width: 70%;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .chat-message.incoming {
          flex-direction: row;
          justify-content: flex-start;
        }
        .chat-message.outgoing {
          flex-direction: row-reverse;
          justify-content: flex-end;
          margin-left: auto;
        }
        .chat-bubble {
          padding: 10px 14px;
          border-radius: 12px;
          font-size: 14px;
          line-height: 1.2;
          max-width: 100%;
          word-wrap: break-word;
          box-shadow: 0 0 6px rgb(0 0 0 / 0.1);
        }
        .chat-message.incoming .chat-bubble {
          background-color: #333;
          color: white;
          border-top-left-radius: 0;
        }
        .chat-message.outgoing .chat-bubble {
          background-color: #7b6ef6;
          color: white;
          border-top-right-radius: 0;
        }
        .chat-sender {
          font-size: 12px;
          font-weight: 600;
          color: #7b6ef6;
          user-select: text;
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
