import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/apiConfig";
import "./styles.css";

const StudentName = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  function generateSessionId() {
    let id = sessionStorage.getItem("sessionId");
    if (!id) {
      id = Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem("sessionId", id);
    }
    return id;
  }

  const handleSubmit = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    try {
      const sessionId = generateSessionId();
      const payload = { sessionId, studentName: trimmedName };

      const response = await axiosInstance.post("/student/add", payload);
      // Assuming response.data contains the created student object, e.g. { _id: "...", ... }
      const createdStudent = response.data;

      // Store backend-generated student ID (important for kick-out detection)
      sessionStorage.setItem(
        "studentId",
        createdStudent._id || createdStudent.sessionId || sessionId
      );
      sessionStorage.setItem("studentName", trimmedName);

      navigate("/poll-student-current");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to register student");
    }
  };

  // useEffect(() => {
  //   const existingName = sessionStorage.getItem("studentName");
  //   if (existingName) {
  //     navigate("/student-waiting-room");
  //   }
  // }, [navigate]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && name.trim()) {
      handleSubmit();
    }
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
        onKeyPress={handleKeyPress}
        className="input-box"
        placeholder="Your name"
      />

      <button
        onClick={handleSubmit}
        className="continue-btn"
        disabled={!name.trim()}
      >
        Continue
      </button>
    </div>
  );
};

export default StudentName;
