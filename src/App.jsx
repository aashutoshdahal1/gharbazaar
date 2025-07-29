import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import GharBazaarAuth from "./pages/Login_Signup";
import FilterPage from "./pages/FilterPage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login-signup" element={<GharBazaarAuth />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/filter" element={<FilterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
