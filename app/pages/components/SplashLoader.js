import { ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native'
import React, { memo } from 'react'
import { COLORS } from '../../constants/theme'
import { useTheme } from '@react-navigation/native'

const SplashLoader = () => {
    const theme = useTheme()
    const { colors } = theme
    const Styles = styles(colors)
    return (
        <>
            <StatusBar backgroundColor={colors.card} barStyle={theme.dark ? 'light-content' : 'dark-content'} />
            <View style={Styles.main}>
                <ActivityIndicator size={'large'} color={COLORS.primary3} />
            </View>
        </>
    )
}

export default memo(SplashLoader)

const styles = (colors) => StyleSheet.create({
    main: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.card,
    },
})