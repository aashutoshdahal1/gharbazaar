import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import GharBazaarAuth from "./pages/Login_Signup";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login-signup" element={<GharBazaarAuth />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
