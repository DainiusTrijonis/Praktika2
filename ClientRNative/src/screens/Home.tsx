import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import SplashScreen from 'react-native-splash-screen';


let unsubscribe: any;
export type AppState = {
  user: any;
  initializing: boolean;
  adminUI: boolean;
  kadastraiUI: boolean;
};
interface Props {
  navigation: any;
}
export default class Home extends React.Component<Props> {
  state: AppState = {
    user: null,
    initializing: true,
    adminUI: false,
    kadastraiUI: false,
  };
  componentDidMount = () => {
    SplashScreen.hide();

    unsubscribe = auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          user: user,
        });
      } else {
        this.props.navigation.navigate('Login');
      }
    });
    auth().currentUser?.getIdToken(true)
      .then((idtoken) => {
        if(idtoken) {
          console.log("idtoken: " + idtoken)
        }
      })
    auth().currentUser?.getIdTokenResult(true)
      .then((idTokenResult) => {
        console.log(idTokenResult.claims)
        if(!!idTokenResult.claims.admin) {
          console.log("admin true and premium");
          this.setState({
            adminUI: true,
            kadastraiUI:true,
            initializing: false,
          })
        }
        else if (!idTokenResult.claims.admin && !!idTokenResult.claims.premium) {
          console.log("admin false and premium true");
          this.setState({
            adminUI: false,
            kadastraiUI: true,
            initializing: false,
          })
        }
        else {
          console.log("admin false and premium false");
          this.setState({
            adminUI: false,
            kadastraiUI: false,
            initializing: false,
          })
        }
      })
  };
  componentWillUnmount() {
    unsubscribe();
  }

  logOut() {
    auth().signOut();
    this.props.navigation.navigate('Login');
  }

  render() {
    if (this.state.initializing) {
      return (
        <SafeAreaView style={{backgroundColor: 'black'}}>
          <View />
        </SafeAreaView>
      );
    } else if (this.state.user != null) {
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.layout}>
            <View>
              <Text> {this.state.user.email} </Text>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.logOut()}>
              <Text>Atsijungti</Text>
            </TouchableOpacity>
            {
              (() => {
                  if (this.state.kadastraiUI)
                      return (
                        <TouchableOpacity
                          style={styles.button}
                          onPress={() => this.props.navigation.navigate('Kadastrai')}>
                          <Text>Kadastrai</Text>
                        </TouchableOpacity>
                      )
              })()
            }
            {
              (() => {
                  if (this.state.adminUI)
                      return (
                        <TouchableOpacity
                          style={styles.button}
                          onPress={() => this.props.navigation.navigate('AdminPanel')}>
                          <Text>AdminPanel</Text>
                        </TouchableOpacity>
                      )
              })()
            }
          </View>
        </SafeAreaView>

      );
    } else if (!this.state.initializing && this.state.user == null) {
      this.props.navigation.navigate('Login');
    }
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  layout: {
    flex: 2,
    alignContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    width: 300,
    marginTop: 16,
  },
});
