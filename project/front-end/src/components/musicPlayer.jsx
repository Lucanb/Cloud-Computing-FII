import React, { useContext, useState, useRef, useEffect } from 'react';
import { BiPlayCircle, BiPauseCircle, BiSkipPreviousCircle, BiSkipNextCircle, BiTrash } from "react-icons/bi";
import { AuthContext } from "../middleware";

export default function MusicPlayer({ currentSong, currentIndex, songs, setSongs }) {
    const user = useContext(AuthContext);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const handleDeleteSong = async () => {
        try {
            const response = await fetch(`https://music-app-luca.azurewebsites.net/api/songs/deleteOne/${currentSong._id}/${user.uid}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log('Song deleted successfully!');
            setSongs(songs.filter(song => song._id !== currentSong._id));
        } catch (error) {
            console.error('Error deleting song:', error);
        }
    };

    useEffect(() => {
        const handlePlayError = () => {
            console.error('Error playing audio.');
            setIsPlaying(false);
        };

        const audioElement = audioRef.current;
        audioElement.addEventListener('error', handlePlayError);
        audioElement.addEventListener('abort', handlePlayError);

        return () => {
            audioElement.removeEventListener('error', handlePlayError);
            audioElement.removeEventListener('abort', handlePlayError);
        };
    }, []);

    useEffect(() => {
        if (isPlaying) {
            audioRef.current.play().catch((error) => {
                console.error('Error playing audio:', error);
                setIsPlaying(false);
            });
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.load();
            if (isPlaying) {
                audioRef.current.play().catch((error) => {
                    console.error('Error playing audio:', error);
                    setIsPlaying(false);
                });
            }
        }
    }, [currentSong]);

    return (
        <div>
            <audio ref={audioRef} src={currentSong ? currentSong.link : ""} />
            <div className={"player-aspect"}>
                {currentSong ? (
                    <div>
                        <h3 className={"activeAlbum-name"}>{currentSong.title}</h3>
                        <h4 className={"activeSong-name"}>{currentSong.album}</h4>
                        <h5 className={"activeArtist-name"}>{currentSong.artist}</h5>
                    </div>
                ) : (
                    ""
                )}
                <div className={"control-icon"}>
                    <BiSkipPreviousCircle color={"white"} size={50} className={"icons"} />
                    {isPlaying ? (
                        <BiPauseCircle color={"white"} size={70} className={"icons"} onClick={togglePlay} />
                    ) : (
                        <BiPlayCircle color={"white"} size={70} className={"icons"} onClick={togglePlay} />
                    )}
                    <BiSkipNextCircle color={"white"} size={50} className={"icons"} />
                    <BiTrash color={'white'} size={30} className={'icons'} onClick={handleDeleteSong} />
                </div>
            </div>
        </div>
    );
}