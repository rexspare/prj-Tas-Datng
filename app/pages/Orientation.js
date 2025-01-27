import { Platform, StyleSheet, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { List } from 'react-native-paper'
import { GradientBtn } from './components'
import { SCREEN } from '../constants/enums'
import { showFlash } from '../utils/helpers'
import { COLORS, FONTS } from '../constants/theme'
import { useAuth, useLanguage } from '../contexts'
import { useTheme } from '@react-navigation/native'
import CheckBox from '@react-native-community/checkbox'
import { GlobalStyleSheet } from '../constants/StyleSheet'
import FeatherIcon from 'react-native-vector-icons/Feather'

const Data = [
    {
        title: "Straight",
        checked: false,
    },
    {
        title: "Gay",
        checked: false,
    },
    {
        title: "Lesbian",
        checked: false,
    },
    {
        title: "Bisexual",
        checked: false,
    },
    {
        title: "Asexual",
        checked: false,
    },
    {
        title: "Queer",
        checked: false,
    },
    {
        title: "Demisexual",
        checked: false,
    },
]

const Orientation = ({ navigation }) => {
    const { t } = useLanguage()
    const { colors } = useTheme()
    const Styles = styles(colors)
    const { updateUser, userData } = useAuth()
    const [selected, setSelected] = useState(userData?.orientation || '')
    const [loading, setLoading] = useState(false)
    // const [orientationData, setOrientationData] = useState(Data)

    const handleOrientationSelected = (val) => {
        setSelected(val)
        // let Data = orientationData.map((data) => {
        //     if (val === data.title) {
        //         return { ...data, checked: !data.checked }
        //     }
        //     return data
        // })
        // setOrientationData(Data)
    }

    const handleNextPress = () => {
        if (selected) {
            setLoading(true)
            const isUpdated = updateUser({ orientation: selected })
            if (isUpdated) {
                navigation.navigate(SCREEN.INTERESTED)
            }
            setLoading(false)
        } else {
            showFlash(t('selectOptionWarning'))
        }
    }

    return (
        <SafeAreaView style={Styles.mainScreen}>
            <View style={Styles.flex}>
                <ScrollView>
                    <View style={GlobalStyleSheet.container}>
                        <TouchableOpacity
                            style={Styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <FeatherIcon size={26} color={colors.title} name={'chevron-left'} />
                        </TouchableOpacity>
                        <Text style={Styles.titleStyle}>{t('orientationHeading')}</Text>

                        {Data?.map((data, index) => {
                            return (
                                <List.Item
                                    onPress={() => handleOrientationSelected(data?.title)}
                                    key={index}
                                    left={() =>
                                        <View
                                            style={[
                                                Platform.OS === 'ios' && {
                                                    transform: [{ scale: .75 }]
                                                }
                                            ]}
                                        >
                                            <CheckBox
                                                disabled
                                                boxType='square'
                                                style={{ left: 10 }}
                                                onCheckColor={COLORS.white}
                                                onFillColor={COLORS.primary}
                                                onTintColor={COLORS.primary}
                                                tintColor={colors.borderColor}
                                                value={selected == data?.title}
                                                tintColors={{ true: COLORS.primary, false: colors.text }}
                                            />
                                        </View>
                                    }
                                    title={() => <Text style={{ ...FONTS.font, ...FONTS.fontMedium, top: -1, color: colors.title }}>{data.title}</Text>}
                                />
                            )
                        })}

                    </View>
                </ScrollView>
            </View>
            <View style={Styles.bottomView}>
                <GradientBtn
                    title={t('next')}
                    isLoading={loading}
                    onPress={handleNextPress}
                />
            </View>
        </SafeAreaView>
    )
}

export default Orientation

const styles = (colors) => StyleSheet.create({
    mainScreen: {
        flex: 1,
        backgroundColor: colors.cardBg,
    },
    flex: {
        flex: 1,
    },
    backButton: {
        height: 48,
        width: 48,
        borderRadius: 48,
        backgroundColor: colors.bgLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
    },
    titleStyle: {
        ...FONTS.h3,
        color: colors.title,
        marginBottom: 20,
    },
    bottomView: {
        paddingHorizontal: 45,
        paddingVertical: 35,
    },
})
