import React, { useContext, useState } from "react";
import { StyleSheet, TouchableOpacity, Text, View, Button } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { Modalize } from 'react-native-modalize'

import { PathContext } from "../../context/PathContext";
import { NameContext } from "../../context/NameContext";


export default function FolderDrop({ mod, folder, path }) {
    
    const navigation = useNavigation()
    const { setPath, setMoveORCopy } = useContext(PathContext)
    const { setName, toggleModal } = useContext(NameContext)

    return (
        <Modalize ref={mod}  snapPoint={400} modalHeight={400}>
            <TouchableOpacity style={styles.container} onPress={() => {
                navigation.navigate('Copy', {
                    path: path,
                    folder: folder,
                })
                setMoveORCopy('copy')
                setPath(path + '/' + folder)
            }}>
                <Text style={styles.txtModal}>Copy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.container} onPress={() => {
                navigation.navigate('Copy', {
                    path: path,
                    folder: folder
                })
                setMoveORCopy('move')
                setPath(path + '/' + folder)
            }}>
                <Text style={styles.txtModal}>Move</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.container} onPress={() => {
                navigation.navigate('Details', {
                    path: path,
                    folder: folder,
                    fileORFolder: 'folder'
                })
            }}>
                <Text style={styles.txtModal}>Details</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.container} onPress={() => {
                toggleModal()
                setName(folder)
            }}>
                <Text style={styles.txtModal}>Rename</Text>
            </TouchableOpacity>
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