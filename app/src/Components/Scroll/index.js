import React, { useRef, useState, useContext, useCallback, useEffect } from "react";
import { StyleSheet, TouchableOpacity, ScrollView, Image, Pressable, View, Text, TextInput, TouchableWithoutFeedback } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal'

import { NameContext } from "../../context/NameContext"
import FolderDrop from '../FolderDrop'
import FileDrop from '../FileDrop'

import api from '../../API'

import fileImage from '../../image/file-solid.png'
import folderImage from '../../image/folder-solid.png'
import dot from '../../image/dot.png'

export default function Scroll({ folder, file, path, setUpdate }) {
    const navigation = useNavigation()

    const [fl, setFl] = useState('')
    const [fd, setFd] = useState('')
    const [newName, setNewName] = useState('')

    const [ok, setOk] = useState(false)

    const { name, isModalVisible, toggleModal, setModalVisible } = useContext(NameContext)

    const modalizeRefFile = useRef(null)
    const modalizeRefPath = useRef(null)
    
    const newNameFunction = useCallback(() => {
        if (ok === true) {
            api.put('/renameFolder', { path: path, name: name, newName: newName })
            setUpdate(true)
        }
    }, [ok])

    useEffect(() => {
        newNameFunction()
        setOk(false)
    }, [ok])

    return (
        <>
            <ScrollView style={{ flex: 1 }} scrollEventThrottle={100} >
                <View style={styles.container}>
                    {
                        folder?.map((f, index) => (
                            <View key={index + "fl1"} >
                                <Pressable onPress={() => {
                                    navigation.push('Manager', {
                                        folderName: { f },
                                        path: { path }
                                    })
                                }} key={index + "fl2"} style={{ flexDirection: 'row' }}>
                                    <Image key={index + "fl5"} style={styles.imgFolder} source={folderImage} />
                                    <View key={index + "fl4"} style={styles.containerFlex}>
                                        <Text style={styles.txtBnt}>{f}</Text>
                                    </View>
                                </Pressable>
                                <TouchableOpacity onPress={() => {
                                    modalizeRefPath.current?.open()
                                    setFd(f)
                                }
                                } style={styles.dotPosition} key={index + "fl3"}>
                                    <Image key={index + "fl5"} style={styles.imgDot} source={dot} />
                                </TouchableOpacity>
                            </View>
                        ))
                    }
                    {
                        file?.map((f, index) => (
                            <View key={index + "fl1"} >
                                <Pressable key={index + "fl2"} style={{ flexDirection: 'row' }}>
                                    <Image key={index + "fl5"} style={styles.imgFile} source={fileImage} />
                                    <View key={index + "fl4"} style={styles.containerFlex}>
                                        <Text style={styles.txtBnt}>{f}</Text>
                                    </View>
                                </Pressable>
                                <TouchableOpacity onPress={() => {
                                    modalizeRefFile.current?.open()
                                    setFl(f)
                                }}
                                    style={styles.dotPosition}
                                    key={index + "fl3"}>
                                    <Image key={index + "fl5"} style={styles.imgDot} source={dot} />
                                </TouchableOpacity>
                            </View>
                        ))
                    }
                </View>
            </ScrollView>

            <FileDrop mod={modalizeRefFile} file={fl} path={path} />
            <FolderDrop mod={modalizeRefPath} folder={fd} path={path} />

            <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
                <View style={{ backgroundColor: "white", padding: 25, borderRadius: 10 }}>
                    <Text style={{ fontSize: 20, textAlign: 'center', marginBottom: 20 }}>Rename</Text>
                    <TextInput
                        placeholder="New Name"
                        style={{ borderColor: 'black', borderWidth: 1, borderRadius: 9, padding: 20 }}
                        onChangeText={(text) => { setNewName(text) }}
                    />
                    <View style={{ display: "flex", flexDirection: "row", justifyContent: 'space-evenly', marginTop: 50, marginBottom: 10 }}>
                        <TouchableWithoutFeedback onPress={() => { setOk(true); setModalVisible(false); modalizeRefPath.current?.close() }}>
                            <Text style={styles.btnOk}>ok</Text>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={toggleModal}>
                            <Text style={styles.btnCancel}>Cancel</Text>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </Modal>
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
    },
    btnOk: {
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 30,
        padding: 9,
        width: 100,
        textAlign: "center"
    },
    btnCancel: {
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 30,
        padding: 9,
        width: 100,
        textAlign: "center",
        backgroundColor: 'black',
        color: "white"
    }
})