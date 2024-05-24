import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DJPage = () => {
    const [djSongs, setDjSongs] = useState(["DJ Song 1", "DJ Song 2"]); // Lista inițială de melodii pentru DJ
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1); // Acesta este echivalentul funcției goBack din versiunile anterioare
    };

    return (
        <div>
            <h1>DJ Control Page</h1>
            <div className="dj-songs-list">
                {djSongs.map((song, index) => (
                    <div key={index}>{song}</div>
                ))}
            </div>
            <button className="action-button" onClick={goBack}>Go Back to Party Planner</button>
        </div>
    );
};

export default DJPage;
