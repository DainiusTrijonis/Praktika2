import React from 'react'
import { Text, View, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import {createApiClient, FirebaseKadastras, FirebaseSklypas,FirebaseBarelis,Medis} from '../api/Kadastrai';

export type AppState = {
    firebaseKadastras: FirebaseKadastras,
    firebaseSklypas: FirebaseSklypas
    firebaseBarelis: FirebaseBarelis,
    medis: Medis,
    errorMsg: string  
}
interface Props {
    navigation: any,
    route: any,
}

const api = createApiClient();

export default class AddMedis extends React.Component<Props> {

    state: AppState = {
        firebaseKadastras: {
            id:'',
            kadastras: {
                vartotojoID:'',
                kadastrinisNr:'',
                adresas:'',
                data:'',
            },
        },
        firebaseSklypas: {
            id:'',
            sklypas:{sklypoNr:'',plotas:0}
        },
        firebaseBarelis: {
            id:'',
            barelis:{barelioNr:'',plotas:0}
        },
        medis:{
            medzioNr:'',
            ardas:'',
            medzioRusis:'',
            bukle:'',
            D:'',
            H:'',
            amzius:'',
        },
        errorMsg: '',
    }
	componentDidMount= () => {
        const firebaseKadastras:FirebaseKadastras = this.props.route.params.firebaseKadastras
        const firebaseSklypas:FirebaseSklypas = this.props.route.params.firebaseSklypas;
        const firebaseBarelis:FirebaseBarelis = this.props.route.params.firebaseBarelis;
        this.setState({
            firebaseKadastras: firebaseKadastras,
            firebaseSklypas: firebaseSklypas,
            firebaseBarelis: firebaseBarelis
        })
    }

    onPressAddMedis = () => {
        if(this.state.medis.medzioNr != '' && this.state.medis.ardas != '' && this.state.medis.medzioRusis != '' && this.state.medis.bukle != '' && this.state.medis.D != ''  && this.state.medis.H != ''  && this.state.medis.amzius != '') {
            api.addMedis(this.state.medis,this.state.firebaseKadastras.id, this.state.firebaseSklypas.id, this.state.firebaseBarelis.id) 
            this.props.navigation.navigate("Medziai",{
                firebaseKadastras: this.state.firebaseKadastras,
                firebaseSklypas: this.state.firebaseSklypas,
                firebaseBarelis: this.state.firebaseBarelis
            })
        }
        else {
            this.setState({
                errorMsg: "Error: Enter information"
            })
        }
    }
    render() {
        return(
            <View >
                <View style={styles.form}>
                    <View style={styles.middle}>
                        <Text style={{ color: 'black' }}>
                            {this.state.errorMsg}
                        </Text>
                    </View>

                    <View style={styles.credentialBox}>
                        <TextInput 
                            style={styles.input} 
                            maxLength = {128}
                            autoCapitalize="none" 
                            placeholder="Medžio numeris"
                            onChangeText={medzioNr => this.setState( prevState => ({ medis: {...this.state.medis, medzioNr: medzioNr} }))}
                            value={this.state.medis.medzioNr}
                        />
                    </View>
                    <View style={styles.credentialBox}>
                        <TextInput 
                            style={styles.input} 
                            maxLength = {128}
                            autoCapitalize="none" 
                            placeholder="Ardas"
                            onChangeText={ardas => this.setState( prevState => ({ medis: {...this.state.medis, ardas: ardas} }))}
                            value={this.state.medis.ardas}
                        />
                    </View>
                    <View style={styles.credentialBox}>
                        <TextInput 
                            style={styles.input} 
                            maxLength = {128}
                            autoCapitalize="none" 
                            placeholder="Medzio Rusis"
                            onChangeText={medzioRusis => this.setState( prevState => ({ medis: {...this.state.medis, medzioRusis: medzioRusis} }))}
                            value={this.state.medis.medzioRusis}
                        />
                    </View>
                    <View style={styles.credentialBox}>
                        <TextInput 
                            style={styles.input} 
                            maxLength = {128}
                            autoCapitalize="none" 
                            placeholder="Bukle"
                            onChangeText={bukle => this.setState( prevState => ({ medis: {...this.state.medis, bukle: bukle} }))}
                            value={this.state.medis.bukle}
                        />
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: "space-between", }}>
                        <View style={styles.TreeSize}>
                            <TextInput
                                style={styles.input}
                                maxLength = {128}
                                autoCapitalize="none"
                                placeholder="Plotis"
                                onChangeText={D => this.setState( prevState => ({ medis: {...this.state.medis, D: D} }))}
                                value={this.state.medis.D}
                            />
                        </View>
                        <View style={styles.TreeSize}>
                            <TextInput
                                style={styles.input}
                                maxLength = {128}
                                autoCapitalize="none"
                                placeholder="Aukštis"
                                onChangeText={H => this.setState( prevState => ({ medis: {...this.state.medis, H: H} }))}
                                value={this.state.medis.H}
                            />
                        </View>
                        <View style={styles.TreeSize}>
                            <TextInput
                                style={styles.input}
                                maxLength = {128}
                                autoCapitalize="none"
                                placeholder="Amžius"
                                onChangeText={amzius => this.setState( prevState => ({ medis: {...this.state.medis, amzius: amzius} })) }
                                value={this.state.medis.amzius.toString()}
                            />
                        </View>
                    </View>

                    <View style={styles.middle}>
                        <TouchableOpacity style={styles.button} onPress={this.onPressAddMedis} >
                            <Text>
                                Pridėti medį
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

}
const styles = StyleSheet.create({
    middle: {
        marginTop: 5,
        alignContent: 'center',
        alignItems: 'center',
    },
    form: {
        marginVertical: 5,
        marginBottom: 48,
        marginHorizontal: 20,
    },
    credentialBox: {
        flexDirection: 'row',
        marginVertical: 5,
        borderRadius: 5,
        height: 40,
        backgroundColor: "gray",
    },
    TreeSize: {
        marginVertical: 5,
        borderRadius: 5,
        height: 40,
        width: 100,
        backgroundColor: "gray",
    },
    input: {
        borderBottomColor: "#8A8F9E",
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginHorizontal: 5,
        flex: 1,
        height: 40,
        fontSize: 15,
        color: "#161F3D"
    },
    button: {
        marginVertical: 5,
        marginHorizontal: 5,
        backgroundColor: "grey",
        height: 45,
        borderRadius: 20,
        width: 150,
        alignItems: "center",
        justifyContent: "center",
    },
    person: {
        alignItems: "center",
        justifyContent: "center",
    },
});