import React, { useState, useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar"
import { StyleSheet, Text, SafeAreaView, View, TouchableOpacity, Image, TextInput, TouchableWithoutFeedback } from "react-native"


import Scroll from "../../Components/Scroll";
import MainDrop from "../../Components/MainDrop";


import reload from '../../image/refresh.png'
import more from '../../image/more.png'
import lupa from '../../image/lupa.png'

import api from '../../API'

export default function Manager({ route }) {
    const [dir, setDir] = useState('')
    const [path, setPath] = useState('')
    const [update, setUpdate] = useState(false)

    const modalizeRef = useRef(null)

    if (route?.params?.folderName === undefined) {
        useEffect(() => {
            api.get('/main').then(({ data }) => {
                setPath(data.path)
                api.post('/', { path: data.path }).then(({ data }) => {
                    setDir(data)
                })
            })
            if (update === true) {
                setUpdate(false)
            }
        }, [path, update])
    } else {
        useEffect(() => {
            setPath(route?.params?.path.path + '/' + route?.params?.folderName.f)
            api.post('/', { path: route?.params?.path.path + '/' + route?.params?.folderName.f }).then(({ data }) => {
                setDir(data)
            })
            if (update === true) {
                setUpdate(false)
            }
        }, [path,update])
    }


    function pathRaplace() {
        let array = path.split('/')
        array.shift()
        return array
    }

    return (
        <>
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar style="light" />
                <View style={styles.header}>
                    <View style={{ padding: 10, display: "flex", flexDirection: "row", marginTop: 20 }}>
                        <Text style={styles.txtHeader}>Folder Manager</Text>
                        <TouchableOpacity>
                            <Image style={styles.imgLupa} source={lupa} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            setUpdate(true)
                        }}>
                            <Image style={styles.imgReload} source={reload} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            modalizeRef.current?.open()
                        }}>
                            <Image style={styles.imgDot} source={more} />
                        </TouchableOpacity>
                    </View>
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
                <Scroll file={dir.file} folder={dir.folder} path={path} setUpdate={setUpdate}></Scroll>
                <MainDrop mod={modalizeRef}></MainDrop>
            </SafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({
    header: {
        padding: 10,
        paddingBottom: 10,
        backgroundColor: "#00BFFF",
        borderBottomColor: '#808080',
        borderWidth: 1,
    },
    txtHeader: {
        fontSize: 25,
        width: 250,
        color: '#ffffff',
        marginTop: 5,
        fontWeight: 'bold'
    },
    loginInput: {
        fontSize: 20,
        width: 250,
        color: '#ffffff'
    },
    imgReload: {
        width: 24,
        height: 24,
        marginTop: 13,
        marginLeft: 17
    },
    imgLupa: {
        width: 20,
        height: 20,
        marginTop: 15,
    },
    imgDot: {
        width: 31,
        height: 31,
        marginTop: 9,
        marginLeft: 12,
        padding: 10
    },
    viewPath: {
        display: 'flex',
        flexDirection: 'row',
        position: 'relative'
    },
    textPath: {
        color: '#ffff',
        marginRight: 3
    },
    textPathLast: {
        color: '#000000',
        marginRight: 3
    }
})

//<TextInput style={styles.loginInput} placeholder="Folder Manager" ></TextInput>