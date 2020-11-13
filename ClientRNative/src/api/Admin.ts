import functions from '@react-native-firebase/functions'
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'

export type FirebaseUser = {
    customClaims?: { [key: string]: any},
    disabled?:boolean,
    displayName?:string,
    email?:string,
    emailVerified?: boolean,
    metadata?: FirebaseAuthTypes.UserMetadata,
    passwordHash?: string,
    passwordSalt?: string,
    phoneNumber?: string,
    photoURL?: string,
    providerData?: FirebaseAuthTypes.UserInfo,
    tenantId?: string,
    tokensValidAfterTime?: any,
    uid:string,
}
export type ApiClient = {
    getUsers(callback:any): void;
    deleteUser(uid:string): void;
    changePassword:(uid:string,password:string) => void;
    changeAccess:(uid:string,customClaims:{[key: string]: any}) => void;
}

export const createApiClient = (): ApiClient => {
    return {
        getUsers: (callback) => {
            auth().currentUser?.getIdToken(true).then((idToken)=>{
                if(idToken) {
                  functions().httpsCallable('getUsers')(idToken).then(response =>{
                    var obj:FirebaseUser[] = JSON.parse(JSON.stringify(response.data).slice(1,-1));
                    callback(obj);
                  });
                }
              })
        },
		deleteUser: (uid) => {
            return auth().currentUser?.getIdToken(true).then((idToken)=>{
                if(idToken) {
                    const data: { [key: string]: any} = {idToken, uid}
                    return  functions().httpsCallable('deleteUser')(data).then(response =>{
                        return response.data
                    }).catch((error) => {
                        return error
                    });
                }
            }).catch((error) => {
                return error
            })
        },
        changePassword: (uid,password) => {
            return auth().currentUser?.getIdToken(true).then((idToken)=>{
                if(idToken) {
                    const data: { [key: string]: any} = {idToken, uid, password}
                    return  functions().httpsCallable('updateUserPassword')(data).then(response =>{
                        console.log(response.data);
                        return response.data
                    }).catch((error) => {
                        console.log(error)
                        return error
                    });
                }
            }).catch((error) => {
                console.log(error);
                return error
            })
        },
        changeAccess: (uid,customClaims) => {
            return auth().currentUser?.getIdToken(true).then((idToken) => {
                if(idToken) {
                    const data: { [key: string]: any} = {idToken,uid, customClaims}
                    return functions().httpsCallable('changeAccessStatus')(data).then(response => {
                        console.log(response.data);
                        return response.data;
                    }).catch((error) => {
                        console.log(error);
                        return error;
                    })
                }
            })
        },
    }
}