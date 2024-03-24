import React, { useState, useEffect } from "react";
import { audios } from "../audios/audioData";
import MusicPlayer from "../components/musicPlayer";
import Player from "../components/musicContainer";
import ReactPaginate from 'react-paginate';

const MusicPage = () => {
    const [songs, setSongs] = useState(audios);
    const [currentSong, setCurrentSong] = useState({});
    const [pageNumber, setPageNumber] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(null);
    const songsPerPage = 6;

    // Calculează înălțimea ecranului pentru a seta înălțimea maximă a containerului de paginare
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);

    // Funcție pentru actualizarea înălțimii ecranului
    const handleResize = () => {
        setWindowHeight(window.innerHeight);
    };

    // Adaugă un eveniment de ascultare pentru redimensionarea ferestrei
    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Calculează înălțimea maximă a containerului de paginare
    const paginationMaxHeight = windowHeight / 5;

    const getSongsData = (song, index) => {
        setCurrentSong(song);
        setCurrentIndex(index);
    };

    // Calculează indexul primei și ultimei piese de pe pagina curentă
    const indexOfLastSong = (pageNumber + 1) * songsPerPage;
    const indexOfFirstSong = indexOfLastSong - songsPerPage;
    const currentSongs = songs.slice(indexOfFirstSong, indexOfLastSong);

    // Schimbă pagina
    const changePage = ({ selected }) => {
        setPageNumber(selected);
    };

    return (
        <div>
            <div className={"player-main"}>
                <MusicPlayer currentSong={currentSong} currentIndex={currentIndex}/>
            </div>
                <div className="pagination-container" style={{ maxHeight: paginationMaxHeight }}> {/* Adaugă un container pentru paginare */}
                    <div className="music-play-container">
                        {currentSongs.map((song, index) => (
                            <Player key={index} song={song} getSongsData={getSongsData} index={index}/>
                        ))}
                    <ReactPaginate
                        pageCount={Math.ceil(songs.length / songsPerPage)}
                        onPageChange={changePage}
                        containerClassName={'pagination'}
                        activeClassName={'active'}
                        previousLabel={'Previous'}
                        nextLabel={'Next'}
                    />
                </div>
            </div>
        </div>
    );
};

export default MusicPage;
