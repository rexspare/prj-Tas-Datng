import { KeyboardAvoidingView, Platform, StyleSheet, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuth, useLanguage } from '../contexts'
import { FONTS } from '../constants/theme'
import { GradientBtn } from './components'
import { SCREEN } from '../constants/enums'
import { showFlash } from '../utils/helpers'
import { useTheme } from '@react-navigation/native'
import { GlobalStyleSheet } from '../constants/StyleSheet'
import FeatherIcon from 'react-native-vector-icons/Feather'

const FirstName = ({ navigation }) => {
    const { t } = useLanguage()
    const { colors } = useTheme()
    const Styles = styles(colors)
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState(userData?.name)
    const { updateUser, userData, user, updateUserLocation } = useAuth()

    useEffect(() => {
        if (!userData?.location) {
            updateUserLocation()
        }
    }, [])


    const handleNextPress = () => {
        if (name) {
            setLoading(true)
            const isUpdated = updateUser({ name: name, uid: user?.uid })
            if (isUpdated) {
                navigation.navigate(SCREEN.BIRTH_DATE)
            }
            setLoading(false)
        } else {
            showFlash(t('enterNameWarning'))
        }
    }

    return (
        <SafeAreaView style={Styles.mainScreen}>
            <KeyboardAvoidingView
                style={Styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : ''}>
                <View style={Styles.flex}>
                    <ScrollView>
                        <View style={GlobalStyleSheet.container}>
                            <TouchableOpacity style={Styles.backButton} onPress={() => navigation.goBack()}>
                                <FeatherIcon size={26} color={colors.title} name={'chevron-left'} />
                            </TouchableOpacity>

                            <Text style={Styles.titleStyle}>{t('nameHeading')}</Text>
                            <TextInput
                                autoFocus
                                value={name}
                                style={Styles.inputStyle}
                                placeholder={t('namePlaceholder')}
                                onChangeText={(x) => setName(x)}
                                placeholderTextColor={colors.textLight}
                            />

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


export default FirstName

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
    bottomView: {
        paddingHorizontal: 45,
        paddingVertical: 35,
    },
})
