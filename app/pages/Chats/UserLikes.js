import { FlatList, StyleSheet, Image, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useApp } from '../../contexts'
import Header from '../../layout/Header'
import { SCREEN } from '../../constants/enums'
import { useTheme } from '@react-navigation/native'
import { COLORS, FONTS } from '../../constants/theme'

const UserLikes = ({ navigation }) => {
    const { yourLikes } = useApp()
    const { colors } = useTheme()
    const Styles = styles(colors)

    const handleNavigation = (item) => {
        navigation.navigate(SCREEN.PROFILE_DETAILS, { item })
    }

    const LikesView = ({ item }) => (
        <TouchableOpacity style={Styles.container} onPress={() => handleNavigation(item)}>
            <View style={Styles.imageContainer}>
                <Image source={{ uri: item?.images[0]?.uri }} style={Styles.image} />
            </View>

            <View style={Styles.centerContent}>
                <Text style={Styles.heading}>{item?.name}</Text>
                <Text numberOfLines={1} style={Styles.messageText}>{item?.about}</Text>
            </View>
        </TouchableOpacity>
    )

    return (
        <View style={Styles.mainScreen}>

            <Header
                leftIcon={'back'}
                title={t('likeTitle')}
                titleLeft
            />

            <FlatList
                data={yourLikes}
                keyExtractor={(item) => item?.uid}
                renderItem={({ item }) => <LikesView item={item} />}
            />

        </View>
    )
}

export default UserLikes

const styles = (colors) => StyleSheet.create({
    mainScreen: { flex: 1, backgroundColor: colors.background, },
    heading: { ...FONTS.h6, color: colors.title, },
    emptyMessage: { ...FONTS.fontMedium, textAlign: 'center', color: colors.title, },

    container: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    activeDot: {
        height: 16,
        width: 16,
        borderRadius: 9,
        backgroundColor: COLORS.success,
        position: 'absolute',
        zIndex: 1,
        bottom: -2,
        left: 1,
        borderWidth: 2,
        borderColor: colors.cardBg,

    },
    image: {
        height: 55,
        width: 55,
        borderRadius: 60,
        marginRight: 12,
    },
    centerContent: {
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderColor: colors.borderColor,
        flex: 1,
        paddingRight: 15,
    },
    row: { flexDirection: 'row', alignItems: 'center', },
    unReadDot: {
        height: 8,
        width: 8,
        borderRadius: 5,
        marginRight: 6,
        marginBottom: 3,
        backgroundColor: COLORS.primary,
    },
    messageText: { ...FONTS.font, color: colors.text, },
    dateText: { ...FONTS.fontXs, color: colors.text, marginBottom: 8, },
    flexEnd: { alignItems: 'flex-end', },
    sentTick: {
        height: 18,
        width: 18,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#BBB6D0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    seenTick: {
        backgroundColor: COLORS.primayLight,
        borderColor: COLORS.primayLight,
    },
})