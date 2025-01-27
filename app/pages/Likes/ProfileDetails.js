import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { debounce } from 'lodash'
import Header from '../../layout/Header'
import { SCREEN } from '../../constants/enums'
import { showFlash } from '../../utils/helpers'
import { useTheme } from '@react-navigation/native'
import { RoundButton, ReportModal, GradientBtn } from '../components'
import LinearGradient from 'react-native-linear-gradient'
import { COLORS, FONTS, SIZES } from '../../constants/theme'
import { GlobalStyleSheet } from '../../constants/StyleSheet'
import { useAuth, useLanguage, usePurchase } from '../../contexts'
import { FavStar, VerifiedBadge, SpotlightPopup } from '../components'
import { getSuperLikeData, removeSuperLike, superLike } from '../../services'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const ProfileDetails = ({ route, navigation }) => {
    const { t } = useLanguage()
    const { colors } = useTheme()
    const Styles = styles(colors)
    const { item } = route.params
    const reportSheet = useRef()
    const { userData, updateUser } = useAuth()
    const [spotlight, setSpotlight] = useState({})
    const { isSubscriptionExpired } = usePurchase()
    const [isSuperLiked, setIsSuperLike] = useState('')
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        getSuperLikes()
    }, [])

    useEffect(() => {
        if (item?.spotlight?.isActive && item?.spotlight?.animation) {
            setSpotlight(item?.spotlight)
        }
    }, [item?.spotlight])

    async function getSuperLikes() {
        const likesData = await getSuperLikeData(item?.uid)
        if (likesData?.length >= 1) {
            setIsSuperLike(likesData[0]?.documentId)
        } else {
            setIsSuperLike('')
        }
    }

    // function isSubscriptionExpired(subDate) {
    //     var subDateMillis = (subDate?.seconds * 1000) + (subDate?.nanoseconds / 1000000)
    //     var currentDate = new Date().getTime()
    //     // var thirtyDaysInMillis = 30 * 24 * 60 * 60 * 1000
    //     var thirtyDaysInMillis = 365 * 24 * 60 * 60 * 1000
    //     var subscriptionEndDate = subDateMillis + thirtyDaysInMillis
    //     return currentDate > subscriptionEndDate
    // }

    async function toggleSuperLike() {
        let subscription = userData?.subscription
        const canSuperLike = subscription?.packageId == 'unlimited' && subscription?.superLikesUsed < 25
            || subscription?.packageId == 'pro' && subscription?.superLikesUsed < 15
            || subscription?.packageId == 'standard' && subscription?.superLikesUsed < 10

        if (isSuperLiked) {
            await removeSuperLike(isSuperLiked)
            getSuperLikes()
        } else {
            if (!isSubscriptionExpired(subscription?.expiresAt) && canSuperLike) {
                await superLike(item)
                await updateUser({ subscription: { ...userData?.subscription, superLikesUsed: subscription.superLikesUsed + 1 } }, false)
                getSuperLikes()
            } else {
                if (isSubscriptionExpired(subscription?.expiresAt)) {
                    showFlash(t('subscriptionExpiredWarning'))
                } else {
                    showFlash(t('noSuperLikesWarning'))
                }
            }
        }
    }

    const debouncedToggle = useCallback(debounce(toggleSuperLike, 100), [isSuperLiked, item?.uid])

    const sendMessage = () => {
        if (!isSubscriptionExpired(userData?.subscription?.expiresAt)) {
            const currentUserStr = userData?.uid.toString()
            const otherUserStr = item?.uid?.toString()
            const sortedUserIds = [currentUserStr, otherUserStr].sort()
            const chatId = sortedUserIds.join('_')
            const profileImage = item?.images?.length >= 1 ? item?.images[0]?.uri : ''
            const formattedUser = { ...item, profileImage }
            navigation.navigate(SCREEN.SINGLE_CHAT, { chatId: chatId, userDetail: formattedUser })
        } else {
            showFlash(t('subscriptionExpiredWarning'))
        }
    }

    const moveToNextImage = () => {
        if (currentIndex < item?.images?.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const moveToPreviousImage = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const canSendMessage = userData?.subscription?.packageId == 'pro' || userData?.subscription?.packageId == 'unlimited'

    const ListItems = ({ data, emptyTitle = t('noDataFound') }) => (
        <View style={Styles.horizontalWrapper}>
            {data?.length >= 1 ? data?.map((data, index) => (
                <TouchableOpacity key={index} style={Styles.itemStyle}>
                    {/* <FeatherIcon color={colors.textLight} size={14} style={Styles.itemIcon} name={data.icon} /> */}
                    <Text style={Styles.itemText}>{data}</Text>
                </TouchableOpacity>
            ))
                : <Text style={Styles.emptyTitle}>{emptyTitle}</Text>
            }
        </View>
    )

    const openProfile = () => {
        navigation.navigate(SCREEN.REELS_LIST, { userId: item?.uid })
    }

    return (
        <SafeAreaView style={Styles.mainScreen}>
            <Header
                titleLeft
                leftIcon={'back'}
                title={t('recommendation')}
                onRightPress={() => reportSheet.current.open()}
                rightIcon={() => <MaterialCommunityIcons name="alert-circle-outline" size={24} color={'red'} />}
            />
            <ScrollView>
                <View style={GlobalStyleSheet.container}>

                    <View style={Styles.imageContainer}>
                        <Image source={{ uri: item?.images[currentIndex]?.uri }} style={Styles.image} />

                        <RoundButton
                            iconName={'arrowleft'}
                            style={Styles.leftSide}
                            onPress={() => moveToPreviousImage()}
                        />
                        <RoundButton
                            iconName={'arrowright'}
                            style={Styles.rightSide}
                            onPress={() => moveToNextImage()}
                        />

                        <LinearGradient
                            style={Styles.imageShadow}
                            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,.7)']}
                        >
                            <View style={Styles.row}>
                                <View style={{ flex: 1 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={Styles.whiteBold}>{item?.name}</Text>
                                        {item?.isVerified && < VerifiedBadge />}
                                    </View>
                                    <Text style={Styles.whiteSubText} numberOfLines={1}>{item?.about}</Text>
                                </View>
                                <FavStar isLiked={isSuperLiked} onPress={() => debouncedToggle()} />
                            </View>
                        </LinearGradient>
                        {canSendMessage &&
                            <TouchableOpacity activeOpacity={0.8} onPress={sendMessage} style={Styles.messageView}>
                                <MaterialCommunityIcons color={colors.textLight} size={26} name={'message-reply-text'} />
                            </TouchableOpacity>
                        }
                        {item?.isActive &&
                            <View style={Styles.activeView}>
                                <View style={Styles.greenDot} />
                                <Text style={Styles.whiteLight}>{t('recentlyActive')}</Text>
                            </View>
                        }
                    </View>

                    <View style={Styles.contentView}>
                        <Text style={Styles.heading}>{t('basicInformation')}</Text>
                        {item?.bio ?
                            <Text style={Styles.bioText}>{item?.bio}</Text>
                            :
                            <Text style={[Styles.emptyTitle, { marginBottom: 14 }]}>{t('noBioFound')}</Text>
                        }

                        <Text style={Styles.heading}>{t('interests')}</Text>
                        <ListItems data={item?.interests} emptyTitle={t('noInterestsAdded')} />

                        <Text style={Styles.heading}>{t('horoscope')}</Text>
                        {item?.horoscope ?
                            <Text style={Styles.bioText}>{item?.horoscope}</Text>
                            :
                            <Text style={[Styles.emptyTitle, { marginBottom: 14 }]}>{t('noHoroscopeFound')}</Text>
                        }

                        <Text style={Styles.heading}>{t('languages')}</Text>
                        <ListItems data={item?.languages} emptyTitle={t('noLanguagesAdded')} />

                    </View>

                    <GradientBtn title={t('checkoutProfile')} style={Styles.buttonStyle} onPress={openProfile} />

                </View>

            </ScrollView>

            <ReportModal
                sheetRef={reportSheet}
                otherUserId={item?.uid}
            />

            <SpotlightPopup
                spotlight={spotlight}
                closeModal={() => setSpotlight({})}
            />

        </SafeAreaView>
    )
}

export default ProfileDetails

const styles = (colors) => StyleSheet.create({
    mainScreen: {
        flex: 1,
        backgroundColor: colors.cardBg,
    },
    imageContainer: { marginBottom: 15, marginHorizontal: -5, },
    image: {
        width: '100%',
        height: undefined,
        aspectRatio: 1 / 1.3,
        borderRadius: SIZES.radius,
    },
    imageShadow: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        top: 0,
        borderRadius: 10,
        paddingHorizontal: 18,
        paddingVertical: 25,
        justifyContent: 'flex-end',
    },
    row: { flexDirection: 'row', alignItems: 'center', },
    whiteBold: { ...FONTS.h6, color: COLORS.white, },
    whiteSubText: { ...FONTS.font, color: COLORS.white, opacity: .75, },
    messageView: {
        height: 50,
        width: 50,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.white,
        position: 'absolute',
        top: 15,
        right: 15,
    },
    activeView: {
        position: 'absolute',
        top: 15,
        left: 15,
        backgroundColor: 'rgba(0,0,0,.8)',
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 3,
    },
    greenDot: {
        height: 8,
        width: 8,
        backgroundColor: COLORS.success,
        borderRadius: 8,
        marginRight: 6,
    },
    whiteLight: { ...FONTS.fontSm, color: COLORS.white, top: -1, },
    contentView: { paddingHorizontal: 8, },
    horizontalWrapper: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8, },
    itemStyle: {
        backgroundColor: 'rgba(0,0,0,0.03)',
        marginRight: 8,
        marginBottom: 8,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.borderColor,
        borderRadius: 30,
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    itemText: { ...FONTS.font, color: colors.title, top: -1 },
    itemIcon: { marginRight: 6 },
    heading: { ...FONTS.h6, fontSize: 15, color: colors.title, marginTop: 1 },
    bioText: { ...FONTS.font, color: colors.textLight, lineHeight: 18, marginBottom: 14 },
    emptyTitle: {
        ...FONTS.fontMedium,
        color: colors.textLight,
        marginTop: 2,
        marginBottom: 5,
    },
    leftSide: {
        zIndex: 1,
        position: 'absolute',
        left: 20,
        top: '46%',
    },
    rightSide: {
        zIndex: 1,
        position: 'absolute',
        right: 20,
        top: '46%',
    },
    reportButton: {
        position: 'absolute',
        top: 15,
        right: 60, // Adjust according to your layout
        zIndex: 1,
    },
    buttonStyle: {
        marginTop: 10,
        marginBottom: 5,
    },
})