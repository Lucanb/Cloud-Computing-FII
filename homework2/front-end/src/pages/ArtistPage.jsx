import React, { useState, useEffect } from 'react';

const ArtistPage = ({ artistId }) => {
    const [artistData, setArtistData] = useState(null);

    useEffect(() => {
        fetchArtistData();
    }, []);

    const fetchArtistData = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/artists/getOne/${artistId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setArtistData(data.artist);
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
                        <h3>{album.title}</h3>
                        <p>{album.year}</p>
                        <img src={album.link} alt={`Image for ${album.title}`} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ArtistPage;
