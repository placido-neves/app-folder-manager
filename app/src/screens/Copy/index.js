import React, { useState, useEffect, useContext, useCallback } from "react";
import { StatusBar } from "expo-status-bar"
import { StyleSheet, Text, SafeAreaView, View, TouchableOpacity } from "react-native"
import { useNavigation } from '@react-navigation/native';

import ScrollFolder from "../../Components/ScrollFolder";
import { PathContext } from "../../context/PathContext";
import api from '../../API'

export default function Copy({ route }) {
    const navigation = useNavigation()
    const [dir, setDir] = useState('')
    const [path, setPath] = useState('')
    const [back, setBack] = useState(false)

    const { pathCopy, moveORCopy } = useContext(PathContext)

    if (route?.params?.folderName === undefined) {
        useEffect(() => {
            api.get('/main').then(({ data }) => {
                setPath(data.path)
                api.post('/', { path: data.path }).then(({ data }) => {
                    setDir(data)
                })
            })
        }, [])
    } else {
        useEffect(() => {
            setPath(route?.params?.path.path + '/' + route?.params?.folderName.f)
            api.post('/', { path: route?.params?.path.path + '/' + route?.params?.folderName.f }).then(({ data }) => {
                setDir(data)
            })
        }, [path])
    }

    const copy = useCallback(() => {
        if (back === true) {
            if (moveORCopy === 'copy') {
                api.post('/copyFolder', { source: pathCopy, dest: path })
            }
            if (moveORCopy === 'move') {
                api.post('/moveFolder', { source: pathCopy, dest: path })
            }
        }
    }, [back])


    useEffect(() => {
        copy()
    }, [back])

    function pathRaplace() {
        let array = path.split('/')
        array.shift()
        return array
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar style="light" />
            <View style={styles.header}>
                <Text style={styles.textHeader}>Folder Manager</Text>
                < View style={styles.viewPath} >
                    {
                        pathRaplace()?.map((path, index) => (
                            <Text
                                key={index}
                                style={
                                    (index === pathRaplace().length - 1) ? styles.textPathLast : styles.textPath}>
                                {path} {(index === pathRaplace().length - 1) ? "" : '> '}
                            </Text>
                        ))
                    }
                </View>
            </View >
            <ScrollFolder folder={dir.folder} path={path} />
            <View style={styles.content}>
                <TouchableOpacity onPress={() => {
                    navigation.navigate('Manager')
                    setBack(!back)
                }} style={styles.btnCopy}>
                    {
                        moveORCopy === 'copy'
                            ?
                            (
                                <Text style={styles.textButton}>
                                    Copy for here
                                </Text>
                            )
                            :
                            (
                                <Text style={styles.textButton}>
                                    Move for here
                                </Text>
                            )
                    }
                </TouchableOpacity>
            </View>
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    header: {
        padding: 30,
        paddingBottom: 10,
        backgroundColor: "#00BFFF",
        borderBottomColor: '#808080',
        borderWidth: 1,
    },
    textHeader: {
        color: '#DCDCDC',
        textAlign: 'center',
        fontSize: 25,
        marginTop: 20,
        fontWeight: 'bold',
    },
    viewPath: {
        display: 'flex',
        flexDirection: 'row',

    },
    textPath: {
        color: '#ffff',
        marginRight: 3
    },
    content: {
        display: 'flex',
        alignItems: "center",
        borderWidth: StyleSheet.hairlineWidth,
        padding:10,
        marginTop: 15
    },
    btnCopy: {
        backgroundColor: "#00BFFF",
        borderRadius: 30,
        padding: 9,
        width:390

    },
    textButton: {
        textAlign: 'center',
        color: '#FFFAFA',
        fontWeight: 'bold'
    }
})