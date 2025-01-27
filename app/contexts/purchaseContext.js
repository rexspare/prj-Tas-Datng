import { Alert } from 'react-native'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './authContext'
import { SCREEN } from '../constants/enums'
import { useLanguage } from './languageContext'
import firestore from '@react-native-firebase/firestore'
import { useNavigation } from '@react-navigation/native'
import { emptyFunction, isIOS, showFlash } from '../utils/helpers'
import {
    initConnection,
    endConnection,
    flushFailedPurchasesCachedAsPendingAndroid,
    getSubscriptions,
    getAvailablePurchases,
    getProducts, //For fetching available products
    requestPurchase, //For initiating in-app purchases
    purchaseUpdatedListener, //For listening to purchase events
    purchaseErrorListener, //For listening to purchase errors
    finishTransaction, //For acknowledging a purchase
    PurchaseError,
} from 'react-native-iap'

export const PurchaseContext = createContext({
    packages: [],
    handlePackage: emptyFunction,
    handlePurchase: emptyFunction,
    handleSpotlight: emptyFunction,
    handleVerifyUser: emptyFunction,
    isSubscriptionExpired: emptyFunction,
})

export const usePurchase = () => useContext(PurchaseContext)

// const productSkus = Platform.select({
//     android: ['basic', 'pro', 'standard', 'unlimited'],
// })

const PRODUCT_IDS = ['basic', 'pro', 'standard', 'unlimited', 'spotlight', 'verified']
const PACKAGES = ['basic', 'pro', 'standard', 'unlimited']

