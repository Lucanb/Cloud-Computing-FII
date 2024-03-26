import React, { useState } from 'react';

const AddArtistModal = ({ onClose }) => {
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
            const response = await fetch('http://localhost:5000/api/artists/save', {
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
        } catch (error) {
            console.error('Error saving artist:', error);
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Add Artist</h2>
                <form onSubmit={handleSubmit}>
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
