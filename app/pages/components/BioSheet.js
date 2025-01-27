import { Text, View } from 'react-native'
import React, { useState, memo } from 'react'
import GradientBtn from './GradientBtn'
import { FONTS } from '../../constants/theme'
import { showFlash } from '../../utils/helpers'
import { useTheme } from '@react-navigation/native'
import { useAuth, useLanguage } from '../../contexts'
import FeatherIcon from 'react-native-vector-icons/Feather'
import CustomInput from '../../components/Input/CustomInput'
import { GlobalStyleSheet } from '../../constants/StyleSheet'

const BioSheet = ({ value, onChange }) => {
    const { t } = useLanguage()
    const { colors } = useTheme()
    const { updateUser } = useAuth()
    const [loading, setLoading] = useState(false)

    const onSavePress = async () => {
        if (value) {
            setLoading(true)
            await updateUser({ bio: value })
            setLoading(false)
        } else {
            showFlash(t('emptyBioWarning'))
        }
    }

    return (
        <>
            <View style={{
                paddingHorizontal: 15,
                borderBottomWidth: 1,
                borderColor: colors.borderColor,
                paddingVertical: 12,
            }}>
                <Text style={{ ...FONTS.h5, color: colors.title }}>{t('basicInformation')}</Text>
            </View>
            <View style={GlobalStyleSheet.container}>
                <View style={{ marginBottom: 15 }}>
                    <CustomInput
                        value={value}
                        placeholder={t('bio')}
                        onChangeText={onChange}
                        icon={<FeatherIcon style={{ opacity: .6 }} name={'info'} size={20} color={colors.text} />}
                    />
                </View>
                <View style={{ paddingHorizontal: 15, }}>
                    <GradientBtn title={t('save')} onPress={onSavePress} isLoading={loading} />
                </View>
            </View>
        </>
    )
}

export default memo(BioSheet)