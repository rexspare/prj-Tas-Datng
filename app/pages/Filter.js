import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { isIOS } from '../utils/helpers'
import { List } from 'react-native-paper'
import { useTheme } from '@react-navigation/native'
import CheckBox from '@react-native-community/checkbox'
import { COLORS, FONTS, SIZES } from '../constants/theme'
import { useApp, useAuth, useLanguage } from '../contexts'
import { GlobalStyleSheet } from '../constants/StyleSheet'
import FeatherIcon from 'react-native-vector-icons/Feather'
import MultiSlider from '@ptomasroos/react-native-multi-slider'

const Filter = ({ navigation }) => {
    const { t } = useLanguage()
    const { colors } = useTheme()
    const Styles = styles(colors)
    const { userData, updateUser } = useAuth()
    const { ageRange, setAgeRange, distanceVal, setDistanceVal } = useApp()

    const setInterestedIn = (val) => {
        updateUser({ interestedIn: val })
    }

    const Option = ({ text }) => (
        <List.Item
            title={text}
            style={Styles.optionStyle}
            titleStyle={Styles.optionText}
            rippleColor={colors.borderColor}
            onPress={() => setInterestedIn(text)}
            right={() => (
                <View style={isIOS() && Styles.optionIcon}>
                    <CheckBox
                        boxType='square'
                        style={{ left: 10 }}
                        value={userData?.interestedIn == text}
                        onCheckColor={COLORS.white}
                        onFillColor={COLORS.primary}
                        onTintColor={COLORS.primary}
                        tintColor={colors.borderColor}
                        tintColors={{ true: COLORS.primary, false: colors.text }}
                        onValueChange={() => setInterestedIn(text)}
                    />
                </View>
            )}
        />
    )

    return (
        <>
            <SafeAreaView style={Styles.mainScreen}>

                <View style={Styles.header}>
                    <TouchableOpacity
                        style={Styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <FeatherIcon size={24} color={colors.title} name='arrow-left' />
                    </TouchableOpacity>
                    <Text style={Styles.headerText}>{t('filterTitle')}</Text>
                </View>

                <View style={{ flex: 1 }}>
                    <ScrollView>
                        <View style={GlobalStyleSheet.container}>

                            <View style={Styles.infoCard}>
                                <Text style={Styles.cardTitle}>{t('wantToDateHeading')}</Text>

                                <Option text={'Men'} />
                                <Option text={'Women'} />
                                <Option text={'Everyone'} />

                            </View>

                            <View style={Styles.infoCard}>
                                <Text style={Styles.cardTitle}>{t('age')}</Text>
                                <Text style={Styles.textBold}>{t('between')} {ageRange[0]} {t('and')} {ageRange[1]}</Text>
                                <View>
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
                            </View>

                            <View style={Styles.infoCard}>
                                <Text style={Styles.cardTitle}>{t('distance')}</Text>
                                <Text style={Styles.textBold}>{t('upTo')} {distanceVal[0]} {t('kilometersAway')}</Text>
                                <View>
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
                            </View>

                        </View>
                    </ScrollView>
                </View>
                {/* <View style={Styles.bottomView}>
                    <GradientBtn
                        title={'Apply'}
                        onPress={() => navigation.navigate(NAV.DRAWER)}
                    />
                </View> */}
            </SafeAreaView>
        </>
    )
}

export default Filter

const styles = (colors) => StyleSheet.create({
    mainScreen: { flex: 1, backgroundColor: colors.background },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    backButton: { padding: 10, top: -1, marginRight: 10, },

    headerText: { ...FONTS.h5, color: colors.title },

    infoCard: {
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 15,
        marginBottom: 15,
        ...GlobalStyleSheet.shadow,
        backgroundColor: colors.cardBg,
    },
    cardTitle: {
        ...FONTS.fontBold,
        ...FONTS.font,
        borderBottomWidth: 1,
        paddingBottom: 8,
        marginBottom: 10,
        color: colors.text,
        borderColor: colors.borderColor,
    },
    bottomView: {
        paddingHorizontal: 45,
        paddingVertical: 35,
    },
    textBold: { ...FONTS.h6, color: colors.title },
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
    optionText: { color: colors.title, },
    optionStyle: { paddingVertical: 2, marginHorizontal: -15, },
    optionIcon: { transform: [{ scale: .75 }], },
})