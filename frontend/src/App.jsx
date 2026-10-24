import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Editor from "./pages/Editor";
import ATSBeater from "./pages/ATSBeater";
import ResumeParser from "./pages/ResumeParser";
import CoverTemplates from "./pages/CoverTemplates";
import CoverPageBuilder from "./pages/CoverPageBuilder";
import Navbar from "./components/Navbar";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.body.className = `${theme}-theme`;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const loginUser = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  // Protected route helper
  const ProtectedRoute = ({ children }) => {
    return token ? children : <Navigate to="/login" replace />;
  };

  return (
    <Router>
      <div className="app-container">
        <Navbar token={token} onLogout={logoutUser} theme={theme} onToggleTheme={toggleTheme} />
        <main className="main-content">
          <Routes>
            <Route 
              path="/login" 
              element={token ? <Navigate to="/dashboard" replace /> : <Login onLogin={loginUser} />} 
            />
            <Route 
              path="/register" 
              element={token ? <Navigate to="/dashboard" replace /> : <Register onLogin={loginUser} />} 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ats-matcher" 
              element={
                <ProtectedRoute>
                  <ATSBeater />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/resume-parser" 
              element={
                <ProtectedRoute>
                  <ResumeParser />
                </ProtectedRoute>
              } 
            />
            <Route path="/templates" element={<CoverTemplates />} />
            <Route path="/create" element={<CoverPageBuilder />} />
            <Route path="/create-cover" element={<CoverPageBuilder />} />
            <Route path="/cover-page" element={<CoverPageBuilder />} />
            <Route path="/interview-coach" element={<Navigate to="/dashboard" replace />} />
            <Route path="/career-playbook" element={<Navigate to="/dashboard" replace />} />
            <Route 
              path="/editor/create" 
              element={
                <ProtectedRoute>
                  <Editor />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/editor/:id" 
              element={
                <ProtectedRoute>
                  <Editor />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}


export default App;