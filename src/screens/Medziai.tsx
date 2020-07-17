import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text, View, ScrollView, StyleSheet, TextInput, TouchableOpacity, Alert} from 'react-native';
import {createApiClient,FirebaseSklypas, FirebaseKadastras, FirebaseBarelis, FirebaseMedis} from '../api/Kadastrai';
export type AppState = {
    firebaseKadastras: FirebaseKadastras,
    firebaseSklypas: FirebaseSklypas,
    firebaseBarelis: FirebaseBarelis,
    firebaseMedziai?: FirebaseMedis[],
    search:string,
    isLoading:boolean,
}
interface Props {
    navigation: any,
    route: any,
}

const api = createApiClient();

export default class MedziaiScreen extends React.Component<Props> {
    state: AppState = {
        search: '',
        isLoading: false,
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
    }
    searchText: any;
    searchDebounce: any = null;

    componentDidMount= () => {
        const firebaseKadastras:FirebaseKadastras = this.props.route.params.firebaseKadastras
        const firebaseSklypas:FirebaseSklypas = this.props.route.params.firebaseSklypas;
        const firebaseBarelis:FirebaseBarelis = this.props.route.params.firebaseBarelis;
        this.setState({
            firebaseKadastras: firebaseKadastras,
            firebaseSklypas: firebaseSklypas,
            firebaseBarelis: firebaseBarelis
        })
        api.getMedziaiRealtime(this.onUpdateMedziai,firebaseKadastras.id, firebaseSklypas.id, firebaseBarelis.id)

        this.props.navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={this.onDeleteBarelis} style={{alignContent:'center', alignSelf:'center', marginBottom:8, marginRight:8}}>
                                <Ionicons name="ios-trash"
                                    size={35} color="darkgray" 
                                />
                </TouchableOpacity>
            )
        });
    }
    onDeleteBarelis = () => {
        Alert.alert(
            'Ištrinti bareli',
            this.state.firebaseBarelis.barelis.barelioNr,
            [
              {
                text: 'Atšaukti',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel'
              },
              { text: 'Patvirtinti', onPress: () => {api.deleteBarelis(this.state.firebaseBarelis, this.state.firebaseKadastras.id, this.state.firebaseSklypas.id); this.props.navigation.navigate('Bareliai')}}
            ],
            { cancelable: false }
          );
    }
    onUpdateMedziai = (medziai:FirebaseMedis[]) => {
        this.setState({
            firebaseMedziai: medziai
        });
    }
    onSearch = async (val:string) => {
        clearTimeout(this.searchDebounce);
        this.searchDebounce = setTimeout(async () => {
            this.setState({
                search: val
            });
        }, 100);
    }
    onAddMedis = () => {
        this.props.navigation.navigate("AddMedis",{
            firebaseKadastras: this.state.firebaseKadastras,
            firebaseSklypas: this.state.firebaseSklypas,
            firebaseBarelis: this.state.firebaseBarelis,
        })
    }
    onClickMedis =(medis: FirebaseMedis) => {
        ////Still unknown
        // this.props.navigation.navigate("Medis", {
        //     firebaseKadastras: this.state.firebaseKadastras,
        //     firebaseSklypas: this.state.firebaseSklypas,
        //     firebaseBarelis: this.state.firebaseBarelis,
        //     firebaseMedis: medis
        // })
    }

    renderKadastrai = (medziai: FirebaseMedis[]) => {
        const filteredMedziai = medziai.filter((m) => (m.medis.medzioRusis.toLowerCase() + m.medis.bukle.toLowerCase() + m.medis.ardas.toLowerCase())
            .includes(this.state.search.toLowerCase()));

        return(
            <ScrollView>

                {filteredMedziai.map(m => {
                    return (
                        <View style= {styles.item}>
                            <View style= {styles.medis}>
                                <Text style={styles.Nr}>{m.medis.medzioNr}</Text>
                                <View style={{width: 0.5, backgroundColor: 'gray'}} />
                                <Text style={styles.Ardas}>{m.medis.ardas}</Text>
                                <View style={{width: 0.5, backgroundColor: 'gray'}} />
                                <Text style={styles.rusis}>{m.medis.medzioRusis}</Text>
                                <View style={{width: 0.5, backgroundColor: 'gray'}} />
                                <Text style={styles.bukle}>{m.medis.bukle}</Text>
                                <View style={{width: 0.5, backgroundColor: 'gray'}} />
                                <Text style={styles.h}>{m.medis.D}</Text>
                                <View style={{width: 0.5, backgroundColor: 'gray'}} />
                                <Text style={styles.h}>{m.medis.H}</Text>
                                <View style={{width: 0.5, backgroundColor: 'gray'}} />
                                <Text style={styles.amzius}>{m.medis.amzius}</Text>
                            </View>
                        </View>
                    )
                })}
                <View style={{height: 200 }}/>
            </ScrollView>
        )
    }

    render() {
        const {firebaseMedziai} = this.state;
        return (
            <View style={styles.body}>
                <TouchableOpacity style={styles.header} activeOpacity={1} onPress={() => this.searchText.focus()} >
                    <TextInput
                        style={styles.input}
                        numberOfLines={1}
                        placeholder="Paieška..."
                        placeholderTextColor="#b6c1cd"
                        maxLength = {128}
                        autoCapitalize="none"
                        onChangeText={search => this.onSearch(search)}
                        ref ={ref => this.searchText = ref}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={this.onAddMedis} style={{alignContent:'center', alignSelf:'center', marginBottom:8}}>
                    <Ionicons name="ios-add-circle-outline"
                              size={35} color="darkgray"
                    />
                </TouchableOpacity>
                <View style= {styles.Info}>
                    <View style= {styles.medis}>
                        <Text style={styles.Nr}>Nr</Text>
                        <View style={{width: 0.5, backgroundColor: 'gray'}} />
                        <Text style={styles.Ardas}>Ardas</Text>
                        <View style={{width: 0.5, backgroundColor: 'gray'}} />
                        <Text style={styles.rusis}>Rušis</Text>
                        <View style={{width: 0.5, backgroundColor: 'gray'}} />
                        <Text style={styles.bukle}>Buklė</Text>
                        <View style={{width: 0.5, backgroundColor: 'gray'}} />
                        <Text style={styles.h}>D</Text>
                        <View style={{width: 0.5, backgroundColor: 'gray'}} />
                        <Text style={styles.h}>H</Text>
                        <View style={{width: 0.5, backgroundColor: 'gray'}} />
                        <Text style={styles.amzius}>Metai</Text>
                    </View>
                </View>
                {firebaseMedziai  ? this.renderKadastrai(firebaseMedziai) : <Text>Prašome palaukti..</Text>}
            </View>
        )
    }
}
const styles = StyleSheet.create({
    body: {
        paddingTop: 20,
        padding: 20
    },

    header:{
        flexShrink:0,
        borderRadius:6,
        backgroundColor: '#fff',
        marginBottom: 14,
        display: 'flex',
        shadowColor:"#e1e5e8",
        shadowRadius: 40,
        shadowOpacity: 20,
        flexDirection: "column",
        padding: 10,
        position: 'relative',
    },

    input: {
        paddingLeft: 10,
        display: 'flex',
        color: "#20455e",
        fontSize: 14,
        borderRadius: 1,
        borderColor: "#b6c1cd",
    },

    item: {
        flexShrink: 0,
        borderRadius: 8,
        backgroundColor: "#fff",
        shadowColor:"#e1e5e8",
        shadowRadius: 40,
        shadowOpacity: 20,
        marginTop: 14,
        display: 'flex',
        flexDirection: 'column',
        borderColor: "#fff",
        padding: 10,
        position: "relative",
    },
    Info: {
        flexShrink: 0,
        borderRadius: 8,
        backgroundColor: "#c3f1c7",
        shadowColor:"#e1e5e8",
        shadowRadius: 40,
        shadowOpacity: 20,
        marginBottom: 0,
        display: 'flex',
        flexDirection: 'column',
        borderColor: "#fff",
        padding: 10,
        position: "relative",

    },
    Ardas: {
        width: 42,
        margin: 6,
        fontSize: 12,
        fontWeight: "400",
        color: "#20455e",
    },

    Nr:{
        width: 17,
        margin: 6,
        fontSize: 12,
        fontWeight: "400",
        color: "#20455e",
    },
    h:{
        width: 28,
        margin: 6,
        fontSize: 12,
        fontWeight: "400",
        color: "#20455e",
    },
    amzius:{
        width: 41,
        margin: 6,
        fontSize: 12,
        fontWeight: "400",
        color: "#20455e",
    },
    title: {
        width: 39,
        margin: 6,
        fontSize: 12,
        fontWeight: "400",
        color: "#20455e",

    },
    rusis: {
        width: 40,
        margin: 6,
        fontSize: 12,
        fontWeight: "400",
        color: "#20455e",
    },
    bukle: {
        width: 75,
        margin: 6,
        fontSize: 12,
        fontWeight: "400",
        color: "#20455e",

    },

    medis:{
        justifyContent: 'space-around',
        flexDirection: 'row'
    }
});