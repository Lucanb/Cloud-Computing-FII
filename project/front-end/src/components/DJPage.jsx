import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './DJPage.css';

const DJPage = () => {
    const navigate = useNavigate();
    const { partyId } = useParams();
    const [proposedSongs, setProposedSongs] = useState([]);
    const [selectedSongs, setSelectedSongs] = useState([]);
    const [remixUrl, setRemixUrl] = useState("");

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const response = await fetch(`https://party-functions-luca.azurewebsites.net/api/party/get-all-songs?partyId=${partyId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch songs');
                }
                const data = await response.json();
                setProposedSongs(data);
            } catch (error) {
                console.error('Error fetching songs:', error);
            }
        };

        fetchSongs();
    }, [partyId]);

    const handleAddSong = (song) => {
        setSelectedSongs([...selectedSongs, song]);
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
            const response = await fetch('https://music-functions-luca.azurewebsites.net/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ playlist: selectedSongs.map(song => ({ link: song.link, title: song.title, artist: song.artist })) })
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Remix created successfully:", data.urls[0]);
                const decodedUrl = decodeURIComponent(data.urls[0]); // Decode the URL
                setRemixUrl(decodedUrl); // Assuming the API returns an array of URLs and we're taking the first one
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
                            {song.title} - {song.artist}
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
                            {song.title} - {song.artist}
                        </div>
                    ))}
                </div>
                <button className="action-button" onClick={handleSendForRemix}>Send for Remix</button>
            </div>
            <div className="remix-container">
                <h2>Remix</h2>
                {remixUrl && (
                    <audio controls>
                        <source src={remixUrl} type="audio/mpeg" />
                        Your browser does not support the audio element.
                    </audio>
                )}
            </div>
            <button className="action-button" onClick={goBack}>Go Back to Party Planner</button>
        </div>
    );
};

export default DJPage;
