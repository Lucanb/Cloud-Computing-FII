import React, { useState } from "react";
import { audios } from "../audios/audioData";
import Player from "../components/musicContainer";

const Home = () => {
    const [songs, setSongs] = useState(audios);
    return (
        <div>
            <h1>HOME</h1>
            {/*<div className={"sign-in-container"}>*/}
            {/*    {songs.map((song, index) => (*/}
            {/*        <Player key={index} song={song} />*/}
            {/*    ))}*/}
            {/*</div>*/}
        </div>
    );
};

export default Home;
