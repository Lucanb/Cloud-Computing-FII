const { app } = require('@azure/functions');
const axios = require('axios'); // For making HTTP requests
const { BlobServiceClient } = require('@azure/storage-blob');

const connectionString = 'https://musicappluca.blob.core.windows.net/?sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiyx&se=2024-08-20T00:03:21Z&st=2024-05-19T16:03:21Z&spr=https&sig=TAiN0%2BNPbD1Ie5l5aLSpDgXwEdGKYSrmUY50H%2BTEBPg%3D';
const containerName = 'remixed-audios';

const MUBERT_API_KEY = ''
const blobServiceClient = new BlobServiceClient(connectionString);
const containerClient = blobServiceClient.getContainerClient(containerName);

app.http('generate-music', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'generate',
        handler: async (request, context) => {
            const { email, playlist, duration } = JSON.parse(await request.text());
    
            // Step 1: Register user and get PAT
            const patResponse = await axios.post('https://api-b2b.mubert.com/v2/GetServiceAccess', {
                email: email,
                license: 'your_license',
                token: 'your_company_token'
            });
    
            const pat = patResponse.data.data.pat;
    
            // Step 2: Generate music using the PAT
            const musicResponse = await axios.post('https://api-b2b.mubert.com/v2/RecordTrack', {
                pat: pat,
                playlist: playlist,
                duration: duration,
                format: 'mp3'
            });
    
            const downloadLink = musicResponse.data.data.tasks[0].download_link;
    
            // Step 3: Download the music file and upload it to Azure Blob Storage
            const musicData = await axios.get(downloadLink, { responseType: 'arraybuffer' });
            const blobName = `music-${new Date().getTime()}.mp3`;
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);
            await blockBlobClient.uploadData(musicData.data);
    
            // Step 4: Return the Blob URL
            return {
                status: 200,
                body: JSON.stringify({ url: blockBlobClient.url })
            };
        }
});