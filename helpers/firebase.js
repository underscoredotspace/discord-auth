const admin = require("firebase-admin")
const firebaseLogin = require("../firebase-login.json")
const serviceCredential = {
    ...firebaseLogin,
    private_key: process.env["FIREBASE_PRIVATE_KEY"],
    private_key_id: process.env["FIREBASE_PRIVATE_KEY_ID"],
    client_email: process.env["FIREBASE_CLIENT_EMAIL"],
    client_id: process.env["FIREBASE_CLIENT_ID"],
}

let db = null

module.exports = function () {
    if (!db) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceCredential),
            databaseURL: "https://gpad-api.firebaseio.com",
        })

        db = admin.firestore()
    }

    return db
}
