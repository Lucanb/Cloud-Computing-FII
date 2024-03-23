// MusicPage.js
import React, { useState } from "react";
import { audios } from "../audios/audioData";
import MusicPlayer from "../components/musicPlayer";
import Player from "../components/musicContainer";

const MusicPage = () => {
    const [songs, setSongs] = useState(audios);
    const getSongs = (song) => {
        console.log(song);
    }
    return (
        <div>
            <div className={"player-main"}>
                <MusicPlayer />
            </div>
            <div className="music-play-container">
                {songs.map((song, index) => (
                    <Player key={index} song={song} getSongs={getSongs}/>
                ))}
            </div>
        </div>
    );
};

export default MusicPage;
