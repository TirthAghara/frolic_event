import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { instituteAPI } from "../api/instituteAPI";
import "../css/InstituteForm.css";

const InstituteForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    coordinator: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [generalError, setGeneralError] = useState("");


  const coordinators = [
    { id: "COOR001", name: "John Doe" },
    { id: "COOR002", name: "Jane Smith" },
    { id: "COOR003", name: "Rahul Patel" },
  ];

  useEffect(() => {
    if (isEditMode) {
      fetchInstituteData();
    }
  }, [id]);

  const fetchInstituteData = async () => {
    try {
      const response = await instituteAPI.getInstituteById(token, id);
      const institute = response.data || response.institute || response;
      setFormData({
        name: institute.name || "",
        description: institute.description || "",
        coordinator: institute.coordinator || "",
      });
    } catch (error) {
      setGeneralError("Failed to fetch institute data: " + error.message);
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

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (generalError) setGeneralError("");
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Institute name is required";
    if (!formData.coordinator) newErrors.coordinator = "Coordinator is required";

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
      setGeneralError("You must be logged in to create an institute");
      return;
    }

    setIsSubmitting(true);
    setGeneralError("");

    try {

      const data = {
        name: formData.name,
        description: formData.description,
        coordinator: formData.coordinator,
      };

      if (isEditMode) {
        await instituteAPI.updateInstitute(token, id, data);
        alert("Institute updated successfully!");
      } else {
        await instituteAPI.createInstitute(token, data);
        alert("Institute created successfully!");
      }
      navigate("/dashboard");
    } catch (error) {
      setGeneralError(
        error.message || `Failed to ${isEditMode ? 'update' : 'create'} institute. Please try again.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="main-content">
        <div className="institute-form-wrapper">
          <p>Loading institute data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="institute-form-wrapper">
        <h2 className="institute-title">{isEditMode ? "Edit Institute" : "Add Institute"}</h2>

        <form className="institute-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Institute Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter Institute Name"
              disabled={isSubmitting}
            />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>
        </div>

        <div className="form-row">          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              placeholder="Short description about the institute"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
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
              <span className="form-error">{errors.coordinator}</span>
            )}
          </div>
        </div>

        {generalError && (
          <div className="form-error general">{generalError}</div>
        )}

          <button 
            type="submit" 
            className="institute-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? (isEditMode ? "Updating Institute..." : "Creating Institute...") 
              : (isEditMode ? "Update Institute" : "Save Institute")}
          </button>
      </form>
      </div>
    </div>
  );
};

export default InstituteForm;
