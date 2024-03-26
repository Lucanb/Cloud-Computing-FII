import React, { useState } from 'react';

const AddAlbumModal = ({ onClose }) => {
    const [formData, setFormData] = useState({
        title: '',
        year: '',
        artist: '',
        link: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/albums/save', {
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
            console.error('Error saving album:', error);
        }
    };


    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Add Album</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Title" />
                    <input type="text" name="year" value={formData.year} onChange={handleChange} placeholder="Year" />
                    <input type="text" name="artist" value={formData.artist} onChange={handleChange} placeholder="Artist" />
                    <input type="text" name="link" value={formData.link} onChange={handleChange} placeholder="Link" />
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default AddAlbumModal;