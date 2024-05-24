import React, { useState } from 'react';
import './MessPageStyle.css';

const SendMessagePage = ({ onSendMessage }) => {
    const [recipientName, setRecipientName] = useState('');
    const [fileLink, setFileLink] = useState('');

    const handleSend = () => {
        onSendMessage({ recipientName, fileLink });
        setRecipientName('');
        setFileLink('');
    };

    return (
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
    );
};

export default SendMessagePage; 
