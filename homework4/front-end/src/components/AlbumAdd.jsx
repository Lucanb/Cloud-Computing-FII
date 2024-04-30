import React, {useContext, useState} from 'react';
import './Forms.css';
import {AuthContext} from "../middleware";

const AddAlbumModal = ({ onClose }) => {
    const user = useContext(AuthContext);
    console.log("Artist page:",user);
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
            const response = await fetch(`https://my-music-app.azurewebsites.net/api/albums/save/${user.uid}`, {
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
            console.error('Error saving album:', error);
        }
    };


    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Add Album</h2>
                <form onSubmit={handleSubmit} className='addForm'>
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