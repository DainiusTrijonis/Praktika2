import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text, View, ScrollView, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, Button} from 'react-native';
import auth, { firebase } from '@react-native-firebase/auth';
import { Dimensions } from 'react-native';
import {createApiClient,FirebaseUser} from '../../../api/Admin';
import { ConfirmDialog, Dialog } from 'react-native-simple-dialogs';
export type AppState = {
    initializing: boolean,
    firebaseUser?:FirebaseUser,
    passwordDialogVisible: boolean,
    accessDialogVisible: boolean,
    password: string,

}
interface Props {
    navigation: any,
    route: any,

}

const api = createApiClient();

export default class Customer extends React.Component<Props> {
    state: AppState = {
        initializing: true,
        passwordDialogVisible: false,
        accessDialogVisible: false,
        password: '',
    };
    passwordText: any;

    componentDidMount = () => {
      this.onUpdateUser(this.props.route.params.FirebaseUser)
    };
    onUpdateUser = (firebaseUser:FirebaseUser) => {
      this.setState({
        firebaseUser: firebaseUser,
        initializing: false,
      });
    };
    onDeleteUser = (uid:string) => {
        api.deleteUser(uid);
        this.props.navigation.navigate("AdminPanel");
    }
    onChangePassword = () =>{
        if(this.state.firebaseUser) {
            api.changePassword(this.state.firebaseUser.uid,this.state.password);
        }
        this.props.navigation.navigate("AdminPanel");
    }
    onChangeAdminAccess = () => {
        if(this.state.firebaseUser?.customClaims)
        {
            let customClaims: { [key: string]: any} = this.state.firebaseUser.customClaims;
            if(customClaims['admin'] === true) {
                customClaims['admin'] = false;
            }
            else {
                customClaims['admin'] = true;
            }
            api.changeAccess(this.state.firebaseUser.uid,customClaims);
            this.props.navigation.navigate("AdminPanel");
        }

    }
    onChangePremiumAccess = () => {
        if(this.state.firebaseUser?.customClaims)
        {
            let customClaims: { [key: string]: any} = this.state.firebaseUser.customClaims;
            if(customClaims['premium'] === true) {
                customClaims['premium'] = false;
            }
            else {
                customClaims['premium'] = true;
            }
            api.changeAccess(this.state.firebaseUser.uid,customClaims);
            this.props.navigation.navigate("AdminPanel");
        }
    }
    renderUser = (user: FirebaseUser) => {
      return(
        <ScrollView>
            <View key={user.providerData?.uid} style= {styles.item}>
                <Text style={styles.title}>{user.email}</Text>
                <View style={styles.footer}>
                    <Text style={styles.footerContent}>{user.uid}</Text>
                    <Text style={styles.footerContent}>{user.customClaims? (user.customClaims['admin']? "Administracija": user.customClaims['premium']? "Moderatorius" : "Jokių privilegijų")   :"Jokių privilegijų"}</Text>
                </View>
            </View>
            <View style={styles.layout}>
                    <TouchableOpacity style={styles.quadrant} onPress={ ()=>{ this.onDeleteUser(user.uid)}}>
                        <View style={ styles.quadrantIcon}>
                                <Ionicons name="ios-trash"
                                    size={35} color="darkgray" 
                                />
                        </View>
                        <View style={styles.quadrantText}>
                            <Text adjustsFontSizeToFit={true} numberOfLines={1}>
                                Ištrinti
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.quadrant} onPress={ ()=>{ this.setState({passwordDialogVisible: true, password:''}) }}>
                        <View style={ styles.quadrantIcon}>
                                <Ionicons name="ios-lock"
                                    size={35} color="darkgray" 
                                />
                        </View>
                        <View style={styles.quadrantText}>
                            <Text adjustsFontSizeToFit={true} numberOfLines={1}>
                                Slaptažodis
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.quadrant} onPress={ ()=>{ this.setState({accessDialogVisible: true}) }}>
                        <View style={ styles.quadrantIcon}>
                                <Ionicons name="ios-key"
                                    size={35} color="darkgray" 
                                />
                        </View>
                        <View style={styles.quadrantText}>
                            <Text  adjustsFontSizeToFit={true} numberOfLines={2}>
                                Prieiga
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <ConfirmDialog
                    visible={this.state.passwordDialogVisible}
                    title="Pakeisti slaptažodi"
                    onTouchOutside={() => this.setState({passwordDialogVisible: false})} 
                    positiveButton={{
                        title: "Pakeisti",
                        onPress: () => this.onChangePassword()
                    }}
                    >    
                    <View>
                        <TouchableOpacity activeOpacity={1} onPress={() => this.passwordText.focus()}>
                            <View style={styles.credentialBox}>
                                <View style={{ marginHorizontal: 15 }}>
                                    <Ionicons name="ios-lock" size={35} color="darkgray" />
                                </View>
                                <TextInput 
                                    style={styles.input} 
                                    maxLength = {128}
                                    secureTextEntry 
                                    autoCapitalize="none" 
                                    placeholder="Slaptažodis"
                                    onChangeText={password => this.setState({ password })}
                                    value={this.state.password}
                                    ref ={ref => this.passwordText = ref}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                </ConfirmDialog>
                <Dialog
                    visible={this.state.accessDialogVisible}
                    title="Pakeisti prieiga"
                    onTouchOutside={() => this.setState({accessDialogVisible: false})} 
                    >    
                    <View style= {{        marginVertical: 20, marginLeft:15,  marginRight:15, flexDirection: 'row', flexShrink: 0, maxWidth: Dimensions.get('window').height, flexWrap: 'wrap'}}>
                        <Button onPress ={ ()=>{ this.onChangeAdminAccess()}} title = {user.customClaims? (user.customClaims['admin']? "Atšaukti administratoriaus teises": "Suteikti administratoriaus teises"):"Suteikti administratoriaus teises"} />
                        {
                        (() => {
                            if (user.customClaims && !user.customClaims['admin'])
                                return (
                                    <Button onPress ={ ()=>{ this.onChangePremiumAccess()}} title = {user.customClaims? (user.customClaims['premium']?  "Atšaukti kadastru prieiga": "Suteikti kadastru prieiga"):"Suteikti kadastru prieiga"}/>
                                )
                        })()
                        }   
                    </View>
                </Dialog>

