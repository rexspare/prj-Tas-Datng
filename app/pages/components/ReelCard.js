import { StyleSheet, TouchableOpacity } from 'react-native'
import React, { memo } from 'react'
import { COLORS } from '../../constants/theme'
import FastImage from 'react-native-fast-image'
import { useTheme } from '@react-navigation/native'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

const ReelCard = ({ item, onPress }) => {
    const { colors } = useTheme()
    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onPress()}
            style={styles.reelContainer}
        >
            <FastImage
                style={styles.reel}
                source={{ uri: item?.videoUrl?.uri }}
            />
            <FontAwesome5 color={colors.border} size={13} style={styles.playIcon} name='play' />
        </TouchableOpacity>
    )
}

export default memo(ReelCard)

const styles = StyleSheet.create({
    reelContainer: {
        height: 180,
        width: '33%',
        marginHorizontal: 0.7,
        marginVertical: 0.7,
        backgroundColor: COLORS.light,
    },
    reel: {
        height: '100%',
        width: '100%',
    },
    playIcon: {
        position: 'absolute',
        bottom: 10,
        left: '4%',
    },
})