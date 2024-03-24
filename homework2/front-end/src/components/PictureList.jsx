import React, { useState, useEffect } from 'react';
import './PictureList.css';

const PictureList = () => {
    const [imageList, setImageList] = useState([]);

    useEffect(() => {
        const apiUrl = 'https://api.unsplash.com/photos/random?count=10&client_id=YOUR_ACCESS_KEY';
        fetch('data/images.json')
            .then(response => response.json())
            .then(data => setImageList(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const handleImageClick = (imageName) => {
        console.log(`Ai selectat imaginea: ${imageName}`);
    };

    return (
        <div className="image-list-container">
            <div className="image-list">
                {imageList.map((imageName, index) => (
                    <div className="image-item" key={index} onClick={() => handleImageClick(imageName)}>
                        <img src={`/images/${imageName}`} alt={`Image ${index + 1}`} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PictureList;
