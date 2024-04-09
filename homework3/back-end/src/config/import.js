import { exec } from 'child_process';
const importCommand = 'mongoimport --uri="mongodb+srv://lucanastasa:vOt8m9d5fbl7gdrH@mydb.dkwmln7.mongodb.net/MusicApp" --collection=artists --file=/path/to/local_data.json --jsonArray';

exec(importCommand, (error, stdout, stderr) => {
    if (error) {
        console.error(`Eroare la importul datelor: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`Eroare la importul datelor: ${stderr}`);
        return;
    }

    console.log('Datele au fost importate cu succes în baza de date cloud.');
});
