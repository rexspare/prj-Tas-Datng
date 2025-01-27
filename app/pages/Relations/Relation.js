import { SafeAreaView, StyleSheet, ActivityIndicator, FlatList, Text, TouchableOpacity, View, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useTheme } from '@react-navigation/native'
import { COLORS, FONTS } from '../../constants/theme'
import firestore from '@react-native-firebase/firestore'
import FeatherIcon from 'react-native-vector-icons/Feather'
import { useApp, useAuth, useLanguage } from '../../contexts'
import { GlobalStyleSheet } from '../../constants/StyleSheet'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { StoriesSection, ReelCard, StreamSection } from '../components'
import { FIRESTORE_COLLECTIONS, SCREEN, STORAGE } from '../../constants/enums'
import { getCollectionDataWhere, getDocumentData, uploadImage } from '../../services'
import { handleGalleryPermission, mergeCampaignsAndReels, openCamera, openGallery, showFlash } from '../../utils/helpers'

const Relation = ({ navigation }) => {
    const { t } = useLanguage()
    const { colors } = useTheme()
    const Styles = styles(colors)
    const { userData, updateUser } = useAuth()
    const [loading, setLoading] = useState(false)
    const [uploadLoader, setUploadLoader] = useState(false)
    const { setStories, setReelsData, reelsData, campaigns } = useApp()

    useEffect(() => {
        fetchUserStories()
        // fetchUserStreams()
        getFollowedReels()
    }, [campaigns?.length])

    const selectImage = () => {
        const callbackFunction = () => {
            Alert.alert(t('createStory'), t('selectFollowing'), [
                { text: t('video'), onPress: () => handlePick(1) },
                { text: t('photo'), onPress: () => handlePick(2) },
                { text: t('camera'), onPress: () => handlePick(3) },
            ])
        }

        handleGalleryPermission(callbackFunction)
    }

    const handlePick = async (type) => {
        switch (type) {
            case 1: {
                const videoObject = await openGallery({ mediaType: 'video', cropping: false })
                uploadStory(videoObject?.path, 'video')
                break
            }
            case 2: {
                const imageObject = await openGallery()
                uploadStory(imageObject?.path, 'image')
                break
            }
            case 3: {
                const imageObject = await openCamera()
                uploadStory(imageObject?.path, 'image')
                break
            }
        }
    }

    const uploadStory = async (mediaUri, mediaType) => {
        try {
            setUploadLoader(true)
            const downloadUrl = await uploadImage(mediaUri, STORAGE.STORIES)

            const expiresAt = firestore.Timestamp.fromDate(new Date(Date.now() + 24 * 60 * 60 * 1000))

            const storyData = {
                mediaUrl: downloadUrl,
                mediaType: mediaType,
                timestamp: firestore.FieldValue.serverTimestamp(),
                expiresAt: expiresAt,
            }

            await updateUser({ story: storyData })
            setUploadLoader(false)
            showFlash('Story uploaded successfully')
        } catch (e) {
            console.log(e)
        }
    }

    const fetchUserStories = async () => {
        try {
            const followedUsersRef = firestore()
                .collection(FIRESTORE_COLLECTIONS.USERS)
                .doc(userData.uid)
                .collection(FIRESTORE_COLLECTIONS.FOLLOWING)

            const followedUsersSnapshot = await followedUsersRef.get()

            const followedUserIds = followedUsersSnapshot.docs.map(doc => doc.id)

            if (followedUserIds?.length === 0) {
                setStories([])
                // console.log('No followed users found.')
                return
            }

            const storiesArray = []
            const currentTimestamp = firestore.Timestamp.now()

            for (let userId of followedUserIds) {
                const followedUsers = await firestore()
                    .collection(FIRESTORE_COLLECTIONS.USERS)
                    .doc(userId)
                    .get()

                const followedUserData = followedUsers?.data()

                if (followedUserData?.story && followedUserData?.story?.expiresAt > currentTimestamp) {
                    storiesArray.push(followedUserData)
                }
                setStories(storiesArray)
            }

        } catch (error) {
            console.error('Error fetching user stories:', error)
            throw error
        }
    }

    const getFollowedReels = async () => {
        setLoading(true)
        const followedUsersRef = firestore()
            .collection(FIRESTORE_COLLECTIONS.USERS)
            .doc(userData.uid)
            .collection(FIRESTORE_COLLECTIONS.FOLLOWING)

        const followedUsersSnapshot = await followedUsersRef.get()

        const followedUserIds = followedUsersSnapshot.docs.map(doc => doc.id)
        if (followedUserIds?.length === 0) {
            // console.log('No followed users found.')
            setReelsData([])
            setLoading(false)
            return
        }

        const reelsOfUsersIFollowed = await getCollectionDataWhere(FIRESTORE_COLLECTIONS.REELS, 'postedBy', followedUserIds, 'in')
        if (reelsOfUsersIFollowed?.length === 0) {
            // console.log('No follower reels found.')
            setReelsData([])
            setLoading(false)
            return
        }
        const formattedReels = await formateReels(reelsOfUsersIFollowed)
        const reelsWithAds = mergeCampaignsAndReels(campaigns, formattedReels)
        setReelsData(reelsWithAds)
        setLoading(false)
    }

    const formateReels = async (data) => {
        let formattedReels = []
        if (data?.length >= 1) {
            for (const item of data) {
                const postedUser = await getDocumentData(FIRESTORE_COLLECTIONS.USERS, item?.postedBy)
                const formatted = {
                    ...item,
                    profileImage: postedUser?.images?.length >= 1 ? postedUser.images[0].uri : '',
                    username: postedUser?.name,
                    uid: postedUser?.uid,
                }
                formattedReels.push(formatted)
            }
            return formattedReels
        }
    }

    const handleOnPress = (item) => {
        const foundIndex = reelsData?.findIndex(x => x?.documentId === item?.documentId)
        navigation.navigate(SCREEN.REELS, { index: foundIndex })
    }

    const renderReelComp = ({ item, index }) => {
        return (
            <>
                {!item?.businessProfileId &&
                    <ReelCard
                        item={item}
                        onPress={() => handleOnPress(item, index)}
                    />
                }
            </>
        )
    }

    // const fetchUserStreams = async () => {
    //     try {
    //         const followedUsersRef = firestore()
    //             .collection(FIRESTORE_COLLECTIONS.USERS)
    //             .doc(userData.uid)
    //             .collection(FIRESTORE_COLLECTIONS.FOLLOWING)

    //         const followedUsersSnapshot = await followedUsersRef.get()
    //         const followedUserIds = followedUsersSnapshot.docs.map(doc => doc.id)

    //         if (followedUserIds.length === 0) {
    //             setStories([])
    //             return
    //         }

    //         let data = []

    //         await Promise.all(
    //             followedUserIds.map(async (userId) => {
    //                 const querySnapshot = await firestore()
    //                     .collection(FIRESTORE_COLLECTIONS.LIVE_STREAMS)
    //                     .where('hostId', '==', userId)
    //                     .where('isActive', '==', true)
    //                     .get()

    //                 // const userDoc = await firestore()
    //                 //     .collection(FIRESTORE_COLLECTIONS.USERS)
    //                 //     .doc(userId)
    //                 //     .get()

    //                 // const hostData = userDoc.exists ? userDoc.data() : null

    //                 querySnapshot.forEach(doc => {
    //                     // data.push({ ...doc.data(), host: hostData })
    //                     data.push({ ...doc.data() })
    //                 })
    //             })
    //         )

    //         setStreams(data)

    //     } catch (error) {
    //         console.error('Error fetching user streams:', error)
    //         throw error
    //     }
    // }

    return (
        <SafeAreaView style={Styles.mainScreen}>

            <View style={Styles.headerArea}>
                <Text style={Styles.headerText}>{t('relations')}</Text>
                <TouchableOpacity
                    style={Styles.headerBtn}
                    onPress={() => navigation.navigate(SCREEN.EXPLORE)}
                >
                    <FontAwesome style={{ opacity: .6 }} name={'search'} size={20} color={colors.title} />
                </TouchableOpacity>
            </View>

            <StoriesSection loading={uploadLoader} onAddPress={() => selectImage()} />
            {/* <StreamSection /> */}

            <View style={Styles.headingContainer}>
                <Text style={Styles.heading}>{t('reels')}</Text>
                <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate(SCREEN.UPLOAD_MEDIA)}>
                    <FeatherIcon name={'plus'} color={colors.text} size={20} />
                </TouchableOpacity>
            </View>

            {loading ?
                <View style={Styles.loader}>
                    <ActivityIndicator size={'small'} color={COLORS.primary} />
                </View>
                :
                <View style={Styles.reelsWrapper}>
                    {reelsData?.length === 0
                        ?
                        <View style={Styles.loader}>
                            <Text style={Styles.emptyText}>{t('noReelsFound')}</Text>
                        </View>
                        :
                        <FlatList
                            data={reelsData?.filter(item => !item?.businessProfileId)}
                            numColumns={3}
                            renderItem={renderReelComp}
                            keyExtractor={(item) => item?.documentId}
                        />
                    }
                </View>
            }

        </SafeAreaView>
    )
}

export default Relation

const styles = (colors) => StyleSheet.create({
    mainScreen: {
        flex: 1,
        backgroundColor: colors.background,
        marginBottom: 60,
    },
    headingContainer: {
        flexDirection: 'row',
        marginHorizontal: 15,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 3,
    },
    heading: {
        ...FONTS.h6,
        color: colors.title,
        marginTop: 5,
        marginBottom: 5,
    },
    headerArea: {
        flexDirection: 'row',
        paddingVertical: 10,
        alignItems: 'center',
        borderBottomWidth: 1,
        paddingHorizontal: 15,
        justifyContent: 'space-between',
        borderColor: colors.borderColor,
    },
    headerText: { ...FONTS.h5, color: colors.title, },
    headerBtn: { ...GlobalStyleSheet.headerBtn, borderColor: colors.borderColor, },
    filterStyle: {
        height: 22,
        width: 22,
        tintColor: colors.title,
    },
    reelsWrapper: { flex: 1 },
    emptyText: { ...FONTS.fontMedium, fontSize: 15, color: colors.text },
    loader: {
        flex: 1,
        paddingBottom: '12%',
        alignItems: 'center',
        justifyContent: 'center',
    },
})