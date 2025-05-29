import React, { useState, useEffect, useRef } from "react";
import "./styles.css";
import axiosInstance from "../../api/apiConfig";
import { io } from "socket.io-client";
import Chats from "../../components/Chats";

const SOCKET_SERVER_URL = "https://poolingsystem-backend.onrender.com";

const STORAGE_SUBMITTED_KEY = "pollSubmitted";

const StudentQuestionPage = () => {
  const socketRef = useRef(null);
  const [poll, setPoll] = useState(null);
  const [selected, setSelected] = useState(null);
  const [timer, setTimer] = useState(15);
  const [submitted, setSubmitted] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [isKickedOut, setIsKickedOut] = useState(false);
  const toggleChat = () => setChatOpen(!chatOpen);
  const studentId = sessionStorage.getItem("studentId");

  // Fetch current poll from backend
  const fetchPoll = async () => {
    try {
      const response = await axiosInstance.get("/poll/get-current-poll");
      const pollData = response.data;

      if (!pollData) {
        setPoll(null);
        setTimer(0);
        setSubmitted(false);
        setSelected(null);
        return;
      }

      const now = new Date();
      const createdAt = new Date(pollData.createdAt);
      const duration = pollData.duration;
      const elapsed = Math.floor((now - createdAt) / 1000);
      const remaining = duration - elapsed;

      if (remaining <= 0) {
        setPoll(null);
        setTimer(0);
        setSubmitted(false);
        setSelected(null);
        return;
      }

      setPoll(pollData);
      setTimer(remaining);

      const storedSubmitted = sessionStorage.getItem(STORAGE_SUBMITTED_KEY);
      setSubmitted(storedSubmitted === "true");
      setSelected(null);
    } catch (error) {
      console.error("Failed to fetch poll:", error);
      setPoll(null);
      setTimer(0);
      setSubmitted(false);
      setSelected(null);
    }
  };

  useEffect(() => {
    fetchPoll();
  }, []);

  useEffect(() => {
    if (isKickedOut) return; // Don't setup socket if kicked out

    socketRef.current = io(SOCKET_SERVER_URL, { transports: ["websocket"] });

    socketRef.current.on("new-question", (newPoll) => {
      const now = new Date();
      const createdAt = new Date(newPoll.createdAt);
      const duration = newPoll.duration;
      const elapsed = Math.floor((now - createdAt) / 1000);
      const remaining = duration - elapsed;

      setPoll(newPoll);
      setSelected(null);
      setTimer(remaining > 0 ? remaining : 0);

      setSubmitted(false);
      sessionStorage.removeItem(STORAGE_SUBMITTED_KEY);
    });

    socketRef.current.on("vote-update", (updatedVotes) => {
      if (!poll) return;
      if (updatedVotes.pollId === poll._id) {
        setPoll((prevPoll) => ({
          ...prevPoll,
          options: prevPoll.options.map((opt) => {
            const updatedOption = updatedVotes.options.find(
              (uo) => uo._id === opt._id
            );
            return updatedOption ? { ...opt, votes: updatedOption.votes } : opt;
          }),
        }));
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [poll, isKickedOut]);

  useEffect(() => {
    if (timer === 0 || submitted || isKickedOut) return;

    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, submitted, isKickedOut]);

  // Poll student existence every 5 seconds to detect kick out
  useEffect(() => {
    if (!studentId) return;

    const checkStudentExists = async () => {
      try {
        await axiosInstance.get(`/student/check/${studentId}`);
        // Student exists, nothing to do
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setIsKickedOut(true);
          setChatOpen(false);
          setPoll(null);
          sessionStorage.clear();
        } else {
          console.error("Error checking student existence:", error);
        }
      }
    };

    checkStudentExists(); // initial check
    const interval = setInterval(checkStudentExists, 5000);

    return () => clearInterval(interval);
  }, [studentId]);

  const handleSubmit = async () => {
    if (selected === null || !poll) return;

    setLoadingSubmit(true);
    try {
      const selectedOptionId = poll.options[selected]._id;

      await axiosInstance.post("/student/submit-vote", {
        pollId: poll._id,
        optionId: selectedOptionId,
      });

      await fetchPoll();

      setSubmitted(true);
      sessionStorage.setItem(STORAGE_SUBMITTED_KEY, "true");

      socketRef.current.emit("vote-casted", {
        pollId: poll._id,
        optionId: selectedOptionId,
      });
    } catch (error) {
      console.error("Error submitting vote:", error);
      alert("Failed to submit vote. Please try again.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  const FormattedTimer = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  // Show results only if submitted or timer ended
  const showResults = submitted || timer === 0;

  const totalVotes = showResults
    ? poll?.options.reduce((sum, o) => sum + (o.votes || 0), 0)
    : 0;

  return (
    <div
      style={{
        marginTop: "2rem",
        display: "flex",
        alignItems: "end",
        flexDirection: "column",
      }}
    >
      {isKickedOut ? (
        <div
          style={{
            marginTop: "7rem",
            width: "400px",
            marginLeft: "auto",
            marginRight: "auto",
            padding: "40px 30px",
            backgroundColor: "#fff",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            borderRadius: "4px",
            boxShadow: "0 0 20px rgba(0, 0, 0, 0.15)",
            textAlign: "center",
            userSelect: "none",
            cursor: "default",
          }}
        >
          <div
            style={{
              backgroundColor: "#7269e6",
              color: "#fff",
              display: "inline-block",
              padding: "5px 15px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: "600",
              marginBottom: "15px",
              letterSpacing: "0.8px",
            }}
          >
            Intervue Poll
          </div>
          <h2
            style={{
              fontWeight: "600",
              fontSize: "24px",
              marginBottom: "12px",
            }}
          >
            You’ve been Kicked out !
          </h2>
          <p style={{ color: "#666", fontSize: "14px", lineHeight: "1.4" }}>
            Looks like the teacher had removed you from the poll system .Please{" "}
            <br /> Try again sometime.
          </p>
        </div>
      ) : !poll ? (
        <div className="waiting-container">
          <div className="badge">✨ Intervue Poll</div>
          <div className="loader"></div>
          <h2>Wait for the teacher to ask questions..</h2>
        </div>
      ) : (
        <>
          <button
            className="view-poll-history-btn"
            style={{ position: "absolute", right: "5rem", top: "2rem" }}
            onClick={() => (window.location.href = "/poll-history")}
          >
            👁️ View Poll history
          </button>
          <div className="poll-page-container">
            <div style={{ display: "flex", alignItems: "center", gap: "3rem" }}>
              <div className="question-title">Question</div>
              <div className="poll-header">
                <button className="view-history-btn">
                  ⏱️ {FormattedTimer(timer)}
                </button>
              </div>
            </div>
            <div className="question-box">
              <div className="question-header">{poll.question}</div>
              <div className="options-container">
                {poll.options.map((option, idx) => {
                  const percentage = totalVotes
                    ? Math.round(((option.votes || 0) / totalVotes) * 100)
                    : 0;

                  return showResults ? (
                    <div
                      key={option._id}
                      className="option-result"
                      style={{ borderColor: "#7269e6" }}
                    >
                      <div
                        className="option-fill"
                        style={{
                          width: percentage > 0 ? `${percentage}%` : "0",
                          backgroundColor:
                            percentage > 0 ? "#7269e6" : "#f6f6f6",
                          color: percentage > 0 ? "white" : "black",
                        }}
                      >
                        <span
                          className="option-num"
                          style={{
                            backgroundColor:
                              percentage > 0 ? "white" : "#7269e6",
                            color: percentage > 0 ? "white" : "black",
                          }}
                        >
                          {idx + 1}
                        </span>
                        <span className="option-text">{option.text}</span>
                      </div>
                      <div className="option-percentage">{percentage}%</div>
                    </div>
                  ) : (
                    <div
                      key={option._id}
                      className={`option ${selected === idx ? "selected" : ""}`}
                      onClick={() => setSelected(idx)}
                    >
                      <span className="option-num">{idx + 1}</span>{" "}
                      {option.text}
                    </div>
                  );
                })}
              </div>
            </div>

            {showResults ? (
              <p className="wait-text">
                <strong>Wait for the teacher to ask new question</strong>
              </p>
            ) : (
              <button
                className="submit-btn"
                disabled={selected === null || loadingSubmit}
                onClick={handleSubmit}
              >
                {loadingSubmit ? "Submitting..." : "Submit"}
              </button>
            )}

            {chatOpen && <Chats onClose={toggleChat} />}
            <button className="chat-toggle-btn" onClick={toggleChat}>
              💬
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentQuestionPage;
