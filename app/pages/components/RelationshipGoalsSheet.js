import { Text, View } from 'react-native'
import React, { memo } from 'react'
import CheckList from './CheckList'
import { useLanguage } from '../../contexts'
import { FONTS } from '../../constants/theme'
import { useTheme } from '@react-navigation/native'
import { GlobalStyleSheet } from '../../constants/StyleSheet'

const genderData = [
    "Long-term partner",
    "Long-term, open to short",
    "Short-term, open to long",
    "Short-term fun",
    "New friends",
    "Still figuring it out",
]

const RelationshipGoalsSheet = ({ value, onSelect }) => {
    const { t } = useLanguage()
    const { colors } = useTheme()
    return (
        <>
            <View style={{
                paddingHorizontal: 15,
                borderBottomWidth: 1,
                borderColor: colors.borderColor,
                paddingVertical: 12,
            }}>
                <Text style={{ ...FONTS.h5, color: colors.title }}>{t('relationshipGoals')}</Text>
            </View>
            <View style={GlobalStyleSheet.container}>
                {genderData.map((data, index) => {
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
        </>
    )
}

export default memo(RelationshipGoalsSheet)