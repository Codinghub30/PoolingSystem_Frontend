import React, { useState } from "react";
import "./styles.css";
import { useNavigate } from "react-router-dom";

const RoleSelection = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (!selectedRole) return;
    sessionStorage.setItem("role", selectedRole);
    if (selectedRole === "student") navigate("/student-entry");
    else navigate("/teacher-panel");
  };

  return (
    <div className="role-container">
      <div className="badge">📊 Interview Poll</div>
      <h2>
        Welcome to the <strong>Live Polling System</strong>
      </h2>
      <p>
        Please select the role that best describes you to begin using the live
        polling system
      </p>

      <div className="card-container">
        <div
          className={`role-card ${
            selectedRole === "student" ? "selected" : ""
          }`}
          onClick={() => setSelectedRole("student")}
        >
          <h4>I'm a Student</h4>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry
          </p>
        </div>
        <div
          className={`role-card ${
            selectedRole === "teacher" ? "selected" : ""
          }`}
          onClick={() => setSelectedRole("teacher")}
        >
          <h4>I'm a Teacher</h4>
          <p>Submit answers and view live poll results in real-time.</p>
        </div>
      </div>

      <button
        className="continue-btn"
        onClick={handleContinue}
        disabled={!selectedRole}
      >
        Continue
      </button>
    </div>
  );
};

export default RoleSelection;
