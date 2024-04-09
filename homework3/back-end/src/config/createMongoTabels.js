import mongoose from 'mongoose';

const connectionString = 'mongodb+srv://lucanastasa:vOt8m9d5fbl7gdrH@mydb.dkwmln7.mongodb.net/MusicApp';
mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(async () => {
    console.log('Conexiunea la MongoDB a fost realizată cu succes!');

    const Artist = mongoose.model('Artist', artistSchema);
    const Album = mongoose.model('Album', albumSchema);
    const Song = mongoose.model('Song', songSchema);

    // await Promise.all([
    //     Artist.create({ name: 'Artist1', description: 'Descriere Artist1', members: ['Membru1', 'Membru2'] }),
    //     Album.create({ name: 'Album1', releaseYear: 2022 }),
    //     Song.create({ name: 'Song1', duration: 180 }),
    // ]);

    console.log('Modelele au fost create cu succes!');
}).catch((err) => {
    console.error('Eroare la conectarea la MongoDB:', err);
});
