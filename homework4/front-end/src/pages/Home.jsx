import React, { useState } from "react";
// import { SearchResult } from "../components/SerchResults"; // Am corectat importul
import SearchBar from "../components/SearchBar";
import PictureList from "../components/PictureList";
import AddArtistModal from "../components/ArtistAdd";
import AddAlbumModal from "../components/AlbumAdd";
import AddImageForm from "../components/AddImage";
import { AuthContext } from '../middleware';
import { useContext } from "react";
const Home = () => {
    const user = useContext(AuthContext);
    console.log("Music page:",user);
    const [isAddArtistModalOpen, setIsAddArtistModalOpen] = useState(false);
    const [isAddAlbumModalOpen, setIsAddAlbumModalOpen] = useState(false);
    const [isAddImageModalOpen, setIsAddImageModalOpen] = useState(false);

    const [setResults] = useState([]);
    console.log('user',user)
    const apiUrlArtists = `https://my-music-app.azurewebsites.net/api/artists/getAll/${user.uid}`;
    const apiUrlAlbums = `https://my-music-app.azurewebsites.net/api/albums/getAll/${user.uid}`;
    const isAuthenticated = useContext(AuthContext);
    // Funcție pentru a seta rezultatele căutării în starea componentei
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
    
    return (
        <div>
            <h1>Welcome to Music Controller</h1> 
            {isAuthenticated ? (
                        <>
            <div className="add-buttons">
                <button onClick={openAddImageForm}>Add Image</button>
                <button onClick={openAddArtistModal}>Add Artist</button>
                <button onClick={openAddAlbumModal}>Add Album</button>
            </div>
            {isAddArtistModalOpen && <AddArtistModal onClose={() => setIsAddArtistModalOpen(false)} />}
            {isAddAlbumModalOpen && <AddAlbumModal onClose={() => setIsAddAlbumModalOpen(false)} />}
            {isAddImageModalOpen && <AddImageForm isOpen={isAddImageModalOpen} onClose={() => setIsAddImageModalOpen(false)} />}
            </>):(<></>)}
            <SearchBar onSearchResults={handleSearchResults}/>
            {/*<div className="results-list">*/}
            {/*    /!*{results.map((result, id) => {*!/*/}
            {/*    /!*    return <SearchResult result={result.name} key={id} />;*!/*/}
            {/*    /!*})}*!/*/}
            {/*</div>*/}
            <h2>Your Albums</h2>
            <PictureList apiUrl={apiUrlAlbums} string={'music'}/>
            <h2>Your Artists</h2>
            <PictureList apiUrl={apiUrlArtists} string={'artist'}/>

        </div>
    );
};

export default Home;