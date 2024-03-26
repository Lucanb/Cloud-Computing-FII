import React, { useState, useEffect } from "react";
import { audios } from "../audios/audioData";
import MusicPlayer from "../components/musicPlayer";
import Player from "../components/musicContainer";
import ReactPaginate from 'react-paginate';
import { useParams } from 'react-router-dom';

const MusicPage = () => {
    let { id } = useParams(); // Accesează ID-ul din obiectul params
    id = id.replace(":", "");
    console.log(id); // Afișează ID-ul în consolă

    // const [songs, setSongs] = useState(audios);
    const [songs, setSongs] = useState([]);////////////////////////////
    const [album, setAlbum] = useState({});
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
    const fetchAlbumData = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/albums/getOne/${id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            // console.log('data : ',data.artist)
            const fetchedAlbum = data.artist.title; // Salvează datele albumului din răspunsul API
            // console.log(fetchedAlbum)
            // if (fetchedAlbum && fetchedAlbum._id) {
                setAlbum(data.artist); // Setează datele albumului
            // } else {
            //     throw new Error('Album data is not valid');
            //}
        } catch (error) {
            console.error('Error fetching album data:', error);
        }
    };

    // Efect pentru a prelua melodiile asociate cu albumul
    const fetchSongsByAlbum = async () => {
        try {
            console.log('album : ',album);
            const response = await fetch(`http://localhost:5000/api/songs/getSongsByAlbum/${encodeURIComponent(album.title)}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data)
            setSongs(data.songs); // Setează melodiile asociate albumului
        } catch (error) {
            console.error('Error fetching songs by album:', error);
        }
    };

    // Efect pentru a apela funcțiile de preluare a datelor la încărcarea componentei și la schimbarea ID-ului albumului
    useEffect(() => {
        fetchAlbumData();
    }, [id]); // Apelează fetchAlbumData() când id-ul se schimbă

    useEffect(() => {
        if (album._id) {
            fetchSongsByAlbum();
        }
    }, [album]);

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
