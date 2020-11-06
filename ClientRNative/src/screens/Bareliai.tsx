import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text, View, ScrollView, StyleSheet, TextInput, TouchableOpacity, Alert} from 'react-native';
import {createApiClient, FirebaseSklypas, FirebaseKadastras, FirebaseBarelis} from '../api/Kadastrai';
export type AppState = {
    firebaseKadastras: FirebaseKadastras,
    firebaseSklypas: FirebaseSklypas,
    firebaseBareliai?: FirebaseBarelis[],
    search:string,
    isLoading:boolean,
}
interface Props {
    navigation: any,
    route: any,
}

const api = createApiClient();

export default class BareliaiScreen extends React.Component<Props> {
    state: AppState = {
        search: '',
        isLoading: false,
        firebaseKadastras: {
            id:'',
            kadastras: {
                kadastrinisNr:'',
                adresas:'',
                data:'',
            },
        },
        firebaseSklypas: {
            id:'',
            sklypas:{sklypoNr:'',plotas:0}
        },
    }    
    searchText: any;
    searchDebounce: any = null;

	componentDidMount= () => {
        const firebaseKadastras:FirebaseKadastras = this.props.route.params.firebaseKadastras
        const firebaseSklypas:FirebaseSklypas = this.props.route.params.firebaseSklypas;
        this.setState({
            firebaseKadastras:firebaseKadastras,
            firebaseSklypas:firebaseSklypas
        })
        api.getBareliaiRealtime(this.onUpdateBareliai,firebaseKadastras.id, firebaseSklypas.id)

        this.props.navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={this.onDeleteSklypas} style={{alignContent:'center', alignSelf:'center', marginBottom:8, marginRight:8}}>
                                <Ionicons name="ios-trash"
                                    size={35} color="darkgray" 
                                />
                </TouchableOpacity>
            )
        });
    }
    
    onDeleteSklypas = () => {
        Alert.alert(
            'Ištrinti sklypą',
            this.state.firebaseSklypas.sklypas.sklypoNr,
            [
              {
                text: 'Atšaukti',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel'
              },
              { text: 'Patvirtinti', onPress: () => {api.deleteSklypas(this.state.firebaseSklypas, this.state.firebaseKadastras.id); this.props.navigation.navigate('Sklypai')}}
            ],
            { cancelable: false }
          );
    }

    onUpdateBareliai = (bareliai:FirebaseBarelis[]) => {
        this.setState({
			firebaseBareliai: bareliai
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
    onAddBarelis = () => {
        this.props.navigation.navigate("AddBarelis",{
            firebaseKadastras: this.state.firebaseKadastras,
            firebaseSklypas: this.state.firebaseSklypas
        })
    }
    onClickBarelis =(barelis: FirebaseBarelis) => {
        this.props.navigation.navigate("Medziai", {
            firebaseKadastras: this.state.firebaseKadastras,
            firebaseSklypas: this.state.firebaseSklypas,
            firebaseBarelis: barelis,
        })
    }

    renderKadastrai = (bareliai: FirebaseBarelis[]) => {
        const filteredBareliai = bareliai.filter((b) => (b.barelis.barelioNr.toString().toLowerCase() )
            .includes(this.state.search.toLowerCase()));
        
        return(
            <ScrollView>
                {filteredBareliai.map(b => {
                    return (
                        <TouchableOpacity onPress={() => this.onClickBarelis(b)} key={b.id} style= {styles.item}>
                            <View style= {{flexDirection: 'row'}}>
                                <Text style={styles.title}>Barelio numeris:</Text>
                                <Text style={styles.title}>{b.barelis.barelioNr}</Text>
                            </View>
                            <View style= {{flexDirection: 'row'}}>
                                <Text style={styles.title}>Plotas:</Text>
                                <Text style={styles.title}>{b.barelis.plotas}</Text>
                                <Text style={styles.title}>Arai</Text>
                            </View>
                        </TouchableOpacity>
                    )
                })}
                <View style={{height: 120 }}/>
            </ScrollView>
        )
    }
    render() {
        const {firebaseBareliai} = this.state;
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
                <TouchableOpacity onPress={this.onAddBarelis} style={{alignContent:'center', alignSelf:'center', marginBottom:8}}>
                                <Ionicons name="ios-add-circle-outline"
                                    size={35} color="darkgray" 
                                />
                </TouchableOpacity>
                {firebaseBareliai  ? this.renderKadastrai(firebaseBareliai) : <Text>Prašome palaukti..</Text>}
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
        backgroundColor: "#fff",
        shadowColor:"#e1e5e8",
        shadowRadius: 40,
        shadowOpacity: 20,
        marginBottom: 14,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 6,
        borderColor: "#fff",
        padding: 10,
        position: "relative",
    },
    title: {
        margin: 6,
        fontSize: 16,
        fontWeight: "400",
        color: "#20455e",
    },
    footer:{
        margin: 6,
        justifyContent: "space-between",
        flexDirection: "row"
    },
    footerContent:{
        fontSize: 12,
        color: "#7a92a5",
        fontWeight: "200",
    },
}); 