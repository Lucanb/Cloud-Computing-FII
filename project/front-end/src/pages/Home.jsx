import React, { useState, useContext } from "react";
import './HomePage.css';
import Button from "@mui/material/Button";
import SearchBar from "../components/SearchBar";
import PictureList from "../components/PictureList";
import AddArtistModal from "../components/ArtistAdd";
import AddAlbumModal from "../components/AlbumAdd";
import AddImageForm from "../components/AddImage";
import { AuthContext } from '../middleware';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const user = useContext(AuthContext);
    const navigate = useNavigate();

    console.log("Music page:", user);
    
    const [isAddArtistModalOpen, setIsAddArtistModalOpen] = useState(false);
    const [isAddAlbumModalOpen, setIsAddAlbumModalOpen] = useState(false);
    const [isAddImageModalOpen, setIsAddImageModalOpen] = useState(false);
    const [showPartyNav, setShowPartyNav] = useState(false);
    const [setResults] = useState([]);

    console.log('user', user);
    
    const apiUrlArtists = `https://music-app-luca.azurewebsites.net/api/artists/getAll/${user.uid}`;
    const apiUrlAlbums = `https://music-app-luca.azurewebsites.net/api/albums/getAll/${user.uid}`;
    const isAuthenticated = useContext(AuthContext);

    const handleSearchResults = (searchResults) => {
        setResults(searchResults);
    };

    const openAddArtistModal = () => {
        setIsAddArtistModalOpen(true);
    };

    const openAddAlbumModal = () => {
        setIsAddAlbumModalOpen(true);
    };

    const openAddImageForm = () => {
        setIsAddImageModalOpen(true);
    };

    const togglePartyNav = () => {
        setShowPartyNav(!showPartyNav);
    };

    const parties = [
        { id: 1, name: 'Party 1' },
        { id: 2, name: 'Party 2' },
        { id: 3, name: 'Party 3' },
        { id: 4, name: 'Party 4' },
        { id: 5, name: 'Party 5' },
        { id: 6, name: 'Party 6' },
        { id: 7, name: 'Party 7' },
        { id: 8, name: 'Party 8' },
        { id: 9, name: 'Party 9' },
        { id: 10, name: 'Party 10' },
        { id: 11, name: 'Party 11' }
    ];

    return (
        <div className="home-container">
            <h1>Welcome to Music Controller</h1>
            {isAuthenticated ? (
                <>
                    <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
                        <Button color="inherit" onClick={openAddImageForm}>Add Image</Button>
                        <Button color="inherit" onClick={openAddArtistModal}>Add Artist</Button>
                        <Button color="inherit" onClick={openAddAlbumModal}>Add Album</Button>
                        <Button color="inherit" onClick={togglePartyNav}>Show Parties</Button>
                    </div>
                    {isAddArtistModalOpen && <AddArtistModal onClose={() => setIsAddArtistModalOpen(false)} />}
                    {isAddAlbumModalOpen && <AddAlbumModal onClose={() => setIsAddAlbumModalOpen(false)} />}
                    {isAddImageModalOpen && <AddImageForm isOpen={isAddImageModalOpen} onClose={() => setIsAddImageModalOpen(false)} />}
                </>
            ) : (<></>)}
            <SearchBar onSearchResults={handleSearchResults} />
            <h2>Your Albums</h2>
            <PictureList apiUrl={apiUrlAlbums} string={'music'} />
            <h2>Your Artists</h2>
            <PictureList apiUrl={apiUrlArtists} string={'artist'} />
            {showPartyNav && (
                <div className="party-nav">
                    <h2>My Parties</h2>
                    <div className="party-nav-buttons">
                        {parties.map(party => (
                            <button
                                key={party.id}
                                className="party-nav-button"
                                onClick={() => navigate(`/party/${party.id}`)}
                            >
                                {party.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
