import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RoleSelection from "./Pages/RoleSelection";
import "./App.css";
import StudentName from "./Pages/StudentName";
import TeacherDashboard from "./Pages/TeacherDashboard";
import PollResultWithChats from "./Pages/PollResultWithChats";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RoleSelection />} />
          <Route path="/student-entry" element={<StudentName />} />
          <Route path="/teacher-panel" element={<TeacherDashboard />} />
          <Route path="/poll-result" element={<PollResultWithChats />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
