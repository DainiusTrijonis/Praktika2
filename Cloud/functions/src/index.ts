import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

const serviceAccount = require("../ServiceAccountKey.json");

admin.initializeApp({
 credential: admin.credential.cert(serviceAccount),
});
// const db = admin.firestore();

// admin.auth().setCustomUserClaims('LFi8bIFTUkdNgVsRTaJ8ZOQxrPD3', {admin: true}).then(() => {
//   console.log("Success");
// }).catch((error)=>{console.log(error)});


exports.grantAdminOnCreate = functions.auth.user().onCreate((user) => {
  admin.auth().setCustomUserClaims(user.uid, {admin: false, premium: false}).then(()=>{
    console.log("successfully added custom claims");
    admin.auth().getUser(user.uid).then((userRecord) => {
      // The claims can be accessed on the user record.
      if(userRecord.customClaims)
      console.log(userRecord.customClaims['admin']);
    }).catch((error)=>{console.log(error)});
  }).catch((error) =>{
    console.log("failed to add custom claims",error);
  })
});

exports.getUsers = functions.https.onCall((token:string) => {
  return admin.auth().verifyIdToken(token).then((claims) => {
    if(claims.admin === true) {
      return admin.auth().listUsers(1000)
        .then(function(listUsersResult) {
          return [
            listUsersResult.users,
          ];
        })
        .catch(function(error) {
          return [
            "Error listing users: " + error,
          ];
        });
    }
    else {
      return[
        "Error claims: Not admin!",
      ];
    }

  }).catch((error) => {
    return[
      "Error verify token:" + error,
    ];
  });
});
exports.updateUserPassword = functions.https.onCall((data) => {
  return admin.auth().verifyIdToken(data['idToken']).then((claims) => {
    if(claims.admin === true) {
      return admin.auth().updateUser(data['uid'],data['password']).then(function(userRecords) {
        console.log("successfully updated user record:",data['uid']);
        return[
          "successfully updated user record:",data['uid'],
        ]
      }).catch((error) =>{
        return[
          "Error updating user: ",error,
        ]
      });
    }
    else {
      return[
        "Error claims: Not admin!",
      ];
    }
  }).catch((error) =>{
      return[
        "Error verify token:" + error,
      ];
    });
});

exports.deleteUser = functions.https.onCall((data) => {
  return admin.auth().verifyIdToken(data['idToken']).then((claims) => {
    if(claims.admin === true) {
      return admin.auth().deleteUser(data['uid']).then(function() {
        console.log("successfully deleted user record:",data['uid']);
        return[
          "successfully deleted user record:",data['uid'],
        ]
      }).catch((error) =>{
        return[
          "Error deleting user: ",error,
        ]
      });
    }
    else {
      return[
        "Error claims: Not admin!",
      ];
    }
  }).catch((error) =>{
      return[
        "Error verify token:" + error,
      ];
    });
});
exports.changeAccessStatus = functions.https.onCall((data) => {
  return admin.auth().verifyIdToken(data['idToken']).then((claims) => {
    if(claims.admin === true) {
      return admin.auth().setCustomUserClaims(data['uid'],data['customClaims']).then(function(userRecords) {
        console.log("successfully updated user record:",userRecords);
        return[
          "successfully updated user record:",data['uid'],
        ]
      }).catch((error) =>{
        return[
          "Error updating user: ",error,
        ]
      });
    }
    else {
      return[
        "Error claims: Not admin!",
      ];
    }
  }).catch((error) =>{
      return[
        "Error verify token:" + error,
      ];
    });
});



