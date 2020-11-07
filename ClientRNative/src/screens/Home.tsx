import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import functions from '@react-native-firebase/functions'
import SplashScreen from 'react-native-splash-screen';

let unsubscribe: any;
export type AppState = {
  user: any;
  initializing: boolean;
};
interface Props {
  navigation: any;
}
export default class Home extends React.Component<Props> {
  state: AppState = {
    user: null,
    initializing: true,
  };
  componentDidMount = () => {
    SplashScreen.hide();
    functions().httpsCallable('helloWorld')().then(response => {
      console.log(response);
    })
    unsubscribe = auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          user: user,
          initializing: false,
        });
      } else {
        this.props.navigation.navigate('Login');
      }
    });
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
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.props.navigation.navigate('Kadastrai')}>
              <Text>Kadastrai</Text>
            </TouchableOpacity>
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