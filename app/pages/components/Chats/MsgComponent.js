import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { memo } from 'react'
import FastImage from 'react-native-fast-image'
import { SCREEN } from '../../../constants/enums'
import { calculateTime } from '../../../utils/helpers'
import { COLORS, FONTS } from '../../../constants/theme'
import { useNavigation, useTheme } from '@react-navigation/native'

const MsgComponent = ({ item, isSender, onLongPress }) => {
    const { colors } = useTheme()
    const theme = useTheme()
    const Styles = styles(colors, theme)
    const { navigate } = useNavigation()

    const formattedTime = item?.timestamp ? calculateTime(item?.timestamp) : ''

    const openReel = () => {
        navigate(SCREEN.REELS, { index: 0, data: [item?.video] })
    }

    return (
        <View style={[Styles.container, isSender && Styles.senderStyle]}>

            {item?.video &&
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => openReel()}
                    onLongPress={() => onLongPress()}
                >
                    <FastImage
                        style={[Styles.imageStyle]}
                        source={{ uri: item?.video?.videoUrl?.uri }}
                    />
                </TouchableOpacity>
            }

            {item?.message &&
                <TouchableOpacity activeOpacity={1} onLongPress={() => onLongPress()} style={[Styles.box, isSender && Styles.senderBox]}>
                    <Text style={[Styles.text, isSender && Styles.senderText]}>{item?.message}</Text>
                </TouchableOpacity>
            }
            <Text style={Styles.timeText}>{formattedTime}</Text>
        </View>
    )
}

export default memo(MsgComponent)

const styles = (colors, theme) => StyleSheet.create({
    container: {
        alignItems: 'flex-start',
        marginRight: '25%',
        marginBottom: 15,
    },
    senderStyle: {
        alignItems: 'flex-end',
        marginLeft: '25%',
        marginRight: 0,
    },
    imageStyle: {
        height: 180,
        width: 165,
        marginBottom: 8,
        borderRadius: 15,
        backgroundColor: 'lightgrey',
    },
    box: {
        backgroundColor: theme.dark ? colors.background : "#eee",
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        marginBottom: 6,
    },
    senderBox: { backgroundColor: COLORS.primary, },
    text: {
        ...FONTS.font,
        ...FONTS.fontMedium,
        color: colors.title,
    },
    senderText: { color: COLORS.white, },
    timeText: { ...FONTS.fontXs, color: colors.textLight, },
})