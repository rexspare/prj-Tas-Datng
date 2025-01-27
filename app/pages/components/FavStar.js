import { Image, StyleSheet, TouchableOpacity } from 'react-native'
import React, { memo } from 'react'
import { emptyFunction } from '../../utils/helpers'
import { COLORS, IMAGES } from '../../constants/theme'

const FavStar = ({ isLiked, onPress = emptyFunction, style }) => {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onPress()}
            style={[styles.starCircle, style, isLiked && styles.activeStar]}
        >
            <Image
                source={IMAGES.star}
                style={[styles.starImage, isLiked && styles.activeImage]}
            />
        </TouchableOpacity>
    )
}

export default memo(FavStar)

const styles = StyleSheet.create({
    starCircle: {
        height: 50,
        width: 50,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.white,
    },
    activeStar: { backgroundColor: COLORS.primary, },
    starImage: { height: 28, width: 28, top: 1, tintColor: COLORS.textLight },
    activeImage: { tintColor: COLORS.white },
})