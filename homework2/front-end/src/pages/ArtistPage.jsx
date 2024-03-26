import React, { useState, useEffect } from 'react';
import {useParams, useNavigate} from "react-router-dom";
import EditArtistModal from '../components/EditArtist';
import "./artistPage.css"
const ArtistPage = () => {
    let { id } = useParams(); // Accesează ID-ul din obiectul params
    id = id.replace(":", "");

    const [artistData, setArtistData] = useState(null);
    const [albums, setAlbums] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const navigate = useNavigate();
    const fetchArtistData = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/artists/getOne/${id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setArtistData(data.artist);
        } catch (error) {
            console.error('Error fetching artist data:', error);
        }
    };

    const fetchAlbumsByArtist = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/albums/getAlbumsByArtist/${encodeURIComponent(artistData.name)}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
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
        navigate(`/music/:${album._id}`);
    };

    const handleDeleteAlbum = async (albumId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/albums/deleteOne/${albumId}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            setAlbums(albums.filter(album => album._id !== albumId));
            console.log('Album deleted successfully!');
        } catch (error) {
            console.error('Error deleting album:', error);
        }
    };
    const handleEditArtistData = () => {
        setIsEditModalOpen(true);
    };


    if (!artistData) {
        return <div>Loading...</div>;
    }

    const { name }  = artistData;

    return (
        <div>
            <div className="artist-header">
                <button className="edit-artist-button" onClick={handleEditArtistData}>Edit</button>
            </div>
            {isEditModalOpen && (
                <EditArtistModal
                    artistData={artistData}
                    onClose={() => setIsEditModalOpen(false)}
                />
            )}
            <h1>{name}</h1>
            <h2>Albums</h2>
            <div className="album-list">
                {albums.map((album, index) => (
                    <div className="album-item" key={index} onClick={() => handleAlbumClick(album)}>
                        <h3>{album.title}</h3>
                        <p>{new Date(album.year).getFullYear()}</p> {/* Afișează doar anul */}
                        <img src={album.link} alt={`Image for ${album.title}`}/>
                        <button className="delete-album-button" onClick={() => handleDeleteAlbum(album._id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );

};

export default ArtistPage;