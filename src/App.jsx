import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RoleSelection from "./Pages/RoleSelection";
import "./App.css";
import StudentName from "./Pages/StudentName";
import TeacherDashboard from "./Pages/TeacherDashboard";
import PollResultWithChats from "./Pages/PollResultWithChats";
import StudentWaitingRoom from "./Pages/StudentWaitingRoom";
import StudentQuestionPage from "./Pages/StudentQuestionPage";
import PollHistory from "./Pages/PollHistory";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RoleSelection />} />
          <Route path="/student-entry" element={<StudentName />} />
          <Route path="/teacher-panel" element={<TeacherDashboard />} />
          <Route path="/poll-result" element={<PollResultWithChats />} />
          <Route path="/poll-history" element={<PollHistory />} />
          <Route
            path="/poll-student-current"
            element={<StudentQuestionPage />}
          />
          <Route
            path="/student-waiting-room"
            element={<StudentWaitingRoom />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
