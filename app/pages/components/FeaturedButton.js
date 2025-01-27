import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React, { memo } from 'react'
import { isIOS } from '../../utils/helpers'
import DropShadow from 'react-native-drop-shadow'
import { useTheme } from '@react-navigation/native'
import { COLORS, FONTS } from '../../constants/theme'
import { GlobalStyleSheet } from '../../constants/StyleSheet'

const FeaturedButton = ({ image, title, subHeading, onPress, containerStyle }) => {
    const { colors } = useTheme()
    const Styles = styles(colors)
    return (
        <View style={[GlobalStyleSheet.col50, containerStyle]}>
            <DropShadow style={Styles.shadowWrap}>
                <TouchableOpacity
                    style={Styles.pressable}
                    activeOpacity={onPress ? 0.8 : 1}
                    onPress={() => { onPress && onPress() }}
                >
                    <Image
                        source={image}
                        resizeMode='contain'
                        style={Styles.imageStyle}
                    />
                    <View>
                        <Text style={Styles.title}>{title}</Text>
                        {subHeading && <Text style={Styles.subHeading}>{subHeading}</Text>}
                    </View>
                </TouchableOpacity>
            </DropShadow>
        </View>
    )
}

export default memo(FeaturedButton)

const styles = (colors) => StyleSheet.create({
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
    imageStyle: {
        height: 26,
        width: 26,
        marginRight: 12,
        tintColor: COLORS.primary,
    },
    pressable: {
        minHeight: 67,
        backgroundColor: colors.cardBg,
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: { ...FONTS.font, ...FONTS.fontBold, color: colors.title },
    subHeading: { ...FONTS.font, color: colors.text },
})