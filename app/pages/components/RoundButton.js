import { StyleSheet, TouchableOpacity } from 'react-native'
import React, { memo } from 'react'
import { COLORS } from '../../constants/theme'
import { emptyFunction } from '../../utils/helpers'
import AntDesign from 'react-native-vector-icons/AntDesign'

const RoundButton = ({ iconName, style, onPress = emptyFunction }) => (
    <TouchableOpacity
        activeOpacity={.7}
        onPress={() => onPress()}
        style={[styles.roundButton, style]}
    >
        <AntDesign size={20} color={COLORS.white} name={iconName} />
    </TouchableOpacity>
)

export default memo(RoundButton)

const styles = StyleSheet.create({
    roundButton: {
        height: 40,
        width: 40,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primary2,
        // borderWidth: 1,
        // borderColor: COLORS.borderColor,
    },
})