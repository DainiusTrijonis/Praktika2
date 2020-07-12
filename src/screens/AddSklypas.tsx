import React from 'react'
import { Text, View, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import {createApiClient, Sklypas, FirebaseKadastras} from '../api/Kadastrai';

export type AppState = {
    firebaseKadastras: FirebaseKadastras,
    sklypas: Sklypas,
    errorMsg: string  
}
interface Props {
    navigation: any,
    route: any,
}

const api = createApiClient();

export default class AddSklypas extends React.Component<Props> {

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
        sklypas: 
            {
                sklypoNr:'',
                plotas:1,
            }, 
        errorMsg: '',
    }
	componentDidMount= () => {
        const firebaseKadastras:FirebaseKadastras = this.props.route.params.firebaseKadastras
        this.setState({
            firebaseKadastras:firebaseKadastras
        })
    }

    onPressAddSklypas = () => {
        if(this.state.sklypas.sklypoNr != '' && this.state.sklypas.plotas != 0) {
            api.addSklypas(this.state.sklypas,this.state.firebaseKadastras.id) 
            this.props.navigation.navigate("Sklypai",{
                firebaseKadastras: this.state.firebaseKadastras
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
                            placeholder="Sklypo numeris"
                            onChangeText={sklypoNr => this.setState( prevState => ({ sklypas: {...this.state.sklypas, sklypoNr: sklypoNr} }))}
                            value={this.state.sklypas.sklypoNr}
                        />
                    </View>

                    <View style={styles.credentialBox}>
                        <TextInput 
                            style={styles.input} 
                            maxLength = {128}
                            autoCapitalize="none" 
                            placeholder="Plotas hektarais"
                            onChangeText={plotas => this.setState( prevState => ({ sklypas: {...this.state.sklypas, plotas: plotas} })) }
                            value={this.state.sklypas.plotas.toString()}
                        />
                    </View>
                    <View style={styles.middle}>
                        <TouchableOpacity style={styles.button} onPress={this.onPressAddSklypas} >
                            <Text>
                                Pridėti sklypą
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