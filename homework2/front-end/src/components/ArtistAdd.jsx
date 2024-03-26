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
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        onClose();
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
