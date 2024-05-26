import React, { useState } from 'react';
import SendMessagePage from '../components/SendMessage';
import NotificationBar from '../components/NotificationBar';

import '../components/MessPageStyle.css';

const MessagingPage = () => {
    const [messages, setMessages] = useState([]);

    const handleSendMessage = (message) => {
        setMessages(prevMessages => [...prevMessages, message]);
    };

    return (
        <div className="container">
            <SendMessagePage userId={user.uid} onSendMessage={handleSendMessage} />
            <NotificationBar messages={messages} />
        </div>
    );
};

export default MessagingPage;
