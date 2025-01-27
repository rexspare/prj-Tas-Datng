import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import Header from '../layout/Header'
import { List } from 'react-native-paper'
import { CustomSwitch } from './components'
import LottieView from 'lottie-react-native'
import { useAuth, useLanguage } from '../contexts'
import { FONTS, COLORS } from '../constants/theme'
import { animationsList } from '../constants/enums'
import { useTheme } from '@react-navigation/native'
import { GlobalStyleSheet } from '../constants/StyleSheet'

const SpotlightList = () => {
    const { t } = useLanguage()
    const { colors } = useTheme()
    const Styles = styles(colors)
    const { updateUser, userData } = useAuth()
    const [spotlight, setSpotlight] = useState(userData?.spotlight?.isActive || false)
    const [selectedSpotlight, setSelectedSpotlight] = useState(userData?.spotlight?.animation || '')

    const onSelect = async (val) => {
        setSelectedSpotlight(val)
        updateUser({ spotlight: { animation: val } })
    }

    const onSwitch = async (val) => {
        // setSpotlight(val)
        // if (val) {
        //     updateUser({ spotlight: { isActive: true } })
        // } else {
        //     setSelectedSpotlight('')
        //     updateUser({ spotlight: { isActive: false, animation: '' } })
        // }
    }

    return (
        <SafeAreaView style={Styles.mainScreen}>
            <View style={Styles.mainScreen}>

                <Header
                    titleLeft
                    borderNone
                    title={t('spotlight')}
                    leftIcon={'back'}
                />

                <ScrollView
                    bounces={false}
                    overScrollMode='never'
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16 }}
                >

                    <View style={Styles.cardStyle}>
                        <Text style={Styles.heading1}>{t('spotlightHeading')}</Text>
                        <List.Item
                            title={t('spotlight')}
                            style={Styles.listLayout}
                            titleStyle={Styles.valueText}
                            right={() => <CustomSwitch value={spotlight} onToggle={onSwitch} />}
                        />
                    </View>

                    <View style={Styles.itemsContainer}>
                        {animationsList?.map((item) => {
                            const isSelected = item?.id === selectedSpotlight
                            return (
                                <TouchableOpacity
                                    key={item?.id}
                                    activeOpacity={0.8}
                                    onPress={() => onSelect(item?.id)}
                                    style={[Styles.itemStyle, isSelected && Styles.activeItem]}
                                >
                                    <View style={Styles.animationStyle}>
                                        <LottieView source={item?.animation} autoPlay loop />
                                    </View>
                                </TouchableOpacity>
                            )
                        })}
                    </View>

                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

export default SpotlightList

const styles = (colors) => StyleSheet.create({
    mainScreen: { flex: 1, backgroundColor: colors.background, },
    cardStyle: {
        ...GlobalStyleSheet.card,
        backgroundColor: colors.cardBg,
        borderColor: colors.borderColor,
        paddingBottom: 5,
        marginBottom: 8,
        marginTop: 15,
    },
    heading1: {
        ...FONTS.font,
        ...FONTS.fontBold,
        color: colors.title,
        paddingBottom: 8,
        marginBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderColor,
    },
    valueText: { ...FONTS.font, fontSize: 16, color: colors.text, },
    listLayout: { marginHorizontal: -15, },
    itemsContainer: {
        gap: 12,
        width: '100%',
        flexWrap: 'wrap',
        paddingVertical: 12,
        flexDirection: 'row',
    },
    itemStyle: {
        height: 150,
        width: '48%',
        borderRadius: 15,
        backgroundColor: colors.cardBg,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    activeItem: {
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    animationStyle: {
        height: '90%',
        width: '90%',
        borderRadius: 15,
        overflow: 'hidden',
    },
})