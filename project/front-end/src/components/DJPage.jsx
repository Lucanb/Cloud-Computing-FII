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
    const [remixUrl, setRemixUrl] = useState("");
    const handleAddSong = (song) => {
        setSelectedSongs([...selectedSongs, song]);
        console.log(JSON.stringify(song))
    };

    const handleRemoveSong = (song) => {
        setSelectedSongs(selectedSongs.filter(selectedSong => selectedSong !== song));
    };

    const handleSendForRemix = async () => {
        if (selectedSongs.length === 0) {
            alert("Please select some songs to remix.");
            return;
        }
    
        try {
            const response = await fetch('https://your-api-url.com/remix', { //aici se va apela functia pentru remix
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ songs: selectedSongs.map(song => song.link) }) // assuming 'link' is the URL to the song file
            });
            
            const data = await response.json();
            
            if(response.ok) {
                setRemixUrl(data.remixUrl); // Assuming the API returns a property 'remixUrl' that is the URL of the remixed song
                console.log("Remix created successfully:", data.remixUrl);
            } else {
                throw new Error('Failed to create remix');
            }
        } catch (error) {
            console.error("Error sending songs for remix:", error);
            alert("Failed to send songs for remix.");
        }
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
                    <source src={remixUrl || "placeholder.mp3"} type="audio/mpeg" /> {/* Provide a placeholder or leave it empty if remixUrl is not set */}
                    Your browser does not support the audio element.
                </audio>
            </div>
            <button className="action-button" onClick={goBack}>Go Back to Party Planner</button>
        </div>
    );
};

export default DJPage;
