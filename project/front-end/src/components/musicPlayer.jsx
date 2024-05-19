    import React, {useContext, useState} from 'react'
    // import React, {useState, useRef, useEffect} from 'react'
    import {BiPlayCircle,BiPauseCircle,BiSkipPreviousCircle,BiSkipNextCircle,BiTrash} from "react-icons/bi";
    import {AuthContext} from "../middleware";
    export default function MusicPlayer(currentSong, currentIndex,songs, setSongs ){
        const user = useContext(AuthContext);
        console.log("Music page:",user);
        const [isPlaying,setIsPlaying] = useState(false);
        // const audioRef= useRef(null);
        const togglePlay = () =>{
            setIsPlaying(!isPlaying)
        }
        const handleDeleteSong = async () => {
            try {
                const response = await fetch(`https://music-app-luca.azurewebsites.net/api/songs/deleteOne/${currentSong.currentSong._id}/${user.uid}`, {
                    method: 'DELETE'
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                // setSongs(songs.filter(song => song._id !== songId));
                console.log('Song deleted successfully!');
                window.location.reload();

            } catch (error) {
                console.error('Error deleting song:', error);
            }
        };
        // useEffect(() => { //vedem daca facem si muzica
        //         if(isPlaying){
        //             audioRef.current.play();
        //         }else{
        //             audioRef.current.pause();
        //         }
        // }, [isPlaying,currentIndex]);
        return(
            <div>
                {/*<audio>*/}
                {/*    /!*ref = {audioRef}*!/*/}
                {/*    /!*de vf daca exista calea :*!/*/}
                {/*    src={currentSong.currentSong.music}*/}
                {/*</audio>*/}
                <div className={"player-aspect"}>
                    {
                        currentSong ? (
                            <div>
                                <h3 className={"activeAlbum-name"}>{currentSong.currentSong.title}</h3>
                                <h4 className={"activeSong-name"}>{currentSong.currentSong.album}</h4>
                                <h5 className={"activeArtist-name"}>{currentSong.currentSong.artist}</h5>
                            </div>
                        ) : (
                            ""
                        )
                    }
                    <div className={"control-icon"}>
                        <BiSkipPreviousCircle color={"white"} size={50} className={"icons"}/>
                        {isPlaying ? (<BiPauseCircle color={"white"} size={70} className={"icons"} onClick={togglePlay}/>)
                            : (<BiPlayCircle color={"white"} size={70} className={"icons"} onClick={togglePlay}/>) }
                        <BiSkipNextCircle color={"white"} size={50} className={"icons"}/>
                        <BiTrash color={'white'} size={30} className={'icons'} onClick={handleDeleteSong} />
                    </div>
                </div>
            </div>
        )
    }