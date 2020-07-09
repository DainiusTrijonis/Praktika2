import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text, View, ScrollView, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import {createApiClient,FirebaseKadastras} from '../api/Kadastrai';
export type AppState = {
    firebaseKadastrai?: FirebaseKadastras[],
    search:string,
    isLoading:boolean,
}
interface Props {
    navigation: any
}

const api = createApiClient();


export default class KadastraiScreen extends React.Component<Props> {
    state: AppState = {
        search: '',
        isLoading: false,
    }    
    searchDebounce: any = null;
    searchText: any;
	componentDidMount= async () => {
        api.getKadastraiRealtime(this.onUpdateKadastrai)
    }
    onUpdateKadastrai = (kadastrai:FirebaseKadastras[]) => {
        this.setState({
			firebaseKadastrai: kadastrai
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
    onAddKadastras = () => {
        this.props.navigation.navigate('AddKadastras');
    }
    onClickKadastras = (k: FirebaseKadastras) => {
        this.props.navigation.navigate("Sklypai",{
            firebaseKadastras: k
        })
    }

    renderKadastrai = (kadastrai: FirebaseKadastras[]) => {
        const filteredKadastrai = kadastrai.filter((k) => (k.kadastras.kadastrinisNr.toLowerCase() + k.kadastras.adresas.toLowerCase() + k.kadastras.data.toLowerCase())
            .includes(this.state.search.toLowerCase()));
        
        return(
            <ScrollView>
                {filteredKadastrai.map(k => {
                    return (
                        <TouchableOpacity onPress={() => this.onClickKadastras(k)} key={k.id} style= {styles.item}>
                            <Text style={styles.title}>{k.kadastras.kadastrinisNr}</Text>
                            <View style={styles.footer}>
                                <Text style={styles.footerContent}>{k.kadastras.adresas}</Text>
                                <Text style={styles.footerContent}>{k.kadastras.data}</Text>
                            </View>
                        </TouchableOpacity>
                    )
                })}
            </ScrollView>
        )
    }


    render() {
        const {firebaseKadastrai} = this.state;
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
                <TouchableOpacity onPress={this.onAddKadastras} style={{alignContent:'center', alignSelf:'center', marginBottom:8}}>
                                <Ionicons name="ios-add-circle-outline"
                                    size={35} color="darkgray" 
                                />
                </TouchableOpacity>
                {firebaseKadastrai  ? this.renderKadastrai(firebaseKadastrai) : <Text>Empty or loading..</Text>}
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