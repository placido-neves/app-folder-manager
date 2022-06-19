import React, { useEffect, useState, useCallback } from "react";
import { StyleSheet, SafeAreaView, View, Image, Text } from "react-native"
import api from '../../API'
import file from '../../image/file-solid.png'
import folder from '../../image/folder-solid.png'

export default function Details({ route }) {
    const [details, setDetails] = useState({})

    const fileORFolder = useCallback(() => {
        if (route?.params?.fileORFolder === 'folder') {
            api.post('/detailFolder', { path: route?.params?.path, name: route?.params?.folder }).then(({ data }) => {
                const dt = JSON.parse(data)
                setDetails(dt.files)
            })
        } if (route?.params?.fileORFolder === 'file') {
            api.post('/detailFile', { path: route?.params?.path + '/' + route?.params?.file }).then(({ data }) => {
                setDetails(data)
            })
        }
    }, [])

    useEffect(() => {
        fileORFolder()
    }, [])

    return (
        <SafeAreaView>
            {
                route?.params?.fileORFolder === 'folder' ?
                    (
                        <View style={styles.container}>
                            <Image style={styles.imgFolder} source={folder} />
                        </View>
                    ):
                    (
                        <View style={styles.container}>
                            <Image style={styles.imgFile} source={file} />
                        </View>
                    )

            }
            <View>
                <Text>Name: {details.name}</Text>
                <Text>Local: {details.local}</Text>
                <Text>Created: {details.created}</Text>
                <Text>Modified: {details.modified}</Text>
                <Text>Size: {details.size}</Text>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        backgroundColor: "#00BFFF"
    },
    imgFile: {
        height: 200,
        width: 150,
        margin: 50
    },
    imgFolder: {
        height: 180,
        width: 200,
        margin: 50
    },
})