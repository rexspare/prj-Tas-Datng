import { StatusBar } from 'react-native'
import React from 'react'
import Filter from './Filter'
import LivePage from './LivePage'
import Settings from './Settings'
import EnterCode from './EnterCode'
import FirstName from './FirstName'
import Languages from './Languages'
import YourGender from './YourGender'
import { useAuth } from '../contexts'
import Interested from './Interested'
import LookingFor from './LookingFor'
import RecentPics from './RecentPics'
import Orientation from './Orientation'
import PhoneNumber from './PhoneNumber'
import UserLikes from './Chats/UserLikes'
import SingleChat from './Chats/SingleChat'
import SpotlightList from './SpotlightList'
import OnBoarding from './Splash/OnBoarding'
import EnterBirthDate from './EnterBirthDate'
import EditProfile from './Profile/EditProfile'
import FollowingScreen from './FollowingScreen'
import SplashScreen from './Splash/SplashScreen'
import { NAV, SCREEN } from '../constants/enums'
import ProfileDetails from './Likes/ProfileDetails'
import { useTheme } from '@react-navigation/native'
import DrawerNavigation from '../Navigations/DrawerNavigation'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Campaigns, BusinessProfile, NewCampaign, CampaignDetails } from './Business'
import { Reels, ReelsList, StoryScreen, UploadMedia, CommentSection, Explore } from './Relations'
import { ZegoUIKitPrebuiltCallInCallScreen, ZegoUIKitPrebuiltCallWaitingScreen } from '@zegocloud/zego-uikit-prebuilt-call-rn'

const Stack = createNativeStackNavigator()

const W3DatingPage = () => {
    const { colors, dark } = useTheme()
    const { user, userData, showSplash } = useAuth()

    if (showSplash) {
        return <SplashScreen />
    }

    return (
        <>
            <StatusBar backgroundColor={dark ? colors.card : colors.card} barStyle={dark ? 'light-content' : 'dark-content'} />

            <Stack.Navigator
                detachInactiveScreens={true}
                screenOptions={{
                    headerShown: false,
                    cardStyle: { backgroundColor: 'transparent' },
                }}
            >
                {user?.uid ?
                    !userData?.images ?
                        <>
                            <Stack.Screen name={SCREEN.FIRST_NAME} component={FirstName} />
                            <Stack.Screen name={SCREEN.BIRTH_DATE} component={EnterBirthDate} />
                            <Stack.Screen name={SCREEN.YOUR_GENDER} component={YourGender} />
                            <Stack.Screen name={SCREEN.ORIENTATION} component={Orientation} />
                            <Stack.Screen name={SCREEN.INTERESTED} component={Interested} />
                            <Stack.Screen name={SCREEN.LOOKING_FOR} component={LookingFor} />
                            <Stack.Screen name={SCREEN.RECENT_PICS} component={RecentPics} />
                        </>
                        :
                        <>
                            <Stack.Screen name={NAV.DRAWER} component={DrawerNavigation} />
                            <Stack.Screen name={SCREEN.SINGLE_CHAT} component={SingleChat} />
                            <Stack.Screen name={SCREEN.COMMENT} component={CommentSection} />
                            <Stack.Screen name={SCREEN.USER_LIKES} component={UserLikes} />
                            <Stack.Screen name={SCREEN.FILTER} component={Filter} />
                            <Stack.Screen name={SCREEN.EDIT_PROFILE} component={EditProfile} />
                            <Stack.Screen name={SCREEN.SETTINGS} component={Settings} />
                            <Stack.Screen name={SCREEN.PROFILE_DETAILS} component={ProfileDetails} />
                            <Stack.Screen name={SCREEN.REELS} component={Reels} />
                            <Stack.Screen name={SCREEN.REELS_LIST} component={ReelsList} />
                            <Stack.Screen name={SCREEN.UPLOAD_MEDIA} component={UploadMedia} />
                            <Stack.Screen name={SCREEN.STORY} component={StoryScreen} />
                            <Stack.Screen name={SCREEN.EXPLORE} component={Explore} />
                            <Stack.Screen name={SCREEN.CAMPAIGNS} component={Campaigns} />
                            <Stack.Screen name={SCREEN.CAMPAIGNS_DETAILS} component={CampaignDetails} />
                            <Stack.Screen name={SCREEN.NEW_CAMPAIGN} component={NewCampaign} />
                            <Stack.Screen name={SCREEN.BUSINESS_PROFILE} component={BusinessProfile} />
                            <Stack.Screen name={SCREEN.SPOTLIGHTS} component={SpotlightList} />
                            <Stack.Screen name={SCREEN.LANGUAGES} component={Languages} />
                            <Stack.Screen name={SCREEN.FOLLOWING} component={FollowingScreen} />

                            {/* <Stack.Screen name={SCREEN.LIVE} component={LivePage} /> */}

                            <Stack.Screen
                                options={{ headerShown: false }}
                                // DO NOT change the name 
                                name="ZegoUIKitPrebuiltCallWaitingScreen"
                                component={ZegoUIKitPrebuiltCallWaitingScreen}
                            />
                            <Stack.Screen
                                options={{ headerShown: false }}
                                // DO NOT change the name
                                name="ZegoUIKitPrebuiltCallInCallScreen"
                                component={ZegoUIKitPrebuiltCallInCallScreen}
                            />
                        </>
                    :
                    <>
                        <Stack.Screen name={SCREEN.ONBOARDING} component={OnBoarding} />
                        <Stack.Screen name={SCREEN.PHONE_NUMBER} component={PhoneNumber} />
                        <Stack.Screen name={SCREEN.ENTER_CODE} component={EnterCode} />
                    </>
                }
            </Stack.Navigator>
        </>
    )
}

export default W3DatingPage
