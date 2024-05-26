import React, { useState } from 'react';
import './MessPageStyle.css';

const SendMessagePage = ({ onSendMessage }) => {
    const [recipientName, setRecipientName] = useState('');
    const [fileLink, setFileLink] = useState('');
    const [notifications] = useState([
        "Notification 1", "Notification 2", "Notification 3", 
        "Notification 4", "Notification 5", "Notification 6",
        "Notification 7", "Notification 8", "Notification 9"
    ]);

    const handleSend = () => {
        onSendMessage({ recipientName, fileLink });
        setRecipientName('');
        setFileLink('');
    };

    return (
        <div className="container">
            <div className="send-message-form">
                <h1>Send Message</h1>
                <input
                    className="input-field"
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Recipient's Name"
                />
                <input
                    className="input-field"
                    type="text"
                    value={fileLink}
                    onChange={(e) => setFileLink(e.target.value)}
                    placeholder="File Link"
                />
                <button className="send-button" onClick={handleSend}>Send</button>
            </div>
            <div className="notifications-bar">
                <h2>Notifications</h2>
                {notifications.map((notification, index) => (
                    <button key={index} className="notification-button">{notification}</button>
                ))}
            </div>
            <div className="playlist">
                <h2>Music Player</h2>
                <audio controls className="audio-player">
                    <source src="music-url" type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio>
            </div>
        </div>
    );
};

export default SendMessagePage;
