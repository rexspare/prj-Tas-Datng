import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useRef, useState } from 'react'
import Header from '../layout/Header'
import { SCREEN } from '../constants/enums'
import { deleteAccount } from '../services'
import { showFlash } from '../utils/helpers'
import { useTheme } from '@react-navigation/native'
import RBSheet from 'react-native-raw-bottom-sheet'
import ProfileSheet from './components/ProfileSheet'
import { GlobalStyleSheet } from '../constants/StyleSheet'
import FeatherIcon from 'react-native-vector-icons/Feather'
import { ActivityIndicator, List } from 'react-native-paper'
import MultiSlider from '@ptomasroos/react-native-multi-slider'
import { COLORS, FONTS, IMAGES, SIZES } from '../constants/theme'
import { useApp, useAuth, useLanguage, usePurchase } from '../contexts'
import { AboutSheet, GenderSheet, BioSheet, GradientBtn, CustomizeCardModal, CustomSwitch } from './components'

const Settings = ({ navigation }) => {
    const { t } = useLanguage()
    const { colors } = useTheme()
    const Styles = styles(colors)
    const genderSheet = useRef()
    const settingSheet = useRef()
    const [sheetType, setSettingSheet] = useState()
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [showColorPicker, setShowColorPicker] = useState(false)
    const [showCardSettings, setShowCardSettings] = useState(false)
    const { handleVerifyUser, isSubscriptionExpired } = usePurchase()
    const { ageRange, setAgeRange, distanceVal, setDistanceVal } = useApp()
    const { userData, updateUser, updateUserLocation, locationLoading } = useAuth()

    const [bio, setBio] = useState(userData?.bio || '')
    const [about, setAbout] = useState(userData?.about || '')

    const openSheet = (type) => {
        setSettingSheet(type)
        settingSheet.current.open()
    }

    const setInterestedIn = (val) => {
        updateUser({ interestedIn: val })
    }

    const renderIcon = (name) => (
        <FeatherIcon
            size={18}
            name={name}
            style={Styles.listIcon}
            color={colors.textLight}
        />
    )

    const renderLoader = () => (
        <ActivityIndicator
            size={18.5}
            color={COLORS.primary}
            style={Styles.listIcon}
        />
    )

    // function isSubscriptionExpired(subDate) {
    //     var subDateMillis = (subDate?.seconds * 1000) + (subDate?.nanoseconds / 1000000)
    //     var currentDate = new Date().getTime()
    //     var thirtyDaysInMillis = 30 * 24 * 60 * 60 * 1000
    //     var subscriptionEndDate = subDateMillis + thirtyDaysInMillis
    //     return currentDate > subscriptionEndDate
    // }

    const checkSubscription = () => {
        let subscription = userData?.subscription
        const isSubscribed = subscription?.packageId == 'unlimited' || subscription?.packageId == 'pro'

        const isExpired = isSubscriptionExpired(subscription?.expiresAt)
        return isSubscribed && !isExpired
    }

    const handleCardCustomize = () => {
        const isAvailable = checkSubscription()
        if (isAvailable) {
            setShowCardSettings(true)
        } else {
            showFlash(t('onlyProOrUnlimitedSubscription'))
        }
    }

    const handleProfileCustomize = () => {
        const isAvailable = checkSubscription()
        if (isAvailable) {
            setShowColorPicker(true)
        } else {
            showFlash(t('onlyProOrUnlimitedSubscription'))
        }
    }

    const [isBusinessActive, setIsBusinessActive] = useState(userData?.isBusinessProfile)

    const upgradeToBusiness = async (val) => {
        const isAvailable = checkSubscription()
        if (isAvailable) {
            setIsBusinessActive(val)
            await updateUser({ isBusinessProfile: val })
        } else {
            showFlash(t('onlyProOrUnlimitedSubscription'))
        }
    }

    const renderLanguageIcon = () => (
        <Image
            resizeMode='contain'
            source={IMAGES.world}
            style={Styles.businessIcon}
        />
    )

    return (
        <>
            <RBSheet
                height={240}
                ref={settingSheet}
                openDuration={100}
                closeOnDragDown={true}
                customStyles={Styles.sheetStyle}
            >
                {sheetType == "bio" ? <BioSheet value={bio} onChange={setBio} /> :
                    sheetType == "about" ? <AboutSheet value={about} onChange={setAbout} /> :
                        <></>
                }
            </RBSheet>
            <RBSheet
                height={300}
                ref={genderSheet}
                openDuration={100}
                closeOnDragDown={true}
                customStyles={Styles.sheetStyle}
            >
                <GenderSheet value={userData?.interestedIn} onSelect={setInterestedIn} />
            </RBSheet>

            <ProfileSheet visible={showColorPicker} setVisible={setShowColorPicker} />
            <CustomizeCardModal visible={showCardSettings} setVisible={setShowCardSettings} />

            <SafeAreaView style={Styles.mainScreen}>
                <Header
                    leftIcon={'back'}
                    titleLeft
                    title={t('settings')}
                    rightIcon={renderLanguageIcon}
                    onRightPress={() => navigation.navigate(SCREEN.LANGUAGES)}
                />
                <ScrollView>
                    <View style={GlobalStyleSheet.container}>

                        <Text style={[Styles.sectionHeading, { marginTop: 0 }]}>{t('accountSetting')}</Text>

                        {/* <View style={Styles.cardStyle}>
                            <Text style={Styles.heading1}>{'Phone Number'}</Text>
                            <List.Item
                                title={'+00 0540 4705'}
                                style={Styles.listLayout}
                                titleStyle={Styles.valueText}
                                onPress={() => openSheet('phoneNumber')}
                                left={() => <FeatherIcon style={Styles.listIcon} size={18} color={colors.textLight} name='phone-call' />}
                            />
                        </View> */}

                        <View style={Styles.cardStyle}>
                            <Text style={Styles.heading1}>{t('bioHeading')}</Text>
                            <List.Item
                                title={bio || t('noBioFound')}
                                style={Styles.listLayout}
                                titleStyle={Styles.valueText}
                                left={() => renderIcon('info')}
                                onPress={() => openSheet('bio')}
                            />
                        </View>
                        <View style={Styles.cardStyle}>
                            <Text style={Styles.heading1}>{t('about')}</Text>
                            <List.Item
                                title={about || t('noAboutFound')}
                                style={Styles.listLayout}
                                titleStyle={Styles.valueText}
                                left={() => renderIcon('info')}
                                onPress={() => openSheet('about')}
                            />
                        </View>
                        <Text style={Styles.sectionHeading}>{t('discoverySetting')}</Text>
                        <View style={Styles.cardStyle}>
                            <Text style={Styles.heading1}>{t('location')}</Text>
                            <List.Item
                                style={Styles.listLayout}
                                titleStyle={Styles.valueText}
                                onPress={() => updateUserLocation()}
                                title={userData?.location?.address || t('moLocationFound')}
                                left={() => locationLoading ? renderLoader() : renderIcon('map-pin')}
                            />
                        </View>
                        <Text style={Styles.sectionHeading}>{t('other')}</Text>
                        <View style={Styles.cardStyle}>
                            <View style={Styles.sectionHeader}>
                                <Text style={Styles.heading2}>{t('maximumDistance')}</Text>
                                <Text style={Styles.blackBold}>{distanceVal[0]}ml</Text>
                            </View>
                            <MultiSlider
                                min={1}
                                max={100}
                                values={distanceVal}
                                trackStyle={Styles.track}
                                markerStyle={Styles.marker}
                                sliderLength={SIZES.width - 60}
                                selectedStyle={Styles.selectedValue}
                                onValuesChange={(val) => setDistanceVal(val)}
                            />
                        </View>
                        <View style={Styles.cardStyle}>
                            <Text style={Styles.heading1}>{t('showMe')}</Text>
                            <List.Item
                                style={Styles.listLayout}
                                titleStyle={Styles.valueText}
                                title={userData?.interestedIn}
                                onPress={() => { genderSheet.current.open() }}
                                right={() => <FeatherIcon size={18} color={colors.text} name='chevron-right' />}
                            />
                        </View>

                        <View style={Styles.cardStyle}>
                            <View style={Styles.sectionHeader}>
                                <Text style={Styles.heading2}>{t('ageRange')}</Text>
                                <Text style={Styles.blackBold}>{ageRange[0]}-{ageRange[1]}</Text>
                            </View>
                            <MultiSlider
                                min={18}
                                max={100}
                                values={ageRange}
                                trackStyle={Styles.track}
                                markerStyle={Styles.marker}
                                sliderLength={SIZES.width - 60}
                                selectedStyle={Styles.selectedValue}
                                onValuesChange={(val) => setAgeRange(val)}
                            />
                        </View>

                        <View style={Styles.cardStyle}>
                            <Text style={Styles.heading1}>{t('businessProfileHeading')}</Text>
                            <List.Item
                                title={t('businessMode')}
                                style={Styles.listLayout}
                                titleStyle={Styles.valueText}
                                right={() => <CustomSwitch
                                    value={isBusinessActive}
                                    onToggle={upgradeToBusiness}
                                />}
                            />
                        </View>

                        <GradientBtn
                            title={t('customizeDatingCard')}
                            onPress={handleCardCustomize}
                            style={{ marginVertical: 8 }}
                        />

                        <GradientBtn
                            title={t('verifyAccount')}
                            onPress={() => handleVerifyUser()}
                            style={{ marginVertical: 8 }}
                        />

                        <GradientBtn
                            title={t('customizeProfilePic')}
                            onPress={handleProfileCustomize}
                            style={{ marginVertical: 8 }}
                        />

                        <GradientBtn
                            title={t('deleteAccount')}
                            isLoading={deleteLoading}
                            onPress={() => deleteAccount(setDeleteLoading)}
                            style={{ marginVertical: 8 }}
                        />

                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    );
};

