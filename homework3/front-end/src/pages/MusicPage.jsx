import React, { useState, useEffect, useContext } from "react";
import { audios } from "../audios/audioData";
import MusicPlayer from "../components/musicPlayer";
import Player from "../components/musicContainer";
import ReactPaginate from 'react-paginate';
import { useParams } from 'react-router-dom';
import AddSongModal from "../components/AddSongs";
import { AuthContext } from "../middleware";
const MusicPage = () => {
    const user = useContext(AuthContext);
    console.log("Music page:",user);
    let { id } = useParams(); // Accesează ID-ul din obiectul params
    id = id.replace(":", "");

    // const [songs, setSongs] = useState(audios);
    const [songs, setSongs] = useState([]);////////////////////////////
    const [album, setAlbum] = useState({});
    const [currentSong, setCurrentSong] = useState({});
    const [pageNumber, setPageNumber] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(null);
    const [isAddSongModalOpen, setIsAddSongModalOpen] = useState(false);
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
            // console.log('id :',id)
            const response = await fetch(`https://us-central1-homework3-project.cloudfunctions.net/gcp-func-novus/api/albums/getOne/${id}/${user.uid}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();

            console.log('data : ',data)
            const fetchedAlbum = data.album; // Salvează datele albumului din răspunsul API
            // console.log(fetchedAlbum)
            if (fetchedAlbum && fetchedAlbum._id) {
                setAlbum(data.album); // Setează datele albumului
             } else {
                  throw new Error('Album data is not valid');
            }
        } catch (error) {
            console.error('Error fetching album data:', error);
        }
    };

    const fetchSongsByAlbum = async () => {
        try {
            // console.log('album : ',album);
            // console.log(album.title)
            const response = await fetch(`https://us-central1-homework3-project.cloudfunctions.net/gcp-func-novus/api/songs/getSongsByAlbum/${encodeURIComponent(album.title)}/${user.uid}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            // console.log(data)
            setSongs(data.songs);
        } catch (error) {
            console.error('Error fetching songs by album:', error);
        }
    };

    useEffect(() => {
        fetchAlbumData();
    }, [id]);

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

    const indexOfLastSong = (pageNumber + 1) * songsPerPage;
    const indexOfFirstSong = indexOfLastSong - songsPerPage;
    const currentSongs = songs.slice(indexOfFirstSong, indexOfLastSong);

    const changePage = ({ selected }) => {
        setPageNumber(selected);
    };
    const openAddSongModal = () => {
        setIsAddSongModalOpen(true);
    };
    return (
        <div>
            <div className="add-song-button" onClick={openAddSongModal}>Add Song</div>
            <AddSongModal isOpen={isAddSongModalOpen} onClose={() => setIsAddSongModalOpen(false)} />
            <div className={"player-main"}>
                <MusicPlayer
                    currentSong={currentSong}
                    currentIndex={currentIndex}
                    songs={songs}
                    setSongs={setSongs}
                />
            </div>
            <div className="pagination-container"
                 style={{maxHeight: paginationMaxHeight}}> {/* Adaugă un container pentru paginare */}
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
