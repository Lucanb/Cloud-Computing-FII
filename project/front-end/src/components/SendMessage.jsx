import React, { useState, useEffect } from 'react';
import './MessPageStyle.css';

const SendMessagePage = ({ userId }) => {
    const [recipientName, setRecipientName] = useState('');
    const [fileLink, setFileLink] = useState('');
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        fetchNotifications();
    }, []); // Adaugă dependența dacă vrei să reîncarci notificările pe baza unei condiții

    const fetchNotifications = async () => {
        try {
            const response = await fetch(`https://message-function-luca.azurewebsites.net/api/messages/getRecent/${userId}`);
            const data = await response.json();
            if (response.ok) {
                setNotifications(data);
            } else {
                throw new Error('Failed to fetch notifications');
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
            alert('Failed to fetch notifications:', error.message);
        }
    };

    const handleSend = async () => {
        const messageData = {
            id_user2: recipientName,
            link_melodie: fileLink
        };

        try {
            const response = await fetch(`https://message-function-luca.azurewebsites.net/api/message/save/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(messageData)
            });

            const responseData = await response.json();
            if (response.ok) {
                console.log('Message sent successfully:', responseData);
                alert('Message sent successfully!');
                fetchNotifications(); // Re-fetch notifications after sending a message
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message:', error.message);
        }

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
                    <div key={index} className="notification-button">{notification.message || "New message from " + notification.id_user2}</div>
                ))}
            </div>
            <div className="playlist">
                <h2>Music Player</h2>
                <audio controls className="audio-player">
                    <source src={fileLink} type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio>
            </div>
        </div>
    );
};

export default SendMessagePage;
