import React, { useState, useEffect, useRef, useContext, useCallback } from "react";
import './PartyPage.css';
import { useLocation } from 'react-router-dom';
import { AuthContext } from "../middleware";

const UserPagePlay = () => {
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
    const [partyId, setPartyId] = useState(null);

    const location = useLocation();
    const userId = user?.uid;

    useEffect(() => {
        const possibleId = location.pathname.split("/")[2];
        setPartyId(possibleId);
    }, [location.pathname]);

    useEffect(() => {
        if (userId) {
            fetchUserSongs(userId);
        }
    }, [userId]);

    const fetchQueue = useCallback(async () => {
        if (!partyId) {
            console.error("Party ID is required to fetch queue");
            return;
        }
        try {
            const partyResponse = await fetch(`https://party-functions-luca.azurewebsites.net/api/party/get-party-by-id/?partyId=${partyId}`);
            if (!partyResponse.ok) {
                throw new Error('Failed to fetch playlist');
            }
            const partyData = await partyResponse.json();
            const playlistData = partyData.playlist;
            const guestsData = partyData.guests;
            setGuests(guestsData);
            console.log('Fetched playlist data:', partyData);

            const detailedSongs = await Promise.all(playlistData.map(async songId => {
                try {
                    const songResponse = await fetch(`https://party-functions-luca.azurewebsites.net/api/songs/getById/${songId}`);
                    if (!songResponse.ok) {
                        console.warn(`Song with ID ${songId} not found in existing songs`);
                        return undefined;
                    }
                    return await songResponse.json();
                } catch (error) {
                    console.warn(`Error fetching song with ID ${songId}:`, error);
                    return undefined;
                }
            }));
            setQueue(detailedSongs.filter(song => song !== undefined));
        } catch (error) {
            console.error('Error fetching queue:', error);
        }
    }, [partyId]);

    useEffect(() => {
        if (partyId) {
            fetchQueue();
        }
    }, [partyId, fetchQueue]);

    const fetchUserSongs = async (userId) => {
        try {
            const response = await fetch(`https://music-app-luca.azurewebsites.net/api/songs/getAll/${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch songs');
            }
            const data = await response.json();
            setExistingSongs(data);
        } catch (error) {
            console.error('Error fetching user songs:', error);
        }
    };

    const updatePlaylist = async (partyId, songId, add = true) => {
        if (!partyId || !songId) {
            console.error("Party ID and Song ID are required");
            return;
        }
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

        } catch (error) {
            console.error('Error updating playlist:', error);
            alert(`Failed to update playlist: ${error.message}`);
        }
    };

    const deleteFromPlaylist = async (partyId, songId) => {
        if (!partyId || !songId) {
            console.error("Party ID and Song ID are required");
            return;
        }
        try {
            const response = await fetch('https://party-functions-luca.azurewebsites.net/api/party/delete-from-playlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ partyId, songId }),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(errorResponse.message || 'Network response was not ok');
            }

        } catch (error) {
            console.error('Error deleting song from playlist:', error);
            alert(`Failed to delete song from the playlist: ${error.message}`);
        }
    };

    const handlePlayPause = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (!currentSong && queue.length > 0) {
            setCurrentSong(queue[0]);
            setIsPlaying(true);
        } else {
            if (isPlaying) {
                audio.pause();
            } else {
                audio.play().catch(error => {
                    console.error('Error playing audio:', error);
                    setIsPlaying(false);
                });
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleAddSong = async () => {
        if (selectedSong) {
            const song = existingSongs.find(song => song._id === selectedSong);
            if (song) {
                try {
                    if (partyId != null)
                        await updatePlaylist(partyId, selectedSong, true);
                    setSongs(prevSongs => [...prevSongs, song]);
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

        // Update playlist in the database
        await updatePlaylist(partyId, songId, false);
    };

    const toggleQueue = () => {
        setShowQueue(!showQueue);
    };

    const handleSongClick = async (song) => {
        setQueue(prevQueue => [...prevQueue, song]);
        if (!currentSong) {
            setCurrentSong(song);
            setIsPlaying(true);
        }
    };

    const playNextSong = useCallback(() => {
        setQueue(prevQueue => {
            if (prevQueue.length > 1) {
                const nextSong = prevQueue[1];
                setCurrentSong(nextSong);
                deleteFromPlaylist(partyId, prevQueue[0]._id); // Delete the song from the database

                return prevQueue.slice(1);
            } else {
                setCurrentSong(null);
                setIsPlaying(false);
                return [];
            }
        });
    }, [partyId]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const endListener = () => playNextSong();
        audio.addEventListener('ended', endListener);
        return () => {
            audio.removeEventListener('ended', endListener);
        };
    }, [playNextSong]);

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
    }, [currentSong, isPlaying]);

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
                <h1>Party Guest Page</h1>
                <div className="controls">
                    <div className="time-picker">
                        <input type="time" defaultValue="19:00" />
                    </div>
                    <button className="action-button" onClick={toggleQueue}>Show Queue</button>
                    <button className="party-control-button" onClick={handlePlayPause}>
                        {isPlaying ? 'Pause Music' : 'Play Music'}
                    </button>
                </div>
            </header>
            {showQueue && (
                <div className="queue-list">
                    <h2>Songs in Queue</h2>
                    {Array.isArray(queue) && queue.map((song, index) => (
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
                    </div>
                ))}</div>

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
        </div>
    );
};

export default UserPagePlay;