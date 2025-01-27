import { SafeAreaView, StyleSheet, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { FONTS } from '../constants/theme'
import { SCREEN } from '../constants/enums'
import { useAuth, useLanguage } from '../contexts'
import { useTheme } from '@react-navigation/native'
import { CheckList, GradientBtn } from './components'
import { GlobalStyleSheet } from '../constants/StyleSheet'
import FeatherIcon from 'react-native-vector-icons/Feather'

const YourGender = ({ navigation }) => {
    const { colors } = useTheme()
    const Styles = styles(colors)
    const { t } = useLanguage()
    const { updateUser, userData } = useAuth()
    const genderData = ["Women", "Men", "Other"]
    const [activeGender, setGender] = useState(userData?.gender || genderData[1])
    const [loading, setLoading] = useState(false)

    const handleNextPress = () => {
        setLoading(true)
        const isUpdated = updateUser({ gender: activeGender })
        if (isUpdated) {
            navigation.navigate(SCREEN.ORIENTATION)
        }
        setLoading(false)
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
                        <Text style={Styles.titleStyle}>{t('genderHeading')}</Text>

                        <View>
                            {genderData?.map((data, index) => (
                                <CheckList
                                    item={data}
                                    key={index}
                                    onPress={() => setGender(data)}
                                    checked={data == activeGender ? true : false}
                                />
                            ))}
                        </View>

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

export default YourGender

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
