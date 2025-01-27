import { Text, View, ScrollView } from 'react-native'
import React, { memo } from 'react'
import CheckList from './CheckList'
import { useLanguage } from '../../contexts'
import { FONTS } from '../../constants/theme'
import { useTheme } from '@react-navigation/native'
import { GlobalStyleSheet } from '../../constants/StyleSheet'

const HoroscopeSheet = ({ value, onSelect }) => {
    const { t } = useLanguage()
    const { colors } = useTheme()

    const zodiacSigns = [
        'Aries',
        'Taurus',
        'Gemini',
        'Cancer',
        'Leo',
        'Virgo',
        'Libra',
        'Scorpio',
        'Sagittarius',
        'Capricorn',
        'Aquarius',
        'Pisces',
    ]

    return (
        <>
            <View style={{
                paddingHorizontal: 15,
                borderBottomWidth: 1,
                borderColor: colors.borderColor,
                paddingVertical: 12,
            }}>
                <Text style={{ ...FONTS.h5, color: colors.title }}>{t('horoscope')}</Text>
            </View>
            <ScrollView>
                <View style={GlobalStyleSheet.container}>
                    {zodiacSigns?.map((data, index) => {
                        return (
                            <CheckList
                                key={index}
                                item={data}
                                onPress={() => onSelect(data)}
                                checked={data == value ? true : false}
                            />
                        )
                    })}
                </View>
            </ScrollView>
        </>
    )
}

export default memo(HoroscopeSheet)