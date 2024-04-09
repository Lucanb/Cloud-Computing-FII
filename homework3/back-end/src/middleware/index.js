import admin from "../config/firebase-config.js";

async function decodeToken(req, res, next) {

    const token = req.headers.authorization.split(' ')[1];
    try {
        const decode = await admin.auth().verifyIdToken(token);
        if (decode) {
            // console.log(decode);
            req.value = decode;
            return next();
        }
        return res.json({ message: "unauthorised access" });
    } catch (error) {
        return res.json({ message: "Internal Error" });
    }
}

export { decodeToken };
