// Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import '../css/AdminDashboard.css';
import { eventAPI } from '../api/eventAPI';
import { instituteAPI } from '../api/instituteAPI';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { label: 'Total Institutes', value: 0 },
    { label: 'Total Events', value: 0 },
    { label: 'Active Events', value: 0 },
  ]);
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        const [eventsRes, institutesRes] = await Promise.all([
          eventAPI.getEvents(token).catch(() => ({ data: [] })),
          instituteAPI.getInstitutes(token).catch(() => ({ data: [] }))
        ]);

        const eventsList = eventsRes.data || [];
        const institutesList = institutesRes.data || [];

        setEvents(eventsList.slice(0, 5)); // Show 5 recent events
        setInstitutes(institutesList);

        // Update stats
        setStats([
          { label: 'Total Institutes', value: institutesList.length },
          { label: 'Total Events', value: eventsList.length },
          { label: 'Active Events', value: eventsList.filter(e => e.status === 'Ongoing').length },
        ]);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Set default stats if API fails
        setStats([
          { label: 'Total Institutes', value: 0 },
          { label: 'Total Events', value: 0 },
          { label: 'Active Events', value: 0 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token, navigate]);

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await eventAPI.deleteEvent(token, eventId);
      setEvents(events.filter(e => e._id !== eventId));
      alert("Event deleted successfully!");
    } catch (error) {
      alert("Failed to delete event: " + error.message);
    }
  };

  const handleDeleteInstitute = async (instId) => {
    if (!window.confirm("Are you sure you want to delete this institute?")) return;
    try {
      await instituteAPI.deleteInstitute(token, instId);
      setInstitutes(institutes.filter(i => i._id !== instId));
      alert("Institute deleted successfully!");
    } catch (error) {
      alert("Failed to delete institute: " + error.message);
    }
  };

  return (
    <div className="main-content">
      {/* Top bar */}
      <header className="topbar">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">Welcome, {user.name || 'Admin'} - Overview of Frolic Event Management System</p>
        </div>
        <div className="topbar-right">
          <span className="user-role">{user.role?.toUpperCase() || 'USER'}</span>
        </div>
      </header>

        {/* Stats cards */}
        <section className="stats-grid">
          {stats.map((s) => (
            <div key={s.label} className="stat-card">
              <p className="stat-label">{s.label}</p>
              <p className="stat-value">{loading ? '-' : s.value}</p>
            </div>
          ))}
        </section>

        {/* Two-column section */}
        <section className="two-column">
          {/* Left Column: Tables */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Recent events table */}
            <div className="card">
              <h2 className="card-title">Recent Events</h2>
              {loading ? (
                <p style={{ color: '#9ca3af', textAlign: 'center' }}>Loading events...</p>
              ) : events.length > 0 ? (
                <table className="events-table">
                  <thead>
                    <tr>
                      <th>Event Name</th>
                      <th>Date</th>
                      <th>Participants</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((event) => (
                      <tr key={event._id}>
                        <td>{event.name}</td>
                        <td>{new Date(event.date).toLocaleDateString()}</td>
                        <td>{event.minParticipants || 0}-{event.maxParticipants || 0}</td>
                        <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            className="edit-btn-small" 
                            onClick={() => handleNavigate(`/edit-event/${event._id}`)}
                            style={{
                              padding: '4px 8px',
                              background: '#3b82f6',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            Edit
                          </button>
                          <button 
                            className="delete-btn-small" 
                            onClick={() => handleDeleteEvent(event._id)}
                            style={{
                              padding: '4px 8px',
                              background: '#ef4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            Delete
                          </button>
                        </div>

                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p style={{ color: '#9ca3af', textAlign: 'center' }}>No events yet</p>
              )}
            </div>

            {/* Institutes list */}
            <div className="card">
              <h2 className="card-title">Institutes</h2>
              {loading ? (
                <p style={{ color: '#9ca3af', textAlign: 'center' }}>Loading institutes...</p>
              ) : institutes.length > 0 ? (
                <table className="events-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Coordinator</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {institutes.map((inst) => (
                      <tr key={inst._id}>
                        <td>{inst.name}</td>
                        <td>{inst.coordinator}</td>
                        <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            className="edit-btn-small" 
                            onClick={() => handleNavigate(`/edit-institute/${inst._id}`)}
                            style={{
                              padding: '4px 8px',
                              background: '#3b82f6',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            Edit
                          </button>
                          <button 
                            className="delete-btn-small" 
                            onClick={() => handleDeleteInstitute(inst._id)}
                            style={{
                              padding: '4px 8px',
                              background: '#ef4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            Delete
                          </button>
                        </div>

                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p style={{ color: '#9ca3af', textAlign: 'center' }}>No institutes yet</p>
              )}
            </div>
          </div>

          {/* Right Column: Quick actions */}
          <div className="card" style={{ alignSelf: 'start' }}>
            <h2 className="card-title">Quick Actions</h2>
            <div className="actions-grid">
              <button className="action-btn" onClick={() => handleNavigate('/add-event')}>Create Event</button>
              <button className="action-btn" onClick={() => handleNavigate('/institute-form')}>Add Institute</button>
              <button className="action-btn" onClick={() => handleNavigate('/groups')}>Manage Groups</button>
            </div>
          </div>
        </section>


      </div>
    );
};

export default Dashboard;

// CSS DASHBOARD


