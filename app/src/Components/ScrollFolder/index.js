import React from "react";
import { StyleSheet,ScrollView, Image, Pressable, View, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native';

import folderImage from '../../image/folder-solid.png'


export default function ScrollFolder({ folder, path }) {
    const navigation = useNavigation()
   
    return (
        <>
            <ScrollView style={{ flex: 1 }} scrollEventThrottle={100} >
                <View style={styles.container}>
                    {
                        folder?.map((f, index) => (
                            <View key={index + "fl1"} >
                                <Pressable onPress={() => {
                                    navigation.push('Copy', {
                                        folderName: { f },
                                        path: { path }
                                    })
                                }} key={index + "fl2"} style={{ flexDirection: 'row' }}>
                                    <Image key={index + "fl5"} style={styles.imgFolder} source={folderImage} />
                                    <View key={index + "fl4"} style={styles.containerFlex}>
                                        <Text style={styles.txtBnt}>{f}</Text>
                                    </View>
                                </Pressable>
                            </View>
                        ))
                    }
                </View>
            </ScrollView>
            
        </>
    )
}

const styles = StyleSheet.create({
    containerFlex: {
        flexDirection: "row",
        borderBottomWidth: StyleSheet.hairlineWidth,
        flex: 1
    },
    imgFile: {
        width: 20,
        height: 25,
        margin: 35,
    },
    imgFolder: {
        width: 25,
        height: 20,
        margin: 35,
    },
    imgDot: {
        width: 7,
        height: 29,
        backgroundColor: '#ffffff'
    },
    txtBnt: {
        fontSize: 15,
        marginTop: 30,
        marginLeft: 10,
        width: 250,
        paddingBottom: 10
    },
    dotPosition: {
        position: 'absolute',
        left: 350,
        padding: 35
    }
})