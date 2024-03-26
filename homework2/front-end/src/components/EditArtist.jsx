import React, { useState } from 'react';

const EditArtistModal = ({ artistData, onClose }) => {
    const [name, setName] = useState(artistData.name);
    const [description, setDescription] = useState(artistData.description);
    const [members, setMembers] = useState(artistData.members);
    const [link, setLink] = useState(artistData.link);

    const handleUpdateArtist = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/api/artists/update/${artistData._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    description,
                    members,
                    link
                })
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            onClose();
            console.log('Artist data updated successfully!');
        } catch (error) {
            console.error('Error updating artist data:', error);
        }
    };

    return (
        <div className="modal">
            <form onSubmit={handleUpdateArtist}>
                <label>Name:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                <label>Description:</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                <label>Members:</label>
                <input type="text" value={members} onChange={(e) => setMembers(e.target.value)} />
                <label>Link:</label>
                <input type="text" value={link} onChange={(e) => setLink(e.target.value)} />
                <button type="submit">Update Artist</button>
            </form>
            <button onClick={onClose}>Close</button>
        </div>
    );
};

export default EditArtistModal;
