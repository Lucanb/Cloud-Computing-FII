import React, { useState } from "react";

const AddSongModal = ({ isOpen, onClose }) => {
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

    const handleSubmit = (e) => {
        e.preventDefault();
        // Trimiterea datelor către backend pentru adăugarea melodiei
        console.log("Submitted song data:", songData);
        // Închiderea modalei după submit
        onClose();
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
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="title">Title:</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={songData.title}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="artist">Artist:</label>
                            <input
                                type="text"
                                id="artist"
                                name="artist"
                                value={songData.artist}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="album">Album:</label>
                            <input
                                type="text"
                                id="album"
                                name="album"
                                value={songData.album}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="releaseDate">Release Date:</label>
                            <input
                                type="date"
                                id="releaseDate"
                                name="releaseDate"
                                value={songData.releaseDate}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="link">Link:</label>
                            <input
                                type="text"
                                id="link"
                                name="link"
                                value={songData.link}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="duration">Duration:</label>
                            <input
                                type="text"
                                id="duration"
                                name="duration"
                                value={songData.duration}
                                onChange={handleChange}
                                required
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
