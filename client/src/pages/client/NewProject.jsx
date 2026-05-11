import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import '../../styles/client/newProject.css'
import API from "../../config/API";

const NewProject = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [budget, setBudget] = useState(0);
    const [skills, setSkills] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (!title || !description || !budget || !skills) {
            return alert("Please fill all fields!");
        }

        try {
            setLoading(true);

            // Privacy Update: Ab hum clientId, clientName, ya clientEmail body mein nahi bhej rahe hain.
            // Backend in details ko Token (req.user) se khud nikaal lega.
            const projectData = {
                title,
                description,
                budget,
                skills // Ye string format mein jayega aur backend split kar lega
            };

            await API.post("api/projects/new-project", projectData);
            
            alert("New project added successfully!!");
            navigate('/client');

        } catch (err) {
            console.error("Project posting failed:", err);
            alert("Operation failed! Please ensure you are logged in.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="new-project-page">
            <h3>Post New Project</h3>

            <div className="new-project-form">
                <div className="form-floating mb-3">
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder=" "
                        onChange={(e) => setTitle(e.target.value)} 
                    />
                    <label>Project Title</label>
                </div>

                <div className="form-floating mb-3">
                    <textarea 
                        className="form-control" 
                        placeholder=" "
                        style={{ height: '150px' }}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <label>Description</label>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <div className="form-floating mb-3">
                            <input 
                                type="number" 
                                className="form-control" 
                                placeholder=" "
                                onChange={(e) => setBudget(e.target.value)} 
                            />
                            <label>Budget (in ₹)</label>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-floating mb-3">
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder=" "
                                onChange={(e) => setSkills(e.target.value)} 
                            />
                            <label>Required skills (comma separated)</label>
                        </div>
                    </div>
                </div>

                <button 
                    className='btn btn-primary w-100 mt-3' 
                    onClick={handleSubmit} 
                    disabled={loading}
                >
                    {loading ? "Posting..." : "Submit Project"}
                </button>
            </div>
        </div>
    )
}

export default NewProject;