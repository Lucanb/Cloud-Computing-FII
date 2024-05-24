import React, { useState } from 'react';
import './MessPageStyle.css';


const NotificationBar = ({ messages }) => {
    const [selectedSong, setSelectedSong] = useState('');

    return (
        <div className="notifications-bar">
            <h2>Notifications</h2>
            {messages.map((msg, index) => (
                <button
                    key={index}
                    className="notification-button"
                    onClick={() => setSelectedSong(msg.fileLink)}
                >
                    {msg.recipientName}
                </button>
            ))}
            <div className="playlist">
                {selectedSong && (
                    <audio src={selectedSong} controls autoPlay />
                )}
            </div>
        </div>
    );
};

export default NotificationBar;
