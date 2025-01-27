import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { GradientBtn } from './components'
import { showFlash } from '../utils/helpers'
import { COLORS, FONTS } from '../constants/theme'
import { useAuth, useLanguage } from '../contexts'
import { useTheme } from '@react-navigation/native'
import OTPTextInput from 'react-native-otp-textinput'
import { GlobalStyleSheet } from '../constants/StyleSheet'
import FeatherIcon from 'react-native-vector-icons/Feather'

const EnterCode = ({ navigation }) => {
    const { t } = useLanguage()
    const { colors } = useTheme()
    const Styles = styles(colors)
    const { confirmOTPCode, loading } = useAuth()
    const [code, setCode] = useState('')

    const handleOtp = () => {
        if (code?.length == 6) {
            confirmOTPCode(code)
        } else {
            showFlash(t('enterOtpWarning'))
        }
    }

    return (
        <SafeAreaView style={Styles.mainScreen}>
            <KeyboardAvoidingView
                style={Styles.flex_1}
                behavior={Platform.OS === 'ios' ? 'padding' : ''}
            >
                <View style={Styles.flex_1}>
                    <ScrollView>
                        <View style={GlobalStyleSheet.container}>
                            <TouchableOpacity
                                style={Styles.backButton}
                                onPress={() => navigation.goBack()}
                            >
                                <FeatherIcon size={26} color={colors.title} name={'chevron-left'} />
                            </TouchableOpacity>
                            <Text style={Styles.titleStyle}>{t('otpCodeHeading')}</Text>
                            <OTPTextInput
                                inputCount={6}
                                tintColor={COLORS.primary}
                                handleTextChange={x => setCode(x)}
                                textInputStyle={Styles.inputStyle}
                            />
                        </View>
                    </ScrollView>
                </View>
                <View style={Styles.bottomView}>
                    <GradientBtn
                        title={t('next')}
                        isLoading={loading}
                        onPress={handleOtp}
                    />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default EnterCode

const styles = (colors) => StyleSheet.create({
    mainScreen: {
        flex: 1,
        backgroundColor: colors.cardBg,
    },
    flex_1: {
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
    inputStyle: {
        width: 45,
        color: colors.title,
        borderBottomWidth: 2,
    },
    bottomView: {
        paddingHorizontal: 45,
        paddingVertical: 35,
    },
})