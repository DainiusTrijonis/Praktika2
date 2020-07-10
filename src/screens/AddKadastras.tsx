import React from 'react'
import { Text, View, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import {createApiClient, Kadastras} from '../api/Kadastrai';

export type AppState = {
    kadastras: Kadastras,
    errorMsg: string  
}
interface Props {
    navigation: any
}

const api = createApiClient();

export default class AddKadastras extends React.Component<Props> {
    state: AppState = {
        kadastras: 
            {
                vartotojoID : '',
                kadastrinisNr : '',
                adresas : '',
                data : ''
            }, 
        errorMsg: '',
    }
	async componentDidMount() {
        this.setState( prevState => ({ kadastras: {...this.state.kadastras, data: new Date().getFullYear().toString() + '.' + (new Date().getMonth()+1).toString() + '.' + new Date().getDate().toString()} }))     
	}
    onPressAddKadastras = () => {
        if(this.state.kadastras.kadastrinisNr != '' && this.state.kadastras.adresas != '' && this.state.kadastras.data != '') {
            api.addKadastras(this.state.kadastras) 
            this.props.navigation.navigate("Kadastrai");
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
                            placeholder="Kadastrinis numeris"
                            onChangeText={kadastrinisNr => this.setState( prevState => ({ kadastras: {...this.state.kadastras, kadastrinisNr: kadastrinisNr} }))}
                            value={this.state.kadastras.kadastrinisNr}
                        />
                    </View>

                    <View style={styles.credentialBox}>
                        <TextInput 
                            style={styles.input} 
                            maxLength = {128}
                            autoCapitalize="none" 
                            placeholder="Adresas" 
                            onChangeText={adresas => this.setState( prevState => ({ kadastras: {...this.state.kadastras, adresas: adresas} })) }
                            value={this.state.kadastras.adresas}
                        />
                    </View>
                    <View style={styles.credentialBox}>
                        <TextInput 
                            style={styles.input} 
                            maxLength = {128}
                            autoCapitalize="none" 
                            placeholder="Data" 
                            onChangeText={data => this.setState( prevState => ({ kadastras: {...this.state.kadastras, data: data} })) }
                            value={this.state.kadastras.data}
                        />
                    </View>
                    <View style={styles.middle}>
                        <TouchableOpacity style={styles.button} onPress={this.onPressAddKadastras} >
                            <Text>
                                AddKadastras
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