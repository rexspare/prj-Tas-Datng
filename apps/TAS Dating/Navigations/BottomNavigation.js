import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../pages/Home/Home';
import Likes from '../pages/Likes/Likes';
import Chat from '../pages/Chats/Chat';
import Profile from '../pages/Profile/Profile';
import CustomNavigation from './CustomNavigation';

const Tab = createBottomTabNavigator();

const BottomNavigation = () => {
    return (
        <Tab.Navigator
            tabBar={props => <CustomNavigation {...props} />}
            screenOptions={{
                headerShown:false,
            }}
            initialRouteName="Home"
        >
            <Tab.Screen 
                name="Home"
                component={Home}

            />
            <Tab.Screen 
                name="Likes"
                component={Likes}
            />
            <Tab.Screen 
                name="Chat"
                component={Chat}
            />
            <Tab.Screen 
                name="Profile"
                component={Profile}
            />
        </Tab.Navigator>
    );
};


export default BottomNavigation;