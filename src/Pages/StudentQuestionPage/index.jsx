import React, { useState, useEffect, useRef } from "react";
import "./styles.css";
import StudentWaitingRoom from "../StudentWaitingRoom";
import axiosInstance from "../../api/apiConfig";
import { io } from "socket.io-client";
import Chats from "../../components/Chats";

// const SOCKET_SERVER_URL =
//   import.meta.env.VITE_SOCKET_SERVER_URL || "http://localhost:9000";

const SOCKET_SERVER_URL = "http://localhost:9000";

const StudentQuestionPage = () => {
  const socketRef = useRef(null);
  const [poll, setPoll] = useState(null);
  const [selected, setSelected] = useState(null);
  const [timer, setTimer] = useState(15);
  const [submitted, setSubmitted] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const toggleChat = () => setChatOpen(!chatOpen);

  // Fetch current active poll from backend API
  const fetchPoll = async () => {
    try {
      const response = await axiosInstance.get("/poll/get-current-poll");
      const pollData = response.data;

      // Calculate remaining time based on createdAt and duration
      const now = new Date();
      const createdAt = new Date(pollData.createdAt);
      const duration = pollData.duration; // duration in seconds

      const elapsed = Math.floor((now - createdAt) / 1000);
      const remaining = duration - elapsed;

      setPoll(pollData);
      setTimer(remaining > 0 ? remaining : 0);
    } catch (error) {
      console.error("Failed to fetch poll:", error);
    }
  };

  useEffect(() => {
    fetchPoll();
  }, []);

  useEffect(() => {
    // Create socket connection
    socketRef.current = io(SOCKET_SERVER_URL);

    // Listen for new poll question
    socketRef.current.on("new-question", (newPoll) => {
      const now = new Date();
      const createdAt = new Date(newPoll.createdAt);
      const duration = newPoll.duration;

      const elapsed = Math.floor((now - createdAt) / 1000);
      const remaining = duration - elapsed;

      setPoll(newPoll);
      setSelected(null);
      setSubmitted(false);
      setTimer(remaining > 0 ? remaining : 0);
    });

    // Cleanup on unmount
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  // Timer countdown logic
  useEffect(() => {
    if (timer === 0 || submitted) return;

    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, submitted]);

  const FormattedTimer = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${
      remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds
    }`;
  };

  const handleSubmit = async () => {
    if (selected === null || !poll) return;

    setLoadingSubmit(true);
    try {
      const selectedOptionId = poll.options[selected]._id;

      await axiosInstance.post("/student/submit-vote", {
        pollId: poll._id,
        optionId: selectedOptionId,
      });

      setSubmitted(true);
      //   await fetchPoll(); // refresh poll after submitting
    } catch (error) {
      console.error("Error submitting vote:", error);
      alert("Failed to submit vote. Please try again.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (!poll) {
    return (
      <div className="waiting-container">
        <div className="badge">✨ Intervue Poll</div>

        <div className="loader"></div>

        <h2>Wait for the teacher to ask questions..</h2>
      </div>
    );
  }

  if (submitted) {
  }

  return (
    <div className="question-container">
      <div className="top-bar">
        <h3>Question 1</h3>
        <span className="timer">⏱️ {FormattedTimer(timer)}</span>
      </div>

      <div className="question-box">
        <div className="question-header">{poll.question}</div>
        <div className="options-container">
          {poll.options.map((option, index) => (
            <div
              key={option._id}
              className={`option ${selected === index ? "selected" : ""}`}
              onClick={() => setSelected(index)}
            >
              <span className="option-num">{index + 1}</span> {option.text}
            </div>
          ))}
        </div>
      </div>
      {submitted || timer === 0 ? (
        <p>
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
  );
};

export default StudentQuestionPage;
