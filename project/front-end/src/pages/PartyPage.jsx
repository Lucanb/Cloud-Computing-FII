import React, { useState } from "react";
import './PartyPage.css';

const PartyPage = () => {
    const [guests, setGuests] = useState(["Alice", "Bob", "Charlie"]);
    const [songs, setSongs] = useState(["Song 1", "Song 2", "Song 3"]);
    const [queue, setQueue] = useState(["Song 4", "Song 5"]);
    const [showQueue, setShowQueue] = useState(false);
    const [newGuest, setNewGuest] = useState("");
    const [newSong, setNewSong] = useState("");
    const [isPlaying, setIsPlaying] = useState(false);

    const handleAddGuest = () => {
        if (newGuest) {
            setGuests([...guests, newGuest]);
            setNewGuest("");
        }
    };

    const handleRemoveGuest = (index) => {
        setGuests(guests.filter((_, i) => i !== index));
    };

    const handleAddSong = () => {
        if (newSong) {
            setSongs([...songs, newSong]);
            setNewSong("");
        }
    };

    const handleRemoveSong = (index) => {
        setSongs(songs.filter((_, i) => i !== index));
    };

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const handleDeleteParty = () => {
        setGuests([]); // Clear all guests
        setSongs([]); // Clear the playlist
    };

    const toggleQueue = () => {
        setShowQueue(!showQueue);
    };

    return (
        <div className="App">
            <header className="party-header">
                <h1>Party Planner</h1>
                <div className="controls">
                    <div className="time-picker">
                        <input type="time" defaultValue="19:00"/>
                    </div>
                    <button className="action-button" onClick={toggleQueue}>Show Queue</button>
                </div>
            </header>
            {showQueue && (
                <div className="queue-list">
                    <h2>Songs in Queue</h2>
                    {queue.map((song, index) => (
                        <div key={index} className="queue-item">{song}</div>
                    ))}
                </div>
            )}
            <div className="guest-list">
                <h2>Guest List</h2>
                {guests.map((guest, index) => (
                    <div key={index} className="guest-item">
                        {guest}
                        <button className="action-button" onClick={() => handleRemoveGuest(index)}>-</button>
                    </div>
                ))}
                <input
                    type="text"
                    value={newGuest}
                    onChange={(e) => setNewGuest(e.target.value)}
                    placeholder="Add new guest"
                    className="party-input"
                />
                <button className="action-button" onClick={handleAddGuest}>+</button>
            </div>
            <div className="playlist-container">
                <h2>Playlist</h2>
                {songs.map((song, index) => (
                    <div key={index} className="song-item">
                        {song}
                        <button className="action-button" onClick={() => handleRemoveSong(index)}>Remove</button>
                    </div>
                ))}
                <input
                    type="text"
                    value={newSong}
                    onChange={(e) => setNewSong(e.target.value)}
                    placeholder="Add new song"
                    className="party-input"
                />
                <button className="action-button" onClick={handleAddSong}>Add Song</button>
                <button className="party-control-button" onClick={handlePlayPause}>
                    {isPlaying ? 'Pause' : 'Play'}
                </button>
            </div>
            <button className="party-control-button" onClick={handleDeleteParty}>Delete Party</button>
        </div>
    );
};

export default PartyPage;
