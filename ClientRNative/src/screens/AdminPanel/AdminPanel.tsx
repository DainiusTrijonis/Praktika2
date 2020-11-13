import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import Ionicons from 'react-native-vector-icons/Ionicons';
import functions from '@react-native-firebase/functions'
import { Dimensions } from 'react-native';
export type AppState = {

}
interface Props {
    navigation: any
}

export default class AdminPanel extends React.Component<Props> {
    
    state: AppState = {

    } 

    render() {
        return(
            <SafeAreaView>
                <View style={styles.layout}>
                    <TouchableOpacity style={styles.quadrant} onPress={ ()=>{ this.props.navigation.navigate('Customers')}}>
                        <View style={ styles.quadrantIcon}>
                                <Ionicons name="ios-people"
                                    size={50} color="darkgray" 
                                />
                        </View>
                        <View style={styles.quadrantText}>
                            <Text adjustsFontSizeToFit={true} numberOfLines={1}>
                                Customers
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
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
      width: 80,
      height: 110,
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
        bottom: 15,
    }
  });