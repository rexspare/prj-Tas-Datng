import { StyleSheet, View, Text, Image, SafeAreaView, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../../layout/Header'
import { useTheme } from '@react-navigation/native'
import { GradientBtn, ReelCard } from '../components'
import { COLORS, FONTS } from '../../constants/theme'
import firestore from '@react-native-firebase/firestore'
import LinearGradient from 'react-native-linear-gradient'
import FeatherIcon from 'react-native-vector-icons/Feather'
import { mergeCampaignsAndReels } from '../../utils/helpers'
import { useApp, useAuth, useLanguage } from '../../contexts'
import { FIRESTORE_COLLECTIONS, SCREEN } from '../../constants/enums'
import { getCollectionDataWhere, getDocumentData } from '../../services'

const ReelsList = ({ route, navigation }) => {
    const userId = route?.params?.userId
    const { t } = useLanguage()
    const { colors } = useTheme()
    const Styles = styles(colors)
    const { userData } = useAuth()
    const [user, setUser] = useState({})
    const [reels, setReels] = useState([])
    const [loading, setLoading] = useState(true)
    const [isFollowed, setIsFollowed] = useState(false)
    const { followUser, isUserFollowing, unfollowUser, campaigns } = useApp()

    useEffect(() => {
        const fetchData = async () => {
            await getUser()
            await getFollowStatus()
            await getUserReels()
        }
        fetchData()
    }, [userId])

    const getUser = async () => {
        const fetchedUser = await getDocumentData(FIRESTORE_COLLECTIONS.USERS, userId)
        if (fetchedUser) {
            setUser(fetchedUser)
        }
    }

    const getFollowStatus = async () => {
        const followStatus = await isUserFollowing(userId)
        setIsFollowed(followStatus)
    }

    const getUserReels = async () => {
        setLoading(true)
        const reelsData = await getCollectionDataWhere(FIRESTORE_COLLECTIONS.REELS, 'postedBy', userId)
        if (reelsData?.length === 0) {
            setReels([])
            setLoading(false)
            return
        }

        const reelsWithAds = mergeCampaignsAndReels(campaigns, reelsData)
        setReels(reelsWithAds)
        setLoading(false)
    }

    const navigateToReels = (index) => {
        const formattedReels = reels?.map((item) => ({
            ...item,
            profileImage: user?.images?.length >= 1 ? user.images[0]?.uri : '',
            username: user?.name,
            uid: user?.uid,
        }))

        navigation.navigate(SCREEN.REELS, { index, data: formattedReels })
    }

    const renderReelComp = ({ item, index }) => (
        <ReelCard
            item={item}
            onPress={() => navigateToReels(index)}
        />
    )

    const toggleFollow = async () => {
        if (isFollowed) {
            await unfollowUser(userData?.uid, user?.uid)
            setIsFollowed(false)
            const prevCount = user?.followersCount | 0
            setUser({ ...user, followersCount: prevCount - 1 })
        } else {
            await followUser(userData?.uid, user?.uid)
            setIsFollowed(true)
            const prevCount = user?.followersCount | 0
            setUser({ ...user, followersCount: prevCount + 1 })
        }
    }

    const isNotCurrentUser = userData?.uid !== user?.uid

    const currentTimestamp = firestore.Timestamp.now()

    const isStoryActive = user?.story && user?.story?.expiresAt > currentTimestamp

    const userColors = isStoryActive ? user?.profileColors || [COLORS.primary, COLORS.primary3] : COLORS.transparentGradient


    const renderEmptyComponent = () => (
        <View style={Styles.loader}>
            <Text style={Styles.emptyText}>{t('noReelsFound')}</Text>
        </View>
    )

    const moveToFollow = (type, count) => {
        if (count === 0) {
            return
        }

        navigation.navigate(SCREEN.FOLLOWING, { userId: user?.uid, isFollowing: type })
    }

    return (
        <SafeAreaView style={Styles.mainScreen}>
            <View style={Styles.mainScreen}>
                <Header
                    titleLeft
                    borderNone
                    title={t('relations')}
                    leftIcon={'back'}
                />
                {user?.uid &&
                    <View style={Styles.profileArea}>
                        <LinearGradient
                            colors={userColors}
                            style={Styles.gradientBorder}
                        >
                            <Image
                                source={{ uri: user?.images?.length >= 1 ? user?.images[0]?.uri : '' }}
                                style={Styles.imageStyle}
                            />
                        </LinearGradient>
                        <Text style={Styles.bigTextBold}>{`${user?.name || "TAS User"} , ${user?.age}`}</Text>
                        <View style={Styles.row}>
                            <FeatherIcon color={colors.text} size={13} style={Styles.mapIconStyle} name='map-pin' />
                            <Text style={Styles.subText}>{user?.location?.city} , {user?.location?.country}</Text>
                        </View>
                        <View style={Styles.countView}>
                            <TouchableOpacity activeOpacity={0.8} style={Styles.countTab} onPress={() => moveToFollow(false, user?.followersCount || 0)}>
                                <Text style={Styles.keyText}>{t('followers')}</Text>
                                <Text style={Styles.valueText}>{user?.followersCount || '0'}</Text>
                            </TouchableOpacity>
                            <View style={Styles.verticalLine} />
                            <TouchableOpacity activeOpacity={0.8} style={Styles.countTab} onPress={() => moveToFollow(false, user?.followingCount || 0)}>
                                <Text style={Styles.keyText}>{t('following')}</Text>
                                <Text style={Styles.valueText}>{user?.followingCount || '0'}</Text>
                            </TouchableOpacity>
                        </View>
                        {(isNotCurrentUser && !loading) &&
                            <View style={Styles.buttonContainer}>
                                <GradientBtn
                                    title={isFollowed ? t('following') : t('follow')}
                                    style={Styles.followButton}
                                    textStyle={Styles.followText}
                                    onPress={toggleFollow}
                                />
                            </View>
                        }
                    </View>
                }
                {loading ?
                    <View style={Styles.loader}>
                        <ActivityIndicator size={'small'} color={COLORS.primary} />
                    </View>
                    :
                    <View style={Styles.reelsWrapper}>
                        {/* {reels?.length === 0
                            ?
                            <View style={Styles.loader}>
                                <Text style={Styles.emptyText}>{t('noReelsFound')}</Text>
                            </View>
                            : */}
                        <FlatList
                            // data={reels}
                            data={reels?.filter(item => !item?.businessProfileId)}
                            numColumns={3}
                            renderItem={renderReelComp}
                            ListEmptyComponent={renderEmptyComponent}
                            keyExtractor={(_, index) => index.toString()}
                            contentContainerStyle={reels?.length === 0 && { flex: 1 }}
                        />
                        {/* } */}
                    </View>
                }
            </View>
        </SafeAreaView>
    )
}

export default ReelsList

const styles = (colors) => StyleSheet.create({
    mainScreen: { flex: 1, backgroundColor: colors.background },
    profileArea: {
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 30,
        borderBottomWidth: 1,
        justifyContent: 'center',
        backgroundColor: colors.cardBg,
        borderBlockColor: colors.borderColor,
    },
    reelsWrapper: { flex: 1 },
    // reelContainer: {
    //     height: 180,
    //     width: '33%',
    //     marginHorizontal: 0.7,
    //     marginVertical: 0.7,
    //     backgroundColor: COLORS.light,
    // },
    // reel: {
    //     height: '100%',
    //     width: '100%',
    // },
    // playIcon: {
    //     position: 'absolute',
    //     bottom: 10,
    //     left: '4%',
    // },
    loader: {
        flex: 1,
        paddingBottom: '12%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    gradientBorder: {
        height: 120,
        width: 120,
        borderRadius: 100,
        marginBottom: 10,
        padding: 5,
        backgroundColor: colors.background,
    },
    imageStyle: {
        height: '100%',
        width: '100%',
        borderRadius: 100,
    },
    bigTextBold: { ...FONTS.h4, color: colors.title, lineHeight: 22 },
    subText: { ...FONTS.font, color: colors.text },
    row: { flexDirection: 'row', alignItems: 'center' },
    mapIconStyle: { marginRight: 5, top: 1 },
    emptyText: { ...FONTS.fontMedium, fontSize: 15, color: colors.text },
    buttonContainer: {
        marginVertical: 8,
    },
    followButton: {
        height: 40, width: 150, justifyContent: 'center', paddingTop: 1, paddingBottom: 0,
    },
    followText: { fontSize: 16 },
    countView: {
        width: '70%',
        marginVertical: 7,
        flexDirection: 'row',
    },
    verticalLine: {
        height: '100%',
        width: 1.2,
        backgroundColor: colors.textLight,
    },
    countTab: {
        width: '50%',
        alignItems: 'center',
    },
    keyText: { ...FONTS.fontPoppins, color: colors.text },
    valueText: { ...FONTS.fontLg, ...FONTS.h6, color: colors.text },
}) 
