import React, { useState, useEffect } from 'react';
import './NewsComponent.css'

function NewsComponent() {
    const [topicName, setTopicName] = useState('');
    const [news, setNews] = useState([]);
    const [newNewsTitle, setNewNewsTitle] = useState('');
    const [newNewsContent, setNewNewsContent] = useState('');
    const [subscriptionName, setSubscriptionName] = useState('');

    const listenForNews = async (e) => {
        e.preventDefault(); // Evităm trimiterea formularului implicită
        try {
            const response = await fetch(`https://us-central1-homework3-project.cloudfunctions.net/gcp-func-novus/api/news/listen-news/${topicName}/${subscriptionName}`);
            const data = await response.json();
            console.log('News received:', data);
            setNews(data);
        } catch (error) {
            console.error('Error listening for news:', error);
        }
    };

    const createNews = async (e) => {
        e.preventDefault(); // Evităm trimiterea formularului implicită
        try {
            const response = await fetch('https://us-central1-homework3-project.cloudfunctions.net/gcp-func-novus/api/news/create-news', {
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
                <input
                    type="text"
                    placeholder="Topic name"
                    value={topicName}
                    onChange={(e) => setTopicName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Subscription name"
                    value={subscriptionName}
                    onChange={(e) => setSubscriptionName(e.target.value)}
                />
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
