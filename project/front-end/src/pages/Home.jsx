import React, { useState, useEffect, useContext } from "react";
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

    const [isAddArtistModalOpen, setIsAddArtistModalOpen] = useState(false);
    const [isAddAlbumModalOpen, setIsAddAlbumModalOpen] = useState(false);
    const [isAddImageModalOpen, setIsAddImageModalOpen] = useState(false);
    const [showPartyNav, setShowPartyNav] = useState(false);
    const [showPartyInvites, setShowPartyInvites] = useState(false);
    const [parties, setParties] = useState([]);
    const [invites, setInvites] = useState([]);
    const [setResults] = useState([]);

    const apiUrlArtists = `https://music-app-luca.azurewebsites.net/api/artists/getAll/${user.uid}`;
    const apiUrlAlbums = `https://music-app-luca.azurewebsites.net/api/albums/getAll/${user.uid}`;
    const isAuthenticated = useContext(AuthContext);

    useEffect(() => {
        if (isAuthenticated) {
            fetchParties();
            fetchInvites();
        }
    }, [isAuthenticated]);

    const fetchParties = async () => {
        try {
            const response = await fetch(`https://party-functions-luca.azurewebsites.net/api/party/get-parties-by-admin-id/?adminId=${user.uid}`);
            if (!response.ok) {
                throw new Error('Failed to fetch parties');
            }
            const data = await response.json();
            setParties(data);
        } catch (error) {
            console.error('Error fetching parties:', error);
        }
    };

    const fetchInvites = async () => {
        try {
            const response = await fetch(`https://party-functions-luca.azurewebsites.net/api/party/get-parties-by-guest-id/?guestId=${user.uid}`);
            if (!response.ok) {
                throw new Error('Failed to fetch invites');
            }
            const data = await response.json();
            setInvites(data);
            console.log("Party invites:", invites)
        } catch (error) {
            console.error('Error fetching invites:', error);
        }
    };

    const handleSearchResults = (searchResults) => {
        setResults(searchResults);
    };

    const handleSeeMessages = () => {
        navigate(`/messagePage/${user.uid}`);
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

    const togglePartyInvites = () => {
        setShowPartyInvites(!showPartyInvites);
    };

    const renderPartyButtons = (parties) => {
        return (
            <div className="party-nav-buttons">
                {parties.map(party => (
                    <button
                        key={party._id}
                        className="party-nav-button"
                        onClick={() => navigate(`/party/${party._id}`)}
                    >
                        Party {party._id}
                    </button>
                ))}
            </div>
        );
    };
    const renderPartyInviteButtons = (parties) => {
        return (
            <div className="party-nav-buttons">
                {parties.map(party => (
                    <button
                        key={party._id}
                        className="party-nav-button"
                        onClick={() => navigate(`/userPage/${party._id}`)}
                    >
                        Party {party._id}
                    </button>
                ))}
            </div>
        );
    };

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
                        <Button color="inherit" onClick={togglePartyInvites}>Show Party Invites</Button>
                        <Button color="inherit" onClick={handleSeeMessages}>See Your Messages</Button>
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
                    {renderPartyButtons(parties)}
                </div>
            )}
            {showPartyInvites && (
                <div className="party-nav">
                    <h2>Party Invites</h2>
                    {renderPartyInviteButtons(invites)}
                </div>
            )}
        </div>
    );
};

export default Home;