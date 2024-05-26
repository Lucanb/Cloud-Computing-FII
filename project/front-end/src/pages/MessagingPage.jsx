import React, { useContext, useState, useEffect } from 'react';
import SendMessagePage from '../components/SendMessage';
import NotificationBar from '../components/NotificationBar';
import { AuthContext } from "../middleware";
import '../components/MessPageStyle.css';

const MessagingPage = () => {
    const user = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [notifications, setNotifications] = useState([]);
    // console.log(user)
    const handleSendMessage = (newMessageData) => {
        setMessages(prevMessages => [...prevMessages, {
            recipientName: newMessageData.recipientName,
            fileLink: newMessageData.fileLink
        }]);
    };

    useEffect(() => {
        fetchNotifications();  // Move notification fetching here
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await fetch(`https://message-function-luca.azurewebsites.net/api/messages/getRecent/${user.uid}`);
            const data = await response.json();
            if (response.ok) {
                setNotifications(data);
            } else {
                console.error('Failed to fetch notifications');
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    return (
        <div className="container">
            <SendMessagePage userId={user.uid} onSendMessage={handleSendMessage} />
            <NotificationBar messages={notifications} />
        </div>
    );
};

export default MessagingPage;
