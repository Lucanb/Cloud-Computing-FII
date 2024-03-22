import { exec } from 'child_process';
const exportCommand = 'mongoexport --uri="mongodb://localhost:27017/MusicApp" --collection=artists --out=/path/to/exported_data.json';

exec(exportCommand, (error, stdout, stderr) => {
    if (error) {
        console.error(`Eroare la exportul datelor: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`Eroare la exportul datelor: ${stderr}`);
        return;
    }

    console.log('Datele au fost exportate cu succes în fișierul exported_data.json');
    const importCommand = 'mongoimport --uri="mongodb+srv://lucanastasa:vOt8m9d5fbl7gdrH@mydb.dkwmln7.mongodb.net/MusicApp" --collection=artists --file=/path/to/exported_data.json --jsonArray';

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
});
