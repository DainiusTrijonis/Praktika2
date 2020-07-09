import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text, View, ScrollView, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import {createApiClient,FirebaseSklypas, FirebaseKadastras} from '../api/Kadastrai';
export type AppState = {
    firebaseKadastras: FirebaseKadastras,
    firebaseSklypai?: FirebaseSklypas[],
    search:string,
    isLoading:boolean,
}
interface Props {
    navigation: any,
    route: any,
}

const api = createApiClient();

export default class SklypaiScreen extends React.Component<Props> {
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
        }
    }    
    searchText: any;
    searchDebounce: any = null;

	componentDidMount= () => {
        const firebaseKadastras:FirebaseKadastras = this.props.route.params.firebaseKadastras
        this.setState({
            firebaseKadastras:firebaseKadastras
        })
        api.getSklypaiRealtime(this.onUpdateSklypai,firebaseKadastras.id)
    }
    onUpdateSklypai = (sklypai:FirebaseSklypas[]) => {
        this.setState({
			firebaseSklypai: sklypai
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
    onAddSklypas = () => {
        this.props.navigation.navigate("AddSklypas",{
            firebaseKadastras: this.state.firebaseKadastras
        })
    }
    onClickSklypas = ( sklypas:FirebaseSklypas ) => {
        this.props.navigation.navigate("Bareliai",{
            firebaseKadastras: this.state.firebaseKadastras,
            firebaseSklypas: sklypas
        })
    }

    renderKadastrai = (sklypai: FirebaseSklypas[]) => {
        const filteredSklypai = sklypai.filter((s) => (s.sklypas.sklypoNr.toString().toLowerCase() )
            .includes(this.state.search.toLowerCase()));
        
        return(
            <ScrollView>
                {filteredSklypai.map(s => {
                    return (
                        <TouchableOpacity onPress={() => this.onClickSklypas(s)} key={s.id} style= {styles.item}>
                            <View style= {{flexDirection: 'row'}}>
                                <Text style={styles.title}>Sklypo Numeris:</Text>
                                <Text style={styles.title}>{s.sklypas.sklypoNr}</Text>
                            </View>
                            <View style= {{flexDirection: 'row'}}>
                                <Text style={styles.title}>Plotas:</Text>
                                <Text style={styles.title}>{s.sklypas.plotas}</Text>
                                <Text style={styles.title}>H</Text>

                            </View>
                        </TouchableOpacity>
                    )
                })}
            </ScrollView>
        )
    }
    render() {
        const {firebaseSklypai} = this.state;
        return (
            <View style={styles.body}>
                <TouchableOpacity style={styles.header} activeOpacity={1} onPress={() => this.searchText.focus()} >
                    <TextInput  
                        style={styles.input}
                        numberOfLines={1} 
                        placeholder="Search..."
                        placeholderTextColor="#b6c1cd"
                        maxLength = {128}
                        autoCapitalize="none"
                        onChangeText={search => this.onSearch(search)}
                        ref ={ref => this.searchText = ref}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={this.onAddSklypas} style={{alignContent:'center', alignSelf:'center', marginBottom:8}}>
                                <Ionicons name="ios-add-circle-outline"
                                    size={35} color="darkgray" 
                                />
                </TouchableOpacity>
                {firebaseSklypai  ? this.renderKadastrai(firebaseSklypai) : <Text>Empty or loading..</Text>}
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