import { AppState } from 'react-native'
import React, { createContext, useState, useEffect, useContext } from 'react'
import axios from 'axios'
import geohash from 'ngeohash'
import * as ZIM from 'zego-zim-react-native'
import * as ZPNs from 'zego-zpns-react-native'
import auth from '@react-native-firebase/auth'
import { useLanguage } from './languageContext'
import { useNavigation } from '@react-navigation/native'
import firestore from '@react-native-firebase/firestore'
import messaging from '@react-native-firebase/messaging'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { getDocumentData, saveData, getCollectionDataWhere } from '../services'
import ZegoUIKitPrebuiltCallService from '@zegocloud/zego-uikit-prebuilt-call-rn'
import { emptyFunction, handleCurrentLocation, showFlash } from '../utils/helpers'
import { FIRESTORE_COLLECTIONS, GOOGLE_API_KEY, NAV, SCREEN, ZEGO_APP_ID, ZEGO_APP_SIGN } from '../constants/enums'

export const AuthContext = createContext({
    showSplash: true,
    user: {},
    phoneLogin: emptyFunction,
    confirmOTPCode: emptyFunction,
    loading: false,
    setLoading: emptyFunction,
    userData: {},
    updateUser: emptyFunction,
    logoutUser: emptyFunction,
    getProfileStatus: emptyFunction,
    updateUserLocation: emptyFunction,
    locationLoading: false,
    getUserData: emptyFunction,
    GoogleSignIn: emptyFunction,
    googleLoading: false,
    businessData: {},
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
    const { t, changeLanguage } = useLanguage()
    const navigation = useNavigation()
    const [user, setUser] = useState({})
    const [userData, setUserData] = useState({})
    const [confirm, setConfirm] = useState(null)
    const [loading, setLoading] = useState(false)
    const [showSplash, setShowSplash] = useState(true)
    const [googleLoading, setGoogleLoading] = useState(false)
    const [locationLoading, setLocationLoading] = useState(false)
    const [businessData, setBusinessData] = useState({})

    useEffect(() => {
        const onAuthStateChanged = async (userInfo) => {
            setShowSplash(true)
            if (userInfo) {
                setUser(userInfo)
                await getUserData(userInfo?.uid).finally(() => {
                    setShowSplash(false)
                    // if (userData?.uid && !userData?.phone && auth()?.currentUser?.phoneNumber) {
                    //     updateUser({ phone: auth()?.currentUser?.phoneNumber }, false)
                    // }
                })
            } else {
                setUser({})
                setUserData({})
                setTimeout(() => {
                    setShowSplash(false)
                }, 1500)
            }
        }
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged)
        return subscriber
    }, [])

    useEffect(() => {
        if (userData?.uid) {
            const handleAppStateChange = (nextAppState) => {
                updateUser({
                    isActive: nextAppState == 'active' ? true : false,
                    lastOnline: firestore.FieldValue.serverTimestamp(),
                })
            }
            const subscription = AppState.addEventListener('change', handleAppStateChange)
            return () => {
                subscription.remove()
            }
        }
    }, [userData?.uid])

    const initService = (currentUser) => {
        ZegoUIKitPrebuiltCallService.init(
            ZEGO_APP_ID,
            ZEGO_APP_SIGN,
            currentUser?.uid,
            currentUser?.name,
            [ZIM, ZPNs],
            {
                ringtoneConfig: {
                    incomingCallFileName: "zego_incoming.wav",
                    outgoingCallFileName: "zego_outgoing.wav",
                },
                notifyWhenAppRunningInBackgroundQuit: true,
                androidNotificationConfig: {
                    channelId: 'Tas_Dating_Call',
                    channelName: 'Tas_Dating_Call',
                },
                requireConfig: (data) => {
                    return {
                        onHangUp: duration => {
                            // console.log('duration =============->', duration)
                            navigation.reset({
                                index: 0,
                                routes: [{ name: NAV.DRAWER }]
                            })
                        }
                    }
                }
            }
        )
    }

    async function getUserData(id) {
        const foundUser = await getDocumentData(FIRESTORE_COLLECTIONS.USERS, id)
        if (foundUser) {
            setUserData(foundUser)
            if (foundUser?.isBusinessProfile && foundUser?.businessProfileId) {
                const foundBusiness = await getDocumentData(FIRESTORE_COLLECTIONS.BUSINESSES, foundUser?.businessProfileId)
                setBusinessData(foundBusiness)
            }
            initService(foundUser)
        }
    }

    async function phoneLogin(number) {
        setLoading(true)
        await auth().signInWithPhoneNumber(number)
            .then(confirmation => {
                setConfirm(confirmation)
                navigation.navigate(SCREEN.ENTER_CODE)
            }).catch(e => {
                // console.log('Error logging in with phone number', e)
                showFlash(e?.message || t('errorWarning'))
            }).finally(() => {
                setLoading(false)
            })
    }

    async function confirmOTPCode(code) {
        setLoading(true)
        try {
            await confirm.confirm(code)
        } catch (error) {
            showFlash(t('invalidCode'))
            // console.log('Invalid code')
        } finally {
            setLoading(false)
        }
    }

    const updateUserLocation = async () => {
        setLocationLoading(true)
        const position = await handleCurrentLocation()
        const coords = { latitude: position?.latitude, longitude: position?.longitude }
        const hashLocation = geohash.encode(coords?.latitude, coords?.longitude)
        let userLocation = { hashLocation, coordinates: coords }
        const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.latitude},${coords.longitude}&key=${GOOGLE_API_KEY}`
        const response = await axios.get(apiUrl)
        if (response?.data?.results) {
            const addressResult = response.data?.results[0]
            const firstFormattedAddress = addressResult?.formatted_address
            const cityName = addressResult.address_components?.length >= 2 ? addressResult?.address_components[1]?.long_name : ''
            const countryName = addressResult.address_components?.length >= 6 ? addressResult.address_components[5]?.long_name : ''
            userLocation.address = firstFormattedAddress
            userLocation.city = cityName
            userLocation.country = countryName
        }
        updateUser({ location: userLocation }, false)
        setLocationLoading(false)
    }

    const updateUser = (object, notMerge = false) => {
        return new Promise(async (resolve, reject) => {
            try {
                await saveData(FIRESTORE_COLLECTIONS.USERS, auth()?.currentUser?.uid, object, !notMerge)
                if (notMerge) {
                    setUserData(object)
                } else {
                    setUserData({ ...userData, ...object })
                }
                resolve(true)
            } catch (error) {
                // console.log('Something went wrong while updating user', error)
                reject(false)
            }
        })
    }

    async function logoutUser() {
        await auth().signOut()
        await changeLanguage('en');
    }

    function getProfileStatus(userObject) {

        const requiredKeys = [
            'interestedIn',
            'lookingFor',
            'age',
            'dob',
            // 'phone',
            'gender',
            'orientation',
            'name',
            'images',
            'uid',
            'languages',
            'interests',
            'bio',
            'about',
            'location',
            'horoscope',
        ]

        let completeKeys = 0
        for (const key of requiredKeys) {
            if (userObject?.hasOwnProperty(key)) {
                completeKeys++
            }
        }
        const completenessPercentage = (completeKeys / requiredKeys?.length) * 100
        return completenessPercentage.toFixed(0)
    }

    async function GoogleSignIn() {
        try {
            setGoogleLoading(true)
            let isSignedIn = await GoogleSignin.isSignedIn()
            if (isSignedIn) {
                await GoogleSignin.revokeAccess()
            }
            const { idToken, user } = await GoogleSignin.signIn()
            const GOOGLE_EMAIL = user.email || ''

            const exists = await getCollectionDataWhere(FIRESTORE_COLLECTIONS.USERS, 'email', GOOGLE_EMAIL)

            if (exists?.length != 0) {
                const EXIST_USER = exists[0]
                if (EXIST_USER?.googleProvider == true) {
                    await proceedGoogleLogin(EXIST_USER, idToken)
                } else {
                    showFlash(t('googleSignInError'))
                }
            } else {
                await proceedGoogleLogin(false, idToken)
            }

        } catch (error) {
            // console.log('Error while using google signIn:', error)
            setGoogleLoading(false)
        }
    }

    const proceedGoogleLogin = async (exists, idToken) => {
        try {
            // Create a Google credential with the token
            const googleCredential = auth.GoogleAuthProvider.credential(idToken)
            // Sign-in the user with the credential
            const logs = await auth().signInWithCredential(googleCredential)

            const fcmToken = await messaging().getToken()

            if (exists) {
                await updateUser({ fcmToken, googleProvider: true })
                setGoogleLoading(false)
            } else {
                await updateUser({
                    email: logs?.user?.email,
                    fcmToken,
                    googleProvider: true,
                    createdAt: firestore.FieldValue.serverTimestamp(),
                    uid: auth()?.currentUser?.uid,
                })
                setGoogleLoading(false)
            }
        } catch (error) {
            // console.log('Proceed Google Error', error)
            setGoogleLoading(false)
        }
    }

    return (
        <AuthContext.Provider
            value={{
                showSplash,
                user,
                phoneLogin,
                confirmOTPCode,
                loading,
                setLoading,
                userData,
                updateUser,
                logoutUser,
                getProfileStatus,
                updateUserLocation,
                locationLoading,
                getUserData,
                GoogleSignIn,
                googleLoading,
                businessData,
            }}>
            {children}
        </AuthContext.Provider>
    )
}
