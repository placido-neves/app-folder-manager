import React, { useState } from 'react'
import { StyleSheet, SafeAreaView, View, Text, TextInput, TouchableOpacity } from "react-native"
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';


export default function Login() {
    const navigation = useNavigation()
  
    return (
        <SafeAreaView>
            <StatusBar style="light" />
            <View style={styles.header}>
                <Text style={styles.textHeader}>Folder Manager</Text>
            </View >
            <View style = {styles.login}>
                <Text style={styles.textLogin}>Entre com ID</Text>
                <TextInput style={styles.loginInput} placeholder="ID do usuario" ></TextInput>
                <TouchableOpacity  onPress={()=>{
                    navigation.navigate('Manager')
                }} style = {styles.loginButton}>
                    <Text  style = {styles.textButton}>Adicionar</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    header: {
        padding: 30,
        paddingBottom: 10,
        backgroundColor: "#00BFFF",
    },
    textHeader: {
        color: '#DCDCDC',
        textAlign: 'center',
        fontSize: 25,
        marginTop: 20,
        fontWeight: 'bold',
    },
    login:{
        padding:20
    },
    textLogin: {
        textAlign: 'center',
        textAlignVertical: 'center',
        marginTop: 200,
        fontSize: 40,
        marginBottom: 10,
        color: '#4F4F4F',
        marginBottom:50
    },
    loginInput: {
        height: 40,
        borderWidth: 1,
        padding: 10,
        fontSize: 15,
        borderRadius: 9,
        borderColor: "#00BFFF",
        marginBottom:20
    },
    loginButton:{
        backgroundColor:"#00BFFF",
        borderRadius:9,
    },
    textButton:{
        textAlign:'center',
        color:'#FFFAFA',
        paddingTop:10,
        paddingBottom:10,
        fontWeight:'bold'
    }

})