import React , {useState} from 'react'
import {BiPlayCircle,BiPauseCircle,BiSkipPreviousCircle,BiSkipNextCircle} from "react-icons/bi";
export default function MusicPlayer(){
    const [isPlaying,setIsplaying] = useState(false);
    const togglePlay = () =>{
        setIsplaying(!isPlaying)
    }
    return(
        <div>
            <div className={"player-aspect"}>
                <h3 className={"activeAlbum-name"}>Album Name</h3>
                <h4 className={"activeSong-name"}>Song Name</h4>
                <h5 className={"activeArtist-name"}>Artist Name</h5>
                <div className={"control-icon"}>
                    <BiSkipPreviousCircle color={"white"} size={50} className={"icons"}/>
                    {isPlaying ? (<BiPauseCircle color={"white"} size={70} className={"icons"} onClick={togglePlay}/>)
                        : (<BiPlayCircle color={"white"} size={70} className={"icons"} onClick={togglePlay}/>) }
                    <BiSkipNextCircle color={"white"} size={50} className={"icons"}/>
                </div>
            </div>
            Player
        </div>
    )
}