import React, { useState } from 'react';

const EditArtistModal = ({ artistData,onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        members: '',
        link: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/api/artists/updateOne/${artistData._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            onClose();
            console.log('Artist updated successfully!');
        } catch (error) {
            console.error('Error updating artist:', error);
        }
    };
    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Edit Artist</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
                    <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
                    <input type="text" name="members" value={formData.members} onChange={handleChange} placeholder="Members" />
                    <input type="text" name="link" value={formData.link} onChange={handleChange} placeholder="Link" />
                    <button type="submit">Update</button>
                </form>
            </div>
        </div>
    );
};


export default EditArtistModal;
