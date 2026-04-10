import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { eventAPI } from "../api/eventAPI";
import "../css/AddEventForm.css";

const AddEvent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    department: "",
    coordinator: "",
    maxGroups: "",
    minParticipants: "",
    maxParticipants: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [generalError, setGeneralError] = useState("");


  // Example static options – replace with API data later
  const departments = [
    { id: "CSE", name: "Computer Science" },
    { id: "IT", name: "Information Technology" },
    { id: "EC", name: "Electronics & Communication" },
  ];

  const coordinators = [
    { id: "COOR001", name: "John Doe" },
    { id: "COOR002", name: "Jane Smith" },
    { id: "COOR003", name: "Rahul Patel" },
  ];

  useEffect(() => {
    if (isEditMode) {
      fetchEventData();
    }
  }, [id]);

  const fetchEventData = async () => {
    try {
      const response = await eventAPI.getEventById(token, id);
      const event = response.data || response.event || response; 
      
      // Format date for input type="date" (YYYY-MM-DD)
      const eventDate = event.date ? new Date(event.date).toISOString().split('T')[0] : "";

      setFormData({
        name: event.name || "",
        description: event.description || "",
        date: eventDate,
        department: event.department || "",
        coordinator: event.coordinator || "",
        maxGroups: event.maxGroups || "",
        minParticipants: event.minParticipants || "",
        maxParticipants: event.maxParticipants || "",
      });
    } catch (error) {
      setGeneralError("Failed to fetch event data: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (generalError) setGeneralError("");
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Event name is required";
    if (!formData.date) newErrors.date = "Event date is required";
    if (!formData.department) newErrors.department = "Department is required";
    if (!formData.coordinator) newErrors.coordinator = "Coordinator is required";

    if (!formData.maxGroups) newErrors.maxGroups = "Max groups is required";
    else if (Number(formData.maxGroups) <= 0) newErrors.maxGroups = "Must be greater than 0";

    if (!formData.minParticipants) newErrors.minParticipants = "Min participants is required";
    if (!formData.maxParticipants) newErrors.maxParticipants = "Max participants is required";

    const minP = Number(formData.minParticipants);
    const maxP = Number(formData.maxParticipants);

    if (formData.minParticipants && formData.maxParticipants && minP > maxP) {
      newErrors.minParticipants = "Min cannot be greater than Max";
      newErrors.maxParticipants = "Max must be ≥ Min";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const vErrors = validate();
    if (Object.keys(vErrors).length > 0) {
      setErrors(vErrors);
      return;
    }

    if (!token) {
      setGeneralError("You must be logged in to create an event");
      return;
    }

    setIsSubmitting(true);
    setGeneralError("");

    try {
      const eventData = {
        name: formData.name,
        description: formData.description,
        date: formData.date,
        department: formData.department,
        coordinator: formData.coordinator,
        maxGroups: Number(formData.maxGroups),
        minParticipants: Number(formData.minParticipants),
        maxParticipants: Number(formData.maxParticipants),
      };

      if (isEditMode) {
        await eventAPI.updateEvent(token, id, eventData);
        alert("Event updated successfully!");
      } else {
        await eventAPI.createEvent(token, eventData);
        alert("Event created successfully!");
      }
      navigate("/dashboard");
    } catch (error) {
      setGeneralError(error.message || `Failed to ${isEditMode ? 'update' : 'create'} event. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="main-content">
        <div className="add-event-wrapper">
          <p>Loading event data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="add-event-wrapper">
      <h2 className="add-event-title">{isEditMode ? "Edit Event" : "Add Event"}</h2>

      <form className="add-event-form" onSubmit={handleSubmit}>
        {/* Event name */}
        <div className="ae-row">
          <div className="ae-group">
            <label>Event Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Coding Contest"
              disabled={isSubmitting}
            />
            {errors.name && <span className="ae-error">{errors.name}</span>}
          </div>
        </div>

        {/* Description */}
        <div className="ae-row">
          <div className="ae-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Event description..."
              rows="3"
              disabled={isSubmitting}
            ></textarea>
          </div>
        </div>

        {/* Date */}
        <div className="ae-row">
          <div className="ae-group">
            <label>Event Date *</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.date && <span className="ae-error">{errors.date}</span>}
          </div>
        </div>

        {/* Department & Coordinator linking */}
        <div className="ae-row">
          <div className="ae-group">
            <label>Department *</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              disabled={isSubmitting}
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
            {errors.department && <span className="ae-error">{errors.department}</span>}
          </div>

          <div className="ae-group">
            <label>Coordinator *</label>
            <select
              name="coordinator"
              value={formData.coordinator}
              onChange={handleChange}
              disabled={isSubmitting}
            >
              <option value="">Select Coordinator</option>
              {coordinators.map((coor) => (
                <option key={coor.id} value={coor.id}>
                  {coor.name}
                </option>
              ))}
            </select>
            {errors.coordinator && (
              <span className="ae-error">{errors.coordinator}</span>
            )}
          </div>
        </div>

        {/* Limits section */}
        <div className="ae-row">
          <div className="ae-group">
            <label>Max Groups *</label>
            <input
              type="number"
              name="maxGroups"
              value={formData.maxGroups}
              onChange={handleChange}
              min="1"
              placeholder="e.g. 20"
              disabled={isSubmitting}
            />
            {errors.maxGroups && <span className="ae-error">{errors.maxGroups}</span>}
          </div>

          <div className="ae-group">
            <label>Min Participants *</label>
            <input
              type="number"
              name="minParticipants"
              value={formData.minParticipants}
              onChange={handleChange}
              min="1"
              placeholder="e.g. 1"
              disabled={isSubmitting}
            />
            {errors.minParticipants && (
              <span className="ae-error">{errors.minParticipants}</span>
            )}
          </div>

          <div className="ae-group">
            <label>Max Participants *</label>
            <input
              type="number"
              name="maxParticipants"
              value={formData.maxParticipants}
              onChange={handleChange}
              min="1"
              placeholder="e.g. 4"
              disabled={isSubmitting}
            />
            {errors.maxParticipants && (
              <span className="ae-error">{errors.maxParticipants}</span>
            )}
          </div>
        </div>

        {generalError && (
          <div className="ae-error general">{generalError}</div>
        )}

          <button type="submit" className="ae-submit-btn" disabled={isSubmitting}>
            {isSubmitting 
              ? (isEditMode ? "Updating Event..." : "Creating Event...") 
              : (isEditMode ? "Update Event" : "Save Event")}
          </button>
      </form>
      </div>
    </div>
  );
};

export default AddEvent;
