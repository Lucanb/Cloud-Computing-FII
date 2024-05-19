import React, {useContext, useState} from "react";
import './Forms.css';
import {AuthContext} from "../middleware";

const AddSongModal = ({ isOpen, onClose }) => {
    const user = useContext(AuthContext);
    console.log("Artist page:",user);
    const [songData, setSongData] = useState({
        title: "",
        artist: "",
        album: "",
        releaseDate: "",
        link: "",
        duration: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSongData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`https://music-app-luca.azurewebsites.net/api/songs/save/${user.uid}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(songData),
            });
            console.log(response);
            console.log(songData)
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            setSongData({
                title: "",
                artist: "",
                album: "",
                releaseDate: "",
                link: "",
                duration: "",
            });

            onClose();
            window.location.reload();
        } catch (error) {
            console.error('Error adding song:', error);
        }
    };

    return (
        <>
            {isOpen && (
                <div className="modal">
                    <div className="modal-content">
            <span className="close" onClick={onClose}>
              &times;
            </span>
                        <h2>Add New Song</h2>
                        <form onSubmit={handleSubmit} className="addForm">
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={songData.title}
                                onChange={handleChange}
                                required
                                placeholder="Title"
                            />
                            <input
                                type="text"
                                id="artist"
                                name="artist"
                                value={songData.artist}
                                onChange={handleChange}
                                required
                                placeholder="Artist"
                            />
                            <input
                                type="text"
                                id="album"
                                name="album"
                                value={songData.album}
                                onChange={handleChange}
                                required
                                placeholder="Album"
                            />
                            <input
                                type="date"
                                id="releaseDate"
                                name="releaseDate"
                                value={songData.releaseDate}
                                onChange={handleChange}
                                required
                                placeholder="Release Date"
                            />
                            <input
                                type="text"
                                id="link"
                                name="link"
                                value={songData.link}
                                onChange={handleChange}
                                required
                                placeholder="Link"
                            />
                            <input
                                type="text"
                                id="duration"
                                name="duration"
                                value={songData.duration}
                                onChange={handleChange}
                                required
                                placeholder="Duration"
                            />
                            <button type="submit">Add Song</button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddSongModal;