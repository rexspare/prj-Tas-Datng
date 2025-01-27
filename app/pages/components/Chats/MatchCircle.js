import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native'
import React, { memo } from 'react'
import { useAuth } from '../../../contexts'
import { FONTS } from '../../../constants/theme'
import { SCREEN } from '../../../constants/enums'
import { textLimit } from '../../../utils/helpers'
import { useNavigation, useTheme } from '@react-navigation/native'

const MatchCircle = ({ item }) => {
    const { colors } = useTheme()
    const Styles = styles(colors)
    const { userData } = useAuth()
    const navigation = useNavigation()

    const handleNavigation = () => {
        const currentUserStr = userData?.uid.toString()
        const otherUserStr = item?.uid?.toString()
        const sortedUserIds = [currentUserStr, otherUserStr].sort()
        const chatId = sortedUserIds.join('_')
        const profileImage = item?.images?.length >= 1 ? item?.images[0]?.uri : ''
        const formattedUser = { ...item, profileImage }
        navigation.navigate(SCREEN.SINGLE_CHAT, { chatId: chatId, userDetail: formattedUser })
    }

    if (item?.loading) {
        return <View style={Styles.loadContainer} />
    }

    return (
        <TouchableOpacity onPress={handleNavigation} style={Styles.container}>
            <Image source={{ uri: item?.images?.length >= 1 ? item?.images[0]?.uri : '' }} style={Styles.image} />
            <Text style={Styles.text}>{textLimit(item?.name, 9)}</Text>
        </TouchableOpacity>
    )
}

export default memo(MatchCircle)

const styles = (colors) => StyleSheet.create({
    container: {
        alignItems: 'center',
        marginRight: 18,
    },
    image: {
        height: 60,
        width: 60,
        borderRadius: 60,
    },
    text: { ...FONTS.fontSm, ...FONTS.fontBold, color: colors.title, marginTop: 3, },
    loadContainer: {
        marginRight: 18,
        height: 60,
        width: 60,
        borderRadius: 60,
        backgroundColor: colors.borderColor,
    },
})