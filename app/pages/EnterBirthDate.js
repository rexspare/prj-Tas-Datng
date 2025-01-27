import React, { useState } from 'react'
import { SafeAreaView, StyleSheet, ScrollView, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView } from 'react-native'
import { useAuth, useLanguage } from '../contexts'
import { FONTS } from '../constants/theme'
import { GradientBtn } from './components'
import { SCREEN } from '../constants/enums'
import { useTheme } from '@react-navigation/native'
import { GlobalStyleSheet } from '../constants/StyleSheet'
import FeatherIcon from 'react-native-vector-icons/Feather'
import DateTimePicker from '@react-native-community/datetimepicker'
import { getAge, getUnixTimestamp, showFlash } from '../utils/helpers'

const EnterBirthDate = ({ navigation }) => {
    const { colors } = useTheme()
    const Styles = styles(colors)
    const { t } = useLanguage()
    const { updateUser, userData } = useAuth()
    const [loading, setLoading] = useState(false)
    const [datePicker, setDatePicker] = useState(false)
    const [birthDate, setBirthDate] = useState(userData?.dob ? true : false)
    const [date, setDate] = useState(userData?.dob ? new Date(userData?.dob * 1000) : new Date())

    function onDateSelected(_, value) {
        setDate(value)
        setDatePicker(false)
        setBirthDate(true)
    }

    const handleNextPress = () => {
        if (date) {
            const dateOfBirth = getUnixTimestamp(date)
            const yourAge = getAge(dateOfBirth)
            if (yourAge >= 18) {
                setLoading(true)
                const isUpdated = updateUser({ dob: getUnixTimestamp(date), age: yourAge })
                if (isUpdated) {
                    navigation.navigate(SCREEN.YOUR_GENDER)
                }
                setLoading(false)
            } else {
                showFlash(t('minimumAgeWarning'))
            }
        } else {
            showFlash(t('enterBirthDateWarning'))
        }
    }

    return (
        <SafeAreaView style={Styles.mainScreen}>
            <KeyboardAvoidingView
                style={Styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : ''}
            >
                {datePicker && (
                    <DateTimePicker
                        value={date}
                        mode={'date'}
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        is24Hour={true}
                        onChange={onDateSelected}
                    />
                )}

                <View style={Styles.flex}>
                    <ScrollView>
                        <View style={GlobalStyleSheet.container}>
                            <TouchableOpacity onPress={() => navigation.goBack()} style={Styles.backButton}>
                                <FeatherIcon size={26} color={colors.title} name={'chevron-left'} />
                            </TouchableOpacity>
                            <Text style={Styles.titleStyle}>{t('birthDateHeading')}</Text>

                            <View>
                                <TextInput
                                    editable={false}
                                    style={Styles.inputStyle}
                                    placeholder={'DD/MM/YYYY'}
                                    placeholderTextColor={colors.textLight}
                                    value={birthDate ? date.toLocaleDateString() : ""}
                                />
                                <TouchableOpacity onPress={() => setDatePicker(true)} style={Styles.absoluteView} />
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
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};


export default EnterBirthDate;

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
    inputStyle: {
        ...FONTS.font,
        fontSize: 18,
        lineHeight: 24,
        color: colors.title,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderColor,
        paddingHorizontal: 15,
        paddingVertical: 15,
    },
    titleStyle: {
        ...FONTS.h3,
        color: colors.title,
        marginBottom: 20,
    },
    absoluteView: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    bottomView: {
        paddingHorizontal: 45,
        paddingVertical: 35,
    },
})