export const PurchaseProvider = ({ children }) => {
    const { t } = useLanguage()
    const { navigate } = useNavigation()
    const { userData, updateUser, showSplash } = useAuth()
    const [packages, setPackages] = useState([])

    useEffect(() => {
        checkExpiredPackages()
        const init = async () => {
            try {
                await initConnection()
                if (!isIOS()) {
                    flushFailedPurchasesCachedAsPendingAndroid()
                    getPurchase()
                    // getAvailablePurchase()
                }
            }
            catch (error) {
                console.error('Error occurred during initilization', error.message)
            }
        }

        if (userData?.uid && !showSplash) {
            init()

            const purchaseUpdateSubscription = purchaseUpdatedListener(
                async (purchase) => {
                    const receipt = purchase?.transactionReceipt
                    if (receipt) {
                        try {
                            await finishTransaction({ purchase, isConsumable: false })
                            // Expires after 30 days
                            const expiresAt = firestore.Timestamp.fromDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))
                            switch (purchase?.productId) {
                                case 'spotlight':
                                    await updateUser({
                                        spotlight: {
                                            isActive: true,
                                            expiresAt,
                                            animation: '1',
                                            createdAt: firestore.FieldValue.serverTimestamp(),
                                        },
                                    })
                                    showFlash(t('spotlightSuccess'))
                                    navigate(SCREEN.SPOTLIGHTS)
                                    break
                                case 'verified':
                                    await updateUser({
                                        verified: {
                                            isActive: true,
                                            expiresAt,
                                            createdAt: firestore.FieldValue.serverTimestamp(),
                                        },
                                    })
                                    showFlash(t('verifyUserSuccess'))
                                    break
                                case 'basic':
                                case 'pro':
                                case 'standard':
                                case 'unlimited':
                                    await updateUser({
                                        subscription: {
                                            isActive: true,
                                            packageId: purchase?.productId,
                                            expiresAt,
                                            createdAt: firestore.FieldValue.serverTimestamp(),
                                        },
                                    })
                                    showFlash(t('subscribedSuccess'))
                                    break
                                default:
                                    console.error('Unknown productId:', purchase?.productId)
                            }
                        } catch (error) {
                            console.error("An error occurred while completing transaction", error)
                        }
                    }
                })
            const purchaseErrorSubscription = purchaseErrorListener((error) =>
                console.error('Purchase error', error.message))

            return () => {
                purchaseUpdateSubscription.remove()
                purchaseErrorSubscription.remove()
                endConnection()
            }
        }
    }, [userData?.uid, showSplash])

    const getPurchase = async () => {
        try {
            const result = await getProducts({ skus: PRODUCT_IDS })
            const filteredPackages = result.filter(x => PACKAGES.includes(x?.productId))
            setPackages(filteredPackages)
        } catch (error) {
            console.error('Error fetching products', error)
        }
    }

    // const getAvailablePurchase = async () => {
    //     try {
    //         const result = await getAvailablePurchases()
    //     }
    //     catch (error) {
    //         console.error('Error occurred while fetching purchases', error)
    //     }
    // }

    const handlePurchase = async (productId) => {
        try {
            const res = await requestPurchase({ skus: [productId] })
        } catch (error) {
            console.log('ERROR: =======>', error)
        }
    }

    const handlePackage = async (productId) => {
        try {

            const res = await requestPurchase({ skus: [productId] })

            // if (res) {

            //     const expiresAt = firestore.Timestamp.fromDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))
            //     // Expires after 30 days

            //     const subscriptionData = {
            //         isActive: true,
            //         packageId: productId,
            //         expiresAt,
            //         createdAt: firestore.FieldValue.serverTimestamp(),
            //     }

            //     await updateUser({ subscription: subscriptionData })
            //     showFlash('You package has been purchased')
            // }
        } catch (error) {
            console.log('ERROR: =======>', error)
        }
    }
    const handleSpotlight = () => {
        const currentTimestamp = firestore.Timestamp.now()
        if (userData?.spotlight?.expiresAt > currentTimestamp) {
            navigate(SCREEN.SPOTLIGHTS)
        } else {
            Alert.alert(t('spotlight'), t('spotlightConfirmMessage'), [
                { text: t('yes'), onPress: () => purchaseSpotlight() },
                { text: t('cancel'), onPress: emptyFunction },
            ])
        }
    }
    const checkExpiredPackages = () => {
        if (userData?.uid && !showSplash) {
            const currentTimestamp = firestore.Timestamp.now()

            if (userData?.spotlight?.isActive && userData?.spotlight?.expiresAt < currentTimestamp) {
                updateUser({ spotlight: { isActive: false } })
                alert('Your spotlight has expired')
            }

            if (userData?.verified?.isActive && userData?.verified?.expiresAt < currentTimestamp) {
                updateUser({ verified: { isActive: false } })
                alert('Your verified account has expired')
            }

            if (userData?.subscription?.isActive && userData?.subscription?.expiresAt < currentTimestamp) {
                updateUser({ subscription: { isActive: false } })
                alert(`Your purchased package has expired`)
            }
        }
    }

    const purchaseSpotlight = async () => {
        try {
            const res = await requestPurchase({ skus: ['spotlight'] })
            // if (res) {
            //     const expiresAt = firestore.Timestamp.fromDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))
            //     // Expires after 30 days

            //     const spotlightData = {
            //         isActive: true,
            //         expiresAt,
            //         animation: '1',
            //         createdAt: firestore.FieldValue.serverTimestamp(),
            //     }

            //     await updateUser({ spotlight: spotlightData })
            //     navigate(SCREEN.SPOTLIGHTS)
            // }

        } catch (e) {
            console.log(e)
        }
    }

    const isSubscriptionExpired = (expiresAt) => {
        const currentTimestamp = firestore.Timestamp.now()
        return expiresAt < currentTimestamp
    }

    const handleVerifyUser = async () => {
        try {
            const res = await requestPurchase({ skus: ['verified'] })

            // if (res) {
            //     const expiresAt = firestore.Timestamp.fromDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))
            //     // Expires after 30 days

            //     const verifiedData = {
            //         isActive: true,
            //         expiresAt,
            //         createdAt: firestore.FieldValue.serverTimestamp(),
            //     }

            //     await updateUser({ verified: verifiedData })
            //     showFlash(t('verifyUserSuccess'))
            // }

        } catch (e) {
            console.log(e)
        }
    }

    // useFocusEffect(
    //     useCallback(() => {
    //         const getPurchase = async () => {
    //             try {
    //                 const result = await getAvailablePurchases()
    //                 const hasPurchased = result.find((product) => product.productId === constants.productSkus[0])
    //                 setPremiumUser(hasPurchased)
    //             }
    //             catch (error) {
    //                 console.error('Error occurred while fetching purchases', error)
    //             }
    //         }

    //         getPurchase()

    //     }, [])
    // )


    return (
        <PurchaseContext.Provider
            value={{
                packages,
                handlePackage,
                handlePurchase,
                handleSpotlight,
                handleVerifyUser,
                isSubscriptionExpired,
            }}>
            {children}
        </PurchaseContext.Provider>
    )
}
