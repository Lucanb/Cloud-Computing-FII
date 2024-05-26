import React, { useState, useEffect } from 'react';
import './MessPageStyle.css';
import { BlobServiceClient } from "@azure/storage-blob";

const SendMessagePage = ({ userId }) => {
    const [recipientName, setRecipientName] = useState('');
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [fileLink, setFileLink] = useState('');
    const [currentSong, setCurrentSong] = useState('');
    const [notifications, setNotifications] = useState([]);

    // Ensure fetchNotifications is defined before its use in useEffect
    const fetchNotifications = async () => {
        try {
            const response = await fetch(`https://message-function-luca.azurewebsites.net/api/messages/getRecent/${userId}`);
            const data = await response.json();
            if (response.ok) {
                console.log('data : ',JSON.stringify(data))
                setNotifications(data);
            } else {
                throw new Error('Failed to fetch notifications');
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
            alert('Failed to fetch notifications:', error.message);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const uploadFileToBlob = async () => {
        if (!file) return null;

        setUploading(true);
        const blobServiceClient = new BlobServiceClient(`https://musicappluca.blob.core.windows.net/?sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiyx&se=2024-08-20T00:03:21Z&st=2024-05-19T16:03:21Z&spr=https&sig=TAiN0%2BNPbD1Ie5l5aLSpDgXwEdGKYSrmUY50H%2BTEBPg%3D`);
        const containerClient = blobServiceClient.getContainerClient("songs");
        const blobName = `${Date.now()}-${file.name}`;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        try {
            await blockBlobClient.uploadBrowserData(file);
            setUploading(false);
            return blockBlobClient.url;
        } catch (error) {
            console.error('Error uploading file to Blob Storage:', error);
            setUploading(false);
            return null;
        }
    };

    const handleSend = async () => {
        const uploadedUrl = await uploadFileToBlob();
        if (!uploadedUrl) {
            alert('Failed to upload file');
            return;
        }

        setFileLink(uploadedUrl);
        const messageData = {
            id_reciever: recipientName, //aici trebuie sa luam id-ul dupa username 
            link_melodie: uploadedUrl
        };

        try {
            const response = await fetch(`https://message-function-luca.azurewebsites.net/api/message/save/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(messageData)
            });
            console.log(JSON.stringify(messageData))
            const responseData = await response.json();
            if (response.ok) {
                console.log('Message sent successfully:', JSON.stringify(responseData));
                alert('Message sent successfully!');
                fetchNotifications();
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message:', error.message);
        }

        setRecipientName('');
        setFile(null);
    };
    
    const playSong = (link) => {
        setCurrentSong(link);
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
                    type="file"
                    onChange={handleFileChange}
                />
                <button className="send-button" onClick={handleSend} disabled={uploading}>
                    {uploading ? 'Uploading...' : 'Send'}
                </button>
            </div>
            <div className="notifications-bar">
                <h2>Notifications</h2>
                {notifications.length > 0 ? (
                    notifications.map((notification, index) => (
                        <button key={index} onClick={() => setCurrentSong(notification.fileLink)}>
                            Play: {notification.recipientName || `Message from User`}
                        </button>
                    ))
                ) : (
                    <p>No notifications found.</p>
                )}
            </div>
            {currentSong && (
                <div className="playlist">
                    <h2>Music Player</h2>
                    <audio controls autoPlay>
                        <source src={currentSong} type="audio/mpeg" />
                        Your browser does not support the audio element.
                    </audio>
                </div>
            )}
        </div>
    );
};

export default SendMessagePage;
