const { app } = require('@azure/functions');
const { BlobServiceClient } = require('@azure/storage-blob');
const { shuffle, findMatchingSongs } = require('./musicAI'); // Importarea funcțiilor

const connectionString = 'https://musicappluca.blob.core.windows.net/?sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiyx&se=2024-08-20T00:03:21Z&st=2024-05-19T16:03:21Z&spr=https&sig=TAiN0%2BNPbD1Ie5l5aLSpDgXwEdGKYSrmUY50H%2BTEBPg%3D';
const containerName = 'remixed-audios';

const blobServiceClient = new BlobServiceClient(connectionString);
const containerClient = blobServiceClient.getContainerClient(containerName);

app.http('generate-music', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'generate',
    handler: async (request, context) => {
        const { playlist } = JSON.parse(await request.text());

        // Extragem numele melodiilor din playlist pentru a le folosi ca searchWords
        const searchWords = playlist.map(item => item[1]);

        return new Promise((resolve, reject) => {
            findMatchingSongs(playlist, searchWords, async (matches) => {
                if (matches && matches.length > 0) {
                    const selectedMixes = [];

                    for (const match of matches) {
                        const blobName = match.link.split('/').pop();
                        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
                        selectedMixes.push(blockBlobClient.url);
                    }

                    resolve({
                        status: 200,
                        body: JSON.stringify({ urls: selectedMixes })
                    });
                } else {
                    resolve({
                        status: 200,
                        body: JSON.stringify({ message: 'No matching songs found.' })
                    });
                }
            });
        });
    }
});
