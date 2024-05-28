import React, { useContext, useState } from "react";
import { AuthContext } from "../middleware";
import { BlobServiceClient } from "@azure/storage-blob";
import './Forms.css';

const AddSongModal = ({ isOpen, onClose, onSongAdded }) => {
    const user = useContext(AuthContext);
    const [songData, setSongData] = useState({
        title: "",
    });
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [verificationMessage, setVerificationMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSongData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const uploadFileToBlob = async () => {
        if (!file) return null;

        setUploading(true);
        const blobServiceClient = new BlobServiceClient(`https://musicappluca.blob.core.windows.net/?sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiyx&se=2024-08-20T00:03:21Z&st=2024-05-19T16:03:21Z&spr=https&sig=TAiN0%2BNPbD1Ie5l5aLSpDgXwEdGKYSrmUY50H%2BTEBPg%3D`);
        const containerClient = blobServiceClient.getContainerClient("songs");
        const blobName = `${Date.now()}-${file.name}`;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        try {
            await blockBlobClient.uploadBrowserData(file);
            return blockBlobClient.url;
        } catch (error) {
            console.error('Error uploading file to Blob Storage:', error);
            return null;
        } finally {
            setUploading(false);
        }
    };

    const verifyCopyright = async (blobUrl) => {
        try {
            const response = await fetch(`https://music-app-luca.azurewebsites.net/api/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ blobUrl }),
            });
            const result = await response.json();
            console.log('verif results : ', result);
            return result;
        } catch (error) {
            console.error('Error verifying copyright:', error);
            return { isProtected: false, message: 'Verification failed.' };
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const fileUrl = await uploadFileToBlob();

        if (!fileUrl) {
            console.error('Failed to upload file to Blob Storage');
            return;
        }

        const verificationResult = await verifyCopyright(fileUrl);
        if (verificationResult.isProtected) {
            setVerificationMessage(verificationResult.message);
            console.log('Results : ', verificationResult);
            console.log('Ress mesasge : ', verificationResult.message);
            return;
            }else{

            const newSong = {
                ...songData,
                link: fileUrl,
            };

            onSongAdded(newSong);

            setSongData({ title: "" });
            setFile(null);
            setVerificationMessage('');

            onClose();
        }
    };

    return (
        <>
            {isOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={onClose}>
                            &times;
                        </span>
                        <h2>Add New Song</h2>
                        {verificationMessage && <p style={{ color: 'red' }}>{verificationMessage}</p>}
                        <form onSubmit={handleSubmit} className="addForm">
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={songData.title}
                                onChange={handleChange}
                                required
                                placeholder="Title"
                            />
                            <input
                                type="file"
                                id="file"
                                name="file"
                                onChange={handleFileChange}
                                required
                            />
                            <button type="submit" disabled={uploading}>
                                {uploading ? "Uploading..." : "Add Song"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddSongModal;
