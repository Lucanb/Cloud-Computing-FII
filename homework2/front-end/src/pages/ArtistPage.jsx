import React, { useState, useEffect } from 'react';
import {useParams, useNavigate} from "react-router-dom";
import "./artistPage.css"
const ArtistPage = () => {
    let { id } = useParams(); // Accesează ID-ul din obiectul params
    id = id.replace(":", "");
    console.log(id);

    const [artistData, setArtistData] = useState(null);
    const [albums, setAlbums] = useState([]);
    const navigate = useNavigate();
    const fetchArtistData = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/artists/getOne/${id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data)
            setArtistData(data.artist);
        } catch (error) {
            console.error('Error fetching artist data:', error);
        }
    };

    const fetchAlbumsByArtist = async () => {
        try {
            console.log('artist name : ',artistData.name)
            const response = await fetch(`http://localhost:5000/api/albums/getAlbumsByArtist/${encodeURIComponent(artistData.name)}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('data in after artist',data.artist)
            setAlbums(data.artist);
        } catch (error) {
            console.error('Error fetching albums by artist:', error);
        }
    };

    useEffect(() => {
        fetchArtistData();
    }, []);

    useEffect(() => {
        if (artistData) {
            fetchAlbumsByArtist();
        }
    }, [artistData]);

    const handleAlbumClick = (album) => {
        console.log(`Ai selectat albumul: ${album.title}`);
        navigate(`/music/:${album._id}`); // Navigare la ruta corespunzătoare albumului
    };

    if (!artistData) {
        return <div>Loading...</div>;
    }

    const { name }  = artistData;

    return (
        <div>
            <h1>{name}</h1>
            <h2>Albums</h2>
            <div className="album-list">
                {albums.map((album, index) => (
                    <div className="album-item" key={index} onClick={() => handleAlbumClick(album)}>
                        <h3>{album.title}</h3>
                        <p>{new Date(album.year).getFullYear()}</p> {/* Afișează doar anul */}
                        <img src={album.link} alt={`Image for ${album.title}`} />
                    </div>
                ))}
            </div>
        </div>
    );

};

export default ArtistPage;