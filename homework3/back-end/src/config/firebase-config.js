import admin from "firebase-admin";

const firebaseConfig = {
    "type": "service_account",
    "project_id": "myapp-dc3c4",
    "private_key_id": "3f7b2898f3852097e8a88ee65233142c26f86c1b",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCsZnvWiBxb74GD\nNQ0nuSnR6vO27wLUKO3C/xu0A8g1KdNw+pf2Z3wqhVNbnPbIg6KZ2OukND6U1O2d\nCPERLPW3FXHJGhgQbNqn49EWC+Tm9VJ1tP+AUOLxZcR9vFhHR/4ZWSVq2p3bxZ8O\n6OSSlq26udN/7lOQma+nQGJMYebf1reozxB1hqfMFdfTsI6Qpj7uxUk/ELlY6tN0\nvMgActucR7l25fMZrqTmv61/gFWDeQH2twTRCq5clPbpGqAb5nGb3C3L7lfsPUqa\nAbW45DesfGH2X2BmDsYOJzTROz3GTnd+fsScK4tNkfGqwp4kU/eG8AfhoMWQfNH1\nuaWH7F3TAgMBAAECggEALVaKTMHgy2CyK6JBAmhUkir6yuoSUV8uH/DdBTtVZH3K\naFTOr/NJGRmU8WvXDqZnlZQRbE59AsD4eCrI0t6DBBH0qZFeMLufyTVFYEniecac\nV+4wnzsmY5uC0Bo/EQfi0CG8kFxL1WckTFR8//v2VjvWXjd77HQuWIq7DyFUCRtM\nPcvh5rhFvRoCoKhHHxwVUZeZ9LDHFeMszJu+CHcZ31/+/ym7/9JvhyDyIEnoK7Fg\nEOx+Gb3hEQ5+6HoxRal4bsBiVfjVDhNB5OT1lbLBBVy6jlA7Blf/+sFizknzc9JC\nN9MfWeLvH9SO2w5mIlE7tpVSLNd9qtOkjM+012Sh6QKBgQDtlt/rfJtKV6Re5+kP\nH51fifpZqcBkpzVFr+LzEnKmL+4GzioQyny/urrp0jyOHwrfH8oeVqZkm4x0NU4d\nZ0QE6a8vVQTZ07jBVFGFLsvAtUhpMNHSlYGJW0VCxslMnDtZwzR0ceQKJue5aN28\nabTMMp8SjpFxaIEN9Mz1Zn8mRwKBgQC5wm+4hJ0rYM+HWUQMM841tlMiYLyDHceE\nLUNPz0CIvolm2/9RBOBb8myww8wJu+Tz6bTulam+8vZcMAgyFT7Um5YYliWAEpn0\nliMPNplaSCS367MsP5TK8IEbcTwhtX5um47jnZzLCSusMdVqm7D6Z5h3dBlY55L3\n+CCixpr2FQKBgBGQfttc6eoUEp3FjVBF6Q+AFtb8GrIWPnT5bNDFg15P2sv7/9Yf\n8hsGhfz1Qu7K0rXuFrYpd8GmUjrhGfZIhRnL4Nyh72rfISCByEkNTZjgjgrgxhJI\nZTwvWC54nbchMa4QJVead95cQ/NMEmB0fB5Ae8wWaCA3Nps+hsx5mFrPAoGBAJ9L\nZZLN5hm0w0JGAlyUcFkPKOtqGT4240ktp3NhPu4Etr9GGQPZMqymjx5mSSpvvj6M\nQ2P1Y8MjhrA3YE/SeDbJ1UTwPOg/C1b7CMWbBJavFw3BSbzAKVB+PbjSucYOZYVk\nUHxQRIy4KINZmLH7ISEahVyqarIao6WRWis8NNahAoGBAMmKj3MUUZ6yPB1zREBd\nOKhgkPxI/73VkvQNR1xRTDDJT1t8hT25hp+CNjQ/4fzl6dvbEbV6HYFYnB78CQEv\n5oU5LbnNhY4VCKupWepeoDOSFMm/ZCKIHs4jbxcODXZfpMs/HrJJqYd+MVXyQU54\n84WJfZRsA0tTAd+sisKRm6/2\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-z16q5@myapp-dc3c4.iam.gserviceaccount.com",
    "client_id": "101222947472178970923",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-z16q5%40myapp-dc3c4.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
}

admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig)
});

export default admin;