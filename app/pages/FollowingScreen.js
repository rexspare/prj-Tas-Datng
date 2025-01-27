import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../layout/Header'
import { useLanguage } from '../contexts'
import { VerifiedBadge } from './components'
import { useTheme } from '@react-navigation/native'
import LinearGradient from 'react-native-linear-gradient'
import { COLORS, FONTS, SIZES } from '../constants/theme'
import { GlobalStyleSheet } from '../constants/StyleSheet'
import { FIRESTORE_COLLECTIONS, SCREEN } from '../constants/enums'
import { getDocumentData, getSubCollectionData } from '../services'

const FollowingScreen = ({ route, navigation }) => {
    const { t } = useLanguage()
    const { colors } = useTheme()
    const Styles = styles(colors)
    const userId = route?.params?.userId
    const isFollowing = route?.params?.isFollowing
    const [followupData, setFollowupData] = useState([])

    useEffect(() => {
        fetchFollowData()
    }, [])

    const fetchFollowData = async () => {

        const subCollection = isFollowing ? FIRESTORE_COLLECTIONS.FOLLOWING : FIRESTORE_COLLECTIONS.FOLLOWERS
        const followData = await getSubCollectionData(FIRESTORE_COLLECTIONS.USERS, userId, subCollection)

        let formattedData = []

        for (const item of followData) {
            const userInfo = await getDocumentData(FIRESTORE_COLLECTIONS.USERS, isFollowing ? item?.followingId : item?.followerId)

            formattedData.push(userInfo)
        }
        setFollowupData(formattedData)

    }

    return (
        <SafeAreaView style={Styles.mainScreen}>
            <Header
                titleLeft
                leftIcon={'back'}
                title={isFollowing ? t('following') : t('followers')}
            />
            <ScrollView>
                <View style={GlobalStyleSheet.container}>

                    <View style={GlobalStyleSheet.row}>
                        {followupData?.map((item, index) => {
                            return (
                                <View style={Styles.itemContainer} key={index}>
                                    <TouchableOpacity onPress={() => navigation.navigate(SCREEN.PROFILE_DETAILS, { item })}>
                                        {item?.images?.length >= 1 && <Image source={{ uri: item?.images[0]?.uri }} style={Styles.itemImage} />}
                                        <LinearGradient colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,.7)']} style={Styles.gradientStyle}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={Styles.whiteTitle}>{item?.name}</Text>
                                                {item?.verified?.isActive && <VerifiedBadge />}
                                            </View>
                                            <Text style={Styles.whiteText} numberOfLines={1}>{item?.about}</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>
                            )
                        })
                        }
                    </View>

                </View>

            </ScrollView>

        </SafeAreaView>
    )
}

export default FollowingScreen

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



    itemContainer: { ...GlobalStyleSheet.col50, marginBottom: 10 },
    itemImage: {
        width: '100%',
        height: 220,
        borderRadius: 10,
    },
    gradientStyle: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        top: 0,
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 15,
        justifyContent: 'flex-end',
    },
    whiteTitle: { ...FONTS.h6, color: COLORS.white, },
    whiteText: { ...FONTS.font, color: COLORS.white, opacity: .75, },
    emptyMessage: { ...FONTS.fontMedium, textAlign: 'center', color: colors.title, },
})