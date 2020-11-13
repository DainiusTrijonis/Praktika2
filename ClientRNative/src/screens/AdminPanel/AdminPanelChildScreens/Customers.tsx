import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text, View, ScrollView, StyleSheet, TextInput, TouchableOpacity, SafeAreaView} from 'react-native';
import auth, { firebase } from '@react-native-firebase/auth';
import functions from '@react-native-firebase/functions'
import { Dimensions } from 'react-native';
import {createApiClient,FirebaseUser} from '../../../api/Admin';
export type AppState = {
    initializing: boolean,
    firebaseUsers?:FirebaseUser[],
}
interface Props {
    navigation: any
}


const api = createApiClient();

export default class Customers extends React.Component<Props> {
    state: AppState = {
        initializing: true,
      };
    componentDidMount = () => {
      api.getUsers(this.onUpdateUsers);
    };
    onUpdateUsers = (firebaseUsers:FirebaseUser[]) => {
      this.setState({
        firebaseUsers: firebaseUsers,
        initializing: false,
      });
    };
    renderUsers = (users: FirebaseUser[]) => {
      return(
        <ScrollView>
          {users.map(user => {
              return (
                  <TouchableOpacity onPress={() => this.onClickUser(user)} key={user.providerData?.uid} style= {styles.item}>
                      <Text style={styles.title}>{user.email}</Text>
                      <View style={styles.footer}>
                          <Text style={styles.footerContent}>{user.uid}</Text>
                          <Text style={styles.footerContent}>{user.customClaims? (user.customClaims['admin']? "Administracija": user.customClaims['premium']? "Moderatorius" : "Jokių privilegijų")   :"Jokių privilegijų"}</Text>
                      </View>
                  </TouchableOpacity>
              )
          })}
          <View style={{height: 120 }}/>
        </ScrollView>
      )
    };
    onClickUser = (user:FirebaseUser) => {
      this.props.navigation.navigate("Customer",{
        FirebaseUser: user
       })
    }
    render() {
    const {firebaseUsers} = this.state;
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
              {firebaseUsers  ? this.renderUsers(firebaseUsers) : <Text>Prašome palaukti..</Text>}
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
  