import React, { useState, useEffect } from 'react';
import './PictureList.css';
import { useNavigate } from 'react-router-dom';
const PictureList = ({ apiUrl,string }) => {
    const [imageList, setImageList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => setImageList(data))
            .catch(error => console.error('Error fetching data:', error));
    }, [apiUrl]);
    const handleImageClick = (id) => {
        console.log(`Ai selectat artistul cu id-ul: ${id}`);
        // Navigare către pagina artistului
        console.log("id de redirect",id)
        navigate(`/${string}/:${id}`);
    };
    const handleUnfollow = async (id) => {
        try {
            let apiString;
            if (string === "music")
            {
                apiString = "albums";
            }else{
                apiString = "artists";
            }
            const response = await fetch(`http://localhost:5000/api/${apiString}/deleteOne/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // Actualizează lista de imagini după ștergere
            const updatedImageList = imageList.filter(image => image._id !== id);
            setImageList(updatedImageList);
            console.log('Unfollow successful!');
        } catch (error) {
            console.error('Error unfollowing:', error);
        }
    };

    return (
        <div className="image-list-container">
            <div className="image-list">
                {imageList.slice(0, 6).map((imageName, index) => (
                    <div key={index}>
                    <div className="image-item" key={index} onClick={() => handleImageClick(imageName._id)}>
                        <img src={imageName.link} alt={`Image ${index + 1}`}/>
                    </div>
                    <button className="unfollow-button" onClick={() => handleUnfollow(imageName._id)}>Unfollow</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PictureList;
