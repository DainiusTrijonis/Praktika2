import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

const serviceAccount = require("../ServiceAccountKey.json");

admin.initializeApp({
 credential: admin.credential.cert(serviceAccount),
});
// const db = admin.firestore();


// Set UID admin
// const adminUid = 'TrRvF6ipu0eOIxTAot2guW5cyu63';
// const additionalClaims ={
//     admin: true,
// };
// admin.auth().setCustomUserClaims(adminUid, additionalClaims)
//   .then(() => {
//     functions.logger.info("Succesfully granted admin claims", {structuredData: true});
//   })
//   .catch((error:any) => {
//     functions.logger.info("Failed to make admins", {structuredData: true});
//   })

// admin.auth().createCustomToken(adminUid, additionalClaims)
// .then((customToken: any) => {
//   functions.logger.info(customToken, {structuredData: true});
// })
// .catch((error:any) => {
//   console.log('Error creating custom token:', error);
// });

exports.helloWorld = functions.https.onCall(() => {
  functions.logger.info("Hello logs!", {structuredData: true});

  return [
    "HelloWorld",
  ];
});
