import * as functions from 'firebase-functions';

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
// var admin = require("firebase-admin");

// var serviceAccount = require("path/to/serviceAccountKey.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });
// const db = admin.firestore();

// const adminUid = 'TrRvF6ipu0eOIxTAot2guW5cyu63';
// const additionalClaims ={
//     adminAccount: true,
// };

// admin.auth().createCustomToken(adminUid, additionalClaims)
// .then((customToken: any) => {
//   console.log(customToken);
// })
// .catch((error:any) => {
//   console.log('Error creating custom token:', error);
// });

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});
