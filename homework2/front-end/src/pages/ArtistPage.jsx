// ArtistPage.jsx
import React, { useState, useEffect } from 'react';

const ArtistPage = () => {
    const [artistData, setArtistData] = useState(null);

    useEffect(() => {
        // Fetch artist data
        fetchArtistData();
    }, []);

    const fetchArtistData = async () => {
        try {
            const response = await fetch('URL_API');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setArtistData(data);
        } catch (error) {
            console.error('Error fetching artist data:', error);
        }
    };

    const handleAlbumClick = (album) => {
        console.log(`Ai selectat albumul: ${album.name}`);
    };

    if (!artistData) {
        return <div>Loading...</div>;
    }

    const { name, bio, albums } = artistData;

    return (
        <div>
            <h1>{name}</h1>
            <p>{bio}</p>
            <h2>Albums</h2>
            <div className="album-list">
                {albums.map((album, index) => (
                    <div className="album-item" key={index} onClick={() => handleAlbumClick(album)}>
                        <h3>{album.name}</h3>
                        <p>{album.releaseYear}</p>
                        <img src={album.image} alt={`Image for ${album.name}`} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ArtistPage;
