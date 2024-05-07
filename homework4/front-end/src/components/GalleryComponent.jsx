import React, { useState, useEffect } from 'react';
import { BlobServiceClient } from '@azure/storage-blob';
import './GalleryComponent.css';

function GalleryComponent() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchImages();
    }, []);

    const get_images = async (containerClient) => {
        const imageUrls = [];
        for await (const blob of containerClient.listBlobsFlat()) {
            const blobUrl = containerClient.getBlockBlobClient(blob.name).url;
            imageUrls.push({
                name: blob.name,
                url: blobUrl
            });
        }
        return imageUrls;
    };

    const fetchImages = async () => {
        setLoading(true);
        setError(null);
        try {
            const blobServiceClient = new BlobServiceClient(
                'https://musicappluca.blob.core.windows.net/images?sp=racwdli&st=2024-05-07T09:34:42Z&se=2024-05-07T17:34:42Z&spr=https&sv=2022-11-02&sr=c&sig=GOYkvNesdU4dZlXo0c2k3l7vtVoDZAk%2FKUYgjh9In0I%3D'
            );
            const containerClient = blobServiceClient.getContainerClient('images');
            const images = [
                {
                    name: "download.jpeg",
                    url: "https://musicappluca.blob.core.windows.net/images/images/download.jpeg"
                },
                {
                    name: "sunset-1373171_1280.jpg",
                    url: "https://musicappluca.blob.core.windows.net/images/images/sunset-1373171_1280.jpg"
                }
            ];//await get_images(containerClient);
            setImages(images);
        } catch (error) {
            console.error('Failed to fetch images:', error);
            setError('Failed to load images');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="gallery">
            <h2>Gallery</h2>
            {images.length > 0 ? (
                <div className="image-grid">
                    {images.map((image, index) => (
                        <div key={index} className="image-item">
                            <img src={image.url} alt={image.name} />
                            <p>{image.name}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No images available</p>
            )}
        </div>
    );
}

export default GalleryComponent;
