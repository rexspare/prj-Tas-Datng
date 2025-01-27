import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import React, { memo } from 'react'
import { useLanguage } from '../../contexts'
import { textLimit } from '../../utils/helpers'
import FastImage from 'react-native-fast-image'
import { useTheme } from '@react-navigation/native'
import { COLORS, FONTS } from '../../constants/theme'
import LinearGradient from 'react-native-linear-gradient'

const StoriesCircle = ({ item, isMyStory, onPress }) => {
    const { t } = useLanguage()
    const { colors } = useTheme()
    const Styles = styles(colors)

    const userColors = item?.profileColors || [COLORS.primary, COLORS.primary3]

    if (item?.loading) {
        return <View style={Styles.loadContainer} />
    }

    return (
        <TouchableOpacity style={Styles.container} activeOpacity={0.7} onPress={onPress}>
            <LinearGradient
                colors={userColors}
                style={Styles.gradientBorder}
            >
                <FastImage
                    source={{ uri: item?.story?.mediaUrl?.uri }}
                    style={Styles.image}
                />
            </LinearGradient>
            <Text style={[Styles.text, { color: colors.title }]}>{isMyStory ? t('myStory') : textLimit(item?.name, 9)}</Text>
        </TouchableOpacity>
    )
}

export default memo(StoriesCircle)

const styles = (colors) => StyleSheet.create({
    container: {
        alignItems: 'center',
        marginRight: 18,
    },
    gradientBorder: {
        height: 60,
        width: 60,
        borderRadius: 60,
        padding: 2.5,
    },
    image: {
        height: '100%',
        width: '100%',
        borderRadius: 60,
        backgroundColor: colors.background,
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