import { StyleSheet, View } from 'react-native'
import React, { memo } from 'react'
import { COLORS } from '../../constants/theme'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

const VerifiedBadge = ({ style }) => {
    return (
        <View style={[styles.container, style]}>
            <MaterialIcons name={'verified'} size={22} color={COLORS.info} />
        </View>
    )
}

export default memo(VerifiedBadge)

const styles = StyleSheet.create({
    container: {
        marginLeft: 4,
    }
})
