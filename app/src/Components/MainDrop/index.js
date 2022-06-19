import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { Modalize } from 'react-native-modalize'

export default function MainDrop({ mod}) {
    const navigation = useNavigation()

    return (
        <Modalize ref={mod} snapPoint={120} modalHeight={120}>
         
        </Modalize >
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
    },
    txtModal: {
        padding: 10,
        fontSize: 18,
        fontWeight: 'bold'
    }
})