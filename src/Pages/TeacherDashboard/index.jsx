import React, { useState } from "react";
import "./style.css";

const TeacherDashboard = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ]);
  const [timer, setTimer] = useState(60);

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

  const handleAskQuestion = () => {
    const payload = {
      question,
      options,
      timer,
    };
    console.log("Question Sent:", payload);
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
        <label>Enter your question</label>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          maxLength={100}
          placeholder="Enter question..."
        />
        <div className="question-footer">
          <select
            value={timer}
            onChange={(e) => setTimer(Number(e.target.value))}
          >
            <option value={30}>30 seconds</option>
            <option value={60}>60 seconds</option>
            <option value={60}>60 seconds</option>
          </select>
          <span>{question.length}/100</span>
        </div>
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
