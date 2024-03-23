// Player.js
import React from 'react';
import "./MusicPage.css";

export default function Player({ song }) {
    return (
        <div className="player-container">
            <h2 className="song-name">{song.name} - {song.album} - {song.artist}</h2>
        </div>
    );
}
