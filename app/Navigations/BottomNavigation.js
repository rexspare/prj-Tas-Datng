import React from 'react'
import Home from '../pages/Home/Home'
import Chat from '../pages/Chats/Chat'
import Likes from '../pages/Likes/Likes'
import { SCREEN } from '../constants/enums'
import Profile from '../pages/Profile/Profile'
import CustomNavigation from './CustomNavigation'
import Relation from '../pages/Relations/Relation'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

const Tab = createBottomTabNavigator()

const BottomNavigation = () => {
    return (
        <Tab.Navigator
            screenOptions={{ headerShown: false }}
            tabBar={props => <CustomNavigation {...props} />}
        >
            <Tab.Screen name={SCREEN.HOME} component={Home} />
            <Tab.Screen name={SCREEN.LIKES} component={Likes} />
            <Tab.Screen name={SCREEN.MEDIA} component={Relation} />
            <Tab.Screen name={SCREEN.CHAT} component={Chat} />
            <Tab.Screen name={SCREEN.PROFILE} component={Profile} />
        </Tab.Navigator>
    )
}

export default BottomNavigation