export default Settings

const styles = (colors) => StyleSheet.create({
    mainScreen: { flex: 1, backgroundColor: colors.background, },
    sectionHeading: { ...FONTS.h6, color: colors.title, marginBottom: 8, marginTop: 10, },
    sheetStyle: {
        wrapper: {},
        container: {
            backgroundColor: colors.cardBg,
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
        },
        draggableIcon: {
            marginTop: 5,
            marginBottom: 0,
            height: 5,
            width: 90,
            backgroundColor: colors.borderColor,
        }
    },
    cardStyle: {
        ...GlobalStyleSheet.card,
        backgroundColor: colors.cardBg,
        borderColor: colors.borderColor,
        paddingBottom: 5,
        marginBottom: 8,
    },
    blackBold: { ...FONTS.h6, color: colors.title },
    heading1: {
        ...FONTS.font,
        ...FONTS.fontBold,
        color: colors.title,
        paddingBottom: 8,
        marginBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderColor,
    },
    heading2: {
        ...FONTS.font,
        ...FONTS.fontBold,
        color: colors.title,
    },
    sectionHeader: {
        paddingBottom: 8,
        marginBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderColor,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    valueText: { ...FONTS.font, fontSize: 16, color: colors.text, },
    listLayout: { marginHorizontal: -15, },
    listIcon: { marginLeft: 12, left: 5, },
    marker: {
        top: 1,
        height: 16,
        width: 16,
        borderWidth: 3,
        borderColor: COLORS.primary,
        backgroundColor: COLORS.white,
    },
    selectedValue: { backgroundColor: COLORS.primary, },
    track: { height: 4, borderRadius: 2, backgroundColor: 'rgba(142,165,200,.3)' },
    businessIcon: {
        height: 22,
        width: 22,
        tintColor: COLORS.primary,
    }
})