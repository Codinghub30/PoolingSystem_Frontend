import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

const StudentName = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const existingName = sessionStorage.getItem("studentName");
    if (existingName) {
      navigate("/student-waiting-room");
    }
  }, [navigate]);

  const handleContinue = () => {
    if (!name.trim()) return;
    sessionStorage.setItem("studentName", name);
    navigate("/student-waiting-room");
  };

  return (
    <div className="student-container">
      <div className="badge">✨ Intervue Poll</div>
      <h2>
        Let's <strong>Get Started</strong>
      </h2>
      <p>
        If you’re a student, you’ll be able to{" "}
        <strong>submit your answers</strong>, participate in live polls, and see
        how your responses compare with your classmates
      </p>

      <label htmlFor="studentName" className="label">
        Enter your Name
      </label>
      <input
        id="studentName"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="input-box"
        placeholder="Your name"
      />

      <button
        onClick={handleContinue}
        className="continue-btn"
        disabled={!name.trim()}
      >
        Continue
      </button>
    </div>
  );
};

export default StudentName;
