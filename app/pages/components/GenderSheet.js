import { Text, View } from 'react-native'
import React, { memo } from 'react'
import CheckList from './CheckList'
import { useLanguage } from '../../contexts'
import { FONTS } from '../../constants/theme'
import { useTheme } from '@react-navigation/native'
import { GlobalStyleSheet } from '../../constants/StyleSheet'

const GenderSheet = ({ value, onSelect }) => {
    const { t } = useLanguage()
    const { colors } = useTheme()
    const genderData = ["Women", "Men", "Everyone"]

    return (
        <>
            <View style={{
                paddingHorizontal: 15,
                borderBottomWidth: 1,
                borderColor: colors.borderColor,
                paddingVertical: 12,
            }}>
                <Text style={{ ...FONTS.h5, color: colors.title }}>{t('showMe')}</Text>
            </View>
            <View style={GlobalStyleSheet.container}>
                {genderData?.map((data, index) => {
                    return (
                        <CheckList
                            item={data}
                            key={index}
                            onPress={() => onSelect(data)}
                            checked={data == value ? true : false}
                        />
                    )
                })}
            </View>
        </>
    )
}

export default memo(GenderSheet)