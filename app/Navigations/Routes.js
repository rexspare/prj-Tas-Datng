import React, { useState, useEffect } from "react"
import {
    NavigationContainer,
    DefaultTheme as NavigationDefaultTheme,
    DarkTheme as NavigationDarkTheme,
} from "@react-navigation/native"
import Pages from "../pages/Index"
import { saveData } from "../services"
import { COLORS } from "../constants/theme"
import auth from "@react-native-firebase/auth"
import themeContext from '../constants/themeContext'
import messaging from "@react-native-firebase/messaging"
import PushNotification from "react-native-push-notification"
import { androidNotificationPermission } from "../utils/helpers"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { GoogleSignin } from "@react-native-google-signin/google-signin"
import { FIRESTORE_COLLECTIONS, GOOGLE_LOGIN_KEY } from "../constants/enums"
import { ZegoCallInvitationDialog } from "@zegocloud/zego-uikit-prebuilt-call-rn"
import { AppProvider, AuthProvider, PurchaseProvider, LanguageProvider } from "../contexts"

const Routes = () => {
    const [isDarkTheme, setIsDarkTheme] = useState(false)

    const authContext = React.useMemo(() => ({
        setDarkTheme: () => {
            setIsDarkTheme(true)
        },
        setLightTheme: () => {
            setIsDarkTheme(false)
        }
    }), [])

    const CustomDefaultTheme = {
        ...NavigationDefaultTheme,
        colors: {
            ...NavigationDefaultTheme.colors,
            text: COLORS.text,
            textLight: '#a19fa8',
            title: COLORS.title,
            background: '#f5f5f5',
            bgLight: '#F0F0F0',
            card: COLORS.white,
            cardBg: COLORS.white,
            borderColor: COLORS.borderColor,
            themeBg: "#F4F6FF",
            bgGradient: ['#FFFBF6', '#FBE7DF'],
        }
    }

    const CustomDarkTheme = {
        ...NavigationDarkTheme,
        colors: {
            ...NavigationDarkTheme.colors,
            text: 'rgba(255, 255, 255, 0.7)',
            textLight: 'rgba(255, 255, 255, 0.7)',
            title: '#fff',
            background: '#00092D',
            bgLight: 'rgba(255,255,255,.1)',
            card: '#3a4a91',
            cardBg: "#0c1746",
            borderColor: COLORS.darkBorder,
            themeBg: "#00092D",
            bgGradient: ['#2c3f6d', '#2c3f6d'],
        }
    }

    const theme = isDarkTheme ? CustomDarkTheme : CustomDefaultTheme

    const requestUserPermission = async () => {
        const authStatus = await messaging().requestPermission()
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL
        if (enabled) {
            getFcmToken()
        }
    }

    const getFcmToken = async () => {
        await messaging().getToken()
            .then(async (fcmToken) => {
                if (fcmToken && auth()?.currentUser) {
                    // console.log('=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=')
                    // console.log('FCM_TOKEN:=======>', fcmToken)
                    // console.log('=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=')
                    await saveData(FIRESTORE_COLLECTIONS.USERS, auth()?.currentUser?.uid, { fcmToken }, true)
                }
            })
            .catch((e) => console.log("Error", e))
    }

    const notificationListener = async () => {
        try {
            messaging().onNotificationOpenedApp((remoteMessage) => {
                // console.log(
                //     "Notification caused app to open from background state:",
                //     remoteMessage.notification
                // )
            })
            messaging().onMessage(async (remoteMessage) => {
                // console.log("Received in Foreground", remoteMessage)
                PushNotification.createChannel({
                    channelId: "channel-id", // (required)
                    channelName: "My channel", // (required)
                })
                PushNotification.localNotification({
                    channelId: "channel-id",
                    title: remoteMessage.notification.title,
                    message: remoteMessage.notification.body, // (required)
                    showWhen: true,
                    color: COLORS.primary,
                })
            })
            messaging()
                .getInitialNotification()
                .then((remoteMessage) => {
                    // if (remoteMessage) {
                    //     console.log(
                    //         "Notification caused app to open from quit state:",
                    //         remoteMessage.notification
                    //     )
                    // }
                })
        } catch (error) {
            console.log("Error", error)
        }
    }

    useEffect(() => {
        try {
            GoogleSignin.configure({ webClientId: GOOGLE_LOGIN_KEY })
            requestUserPermission()
            androidNotificationPermission()
            notificationListener()
        } catch (e) {
            console.log('ERROR:', e)
        }
    }, [])

    return (
        <SafeAreaProvider>
            <themeContext.Provider value={authContext}>
                <NavigationContainer theme={theme}>
                    <LanguageProvider>
                        <AuthProvider>
                            <AppProvider>
                                <PurchaseProvider>
                                    <ZegoCallInvitationDialog />
                                    <Pages />
                                </PurchaseProvider>
                            </AppProvider>
                        </AuthProvider>
                    </LanguageProvider>
                </NavigationContainer>
            </themeContext.Provider>
        </SafeAreaProvider>
    )
}

export default Routes