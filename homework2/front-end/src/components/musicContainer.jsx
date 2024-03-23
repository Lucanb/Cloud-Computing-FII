// Player.js
import React from 'react';
import "./MusicPage.css";

export default function Player({ song, getSongs }) {
    return (
        <div className="player-container" onClick={() => getSongs(song)}>
            <h2 className="song-name">{song.name} - {song.album} - {song.artist}</h2>
        </div>
    );
}
