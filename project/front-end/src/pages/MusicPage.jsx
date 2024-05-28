import React, { useState, useEffect, useContext } from "react";
import MusicPlayer from "../components/musicPlayer";
import Player from "../components/musicContainer";
import ReactPaginate from 'react-paginate';
import { useParams } from 'react-router-dom';
import AddSongModal from "../components/AddSongs";
import { AuthContext } from "../middleware";

const MusicPage = () => {
    const user = useContext(AuthContext);
    console.log("Music page:", user);
    let { id } = useParams();
    id = id.replace(":", "");

    const [songs, setSongs] = useState([]);
    const [album, setAlbum] = useState({});
    const [currentSong, setCurrentSong] = useState({});
    const [pageNumber, setPageNumber] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(null);
    const [isAddSongModalOpen, setIsAddSongModalOpen] = useState(false);
    const songsPerPage = 6;
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);

    const handleResize = () => {
        setWindowHeight(window.innerHeight);
    };

    const fetchAlbumData = async () => {
        try {
            const response = await fetch(`https://music-app-luca.azurewebsites.net/api/albums/getOne/${id}/${user.uid}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            const fetchedAlbum = data;
            if (fetchedAlbum && fetchedAlbum._id) {
                setAlbum(data);
            } else {
                throw new Error('Album data is not valid');
            }
        } catch (error) {
            console.error('Error fetching album data:', error);
        }
    };

    const fetchSongsByAlbum = async () => {
        try {
            const response = await fetch(`https://music-app-luca.azurewebsites.net/api/songs/getSongsByAlbum/${encodeURIComponent(album.title)}/${user.uid}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setSongs(data);
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

    const handleSongAdded = (newSong) => {
        newSong.artist = album.artist;
        newSong.album = album.title || "Unknown Album";
        newSong.releaseDate = new Date().toISOString().split('T')[0];
        newSong.duration = "Unknown Duration";

        setSongs([...songs, newSong]);
    };

    return (
        <div>
            <div className="add-song-button" onClick={openAddSongModal}>Add Song</div>
            <AddSongModal isOpen={isAddSongModalOpen} onClose={() => setIsAddSongModalOpen(false)} onSongAdded={handleSongAdded} />
            <div className={"player-main"}>
                <MusicPlayer
                    currentSong={currentSong}
                    currentIndex={currentIndex}
                    songs={songs}
                    setSongs={setSongs}
                />
            </div>
            <div className="pagination-container" style={{ maxHeight: windowHeight / 5 }}>
                <div className="music-play-container">
                    {currentSongs.map((song, index) => (
                        <Player key={index} song={song} getSongsData={getSongsData} index={index} />
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
