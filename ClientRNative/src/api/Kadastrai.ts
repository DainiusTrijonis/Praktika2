import firestore from '@react-native-firebase/firestore';
import auth  from '@react-native-firebase/auth'

export type FirebaseKadastras = {
    id: string,
    kadastras: Kadastras,
}
export type Kadastras = {
    kadastrinisNr: string,
    adresas: string,
    data: string,
}

export type FirebaseSklypas = {
    id: string,
    sklypas: Sklypas,
}
export type Sklypas = {
    sklypoNr: string,
    plotas?: number,
}

export type FirebaseBarelis = {
    id:string,
    barelis: Barelis
}
export type Barelis = {
    barelioNr: string,
    plotas?: number,
}

export type FirebaseMedis = {
    id:string,
    medis:Medis,
}
export type Medis = {
    medzioNr:string,
    ardas:string,
    medzioRusis:string,
    bukle:string,
    D:string,
    H:string,
    amzius:string,
}



export type ApiClient = {
    getKadastraiRealtime(callback:any): void
    getSklypaiRealtime(callback:any, kadastroId:string): void
    getBareliaiRealtime(callback:any, kadastroId:string, sklypoId:string): void
    getMedziaiRealtime(callback:any, kadastroId:string, sklypoId:string, barelioId:string): void

    addKadastras(k:Kadastras):  void
    addSklypas(s:Sklypas,kadastroId:string):  void
    addBarelis(b:Barelis,kadastroId:string, sklypoId:string):  void
    addMedis(m:Medis,kadastroId:string, sklypoId:string, barelioId:string):  void

    deleteKadastras:(k:FirebaseKadastras) => Promise<boolean>
    deleteSklypas:(s:FirebaseSklypas,kadastroId:string) => Promise<boolean>
    deleteBarelis:(b:FirebaseBarelis,kadastroId:string, sklypoId:string) => Promise<boolean>
    deleteMedis:(m:FirebaseMedis,kadastroId:string, sklypoId:string, barelioId:string) => Promise<boolean>

}

