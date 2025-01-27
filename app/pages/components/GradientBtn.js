import { TouchableOpacity, Text, Platform, StyleSheet, ActivityIndicator } from 'react-native'
import React, { memo } from 'react'
import { COLORS } from '../../constants/theme'
import DropShadow from 'react-native-drop-shadow'
import { emptyFunction } from '../../utils/helpers'
import LinearGradient from 'react-native-linear-gradient'

const GradientBtn = ({ title = '', onPress = emptyFunction, isLoading, style, textStyle }) => {
    return (
        <TouchableOpacity activeOpacity={.8} onPress={() => onPress()}>
            <DropShadow style={[styles.container, Platform.OS === 'ios' && styles.iosStyle]}>
                <LinearGradient
                    style={[styles.button, style]}
                    colors={["#FF78B7", "#FF3C97"]}
                >
                    {isLoading ?
                        <ActivityIndicator color={'white'} size={'small'} />
                        :
                        <Text style={[styles.text, textStyle]}>{title}</Text>
                    }
                </LinearGradient>
            </DropShadow>
        </TouchableOpacity>
    )
}

export default memo(GradientBtn)

const styles = StyleSheet.create({
    container: {
        shadowColor: COLORS.primary,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: .5,
        shadowRadius: 12,
    },
    iosStyle: {
        backgroundColor: COLORS.primary,
        borderRadius: 30,
    },
    button: {
        height: 55,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 30,
    },
    text: {
        fontSize: 18,
        fontFamily: "Poppins-Medium",
        color: COLORS.white,
        top: 1,
    },
})