import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DJPage.css'

const DJPage = () => {
    const [proposedSongs, setProposedSongs] = useState(["Song 1", "Song 2", "Song 3", "Song 4"]); // Lista de melodii propuse
    const [selectedSongs, setSelectedSongs] = useState([]); // Lista de melodii selectate pentru remix
    const navigate = useNavigate();

    const handleAddSong = (song) => {
        setSelectedSongs([...selectedSongs, song]);
    };

    const handleRemoveSong = (song) => {
        setSelectedSongs(selectedSongs.filter(selectedSong => selectedSong !== song));
    };

    const handleSendForRemix = () => {
        // Logică pentru trimiterea melodiilor selectate pentru remix
        console.log("Melodii trimise pentru remix:", selectedSongs);
    };

    const goBack = () => {
        navigate(-1); // Acesta este echivalentul funcției goBack din versiunile anterioare
    };

    return (
        <div>
            <h1>DJ Control Page</h1>
            <div className="proposed-songs-container">
                <h2>Proposed Songs</h2>
                <div className="songs-list">
                    {proposedSongs.map((song, index) => (
                        <div key={index} className="song-item">
                            {song}
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
                            {song}
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
