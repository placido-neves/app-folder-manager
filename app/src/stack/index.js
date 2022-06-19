import React from "react";
import { createStackNavigator } from '@react-navigation/stack'

import Login from "../screens/Login";
import Manager from "../screens/Manager"
import Details from '../screens/Detail'
import Copy from "../screens/Copy";

const stck = createStackNavigator()

export default function Stack() {
    return (

        <stck.Navigator
            initialRouteName={Login}
            screenOptions={{
                headerShown: false,
            }}
        >
            <stck.Screen
                name="Login"
                component={Login}>
            </stck.Screen>
            <stck.Screen
                name="Manager"
                component={Manager}>
            </stck.Screen>
            <stck.Screen
                name="Details"
                component={Details}>
            </stck.Screen>
            <stck.Screen
                name="Copy"
                component={Copy}>
            </stck.Screen>
        </stck.Navigator>

    )
}