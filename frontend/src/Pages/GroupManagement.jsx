import React, { useState, useEffect } from "react";
import { eventAPI } from "../api/eventAPI";
import { groupAPI } from "../api/groupAPI";
import "../css/GroupManagement.css";

const GroupManagement = () => {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Fetch events
    const loadEvents = async () => {
      try {
        setLoading(true);
        const res = await eventAPI.getEvents(token);
        setEvents(res.data || []);
      } catch (err) {
        setError("Failed to load events");
      } finally {
        setLoading(false);
      }
    };
    if (token) loadEvents();
  }, [token]);

  useEffect(() => {
    if (selectedEventId) {
      loadGroups(selectedEventId);
    } else {
      setGroups([]);
    }
  }, [selectedEventId]);

  const loadGroups = async (eventId) => {
    try {
      setLoading(true);
      const res = await groupAPI.getGroupsByEvent(token, eventId);
      setGroups(res.data || []);
      setError("");
    } catch (err) {
      setError("Failed to load groups");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!groupName.trim() || !selectedEventId) return;

    try {
      setError("");
      await groupAPI.createGroup(token, { groupName, eventId: selectedEventId });
      setGroupName("");
      loadGroups(selectedEventId);
    } catch (err) {
      setError(err.message || "Failed to create group");
    }
  };

  const toggleAttribute = async (groupId, field, currentValue) => {
    try {
      await groupAPI.updateGroupMetadata(token, groupId, { [field]: !currentValue });
      loadGroups(selectedEventId);
    } catch (err) {
      setError("Failed to update group");
    }
  };

  const selectedEvent = events.find(e => e._id === selectedEventId);

  return (
    <div className="main-content">
      <div className="group-management-wrapper">
        <h2 className="page-title GM-title">Group Management</h2>
        
        {error && <div className="GM-error">{error}</div>}

        {/* Event Selection */}
        <div className="GM-card">
          <label>Select Event</label>
          <select 
            value={selectedEventId} 
            onChange={(e) => setSelectedEventId(e.target.value)}
            disabled={loading && !events.length}
          >
            <option value="">-- Choose an Event --</option>
            {events.map((ev) => (
              <option key={ev._id} value={ev._id}>{ev.name}</option>
            ))}
          </select>
        </div>

        {selectedEventId && (
          <div className="GM-two-column">
            
            {/* Create Group Form */}
            <div className="GM-card">
              <h3 className="card-title">Create New Group</h3>
              <p style={{marginBottom: "1rem", color: "#94a3b8", fontSize: "0.9rem"}}>
                Capacity: {groups.length} / {selectedEvent?.maxGroups || "?"}
              </p>
              <form onSubmit={handleCreateGroup} className="GM-form">
                <input 
                  type="text" 
                  placeholder="Group Name" 
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  disabled={loading || (selectedEvent && groups.length >= selectedEvent.maxGroups)}
                />
                <button type="submit" disabled={loading || !groupName.trim() || (selectedEvent && groups.length >= selectedEvent.maxGroups)}>
                  Create Group
                </button>
              </form>
            </div>

            {/* Groups Table */}
            <div className="GM-card">
              <h3 className="card-title">Existing Groups ({groups.length})</h3>
              {loading && groups.length === 0 ? (
                <p>Loading groups...</p>
              ) : groups.length > 0 ? (
                <div className="table-responsive">
                  <table className="events-table">
                    <thead>
                      <tr>
                        <th>Group Name</th>
                        <th>Payment</th>
                        <th>Attendance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groups.map(g => (
                        <tr key={g._id}>
                          <td>{g.groupName}</td>
                          <td>
                            <button 
                              className={`status-badge ${g.isPaymentDone ? 'completed' : 'ongoing'}`}
                              onClick={() => toggleAttribute(g._id, 'isPaymentDone', g.isPaymentDone)}
                              style={{cursor: 'pointer'}}
                            >
                              {g.isPaymentDone ? 'Paid' : 'Pending'}
                            </button>
                          </td>
                          <td>
                            <button 
                              className={`status-badge ${g.isPresent ? 'completed' : 'ongoing'}`}
                              onClick={() => toggleAttribute(g._id, 'isPresent', g.isPresent)}
                              style={{cursor: 'pointer'}}
                            >
                              {g.isPresent ? 'Present' : 'Absent'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p style={{color: '#94a3b8'}}>No groups have been created yet.</p>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default GroupManagement;
