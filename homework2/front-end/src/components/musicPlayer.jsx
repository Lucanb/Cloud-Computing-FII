    import React, {useState} from 'react'
    // import React, {useState, useRef, useEffect} from 'react'
    import {BiPlayCircle,BiPauseCircle,BiSkipPreviousCircle,BiSkipNextCircle,BiTrash} from "react-icons/bi";
    export default function MusicPlayer(currentSong, currentIndex,songs, setSongs ){
        const [isPlaying,setIsPlaying] = useState(false);
        // const audioRef= useRef(null);
        const togglePlay = () =>{
            setIsPlaying(!isPlaying)
        }
        const handleDeleteSong = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/songs/deleteOne/${currentSong.currentSong._id}`, {
                    method: 'DELETE'
                });
                console.log('verify id: ',currentSong.currentSong._id)
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                // setSongs(songs.filter(song => song._id !== songId));
                console.log('Song deleted successfully!');
            } catch (error) {
                console.error('Error deleting song:', error);
            }
        };
        console.log(currentSong)
        // useEffect(() => { //vedem daca facem si muzica
        //         if(isPlaying){
        //             audioRef.current.play();
        //         }else{
        //             audioRef.current.pause();
        //         }
        // }, [isPlaying,currentIndex]);
        return(
            <div>
                <audio>
                    {/*ref = {audioRef}*/}
                    {/*de vf daca exista calea :*/}
                    src={currentSong.currentSong.music}
                </audio>
                <div className={"player-aspect"}>
                    {
                        currentSong ? (
                            <div>
                                <h3 className={"activeAlbum-name"}>{currentSong.currentSong.name}</h3>
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