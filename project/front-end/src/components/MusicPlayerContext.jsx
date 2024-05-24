import React, { createContext, useContext, useState } from 'react';

const MusicPlayerContext = createContext();

export const useMusicPlayer = () => useContext(MusicPlayerContext);

export const MusicPlayerProvider = ({ children }) => {
    const [isDJPlaying, setIsDJPlaying] = useState(false);
    const [isMusicPlaying, setIsMusicPlaying] = useState(false);

    const playDJ = () => {
        if (isMusicPlaying) {
            setIsMusicPlaying(false);
        }
        setIsDJPlaying(true);
    };

    const stopDJ = () => {
        setIsDJPlaying(false);
    };

    const toggleDJ = () => {
        if (isDJPlaying) {
            stopDJ();
        } else {
            playDJ();
        }
    };

    const playMusic = () => {
        if (isDJPlaying) {
            setIsDJPlaying(false);
        }
        setIsMusicPlaying(true);
    };

    const stopMusic = () => {
        setIsMusicPlaying(false);
    };

    const toggleMusicPlayback = () => {
        if (isMusicPlaying) {
            stopMusic();
        } else {
            playMusic();
        }
    };

    return (
        <MusicPlayerContext.Provider value={{ isDJPlaying, isMusicPlaying, toggleDJ, toggleMusicPlayback }}>
            {children}
        </MusicPlayerContext.Provider>
    );
};
