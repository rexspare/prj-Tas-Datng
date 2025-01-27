import { Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useAuth, useLanguage } from '../contexts'
import { SvgXml } from 'react-native-svg'
import { NAV, SCREEN } from '../constants/enums'
import themeContext from '../constants/themeContext'
import Divider from '../components/Dividers/Divider'
import { COLORS, FONTS, ICONS } from '../constants/theme'
import FeatherIcon from 'react-native-vector-icons/Feather'
import ToggleStyle1 from '../components/Toggles/ToggleStyle1'
import { useNavigation, useTheme } from '@react-navigation/native'

const DrawerMenu = () => {
    const theme = useTheme()
    const { t } = useLanguage()
    const { colors } = useTheme()
    const Styles = styles(colors)
    const navigation = useNavigation()
    const { logoutUser, userData, user } = useAuth()
    const { setDarkTheme, setLightTheme } = React.useContext(themeContext)

    const Tab = ({ text, onPress, icon }) => (
        <TouchableOpacity onPress={() => onPress()} style={Styles.navLink}>
            <SvgXml style={Styles.icon} {...icon} />
            <Text style={Styles.navText}>{text}</Text>
            <FeatherIcon size={16} color={colors.text} name={'chevron-right'} />
        </TouchableOpacity>
    )

    const handleToggle = (value) => {
        if (value) {
            setLightTheme()
        } else {
            setDarkTheme()
        }
    }

    return (
        <View style={Styles.mainContainer}>
            <View style={Styles.header}>
                <View style={Styles.imageContainer}>
                    <Image source={{ uri: userData?.images[0]?.uri }} style={Styles.imageStyle} />
                </View>
                <View>
                    <Text style={Styles.whiteH6}>{userData?.name}</Text>
                    <Text style={Styles.whiteFont}>{user?.phoneNumber || user?.email}</Text>
                </View>
            </View>
            <View style={Styles.layout}>
                <Text style={Styles.sectionHeading}>{t('mainMenu')}</Text>

                <Tab
                    text={t('home')}
                    icon={{ xml: ICONS.home }}
                    onPress={() => navigation.navigate(NAV.BOTTOM, { screen: SCREEN.HOME })}
                />
                <Tab
                    text={t('myReels')}
                    icon={{ xml: ICONS.reels }}
                    onPress={() => navigation.navigate(SCREEN.REELS_LIST, { userId: user?.uid })}
                />
                {/* <Tab
                    text={'Components'}
                    icon={{ xml: ICONS.components }}
                    onPress={() => navigation.navigate('Components')}
                /> */}

                <Tab
                    text={t('settings')}
                    icon={{ height: 22, width: 22, stroke: "#bfc9da", xml: ICONS.setting }}
                    onPress={() => navigation.navigate(SCREEN.SETTINGS)}
                />
                <Tab
                    text={t('logout')}
                    icon={{ xml: ICONS.logout }}
                    onPress={() => logoutUser()}
                />

                <Divider />

                <Text style={Styles.sectionHeading}>{t('settings')}</Text>

                <View style={Styles.navLink}>
                    <SvgXml style={Styles.icon} xml={ICONS.dark} />
                    <Text style={Styles.navText}>{t('darkMode')}</Text>
                    <ToggleStyle1 active={theme.dark} onToggle={handleToggle} />
                </View>

            </View>
            <View style={Styles.bottomView}>
                <Text style={Styles.textBold}>{'TAS Dating'}</Text>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => Linking.openURL("https://tasdating.com/Legal%20Documents/Responsive%20Legal%20Documents(Privacy%20Policy)/index.html")}
                >
                    <Text style={Styles.text}>{t('privacyPolicy')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => Linking.openURL("https://tasdating.com/Legal%20Documents/Responsive%20Legal%20Documents(Terms%20%20of%20Use)/index.html")}>
                    <Text style={Styles.text}>{t('termsOfUse')}</Text>
                </TouchableOpacity>
                <Text style={Styles.text}>{'App Version 1.0.7'}</Text>
            </View>
        </View>
    )
}

export default DrawerMenu

const styles = (colors) => StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: colors.card, },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 15,
        backgroundColor: COLORS.primary,
    },
    imageContainer: {
        borderRadius: 50,
        borderWidth: 2,
        borderColor: COLORS.white,
        marginRight: 12,
    },
    imageStyle: {
        height: 48,
        width: 48,
        borderRadius: 50,
    },
    whiteH6: { ...FONTS.h6, color: COLORS.white, lineHeight: 20, },
    whiteFont: { ...FONTS.font, color: COLORS.white, },
    layout: { paddingHorizontal: 15, paddingVertical: 20, flex: 1, },
    sectionHeading: { ...FONTS.h6, color: colors.title, marginBottom: 5, },
    textBold: { ...FONTS.h6, color: colors.title, },
    text: { ...FONTS.font, color: colors.text, },
    navLink: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    navText: {
        flex: 1,
        ...FONTS.font,
        color: COLORS.title,
        color: colors.text,
    },
    icon: { marginRight: 10, tintColor: 'red' },
    bottomView: { paddingBottom: 30, paddingHorizontal: 15, paddingTop: 20, },
})


