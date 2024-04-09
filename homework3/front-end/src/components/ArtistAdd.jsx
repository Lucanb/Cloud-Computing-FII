import React, {useContext, useState} from 'react';
import './Forms.css';
import {AuthContext} from "../middleware";

const AddArtistModal = ({ onClose }) => {
    const user = useContext(AuthContext);
    console.log("Artist page:",user);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        members: '',
        link: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;
        if (name === "year") {
            // Verifică și validează formatul anului utilizând o expresie regulată
            const isValidYear = /^\d{4}$/.test(value);
            if (isValidYear) {
                // Convertirea anului într-un obiect de tip Date
                newValue = new Date(Number(value), 0); // '0' reprezintă luna ianuarie
            }
        }
        setFormData({ ...formData, [name]: newValue });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`https://us-central1-homework3-project.cloudfunctions.net/gcp-func-novus/api/artists/save/${user.uid}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            onClose();
            window.location.reload();
        } catch (error) {
            console.error('Error saving artist:', error);
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Add Artist</h2>
                <form onSubmit={handleSubmit} className='addForm'>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
                    <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
                    <input type="text" name="members" value={formData.members} onChange={handleChange} placeholder="Members" />
                    <input type="text" name="link" value={formData.link} onChange={handleChange} placeholder="Link" />
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default AddArtistModal;
