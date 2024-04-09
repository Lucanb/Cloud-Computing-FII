import mongoose from 'mongoose';
const connectionString = 'mongodb+srv://lucanastasa:vOt8m9d5fbl7gdrH@mydb.dkwmln7.mongodb.net/';

export const connectDB = async () => {
    try {
        await mongoose.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Conexiunea la baza de date MongoDB Atlas a fost stabilită cu succes!');
    } catch (error) {
        console.error('Eroare de conectare la MongoDB:', error);
        process.exit(1);
    }
};