import React, { useState, useEffect, useRef, useContext } from "react";
import './PartyPage.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from "../middleware";

const PartyPage = () => {
    const [guests, setGuests] = useState(["Alice", "Bob", "Charlie"]);
    const [songs, setSongs] = useState([]);
    const [queue, setQueue] = useState([]);
    const [showQueue, setShowQueue] = useState(false);
    const [newGuest, setNewGuest] = useState("");
    const [existingSongs, setExistingSongs] = useState([]);
    const [selectedSong, setSelectedSong] = useState("");
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);
    const user = useContext(AuthContext);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            const userId = user.uid;
            fetchUserSongs(userId);
        }
    }, [user]);

    const fetchUserSongs = async (userId) => {
        try {
            const response = await fetch(`https://music-app-luca.azurewebsites.net/api/songs/getAll/${userId}`);
            const data = await response.json();
            setExistingSongs(data);
        } catch (error) {
            console.error('Error fetching user songs:', error);
        }
    };

    const handleCreateParty = () => {
        alert("Party created with the current guests and playlist!");
    };

    const handlePlayPause = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
        } else {
            audio.play().catch(error => {
                console.error('Error playing audio:', error);
                setIsPlaying(false);
            });
        }
        setIsPlaying(!isPlaying);
    };

    const navigateToDJPage = () => {
        const currentPath = location.pathname;
        const id = currentPath.split("/")[2];
        if (id !== 'default') {
            navigate(`/party-dj/${id}`, { state: { proposedSongs: songs } });
        } else {
            alert('Please Create The Party first and navigate on it!');
        }
    };

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
        if (selectedSong) {
            const song = existingSongs.find(song => song._id === selectedSong);
            setSongs([...songs, song]);
            setSelectedSong("");
        }
    };

    const handleRemoveSong = (index) => {
        setSongs(songs.filter((_, i) => i !== index));
    };

    const handleDeleteParty = () => {
        setGuests([]);
        setSongs([]);
        setQueue([]);
        setCurrentSong(null);
        setIsPlaying(false);
    };

    const toggleQueue = () => {
        setShowQueue(!showQueue);
    };

    const handleSongClick = (song) => {
        setQueue(prevQueue => [...prevQueue, song]);
        if (!currentSong) {
            setCurrentSong(song);
            setIsPlaying(true);
        }
    };

    const playNextSong = () => {
        setQueue(prevQueue => {
            if (prevQueue.length > 1) {
                const nextSong = prevQueue[1];
                setCurrentSong(nextSong);
    
                return prevQueue.slice(1);
            } else {
                setCurrentSong(null);
                setIsPlaying(false);
                return [];
            }
        });
    };
    
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
    
        const endListener = () => playNextSong();
        audio.addEventListener('ended', endListener);
        return () => {
            audio.removeEventListener('ended', endListener);
        };
    }, []);
    
    useEffect(() => {
        if (currentSong) {
            audioRef.current.src = currentSong.link; // Ensure src is updated
            audioRef.current.load(); // Load the new audio source
            if (isPlaying) {
                audioRef.current.play().catch(error => {
                    console.error('Error playing the new source:', error);
                    setIsPlaying(false);
                });
            }
        }
    }, [currentSong]);
    
    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            if (isPlaying) {
                audio.play().catch(error => {
                    console.error('Playback error:', error);
                    setIsPlaying(false);
                });
            } else {
                audio.pause();
            }
        }
    }, [isPlaying]);

    return (
        <div className="App">
            <header className="party-header">
                <h1>Party Planner</h1>
                <div className="controls">
                    <div className="time-picker">
                        <input type="time" defaultValue="19:00" />
                    </div>
                    <button className="action-button" onClick={toggleQueue}>Show Queue</button>
                    <button className="action-button" onClick={navigateToDJPage}>Go to DJ Page</button>
                    <button className="party-control-button" onClick={handlePlayPause}>
                        {isPlaying ? 'DJ is playing' : isPlaying ? 'Pause Music' : 'Play Music'}
                    </button>
                </div>
            </header>
            {showQueue && (
                <div className="queue-list">
                    <h2>Songs in Queue</h2>
                    {queue.map((song, index) => (
                        <div key={index} className="queue-item">{song.title} - by {song.artist}</div>
                    ))}
                </div>
            )}
            <audio ref={audioRef} />
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
                {location.pathname === "/party/default" && (
                    <button className="create-party-button" onClick={handleCreateParty}>Create Party</button>
                )}
            </div>
            <div className="playlist-container">
                <h2>Playlist</h2>
                {songs.map((song, index) => (
                    <div key={index} className="song-item">
                        {song.title} - by {song.artist}
                        <div>
                        <button className="action-button" onClick={() => handleSongClick(song)}>Add to Queue</button>
                        <button className="action-button" onClick={() => handleRemoveSong(index)}>Remove</button>
                    </div></div>
                ))}
                <select
                    value={selectedSong}
                    onChange={(e) => setSelectedSong(e.target.value)}
                    className="party-input"
                >
                    <option value="">Select existing song</option>
                    {existingSongs.map((song) => (
                        <option key={song._id} value={song._id}>
                            {song.title} - by {song.artist} - {song.album}
                        </option>
                    ))}
                </select>
                <button className="action-button" onClick={handleAddSong}>Add Song</button>
                <button className="party-control-button" onClick={handlePlayPause}>
                    {isPlaying ? 'Pause Music' : 'Play Music'}
                </button>
            </div>
            <button className="party-control-button" onClick={handleDeleteParty}>Delete Party</button>
        </div>
    );
};

export default PartyPage;
