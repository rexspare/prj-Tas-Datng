const functions = require("firebase-functions");
const nodemailer = require("nodemailer");
const admin = require("firebase-admin");
const express = require("express");
var path = require("path");
;

admin.initializeApp(functions.config().firebase);

const firestore = admin.firestore;
const notificationsRef = firestore().collection("userNotifications");



var app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// app.use('/static', express.static('public'));


exports.webApp = functions.https.onRequest(app);

exports.sendPushNotification = functions.https.onCall(async (data, context) => {
    saveNotification(data);
    const payload = {
        notification: {
            title: `${data?.title}`,
            body: `${data?.message}`,
        },
    };
    admin
        .messaging()
        .sendToDevice(data?.FCMToken, payload)
        .then(function (response) {
            // functions.logger.log(response);
        })
        .catch(function (error) {
            // functions.logger.log(error);
        });
});



const saveNotification = (data) => {
    notificationsRef
        .doc()
        .set({
            type: data?.type,
            title: `${data?.title}`,
            body: `${data?.message}`,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            lastUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
            userId: data.userId,
            seenAt: null,
        })
        .then(() => {
            return "done";
        })
        .catch((error) => {
            return error;
        });
};
