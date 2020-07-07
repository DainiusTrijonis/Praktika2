import React from 'react'
import { Text, View, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import {createApiClient, FirebaseKadastras, FirebaseSklypas,Barelis} from '../api/Kadastrai';

export type AppState = {
    firebaseKadastras: FirebaseKadastras,
    firebaseSklypas: FirebaseSklypas
    barelis:Barelis,
    errorMsg: string  
}
interface Props {
    navigation: any,
    route: any,
}

const api = createApiClient();

export default class AddBarelis extends React.Component<Props> {

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
            sklypas: 
            {
                sklypoNr:'',
                plotas:0,
            },
        },
 
        barelis:{
            barelioNr:'',
            plotas:0,
        },
        errorMsg: '',
    }
	componentDidMount= () => {
        const firebaseKadastras:FirebaseKadastras = this.props.route.params.firebaseKadastras
        const firebaseSklypas:FirebaseSklypas = this.props.route.params.firebaseSklypas
        this.setState({
            firebaseKadastras:firebaseKadastras,
            firebaseSklypas:firebaseSklypas,
        })
    }

    onPressAddBarelis = () => {
        if(this.state.barelis.barelioNr != '' && this.state.barelis.plotas != 0) {
            api.addBarelis(this.state.barelis,this.state.firebaseKadastras.id, this.state.firebaseSklypas.id) 
            this.props.navigation.navigate("Bareliai",{
                firebaseKadastras: this.state.firebaseKadastras,
                firebaseSklypas: this.state.firebaseSklypas,
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
            <View style={styles.body}>
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
                            placeholder="BarelioNr"
                            onChangeText={barelioNr => this.setState( prevState => ({ barelis: {...this.state.barelis, barelioNr: barelioNr} }))}
                            value={this.state.barelis.barelioNr}
                        />
                    </View>

                    <View style={styles.credentialBox}>
                        <TextInput 
                            style={styles.input} 
                            maxLength = {128}
                            autoCapitalize="none" 
                            placeholder="Plotas" 
                            onChangeText={plotas => this.setState( prevState => ({ barelis: {...this.state.barelis, plotas: plotas} })) }
                            value={this.state.barelis.plotas.toString()}
                        />
                    </View>
                    <View style={styles.middle}>
                        <TouchableOpacity style={styles.button} onPress={this.onPressAddBarelis} >
                            <Text>
                                Add Barelis
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

}
const styles = StyleSheet.create({
    body: {
        paddingTop: 5,
        padding: 20
    },
    middle: {
        marginTop: 5,
        alignContent: 'center',
        alignItems: 'center', 
    },
    loginText: {
        marginTop: 32,
        fontSize: 18,
        fontWeight: "400",
        textAlign: "center",
        height: 72,
    },
    form: {
        marginVertical: 40,
        marginBottom: 48,
        marginHorizontal: 30,
    },
    credentialBox: {
        flexDirection: 'row',
        marginVertical: 10,
        borderRadius: 5,
        height: 45,
        backgroundColor: "gray",
    },
    inputTitle: {
        color: "#8A8F9E",
        fontSize: 15,
        textTransform: "uppercase",
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
        marginVertical: 10,
        marginHorizontal: 30,
        backgroundColor: "gray",
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