// DJPage.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './DJPage.css';

const DJPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Retrieve proposed songs passed from PartyPage or use default list
    const initialProposedSongs = location.state?.proposedSongs || ["Song 1", "Song 2", "Song 3", "Song 4"];
    const [proposedSongs, setProposedSongs] = useState(initialProposedSongs);
    const [selectedSongs, setSelectedSongs] = useState([]);

    const handleAddSong = (song) => {
        setSelectedSongs([...selectedSongs, song]);
    };

    const handleRemoveSong = (song) => {
        setSelectedSongs(selectedSongs.filter(selectedSong => selectedSong !== song));
    };

    const handleSendForRemix = () => {
        console.log("Songs sent for remix:", selectedSongs);
    };

    const goBack = () => {
        navigate(-1);
    };

    return (
        <div>
            <h1>DJ Control Page</h1>
            <div className="proposed-songs-container">
                <h2>Proposed Songs</h2>
                <div className="songs-list">
                    {proposedSongs.map((song, index) => (
                        <div key={index} className="song-item">
                            {song.title} - {song.artist} {/* Ensure you are displaying strings, not objects */}
                            <button onClick={() => handleAddSong(song)}>+</button>
                            <button onClick={() => handleRemoveSong(song)}>-</button>
                        </div>
                    ))}
                </div>
            </div>
            <div className="selected-songs-container">
                <h2>Selected Songs for Remix</h2>
                <div className="songs-list">
                    {selectedSongs.map((song, index) => (
                        <div key={index} className="song-item">
                            {song.title} - {song.artist} {/* Access the title and artist properties of the song */}
                        </div>
                    ))}
                </div>
                <button className="action-button" onClick={handleSendForRemix}>Send for Remix</button>
            </div>
            <div className="remix-container">
                <h2>Remix</h2>
                <audio controls>
                    <source src="remix-url" type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio>
            </div>
            <button className="action-button" onClick={goBack}>Go Back to Party Planner</button>
        </div>
    );
};

export default DJPage;
