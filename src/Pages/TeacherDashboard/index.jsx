import React, { useState } from "react";
import "./style.css";
import axiosInstance from "../../api/apiConfig";
import { useNavigate } from "react-router-dom";

const TeacherDashboard = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ]);
  const [timer, setTimer] = useState(60);
  const navigate = useNavigate();

  const handleOptionChange = (index, value) => {
    let newOptions = [...options];
    newOptions[index].text = value;
    setOptions(newOptions);
  };

  const handleCorrectChange = (index, isCorrect) => {
    const newOptions = [...options];
    newOptions[index].isCorrect = isCorrect;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, { text: "", isCorrect: false }]);
  };

  const handleAskQuestion = async () => {
    console.log("the timerrr step 1", timer);

    const payload = {
      question,
      options,
      duration: timer,
    };

    try {
      const response = await axiosInstance.post("/poll/create", payload);

      navigate("/poll-result");
      alert("Poll created successfully!");

      // Reset form after success
      setQuestion("");
      setOptions([
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ]);
      setTimer(60);
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 2xx
        alert(
          `Error: ${error.response.data.message || "Failed to create poll"}`
        );
      } else if (error.request) {
        // Request was made but no response received
        alert("Network error: No response from server.");
      } else {
        // Something else happened
        alert(`Error: ${error.message}`);
      }
      console.error("Create poll error:", error);
    }
  };

  return (
    <div className="teacher-container">
      <div className="badge">✨ Intervue Poll</div>
      <h2>
        Let’s <strong>Get Started</strong>
      </h2>
      <p>
        you’ll have the ability to create and manage polls, ask questions, and
        monitor your students' responses in real-time.
      </p>

      <div className="top-section">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <label>Enter your question</label>
          </div>
          <div className="question-footer" style={{ marginBottom: "2rem" }}>
            <select
              value={timer}
              onChange={(e) => setTimer(Number(e.target.value))}
            >
              <option value={30}>30 seconds</option>
              <option value={60}>60 seconds</option>
            </select>
          </div>
        </div>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          maxLength={100}
          placeholder="Enter question..."
        />
        <span>{question.length}/100</span>
      </div>

      <div className="options-section">
        <label>Edit Options</label>
        {options.map((item, idx) => (
          <div className="option-row" key={idx}>
            <span className="option-number">{idx + 1}</span>
            <input
              type="text"
              value={item.text}
              onChange={(e) => handleOptionChange(idx, e.target.value)}
              placeholder={`Option ${idx + 1}`}
            />
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name={`correct-${idx}`}
                  checked={item.isCorrect === true}
                  onChange={() => handleCorrectChange(idx, true)}
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name={`correct-${idx}`}
                  checked={item.isCorrect === false}
                  onChange={() => handleCorrectChange(idx, false)}
                />
                No
              </label>
            </div>
          </div>
        ))}
        <button className="add-option-btn" onClick={addOption}>
          + Add More option
        </button>
      </div>

      <button className="ask-btn" onClick={handleAskQuestion}>
        Ask Question
      </button>
    </div>
  );
};

export default TeacherDashboard;
