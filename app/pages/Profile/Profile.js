import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { isIOS } from '../../utils/helpers'
import { SCREEN } from '../../constants/enums'
import DropShadow from 'react-native-drop-shadow'
import * as Progress from 'react-native-progress'
import { useTheme } from '@react-navigation/native'
import FeatherIcon from 'react-native-vector-icons/Feather'
import { GlobalStyleSheet } from '../../constants/StyleSheet'
import { COLORS, FONTS, IMAGES } from '../../constants/theme'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { useAuth, useLanguage, usePurchase } from '../../contexts'
import { FeaturedButton, SubscriptionCard, VerifiedBadge } from '../components'

// const SubscriptionData = [
//     {
//         title: `PREMIUM - \nUNLIMITED`, price: '96.00', timePeriod: 'month',
//         features: [
//             { text: 'See who likes you, Unlimited Messages', isAvailable: true },
//             { text: 'Message Before matching', isAvailable: true },
//             { text: '25 Super likes per month', isAvailable: true },
//             { text: 'Priority likes', isAvailable: true },
//             { text: 'Hide adds', isAvailable: true },
//         ],
//     },
//     {
//         title: `PREMIUM - \nPRO`, price: '48.00', timePeriod: 'month',
//         features: [
//             { text: 'See who likes you, Unlimited Messages', isAvailable: true },
//             { text: 'Message Before matching', isAvailable: true },
//             { text: '15 Super likes per month', isAvailable: true },
//             { text: 'Priority likes', isAvailable: true },
//             { text: 'Hide adds', isAvailable: false },
//         ],
//     },
//     {
//         title: `BOOST - \nSTANDARD`, price: '24.00', timePeriod: 'month',
//         features: [
//             { text: 'See who likes you', isAvailable: true },
//             { text: 'Unlimited Messages', isAvailable: true },
//             { text: '10 Super likes per month', isAvailable: true },
//             { text: 'Priority likes', isAvailable: false },
//             { text: 'Hide adds', isAvailable: false },
//         ],
//     },
//     {
//         title: `BOOST - \nBASIC`, price: '12.00', timePeriod: 'month',
//         features: [
//             { text: 'See who likes you', isAvailable: true },
//             { text: 'Unlimited Messages', isAvailable: true },
//             { text: 'Message Before matching', isAvailable: false },
//             { text: 'Priority likes', isAvailable: false },
//             { text: 'Hide adds', isAvailable: false },
//         ],
//     },
// ]

// const Features = [
//     "Unlimited likes",
//     "Beeline",
//     "Advanced filters",
//     "Incognito mode",
//     "Travel mode",
//     "5 SuperSwipes a week",
//     "1 Spotlight a week",
//     "Unlimited Extends",
//     "Unlimited Rematch",
//     "Unlimited Backtrack",
// ]

