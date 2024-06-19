import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ContactUsForm from "./components/ContactUsForm";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/contact" />} />
      <Route path="/contact" element={<ContactUsForm />} />
    </Routes>
  );
}

export default App;
