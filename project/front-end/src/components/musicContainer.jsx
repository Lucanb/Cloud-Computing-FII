// Player.js
import React from 'react';
import "./MusicPage.css";

export default function Player({ song, getSongsData, index }) {
    return (
        <div className="player-container" onClick={() => getSongsData(song, index)}>
            <h2 className="song-name">{song.title} - {song.album} - {song.artist}</h2>
        </div>
    );
}