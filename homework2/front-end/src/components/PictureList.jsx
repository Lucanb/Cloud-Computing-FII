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
    console.log('imageList:', imageList);
    const handleImageClick = (id) => {
        console.log(`Ai selectat artistul cu id-ul: ${id}`);
        // Navigare către pagina artistului
        console.log("id de redirect",id)
        navigate(`/${string}/:${id}`);
    };

    return (
        <div className="image-list-container">
            <div className="image-list">
                {imageList.map((imageName, index) => (
                    <div className="image-item" key={index} onClick={() => handleImageClick(imageName._id)}>
                        <img src={imageName.link} alt={`Image ${index + 1}`}/>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PictureList;
