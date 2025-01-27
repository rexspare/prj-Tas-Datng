import { StyleSheet, Image, TouchableOpacity } from 'react-native'
import React, { memo } from 'react'
import { useTheme } from '@react-navigation/native'
import { COLORS, SIZES } from '../../constants/theme'
import FeatherIcon from 'react-native-vector-icons/Feather'

const initialIcon = { name: 'plus', size: 40 }

const ImagePicker = ({ data, onSelect, onRemove, style, icon = initialIcon }) => {
    const { colors } = useTheme()
    const Styles = styles(colors)
    return (
        <TouchableOpacity
            activeOpacity={data?.uri ? 1 : .9}
            onPress={() => !data?.uri && onSelect()}
            style={[Styles.imageBox, style]}
        >
            {data?.uri ?
                <>
                    <Image
                        style={Styles.imageStyle}
                        source={{ uri: data?.uri }}
                    />
                    <TouchableOpacity
                        activeOpacity={.8}
                        onPress={() => onRemove()}
                        style={Styles.removeButton}
                    >
                        <FeatherIcon name='x' size={16} color={COLORS.white} />
                    </TouchableOpacity>
                </>
                :
                <FeatherIcon name={icon?.name} color={colors.borderColor} size={icon.size} />
            }
        </TouchableOpacity>
    )
}

export default memo(ImagePicker)

const styles = (colors) => StyleSheet.create({
    imageBox: {
        flex: 1,
        borderWidth: 1.3,
        marginVertical: 5,
        borderRadius: SIZES.radius,
        borderStyle: 'dashed',
        minHeight: SIZES.width / 3.5,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderColor: colors.borderColor,
        backgroundColor: colors.cardBg,
    },
    removeButton: {
        height: 25,
        width: 25,
        borderRadius: 20,
        position: 'absolute',
        top: 8,
        right: 8,
        zIndex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.danger,
    },
    imageStyle: {
        width: '100%',
        height: '100%',
        borderRadius: SIZES.radius,
    },
})