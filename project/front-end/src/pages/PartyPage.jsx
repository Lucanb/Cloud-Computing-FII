import React, { useState, useEffect, useRef, useContext } from "react";
import './PartyPage.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from "../middleware";

const PartyPage = () => {
    const [guests, setGuests] = useState([]);
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
    const currentPath = location.pathname;
    const partyId = currentPath.split("/")[2];
    const userId = user?.uid;

    useEffect(() => {
        if (user) {
            fetchUserSongs(userId);
        }
    }, [user]);

    useEffect(() => {
        if (partyId && user && existingSongs.length > 0) {
            fetchPartyDetails(partyId);
        } else {
            console.log('Fetching party details postponed due to missing data.');
        }
    }, [partyId, user, existingSongs]);

    const fetchUserSongs = async (userId) => {
        try {
            const response = await fetch(`https://music-app-luca.azurewebsites.net/api/songs/getAll/${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch songs');
            }
            const data = await response.json();
            console.log('Fetched user songs:', data);
            setExistingSongs(data);
        } catch (error) {
            console.error('Error fetching user songs:', error);
        }
    };

    const fetchPartyDetails = async (partyId) => {
        try {
            const playlistResponse = await fetch(`https://party-functions-luca.azurewebsites.net/api/party/get-all-songs/${partyId}`);
            if (!playlistResponse.ok) {
                throw new Error('Failed to fetch playlist');
            }
            const playlistData = await playlistResponse.json();
            console.log('Fetched playlist data:', playlistData);

            const detailedSongs = playlistData.map(songId => {
                const foundSong = existingSongs.find(song => song._id === songId);
                if (!foundSong) {
                    console.warn(`Song with ID ${songId} not found in existing songs`);
                }
                return foundSong;
            }).filter(song => song !== undefined);

            console.log('Detailed songs:', detailedSongs);
            setSongs(detailedSongs);
            setQueue(detailedSongs); // Set all songs to queue
        } catch (error) {
            console.error('Error fetching party details:', error);
        }
    };

    const handleCreateParty = async () => {
        if (!user || !user.uid) {
            alert("User must be logged in to create a party.");
            return;
        }

        try {
            const response = await fetch('https://music-app-luca.azurewebsites.net/api/party/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ admin: user.uid }),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(errorResponse.message || 'Network response was not ok');
            }

            const partyData = await response.json();
            alert(`Party created!`);

            await updateGuestList(partyData.id, guests);

            for (const song of songs) {
                await updatePlaylist(partyData.id, song._id, true);
            }

            navigate(`/party/${partyData.id}`);

        } catch (error) {
            console.error('Error creating party:', error);
            alert(`Failed to create party: ${error.message}`);
        }
    };

    const updateGuestList = async (partyId, guests) => {
        try {
            for (const guest of guests) {
                const response = await fetch('https://party-functions-luca.azurewebsites.net/api/party/update-guest-list', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ partyId, guestId: guest, add: true }),
                });

                if (!response.ok) {
                    const errorResponse = await response.json();
                    throw new Error(errorResponse.message || 'Network response was not ok');
                }
            }

        } catch (error) {
            console.error('Error updating guest list:', error);
            alert(`Failed to update guest list: ${error.message}`);
        }
    };

    const updatePlaylist = async (partyId, songId, add = true) => {
        try {
            const response = await fetch('https://party-functions-luca.azurewebsites.net/api/party/update-playlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ partyId, songId, add }),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(errorResponse.message || 'Network response was not ok');
            }

            return response;
        } catch (error) {
            console.error('Error updating playlist:', error);
            alert(`Failed to update playlist: ${error.message}`);
        }
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
        if (partyId) {
            navigate(`/party-dj/${partyId}`);
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

    const handleRemoveGuest = async (index) => {
        const guestToRemove = guests[index];
        setGuests(guests.filter((_, i) => i !== index));

        if (partyId != null && partyId !== "default") {
            try {
                const response = await fetch('https://party-functions-luca.azurewebsites.net/api/party/update-guest-list', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ partyId, guestId: guestToRemove, add: false }),
                });

                if (!response.ok) {
                    const errorResponse = await response.json();
                    throw new Error(errorResponse.message || 'Network response was not ok');
                }
            } catch (error) {
                console.error('Error updating guest list:', error);
                alert(`Failed to update guest list: ${error.message}`);
            }
        }
    };

    const handleAddSong = async () => {
        if (selectedSong) {
            const song = existingSongs.find(song => song._id === selectedSong);
            if (song) {
                try {
                    if (partyId != null && partyId !== "default") {
                        const response = await updatePlaylist(partyId, selectedSong, true);
                        if (response.ok) {
                            setSongs(prevSongs => [...prevSongs, song]);
                            setQueue(prevQueue => [...prevQueue, song]);
                        } else {
                            console.error('Failed to add song to playlist:', response.statusText);
                            alert('Failed to add song to the playlist');
                        }
                    } else {
                        setSongs(prevSongs => [...prevSongs, song]);
                        setQueue(prevQueue => [...prevQueue, song]);
                    }
                    setSelectedSong("");
                } catch (error) {
                    console.error('Error adding song to playlist:', error);
                    alert('Failed to add song to the playlist');
                }
            }
        }
    };

    const handleRemoveSong = async (index) => {
        const songId = songs[index]._id;
        setSongs(songs.filter((_, i) => i !== index));
        setQueue(queue.filter((_, i) => i !== index));

        if (partyId != null && partyId !== "default") {
            await updatePlaylist(partyId, songId, false);
        }
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
            audioRef.current.src = currentSong.link;
            audioRef.current.load();
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
                        {isPlaying ? 'Pause Music' : 'Play Music'}
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
                        </div>
                    </div>
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