        </ScrollView>
      )
    };
    render() {
    const {firebaseUser} = this.state;
    if (this.state.initializing) {
        return (
          <SafeAreaView style={{}}>
              <View>
                <Text>Loading...</Text>
              </View>
          </SafeAreaView>
        );
    } else if (!this.state.initializing) {
        return (
          <SafeAreaView>
            <View style={styles.body}>
              {firebaseUser  ? this.renderUser(firebaseUser) : <Text>Prašome palaukti..</Text>}
            </View>
          </SafeAreaView>
        );
    }
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
  credentialBox: {
    flexDirection: 'row',
    marginVertical: 10,
    borderRadius: 5,
    height: 45,
    backgroundColor: "gray",
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
    layout: {
        marginVertical: 20,
        marginLeft:15,
        marginRight:15,
        flexDirection: 'row',
        flexShrink: 0,
        maxWidth: Dimensions.get('window').height,
        flexWrap: 'wrap'
    },
    quadrant: {
        backgroundColor:'#d9d9d9',
        marginTop: 15,
        shadowColor: "#000000",
        shadowOpacity: 0.8,
        shadowRadius: 2,
        borderColor:'black',  
        padding: 10,
        width: 95,
        height: 90,
        marginLeft: 15,
        flexDirection: 'column'
    },
    quadrantIcon: {
        alignSelf: 'center'
    },
    quadrantText: {
        alignSelf: 'center',
        textAlignVertical: 'bottom',
        position: 'absolute',
        bottom: 10,
    }
});
  