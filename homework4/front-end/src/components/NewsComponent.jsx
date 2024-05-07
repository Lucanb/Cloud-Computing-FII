import React, { useState, useEffect } from 'react';
import './NewsComponent.css'

function NewsComponent() {
    const [topicName, setTopicName] = useState('');
    const [news, setNews] = useState([]);
    const [newNewsTitle, setNewNewsTitle] = useState('');
    const [newNewsContent, setNewNewsContent] = useState('');
    const [subscriptionName, setSubscriptionName] = useState('');

    const listenForNews = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`https://music-app-luca.azurewebsites.net/api/news/latest`);
            const data = await response .json();
            console.log(data)
            // console.log('News received:', data);
            // data = JSON("sper")
            setNews(data);
        } catch (error) {
            console.error('Error listening for news:', error);
        }
    };

    const createNews = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://music-app-luca.azurewebsites.net/api/news/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    topicName: topicName,
                    title: newNewsTitle,
                    content: newNewsContent
                })
            });
            const data = await response.json();
            console.log('News created:', data);
            setNewNewsTitle('');
            setNewNewsContent('');
        } catch (error) {
            console.error('Error creating news:', error);
        }
    };

    return (
        <div className="listenNewsForm">
            <h2>Listen for News</h2>
            <form onSubmit={listenForNews}>
                <button type="submit">Listen</button>
            </form>

            <h2>Create News</h2>
            <form onSubmit={createNews} className="createNewsForm">
                <input
                    type="text"
                    placeholder="Topic name"
                    value={topicName}
                    onChange={(e) => setTopicName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Title"
                    value={newNewsTitle}
                    onChange={(e) => setNewNewsTitle(e.target.value)}
                />
                <textarea
                    placeholder="Content"
                    value={newNewsContent}
                    onChange={(e) => setNewNewsContent(e.target.value)}
                ></textarea>
                <button type="submit">Create</button>
            </form>

            <h2>News List</h2>
            {news.length > 0 ? (
                <ul>
                    {news.map((item, index) => (
                        <li key={index}>{item.title}: {item.content}</li>
                    ))}
                </ul>
            ) : (
                <p>No news available</p>
            )}
        </div>
    );
}

export default NewsComponent;
