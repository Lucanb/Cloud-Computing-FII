import React, { useState, useEffect, useRef } from 'react';
import './MessPageStyle.css';

const NotificationBar = ({ messages }) => {
    const [selectedSong, setSelectedSong] = useState('');
    const audioRef = useRef(null);  // Use ref to directly manipulate the audio element

    // This effect ensures the audio plays automatically when selectedSong changes
    useEffect(() => {
        if (selectedSong && audioRef.current) {
            audioRef.current.load();  // Reload the audio element with the new source
            audioRef.current.play();  // Play the new source
        }
    }, [selectedSong]);  // Dependency array ensures this runs only when selectedSong changes

    const handlePlay = (link) => {
        if (link) {
            console.log("Playing:", link);
            setSelectedSong(link);
        } else {
            console.error("Link is undefined.");
        }
    };

    return (
        <div className="notifications-bar">
            <h2>Notifications</h2>
            {messages.length > 0 ? (
                messages.map((msg, index) => (
                    <button
                        key={index}
                        className="notification-button"
                        onClick={() => handlePlay(msg.link_melodie)}
                    >
                        {msg.id_reciever || "Unnamed"}
                    </button>
                ))
            ) : (
                <p>No notifications available.</p>
            )}
            <div className="playlist">
                {selectedSong && (
                    <audio controls autoPlay ref={audioRef}>
                        <source src={selectedSong} type="audio/mpeg" />
                        Your browser does not support the audio element.
                    </audio>
                )}
            </div>
        </div>
    );
};

export default NotificationBar;
