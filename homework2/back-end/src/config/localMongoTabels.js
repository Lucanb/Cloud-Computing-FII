import mongoose from 'mongoose';
import fs from 'fs';

const localConnectionString = 'mongodb://localhost:27017/MusicApp';

mongoose.connect(localConnectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(async () => {
    console.log('Conexiunea la MongoDB local a fost realizată cu succes!');

    const artistSchema = new mongoose.Schema({
        name: { type: String, required: true },
        description: String,
        members: [String]
    });

    const albumSchema = new mongoose.Schema({
        name: { type: String, required: true },
        releaseYear: Number,
        artist: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist' }
    });

    const songSchema = new mongoose.Schema({
        name: { type: String, required: true },
        duration: Number,
        artist: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist' },
        album: { type: mongoose.Schema.Types.ObjectId, ref: 'Album' }
    });

    const Artist = mongoose.model('Artist', artistSchema);
    const Album = mongoose.model('Album', albumSchema);
    const Song = mongoose.model('Song', songSchema);

    const [artist, album, song] = await Promise.all([
        Artist.create({ name: 'Artist1', description: 'Descriere Artist1', members: ['Membru1', 'Membru2'] }),
        Album.create({ name: 'Album1', releaseYear: 2022 }),
        Song.create({ name: 'Song1', duration: 180 }),
    ]);

    console.log('Modelele au fost create cu succes!');

    const dataToSave = { artist, album, song };
    const jsonData = JSON.stringify(dataToSave, null, 2);
    fs.writeFile('database_data.json', jsonData, (err) => {
        if (err) {
            console.error('Eroare la salvarea fișierului JSON:', err);
        } else {
            console.log('Datele au fost salvate cu succes în fișierul database_data.json');
        }
    });
}).catch((err) => {
    console.error('Eroare la conectarea la MongoDB local:', err);
});
