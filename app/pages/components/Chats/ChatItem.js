import { StyleSheet, Text, TouchableOpacity, Image, View } from 'react-native'
import React, { memo } from 'react'
import { SvgXml } from 'react-native-svg'
import { useAuth } from '../../../contexts'
import { SCREEN } from '../../../constants/enums'
import { calculateTime } from '../../../utils/helpers'
import { COLORS, FONTS, ICONS } from '../../../constants/theme'
import { useNavigation, useTheme } from '@react-navigation/native'

const ChatItem = ({ item }) => {
    const { colors } = useTheme()
    const Styles = styles(colors)
    const navigation = useNavigation()
    const { userData } = useAuth()

    const handleNavigation = () => {

        const getOtherParticipant = (id) => {
            const participants = id?.split('_')
            return participants.find((participant) => participant !== userData?.uid)
        }
        const formattedUser = { uid: getOtherParticipant(item.id), ...item }
        navigation.navigate(SCREEN.SINGLE_CHAT, { chatId: item?.id, userDetail: formattedUser })
    }

    const isReceiver = userData?.uid !== item?.lastUser
    const messageReceivedSeen = isReceiver && !item?.messageSeen
    const otherUserSeen = isReceiver ? item?.messageSent : item?.messageSeen
    const formattedTime = calculateTime(item?.lastMessageTime)

    if (item?.loading) {
        return (
            <View style={[Styles.container, { marginVertical: 10, }]}>
                <View style={Styles.image} />
                <View style={Styles.loadContainer}>
                    <View style={Styles.loadingContent} />
                    <View style={Styles.loadingContent} />
                    <View style={Styles.loadingContent} />
                </View>
            </View>
        )
    }

    const renderLastMessage = item?.lastMessage || item?.video && 'Sent a reel'

    return (
        <TouchableOpacity onPress={handleNavigation} style={Styles.container}>

            <View style={Styles.imageContainer}>
                {item?.isActive &&
                    <View style={Styles.activeDot} />
                }
                <Image source={{ uri: item?.profileImage }} style={Styles.image} />
            </View>

            <View style={Styles.centerContent}>
                <View style={Styles.row}>
                    {messageReceivedSeen &&
                        <View style={Styles.unReadDot} />
                    }
                    <Text style={Styles.heading}>{item?.name}</Text>
                </View>
                <Text numberOfLines={1} style={Styles.messageText}>{renderLastMessage}</Text>
            </View>

            <View style={Styles.flexEnd}>
                <Text style={Styles.dateText}>{formattedTime}</Text>
                {item?.messageSent &&
                    <View style={[Styles.sentTick, otherUserSeen && Styles.seenTick]}>
                        <SvgXml height={12} width={12} stroke={otherUserSeen ? COLORS.primary : '#BBB6D0'} xml={ICONS.check} />
                    </View>
                }
            </View>

        </TouchableOpacity>
    )
}

export default memo(ChatItem)

const styles = (colors) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        alignItems: 'center',
    },
    imageContainer: { marginRight: 12, },
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
        backgroundColor: colors.borderColor,
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
    heading: { ...FONTS.fontBold, color: COLORS.title },
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

    loadContainer: {
        flex: 1, marginHorizontal: '5%',
    },

    loadingContent: {
        flex: 1,
        width: '100%',
        marginVertical: 5,
        backgroundColor: colors.borderColor,
    },
})