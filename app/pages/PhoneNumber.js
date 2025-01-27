import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useAuth, useLanguage } from '../contexts'
import { GradientBtn } from './components'
import { SocialButton } from './components'
import { FONTS, SIZES } from '../constants/theme'
import { useTheme } from '@react-navigation/native'
import { GlobalStyleSheet } from '../constants/StyleSheet'
import FeatherIcon from 'react-native-vector-icons/Feather'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { CountryPicker } from 'react-native-country-codes-picker'

const PhoneNumber = ({ navigation }) => {
    const theme = useTheme()
    const { colors } = theme
    const { t } = useLanguage()
    const [show, setShow] = useState(false)
    const [number, setNumber] = useState('')
    const [countryCode, setCountryCode] = useState('+1')
    // const [number, setNumber] = useState('6505553435')
    const { phoneLogin, loading, GoogleSignIn, googleLoading } = useAuth()

    const Styles = styles(colors)

    const handleCountryPick = (item) => {
        setCountryCode(item.dial_code)
        setShow(false)
    }

    const handleNextPress = async () => {
        // if (countryCode && number?.length == 10) {
        if (number?.length > 8) {
            phoneLogin(`${countryCode} ${number}`)
        }
        // navigation.navigate(SCREEN.ENTER_CODE)
        // } else {
        //     if (number?.length !== 10) {
        //         showFlash('Please enter a valid number')
        //     } else {
        //         showFlash('Please select a country')
        //     }
        // }
    }

    const onGooglePress = async () => {
        GoogleSignIn()
    }

    return (
        <SafeAreaView style={Styles.mainScreen}>
            <KeyboardAvoidingView
                style={Styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : ''}
            >
                <CountryPicker
                    show={show}
                    pickerButtonOnPress={handleCountryPick}
                    onBackdropPress={() => setShow(false)}
                    style={Styles.pickerStyle}
                />
                <View style={Styles.flex}>
                    <ScrollView>
                        <View style={GlobalStyleSheet.container}>
                            <TouchableOpacity style={Styles.backButton} onPress={() => navigation.goBack()}>
                                <FeatherIcon size={26} color={colors.title} name={'chevron-left'} />
                            </TouchableOpacity>
                            <Text style={Styles.titleStyle}>{t('phoneNumberHeading')}</Text>

                            <View style={Styles.inputContainer}>

                                <TouchableOpacity style={Styles.pickerButton} onPress={() => setShow(true)}>
                                    <Text style={Styles.codeText}>{countryCode}</Text>
                                    <FeatherIcon style={{ marginLeft: 2 }} color={colors.title} size={18} name="chevron-down" />
                                </TouchableOpacity>

                                <TextInput
                                    // maxLength={10}
                                    value={number}
                                    keyboardType='number-pad'
                                    style={Styles.inputStyle}
                                    onChangeText={(x) => setNumber(x)}
                                    placeholder={t('phonePlaceholder')}
                                    placeholderTextColor={colors.textLight}
                                />
                            </View>
                        </View>
                    </ScrollView>
                </View>

                <View style={Styles.bottomView}>
                    <SocialButton
                        title={t('google')}
                        iconName={'google'}
                        iconType={FontAwesome}
                        onPress={onGooglePress}
                        isLoading={googleLoading}
                    />
                    <GradientBtn
                        title={t('next')}
                        isLoading={loading}
                        onPress={handleNextPress}
                    />
                </View>

            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = (colors) => StyleSheet.create({
    mainScreen: {
        flex: 1,
        backgroundColor: colors.cardBg,
    },
    flex: {
        flex: 1,
    },
    pickerStyle: {
        modal: {
            height: '60%',
            backgroundColor: colors.cardBg,
        },
        textInput: {
            paddingHorizontal: 12,
            height: 48,
            color: colors.title,
            backgroundColor: colors.bgLight,
        },
        dialCode: {
            ...FONTS.fontLg,
            ...FONTS.fontSemiBold,
            color: colors.title,
        },
        countryName: {
            ...FONTS.font,
            ...FONTS.fontSemiBold,
            color: colors.text,
        },
        countryButtonStyles: {
            height: 50,
            backgroundColor: colors.cardBg,
            borderRadius: 0,
            borderBottomWidth: 1,
            borderBottomColor: colors.borderColor,
            marginBottom: 0,
        },
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

    inputContainer: {
        height: 55,
        padding: 5,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderRadius: SIZES.radius,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,.05)',
        borderColor: colors.borderColor
    },
    pickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 8,
    },
    codeText: {
        ...FONTS.fontLg,
        color: colors.title,
    },
    inputStyle: {
        ...FONTS.font,
        fontSize: 16,
        color: colors.title,
        flex: 1,
        top: 0,
        borderLeftWidth: 1,
        borderLeftColor: colors.borderColor,
        paddingVertical: 0,
        paddingLeft: 12,
    },
    bottomView: {
        paddingHorizontal: 45,
        paddingVertical: 35,
    },
})

export default PhoneNumber