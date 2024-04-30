import React, { useState } from 'react';
import { BlobServiceClient } from '@azure/storage-blob';

const AddImageForm = ({ isOpen, onClose }) => {
    const [imageData, setImageData] = useState({
        title: '',
        imageUrl: '',
    });
    const [file, setFile] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setImageData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (!file) {
                console.error('No file selected');
                return;
            }

            const blobServiceClient = new BlobServiceClient(
                'https://mymusicapp.blob.core.windows.net/images',
                "https://mymusicapp.blob.core.windows.net/images/?sv=2022-11-02&ss=bf&srt=co&se=2024-05-03T14%3A13%3A41Z&sp=rwl&sig=R%2BfhrbTaDq4JT56ZquylVCdGlkISiPURHjVlE9trPBA%3D"
            );

            const containerName = '<container-name>';
            const containerClient = blobServiceClient.getContainerClient(containerName);
            const blobName = file.name;
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);

            await blockBlobClient.uploadBrowserData(file);

            const imageUrl = blockBlobClient.url;
            const imageDataWithUrl = { ...imageData, imageUrl };

            setImageData({
                title: '',
                imageUrl: '',
            });

            onClose();
            window.location.reload();
        } catch (error) {
            console.error('Error adding image:', error);
        }
    };

    return (
        <>
            {isOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={onClose}>&times;</span>
                        <h2>Add New Image</h2>
                        <form onSubmit={handleSubmit} className="addForm">
                            <input
                                type="text"
                                name="title"
                                value={imageData.title}
                                onChange={handleChange}
                                required
                                placeholder="Title"
                            />
                            <input
                                type="file"
                                onChange={handleFileChange}
                                required
                            />
                            <button type="submit">Add Image</button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddImageForm;