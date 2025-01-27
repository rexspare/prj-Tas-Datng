import { Image, ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native'
import React from 'react'
import { useTheme } from '@react-navigation/native'
import { COLORS, IMAGES } from '../../constants/theme'

const SplashScreen = () => {
    const theme = useTheme()
    const { colors } = theme
    const Styles = styles(colors)
    return (
        <View style={Styles.main}>
            <StatusBar backgroundColor={colors.card} barStyle={theme.dark ? 'light-content' : 'dark-content'} />

            <Image source={IMAGES.tasLogo} style={Styles.logo} resizeMode='contain' />

            <ActivityIndicator size={'large'} color={COLORS.primary3} />
        </View>
    )
}

export default SplashScreen

const styles = (colors) => StyleSheet.create({
    main: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.card,
    },
    logo: {
        height: 180,
        width: 180,
        marginBottom: '1%',
    },
})