import admin from "firebase-admin";

const firebaseConfig = {
    "type": "service_account",
    "project_id": "homework2-c8e24",
    "private_key_id": "dee2dff1151bc1e57c49b699097b8f770687301d",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC1kYwNOekVyem5\ns9QCKTNGtyIp2PP8eBsGqEKwCJkS6SQHyGN1Scjr5jMFXUb8W4wjrgd1CbrlrgDp\n6jo4PxmBGE5m2lsrMuxGEz50BeBGmztnOWLHlXjuof2Ccg/Nw2KPi6gChkFDmP2A\nNgxd+O2swLUlYp8rRYjLR+cKZVjbHA7h33abkBWd6ScLq4MoG3S0bebOz8bb6CtG\nCUozKkAgTE7J/Gg7qYqdXAnpuJMQevT7fEjLzlB4yEt5nCUI+ALihVKQRT2QuWti\nxue0MCbRy/gSOOovCYPch3sEk2APhPMW0V+0NSFS1YRBBc0GV1eEziNq7UgGeJej\nJSR7wfBXAgMBAAECggEAUvQaXniUy0WiqRtFw277ZFWLID9kyXY+Mr5xKWfkN8WY\nlo2xEwcQ6uYTbWH+apGQ50Q9V/WIFCN5e2VuEACUMGzgdRFSEdyEIkfsgqmkm92U\nOEb5oGHkDHKqFgzyt3mK8DZIHk8kRjQBrbAD2nM+c2zf1iLGwchVBTrmjdNb006q\n6xwIqJ+cpDYKIVfK9gCqip976/l6qxvnoQW+VVQ1Biu0h7huJuw3g9D1DAHv0GWl\nDu6KUTkCWbt4jI4tMgC7jWyYzXBy/4nUi6qQpb/LIzeX1eNKCFBN0PNfU2W944Y+\nKQjrnseF33fncwwlbvbNDZXcrj1fPs3rTbLVTVt7kQKBgQDnJGwNbD2cjhQaSdLh\ncvqs3dViPOLfEKKNQtU0ajSqGBz4GS+OWlsLG+Dk5PrVceLtkjxGBpF9N/WofuSv\n6XKkuOeW71w1ClxihBYVj6E2huqbr81IF745Wc4QfSztuKahdwkukKwjqZlPCq+Y\nCWfz2wHbAbx6X5UGeRWAYP6BMwKBgQDJGE+FQcmc6+Zecqh1imqG7wxUYzsut/qC\nSTKwPNbsWSD4CA1IsR3PuGa8vHPE0M2kKM36qs6jYn5iRhYFaLm7Iecj3kDe8Dzi\n7g3KFg3UADvX9/cMRD8Uq4OZ1lcqY9Qy0Q3eI6mCS5CWUD8Mwo39Nyuycgfe+PDI\nwj9bmZ6cTQKBgQClTyg0JWCfEgIQlxHKCah8b58HxlHfhQ8shkrjVL3blKlLSv/3\nCGoqtMKQEa/PbccFb9vJnTL6YkZAPpihsw05/8Ap84B3srRGBP+iZfm/fJhXxlDD\nqa9zZuX4Zv31+mS5/99CPVfPnaE2pYbV7ow5HD3kewZoYum7GmglS7lZfwKBgQCA\nRa2Txt8f5anQ3Tpvn5dL8vfebF2380ssCBz5JhXCNSg+joRKtg/aDDoccek2xiom\naJDbMFEXDyCm9yXc1WyD3aBe1Mp0arGr30WUfnTbojqKDHXdsTq7qJwNaRe4xmz4\n7Tj3VbAumJzmBNHzBbckqiiJbwtuQ0T0ClP3zgnKkQKBgEd/SAoQjCVgNPJDEqCc\n6T8nQ01oEf5UBZb6Gzc1msFojeWCfbysAyZVnO6tFOkXceZTtFTzJho1gAvyNYKL\nN3lAKH8/Nw2pENe4tXgHx/0YRGWjQOiQG0s3HWBK69sQhqiUhitIbSDwp/Z63A0A\ntFaRZ+knHmz2VFy3kvXg/Fw2\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-gh3g3@homework2-c8e24.iam.gserviceaccount.com",
    "client_id": "104187010957976663401",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-gh3g3%40homework2-c8e24.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
}

admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig)
});

export default admin;