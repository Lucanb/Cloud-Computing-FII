import React, { useState, useEffect, useContext } from 'react';
import {useParams, useNavigate} from "react-router-dom";
import EditArtistModal from '../components/EditArtist';
import "./artistPage.css"
import { AuthContext } from '../middleware';
const ArtistPage = () => {
    const user = useContext(AuthContext);
    console.log("Artist page:",user);
    let { id } = useParams(); // Accesează ID-ul din obiectul params
    if (id && id.startsWith(":")) {
        // Eliminați caracterul ":" din id
        id = id.slice(1);
    }

    const [artistData, setArtistData] = useState(null);
    // console.log(artistData)
    const [albums, setAlbums] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const navigate = useNavigate();

    const fetchArtistData = async () => {
        try {
            const response = await fetch(`https://my-music-app.azurewebsites.net/api/artists/getOne/${id}/${user.uid}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setArtistData(data);
        } catch (error) {
            console.error('Error fetching artist data:', error);
        }
    };

    const fetchAlbumsByArtist = async () => {
        try {
            const response = await fetch(`https://my-music-app.azurewebsites.net/api/albums/getAlbumsByArtist/${encodeURIComponent(artistData.name)}/${user.uid}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data)
            setAlbums(data);
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
            const response = await fetch(`https://my-music-app.azurewebsites.net/api/albums/deleteOne/${albumId}/${user.uid}`, {
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


    console.log(artistData);
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
                {albums && albums.map((album, index) => (
                    <div className="album-item" key={index} onClick={() => handleAlbumClick(album)}>
                        <h3>{album.title}</h3>
                        <p>{new Date(album.year).getFullYear()}</p> {/* Afișează doar anul */}
                        <img src={album.link} alt={`Image for ${album.title}`}/>
                        <button className="delete-album-button" onClick={() => handleDeleteAlbum(album._id)}>Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );

};

export default ArtistPage;