const Profile = ({ navigation }) => {
    const { t } = useLanguage()
    const { colors } = useTheme()
    const Styles = styles(colors)
    const { userData, getProfileStatus } = useAuth()
    const { packages, handleSpotlight } = usePurchase()
    const completenessPercentage = getProfileStatus(userData) || 0

    const calculateRemainingLikes = () => {
        let count = 0
        if (userData?.subscription?.packageId == 'pro') {
            count = 15 - userData?.subscription?.superLikesUsed
        } else if (userData?.subscription == 'standard') {
            count = 10 - userData?.subscription?.superLikesUsed
        } else if (userData?.subscription == 'unlimited') {
            count = 25 - userData?.subscription?.superLikesUsed
        } else {
            count = 0
        }
        return `${count} left`
    }

    const userColorPrimary = (userData?.profileColors && userData?.profileColors[0]) || COLORS.primary

    const moveToFollow = (type, count) => {
        if (count === 0) {
            return
        }

        navigation.navigate(SCREEN.FOLLOWING, { userId: userData?.uid, isFollowing: type })
    }

    return (
        <SafeAreaView style={Styles.mainScreen}>
            <ScrollView>
                <DropShadow style={Styles.shadowWrap}>
                    <View style={Styles.profileArea}>
                        <View style={Styles.headerArea}>
                            <Text style={Styles.titleStyle}>{t('profile')}</Text>
                            <TouchableOpacity
                                style={Styles.headerBtn}
                                onPress={() => navigation.navigate(SCREEN.FILTER)}
                            >
                                <Image source={IMAGES.filter} style={Styles.filterImage} />
                            </TouchableOpacity>
                        </View>
                        <View style={Styles.profileOptions}>
                            <TouchableOpacity
                                style={[Styles.actionBtn, { backgroundColor: COLORS.primayLight }]}
                                onPress={() => navigation.navigate(SCREEN.SETTINGS)}
                            >
                                <FontAwesome5 color={COLORS.primary} size={22} name={'cog'} />
                            </TouchableOpacity>
                            <View style={Styles.center}>
                                <View style={Styles.progressRotate}>
                                    <Progress.Circle
                                        borderWidth={0}
                                        unfilledColor={COLORS.borderColor}
                                        color={userColorPrimary}
                                        progress={completenessPercentage / 100}
                                        size={130}
                                        thickness={5}
                                        strokeCap={'round'}
                                    />
                                </View>
                                <Image source={userData?.images[0]?.uri && { uri: userData?.images[0]?.uri }} style={Styles.imageStyle} />
                                <View style={[Styles.profileProgress, { backgroundColor: userColorPrimary }]}>
                                    <Text style={Styles.progressText}>{`${completenessPercentage}%`}</Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                style={[Styles.actionBtn, { backgroundColor: COLORS.primayLight }]}
                                onPress={() => navigation.navigate(SCREEN.EDIT_PROFILE)}
                            >
                                <FontAwesome5 color={COLORS.primary} size={20} name={'pencil-alt'} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={Styles.bigTextBold}>{`${userData?.name || "TAS User"} , ${userData?.age}`}</Text>
                                {userData?.verified?.isActive && <VerifiedBadge style={{ marginTop: -4 }} />}
                            </View>
                            {userData?.location?.city && userData?.location?.country &&
                                <View style={Styles.row}>
                                    <FeatherIcon color={colors.text} size={13} style={Styles.mapIconStyle} name='map-pin' />
                                    <Text style={Styles.subText}>{userData?.location?.city} , {userData?.location?.country}</Text>
                                </View>
                            }
                        </View>

                        <View style={Styles.countView}>
                            <TouchableOpacity activeOpacity={0.8} style={Styles.countTab} onPress={() => moveToFollow(false, userData?.followersCount || 0)}>
                                <Text style={Styles.keyText}>{t('followers')}</Text>
                                <Text style={Styles.valueText}>{userData?.followersCount || '0'}</Text>
                            </TouchableOpacity>
                            <View style={Styles.verticalLine} />
                            <TouchableOpacity activeOpacity={0.8} style={Styles.countTab} onPress={() => moveToFollow(true, userData?.followingCount || 0)}>
                                <Text style={Styles.keyText}>{t('following')}</Text>
                                <Text style={Styles.valueText}>{userData?.followingCount || '0'}</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </DropShadow>

                <View style={GlobalStyleSheet.container}>
                    <View style={Styles.featuresContainer}>
                        <FeaturedButton
                            title={t('spotlight')}
                            image={IMAGES.sparkle}
                            subHeading={'from $12'}
                            // onPress={() => navigation.navigate(SCREEN.SPOTLIGHTS)}
                            onPress={() => handleSpotlight()}
                        />
                        <FeaturedButton
                            title={t('superLikes')}
                            image={IMAGES.star}
                            subHeading={calculateRemainingLikes()}
                            onPress={() => Alert.alert("Super Likes", "This is your remaining super likes")}
                        />
                        {userData?.isBusinessProfile &&
                            <FeaturedButton
                                title={t('businessCampaigns')}
                                image={IMAGES.briefcase}
                                containerStyle={Styles.customFeature}
                                onPress={() => navigation.navigate(SCREEN.CAMPAIGNS)}
                            />
                        }
                    </View>
                </View>

                <ScrollView
                    horizontal
                    bounces={false}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={Styles.subscriptionContainer}
                >
                    {packages?.length > 0 && (
                        packages.map((item, index) => <SubscriptionCard item={item} key={index} />)
                    )}
                </ScrollView>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = (colors) => StyleSheet.create({
    mainScreen: { flex: 1, backgroundColor: colors.background, },
    shadowWrap: {
        shadowColor: "#000",
        shadowOffset: {
            width: 4,
            height: 4,
        },
        shadowOpacity: .15,
        shadowRadius: 5,
        backgroundColor: isIOS() && colors.cardBg,
    },
    profileArea: {
        paddingBottom: 40,
        paddingHorizontal: 15,
        backgroundColor: colors.cardBg,
    },
    titleStyle: { ...FONTS.h5, color: colors.title },
    headerBtn: {
        ...GlobalStyleSheet.headerBtn,
        borderColor: colors.borderColor,
    },
    filterImage: {
        height: 22,
        width: 22,
        tintColor: colors.title,
    },
    profileOptions: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginBottom: 25,
    },
    center: { alignItems: 'center', justifyContent: 'center', },
    imageStyle: {
        height: 120,
        width: 120,
        borderRadius: 100,
        position: 'absolute',
    },
    progressRotate: { transform: [{ rotate: '180deg' }] },
    bigTextBold: { ...FONTS.h4, color: colors.title, lineHeight: 22 },
    subText: { ...FONTS.font, color: colors.text },
    row: { flexDirection: 'row', alignItems: 'center' },
    mapIconStyle: { marginRight: 5, top: 1, },
    headerArea: {
        flexDirection: 'row',
        paddingTop: 15,
        paddingBottom: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    actionBtn: {
        height: 50,
        width: 50,
        borderRadius: 50,
        backgroundColor: COLORS.primayLight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileProgress: {
        position: 'absolute',
        bottom: -10,
        backgroundColor: COLORS.primary,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: colors.cardBg,
    },
    progressText: { ...FONTS.font, ...FONTS.fontBold, color: COLORS.white, },
    subscriptionContainer: {
        paddingLeft: 15,
        paddingTop: 15,
        paddingBottom: 90,
    },
    featuresContainer: {
        ...GlobalStyleSheet.row,
        flexWrap: 'wrap', rowGap: 10,
        justifyContent: 'center',
    },
    customFeature: {
        width: 'auto',
        paddingHorizontal: 5,
    },

    countView: {
        width: '70%',
        marginVertical: 7,
        flexDirection: 'row',
        alignSelf: 'center',
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
})

export default Profile