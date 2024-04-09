import express from "express";
import { PubSub } from '@google-cloud/pubsub';

const pubsub = new PubSub({
    projectId: 'homework3-project',
    keyFilename: 'homework3-project-4269da636131.json' // sau direct cheile de autentificare
});

const router = express.Router();

async function listenForNews(topicName,subscriptionName) {
    const subscription = pubsub.subscription(subscriptionName, { topic: topicName });

    return new Promise((resolve, reject) => {
        const news = [];
        subscription.on('message', messageHandler);
        subscription.on('error', errorHandler);

        function messageHandler(message) {
            console.log(`Received message: ${message.id}`);
            console.log(`Data: ${message.data.toString()}`);
            message.ack();
            news.push(JSON.parse(message.data.toString())); // Adăugați știrea la array-ul de știri
        }

        function errorHandler(error) {
            console.error(`Error occurred: ${error}`);
            reject(error); // Rejectăm promisiunea în caz de eroare
        }

        subscription.on('close', () => {
            resolve(news); // Rezolvăm promisiunea atunci când abonamentul se închide
        });
        setTimeout(() => {
            resolve(news); // Rezolvăm promisiunea după un interval de timp
        }, 6000);
    });
}

async function createNews(topicName, newsData) {
    const dataBuffer = Buffer.from(JSON.stringify(newsData));

    try {
        // Publicăm mesajul către topic
        const messageId = await pubsub.topic(topicName).publish(dataBuffer);
        console.log(`Mesajul a fost publicat cu ID-ul: ${messageId}`);
        return messageId;
    } catch (error) {
        console.error('Eroare la publicarea știrii:', error);
        throw error;
    }
}

router.post('/create-news', async (req, res) => {
    const { topicName, title, content } = req.body; // Se așteaptă să primească numele topicului, titlul și conținutul știrii în corpul cererii

    try {
        const messageId = await createNews(topicName, { title, content });
        res.status(200).json({ messageId });
    } catch (error) {
        console.error('Eroare la crearea știrii:', error);
        res.status(500).json({ error: 'A apărut o eroare la crearea știrii.' });
    }
});

router.get('/listen-news/:topicName/:subscriptionName', async (req, res) => {
    const { topicName,subscriptionName } = req.params;

    try {
        const news = await listenForNews(topicName,subscriptionName);
        res.status(200).json(news);
    } catch (error) {
        console.error('Eroare la preluarea știrilor:', error);
        res.status(500).json({ error: 'A apărut o eroare la preluarea știrilor.' });
    }
});

export default router;
