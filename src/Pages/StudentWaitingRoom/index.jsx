import React from "react";
import "./styles.css";

const StudentWaitingRoom = () => {
  return (
    <div className="waiting-container">
      <div className="badge">✨ Intervue Poll</div>

      <div className="loader"></div>

      <h2>Wait for the teacher to ask questions..</h2>
    </div>
  );
};

export default StudentWaitingRoom;
