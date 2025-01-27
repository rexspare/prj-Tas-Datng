import { Image, SafeAreaView, View, StyleSheet } from 'react-native'
import React from 'react'
import { SCREEN } from '../../constants/enums'
import { useApp, useAuth } from '../../contexts'
import { useTheme } from '@react-navigation/native'
import { FONTS, IMAGES } from '../../constants/theme'
import FeatherIcon from 'react-native-vector-icons/Feather'
import { GlobalStyleSheet } from '../../constants/StyleSheet'
import { InterstitialAds, MainSlider, HomeSlider } from '../components'
import { TouchableOpacity } from 'react-native-gesture-handler'

const Home = ({ navigation }) => {
    const { colors } = useTheme()
    const Styles = styles(colors)
    const { homeFeeds } = useApp()
    const { userData } = useAuth()

    return (
        <SafeAreaView style={Styles.mainScreen}>
            <View style={[GlobalStyleSheet.homeHeader, { justifyContent: 'space-between', }]}>
                <TouchableOpacity
                    style={Styles.headerBtn}
                    hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                    onPress={() => navigation.openDrawer()}
                >
                    <FeatherIcon color={colors.title} size={22} name={'grid'} />
                </TouchableOpacity>
                <Image
                    source={require('../../assets/images/taslogo.png')}
                    style={Styles.logoStyle}
                />
                <TouchableOpacity
                    style={Styles.headerBtn}
                    hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                    onPress={() => navigation.navigate(SCREEN.FILTER)}
                >
                    <Image source={IMAGES.filter} style={Styles.filterImage} />
                </TouchableOpacity>
            </View>

            <HomeSlider data={homeFeeds} />

            {/* <MainSlider
                currentUser={userData}
                navigation={navigation}
                data={homeFeeds}
            /> */}

            {__DEV__ == false && <InterstitialAds />}

        </SafeAreaView>
    )
}

export default Home

const styles = (colors) => StyleSheet.create({
    mainScreen: {
        flex: 1,
        backgroundColor: colors.background,
    },
    headerBtn: {
        ...GlobalStyleSheet.headerBtn,
        borderColor: colors.borderColor,
    },
    logoStyle: {
        width: 55,
        height: 55,
        resizeMode: 'contain',
    },
    title: {
        ...FONTS.h5,
        flex: 1,
        textAlign: 'center',
        color: colors.title,
    },
    filterImage: {
        height: 22,
        width: 22,
        tintColor: colors.title,
    },
})