export const createApiClient = (): ApiClient => {
    return {
        getKadastraiRealtime: (callback) => {
            const userId = auth().currentUser?.uid;
            if(userId != null) {
                firestore().collection("UserCollections").doc(userId).collection("Kadastrai")
                .onSnapshot((querySnapshot) => {
                    var k:FirebaseKadastras[] = new Array<FirebaseKadastras>();
                    querySnapshot.forEach((doc:any)=> {
                        const document:Kadastras = doc.data()
                        const docId:string = doc.id
                        const firebaseKadastras:FirebaseKadastras = {id:docId,kadastras:document}
                        k.push(firebaseKadastras); 
                    });
                    callback(k);
                })
            }
        },
        getSklypaiRealtime: (callback, kadastroId ) => {
            const userId = auth().currentUser?.uid;
            firestore().collection("UserCollections").doc(userId).collection("Kadastrai").doc(kadastroId).collection("Sklypai")
                .onSnapshot((querySnapshot) => {
                    var s:FirebaseSklypas[] = new Array<FirebaseSklypas>();
                    querySnapshot.forEach((doc:any)=> {
                        const document:Sklypas = doc.data()
                        const docId:string = doc.id
                        const firebaseSklypas:FirebaseSklypas = {id:docId,sklypas:document}
                        s.push(firebaseSklypas); 
                    });
                    callback(s);
                })
        },
        getBareliaiRealtime: (callback, kadastroId, sklypoId ) => {
            const userId = auth().currentUser?.uid;
            firestore().collection("UserCollections").doc(userId).collection("Kadastrai").doc(kadastroId).collection("Sklypai").doc(sklypoId).collection('Bareliai')
                .onSnapshot((querySnapshot) => {
                    var b:FirebaseBarelis[] = new Array<FirebaseBarelis>();
                    querySnapshot.forEach((doc:any)=> {
                        const document:Barelis = doc.data()
                        const docId:string = doc.id
                        const firebaseBarelis:FirebaseBarelis = {id:docId, barelis:document}
                        b.push(firebaseBarelis); 
                    });
                    callback(b);
                })
        },
        getMedziaiRealtime: (callback, kadastroId, sklypoId, barelioId ) => {
            const userId = auth().currentUser?.uid;
            firestore().collection("UserCollections").doc(userId).collection("Kadastrai").doc(kadastroId).collection("Sklypai").doc(sklypoId).collection('Bareliai').doc(barelioId).collection('Medziai')
                .onSnapshot((querySnapshot) => {
                    var m:FirebaseMedis[] = new Array<FirebaseMedis>();
                    querySnapshot.forEach((doc:any)=> {
                        const document:Medis = doc.data()
                        const docId:string = doc.id
                        const firebaseMedis:FirebaseMedis = {id:docId, medis:document}
                        m.push(firebaseMedis); 
                    });
                    callback(m);
                })
        },
        addKadastras: (k:Kadastras) => {
            const userId = auth().currentUser?.uid;
            if (userId != null) {
                firestore().collection("UserCollections").doc(userId).collection('Kadastrai').where('kadastrinisNr','==',k.kadastrinisNr).get()
                    .then(snapshot =>{
                        var id;
                        snapshot.forEach((doc)=>{
                            id = doc.id
                        })
                        if(snapshot.empty) {
                            firestore().collection("UserCollections").doc(userId).collection('Kadastrai').add(k);
                        }
                        else {
                            firestore().collection("UserCollections").doc(userId).collection('Kadastrai').doc(id).set(k, {merge: true})
                        }
                    })
            }
        },
        addSklypas: (s:Sklypas, kadastroId:string) => {
            const userId = auth().currentUser?.uid;
            if (userId != null) {
                firestore().collection("UserCollections").doc(userId).collection('Kadastrai').doc(kadastroId).collection("Sklypai").where('sklypoNr','==',s.sklypoNr).get()
                    .then(snapshot =>{
                        var id;
                        snapshot.forEach((doc)=>{
                            id = doc.id
                        })
                        if(snapshot.empty) {
                            firestore().collection("UserCollections").doc(userId).collection('Kadastrai').doc(kadastroId).collection("Sklypai").add(s);
                        }
                        else {
                            firestore().collection("UserCollections").doc(userId).collection('Kadastrai').doc(kadastroId).collection("Sklypai").doc(id).set(s, {merge: true});
                        }
                    })
            }
        },
        addBarelis: (b:Barelis, kadastroId:string, sklypoId:string) => {
            const userId = auth().currentUser?.uid;
            if (userId != null) {
                firestore().collection("UserCollections").doc(userId).collection("Kadastrai").doc(kadastroId).collection("Sklypai").doc(sklypoId).collection('Bareliai').where('barelioNr','==',b.barelioNr).get()
                    .then(snapshot =>{
                        var id;
                        snapshot.forEach((doc)=>{
                            id = doc.id
                        })
                        if(snapshot.empty) {
                            firestore().collection("UserCollections").doc(userId).collection("Kadastrai").doc(kadastroId).collection("Sklypai").doc(sklypoId).collection('Bareliai').add(b);
                        }
                        else {
                            firestore().collection("UserCollections").doc(userId).collection("Kadastrai").doc(kadastroId).collection("Sklypai").doc(sklypoId).collection('Bareliai').doc(id).set(b, {merge: true});
                        }
                    })
            }
        },
        addMedis: (m:Medis, kadastroId:string, sklypoId:string, barelioId:string) => {
            const userId = auth().currentUser?.uid;
            if (userId) {
                firestore().collection("UserCollections").doc(userId).collection("Kadastrai").doc(kadastroId).collection("Sklypai").doc(sklypoId).collection('Bareliai').doc(barelioId).collection('Medziai').where('medzioNr','==',m.medzioNr).get()
                    .then(snapshot =>{
                        var id;
                        snapshot.forEach((doc)=>{
                            id = doc.id
                        })
                        if(snapshot.empty) {
                            firestore().collection("UserCollections").doc(userId).collection("Kadastrai").doc(kadastroId).collection("Sklypai").doc(sklypoId).collection('Bareliai').doc(barelioId).collection('Medziai').add(m);
                        }
                        else {
                            firestore().collection("UserCollections").doc(userId).collection("Kadastrai").doc(kadastroId).collection("Sklypai").doc(sklypoId).collection('Bareliai').doc(barelioId).collection('Medziai').doc(id).set(m, {merge: true});
                        }
                    })
            }
        },

        deleteKadastras: async(k:FirebaseKadastras) => {
            const userId = auth().currentUser?.uid;
            return await firestore().collection("UserCollections").doc(userId).collection("Kadastrai").doc(k.id).delete().then(function() {
                return true;
            }).catch(function(error) {
                return false;
            });
        },
        deleteSklypas: async(s:FirebaseSklypas,kadastroId:string) => {
            const userId = auth().currentUser?.uid;
            return await firestore().collection("UserCollections").doc(userId).collection("Kadastrai").doc(kadastroId).collection("Sklypai").doc(s.id).delete().then(function() {
                return true;
            }).catch(function(error) {
                return false;
            });
        },
        deleteBarelis: async (b:FirebaseBarelis,kadastroId:string, sklypoId:string) => {
            const userId = auth().currentUser?.uid;
            return await firestore().collection("UserCollections").doc(userId).collection("Kadastrai").doc(kadastroId).collection("Sklypai").doc(sklypoId).collection("Bareliai").doc(b.id).delete().then(function() {
                return true;
            }).catch(function(error) {
                return false;
            });
        },
        deleteMedis: async (m:FirebaseMedis,kadastroId:string, sklypoId:string, barelioId:string) => {
            const userId = auth().currentUser?.uid;
            return await firestore().collection("UserCollections").doc(userId).collection("Kadastrai").doc(kadastroId).collection("Sklypai").doc(sklypoId).collection("Bareliai").doc(barelioId).collection("Medziai").doc(m.id).delete().then(function() {
                return true;
            }).catch(function(error) {
                return false;
            });
        },

    }
}