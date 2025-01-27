import React from 'react'
import { NAV } from '../constants/enums'
import { SafeAreaView } from 'react-native'
import DrawerMenu from '../layout/DrawerMenu'
import BottomNavigation from './BottomNavigation'
import { createDrawerNavigator } from '@react-navigation/drawer'

const Drawer = createDrawerNavigator()

const DrawerNavigation = () => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Drawer.Navigator
                drawerContent={() => <DrawerMenu />}
                screenOptions={{ headerShown: false }}
            >
                <Drawer.Screen name={NAV.BOTTOM} component={BottomNavigation} />
            </Drawer.Navigator>
        </SafeAreaView>
    )
}

export default DrawerNavigation