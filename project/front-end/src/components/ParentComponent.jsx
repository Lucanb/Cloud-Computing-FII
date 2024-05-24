import React, { useState } from 'react';
import PartyPage from './PartyPage';
import DJPage from './DJPage';

const ParentComponent = () => {
    const [songs, setSongs] = useState(["Song 1", "Song 2", "Song 3"]);

    const addSong = (song) => {
        setSongs([...songs, song]);
    };

    const removeSong = (index) => {
        setSongs(songs.filter((_, i) => i !== index));
    };

    return (
        <div>
            <PartyPage songs={songs} addSong={addSong} removeSong={removeSong} />
            <DJPage songs={songs} addSong={addSong} removeSong={removeSong} />
        </div>
    );
};

export default ParentComponent;
