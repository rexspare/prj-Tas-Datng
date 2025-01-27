import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import BottomNavigation from './BottomNavigation';
import DrawerMenu from '../layout/DrawerMenu';
import { SafeAreaView } from 'react-native';

const Drawer = createDrawerNavigator();

const DrawerNavigation = (props) => {
    return (
        <SafeAreaView
            style={{
                flex:1,
            }}
        >
            <Drawer.Navigator
                drawerContent={() => <DrawerMenu/>}
                screenOptions={{
                    headerShown : false
                }}
            >
                <Drawer.Screen name="BottomNavigation" component={BottomNavigation} />
            </Drawer.Navigator>
        </SafeAreaView>
    );
};


export default DrawerNavigation;