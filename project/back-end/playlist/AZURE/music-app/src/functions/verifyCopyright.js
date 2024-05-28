const { app } = require('@azure/functions');
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const acrcloud = require('acrcloud');
const { BlobServiceClient } = require('@azure/storage-blob');

const ACRCloudConfig = {
    host: 'identify-eu-west-1.acrcloud.com',
    access_key: '997c313283f743f8f7b6803546786825',
    access_secret: '1MbliKcTSsD2VgBzbgclPx1cj2ldjdKploZdAwEn'
};

const acrcloudClient = new acrcloud(ACRCloudConfig);

app.http('verify-copyright', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'verify',
    handler: async (request, context) => {
        const { blobUrl } = JSON.parse(await request.text());

        try {
            const blobServiceClient = new BlobServiceClient('https://musicappluca.blob.core.windows.net/?sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiyx&se=2024-08-20T00:03:21Z&st=2024-05-19T16:03:21Z&spr=https&sig=TAiN0%2BNPbD1Ie5l5aLSpDgXwEdGKYSrmUY50H%2BTEBPg%3D');
            const containerClient = blobServiceClient.getContainerClient("songs");
            const blobName = path.basename(blobUrl);
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);

            const downloadBlockBlobResponse = await blockBlobClient.download(0);
            const filePath = `/tmp/${blobName}`;
            const fileStream = fs.createWriteStream(filePath);

            downloadBlockBlobResponse.readableStreamBody.pipe(fileStream);

            return new Promise((resolve, reject) => {
                fileStream.on('finish', () => {
                    const outputFilePath = `/tmp/segment-${blobName}`;

                    ffmpeg.setFfmpegPath(ffmpegPath);

                    ffmpeg(filePath)
                        .setStartTime('00:00:00')
                        .setDuration(15)
                        .audioCodec('libmp3lame')
                        .audioBitrate('128k')
                        .format('mp3')
                        .output(outputFilePath)
                        .on('end', () => {
                            fs.readFile(outputFilePath, (err, data) => {
                                if (err) {
                                    return resolve({
                                        status: 500,
                                        body: JSON.stringify({ error: 'Error reading segment file.' })
                                    });
                                }

                                acrcloudClient.identify(data)
                                    .then(result => {
                                        console.log("Identification result:");
                                        console.dir(result, { depth: null });

                                        let isProtected = false;

                                        if (result.status.code === 0 && result.metadata && result.metadata.music && result.metadata.music.length > 0) {
                                            isProtected = true;
                                        }

                                        if (result.metadata && result.metadata.humming && result.metadata.humming.length > 0) {
                                            result.metadata.humming.forEach(hummingResult => {
                                                if (hummingResult.score >= 0.6) {
                                                    isProtected = true;
                                                }
                                            });
                                        }

                                        fs.unlink(filePath, () => {});
                                        fs.unlink(outputFilePath, () => {});

                                        if (isProtected) {
                                            return resolve({
                                                status: 200,
                                                body: JSON.stringify({ isProtected: true, message: 'The uploaded file is protected by copyright.' })
                                            });
                                        } else {
                                            return resolve({
                                                status: 200,
                                                body: JSON.stringify({ isProtected: false, message: 'No matching content found.' })
                                            });
                                        }
                                    })
                                    .catch(err => {
                                        return resolve({
                                            status: 500,
                                            body: JSON.stringify({ error: 'Error identifying audio: ' + err })
                                        });
                                    });
                            });
                        })
                        .on('error', (err) => {
                            return resolve({
                                status: 500,
                                body: JSON.stringify({ error: 'Error extracting segment: ' + err })
                            });
                        })
                        .run();
                });
            });
        } catch (error) {
            return {
                status: 500,
                body: JSON.stringify({ error: 'Error processing audio: ' + error })
            };
        }
    }
});
