// Sidebar.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../css/AdminDashboard.css"; // reuse your existing sidebar styles

const Sidebar = () => {
  const navigate = useNavigate();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", path: "/dashboard" },
    { id: "add-event", label: "Add Event", path: "/add-event" },
    { id: "institute-form", label: "Institute Form", path: "/institute-form" },
    { id: "groups", label: "Group Management", path: "/groups" },
    { id: "logout", label: "Logout", path: null, onClick: () => handleLogout() },
  ];

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-dot" /> Frolic
      </div>
      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          item.onClick ? (
            <button
              key={item.id}
              className="sidebar-item logout-btn"
              onClick={item.onClick}
              style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              {item.label}
            </button>
          ) : (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
            >
              {item.label}
            </NavLink>
          )
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
