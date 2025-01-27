import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native'
import React, { memo } from 'react'
import { COLORS } from '../../constants/theme'

const SocialButton = ({ title, iconType, iconName, onPress, isLoading }) => {
    const Icon = iconType
    return (
        <TouchableOpacity
            activeOpacity={.8}
            style={styles.container}
            onPress={() => onPress()}
        >
            {isLoading ?
                <ActivityIndicator color={COLORS.primary} size={'small'} />
                :
                <>
                    {(iconName && iconType) &&
                        <Icon name={iconName} size={20} color={COLORS.primary} />
                    }
                    <Text style={styles.textStyle}>{title}</Text>
                </>
            }
        </TouchableOpacity>
    )
}

export default memo(SocialButton)

const styles = StyleSheet.create({
    container: {
        height: 55,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 30,
        borderWidth: 1.5,
        flexDirection: 'row',
        borderColor: COLORS.primary,
        backgroundColor: COLORS.white,
        shadowColor: COLORS.primary,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: .5,
        shadowRadius: 12,
        marginVertical: 8,
    },
    textStyle: {
        fontSize: 18,
        fontFamily: "Poppins-Medium",
        color: COLORS.primary,
        top: 1,
        marginLeft: '3%',
    },
})