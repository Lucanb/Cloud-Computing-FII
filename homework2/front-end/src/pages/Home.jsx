import React, { useState } from "react";
import { SearchResult } from "../components/SerchResults"; // Am corectat importul
import SearchBar from "../components/SearchBar";
import PictureList from "../components/PictureList";
const Home = () => {
    const [results, setResults] = useState([]);
    const apiUrlArtists = 'http://localhost:5000/api/artists/getAll';
    const apiUrlAlbums = 'http://localhost:5000/api/albums/getAll';
    // Funcție pentru a seta rezultatele căutării în starea componentei
    const handleSearchResults = (searchResults) => {
        setResults(searchResults);
    };

    return (
        <div>
            <h1>Welcome to Music Controller</h1>
            <SearchBar onSearchResults={handleSearchResults} /> {/* Adăugați o proprietate onSearchResults */}
            <div className="results-list">
                {results.map((result, id) => {
                    return <SearchResult result={result.name} key={id} />;
                })}
            </div>
            <h2>Your Albums</h2>
            <PictureList apiUrl={apiUrlAlbums} string={'music'} />
            <h2>Your Artists</h2>
            <PictureList apiUrl={apiUrlArtists} string={'artist'} />
        </div>
    );
};

export default Home;
