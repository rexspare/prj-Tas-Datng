import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { VerifiedBadge } from '../components'
import { SCREEN } from '../../constants/enums'
import { useTheme } from '@react-navigation/native'
import { useApp, useLanguage } from '../../contexts'
import LinearGradient from 'react-native-linear-gradient'
import { COLORS, FONTS, IMAGES } from '../../constants/theme'
import { GlobalStyleSheet } from '../../constants/StyleSheet'

const Likes = ({ navigation }) => {
    const { t } = useLanguage()
    const { colors } = useTheme()
    const Styles = styles(colors)
    const { yourLikes } = useApp()
    return (
        <SafeAreaView style={Styles.mainScreen}>

            <View style={Styles.headerArea}>
                <Text style={Styles.headerText}>{t('likedYou')}</Text>
                <TouchableOpacity
                    style={Styles.headerBtn}
                    onPress={() => navigation.navigate(SCREEN.FILTER)}
                >
                    <Image source={IMAGES.filter} style={Styles.filterStyle} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={Styles.scrollStyle}>
                <View style={GlobalStyleSheet.container}>
                    <View style={GlobalStyleSheet.row}>
                        {yourLikes?.length >= 1 ? yourLikes?.map((item, index) => {
                            return (
                                <View style={Styles.itemContainer} key={index}>
                                    <TouchableOpacity onPress={() => navigation.navigate(SCREEN.PROFILE_DETAILS, { item })}>
                                        <Image source={{ uri: item?.images[0]?.uri }} style={Styles.itemImage} />
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
                            :
                            <Text style={Styles.emptyMessage}>{t('noLikesFound')}</Text>
                        }
                    </View>
                </View>
            </ScrollView>

        </SafeAreaView>
    )
}

export default Likes

const styles = (colors) => StyleSheet.create({
    mainScreen: { flex: 1, backgroundColor: colors.background, },
    headerArea: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: colors.borderColor,
    },
    headerText: { ...FONTS.h5, color: colors.title, },
    headerBtn: { ...GlobalStyleSheet.headerBtn, borderColor: colors.borderColor, },
    filterStyle: {
        height: 22,
        width: 22,
        tintColor: colors.title,
    },
    scrollStyle: { paddingBottom: 80, },
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
