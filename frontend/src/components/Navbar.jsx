import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logoImg from "../assets/resumecraft.png";

const Navbar = ({ token, onLogout, theme, onToggleTheme }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path ? "active-nav-link" : "";
  };

  return (
    <header className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="navbar-container">
        {/* Brand Logo & Title */}
        <Link to={token ? "/dashboard" : "/login"} className="navbar-logo" title="ResumeCraft">
          <div className="navbar-logo-glow-wrap">
            <img src={logoImg} alt="ResumeCraft Logo" className="navbar-brand-img" />
          </div>
          <div className="logo-text-group">
            <span className="logo-title">
              Resume<span className="logo-highlight">Craft</span>
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        {token && (
          <nav className="navbar-nav-links" aria-label="Main Navigation">
            <Link to="/dashboard" className={`nav-link-item ${isActive("/dashboard")}`}>
              <span className="nav-icon">📊</span>
              <span>Dashboard</span>
            </Link>
            <Link to="/templates" className={`nav-link-item ${isActive("/templates")}`}>
              <span className="nav-icon">🎨</span>
              <span>Templates</span>
            </Link>
            <Link to="/ats-matcher" className={`nav-link-item ${isActive("/ats-matcher")}`}>
              <span className="nav-icon">🎯</span>
              <span>ATS Matcher</span>
              <span className="nav-badge-hot">AI</span>
            </Link>
            <Link to="/resume-parser" className={`nav-link-item ${isActive("/resume-parser")}`}>
              <span className="nav-icon">📤</span>
              <span>Parse File</span>
            </Link>
          </nav>
        )}

        {/* Right Action Menu */}
        <div className="navbar-menu">
          {token ? (
            <div className="navbar-auth-actions">
              <Link to="/editor/create" className="navbar-button-primary">
                <span className="btn-plus-icon">+</span>
                <span>Create Resume</span>
              </Link>

              <button 
                onClick={onToggleTheme} 
                className="theme-toggle-btn" 
                title={`Switch to ${theme === "dark" ? "Light" : "Dark"} mode`}
                aria-label="Toggle theme"
              >
                <span className="theme-icon">{theme === "dark" ? "☀️" : "🌙"}</span>
                <span className="theme-text">{theme === "dark" ? "Light" : "Dark"}</span>
              </button>

              <button 
                onClick={handleLogout} 
                className="navbar-button-logout"
                title="Sign out of your account"
              >
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="navbar-guest-actions">
              <button 
                onClick={onToggleTheme} 
                className="theme-toggle-btn" 
                title={`Switch to ${theme === "dark" ? "Light" : "Dark"} mode`}
                aria-label="Toggle theme"
              >
                <span className="theme-icon">{theme === "dark" ? "☀️" : "🌙"}</span>
                <span className="theme-text">{theme === "dark" ? "Light" : "Dark"}</span>
              </button>
              <Link to="/login" className="nav-link-login">Sign In</Link>
            </div>
          )}

          {/* Mobile Menu Hamburger Toggle */}
          <button
            className={`mobile-menu-toggle ${mobileMenuOpen ? "open" : ""}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            <span className="hamburger-bar"></span>
            <span className="hamburger-bar"></span>
            <span className="hamburger-bar"></span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <nav className="mobile-nav-links">
            {token ? (
              <>
                <Link to="/dashboard" className={`mobile-nav-item ${isActive("/dashboard")}`}>
                  <span className="nav-icon">📊</span> Dashboard
                </Link>
                <Link to="/templates" className={`mobile-nav-item ${isActive("/templates")}`}>
                  <span className="nav-icon">🎨</span> Templates
                </Link>
                <Link to="/ats-matcher" className={`mobile-nav-item ${isActive("/ats-matcher")}`}>
                  <span className="nav-icon">🎯</span> ATS Matcher
                  <span className="nav-badge-hot">AI</span>
                </Link>
                <Link to="/resume-parser" className={`mobile-nav-item ${isActive("/resume-parser")}`}>
                  <span className="nav-icon">📤</span> Parse PDF/DOCX
                </Link>
                <div className="mobile-drawer-footer">
                  <Link to="/editor/create" className="mobile-create-btn">
                    + Create Resume
                  </Link>
                  <button onClick={handleLogout} className="mobile-logout-btn">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className={`mobile-nav-item ${isActive("/login")}`}>
                  <span className="nav-icon">🔑</span> Sign In
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;

