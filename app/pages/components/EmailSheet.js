import { Text, View } from 'react-native'
import React, { memo } from 'react'
import GradientBtn from './GradientBtn'
import { FONTS } from '../../constants/theme'
import { useTheme } from '@react-navigation/native'
import CustomInput from '../../components/Input/CustomInput'
import { GlobalStyleSheet } from '../../constants/StyleSheet'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'

const EmailSheet = () => {
    const { colors } = useTheme()

    return (
        <>
            <View style={{
                paddingHorizontal: 15,
                borderBottomWidth: 1,
                borderColor: colors.borderColor,
                paddingVertical: 12,
            }}>
                <Text style={{ ...FONTS.h5, color: colors.title }}>Email Address</Text>
            </View>
            <View style={GlobalStyleSheet.container}>
                <View style={{ marginBottom: 15 }}>
                    <CustomInput
                        icon={<MaterialIcon style={{ opacity: .6 }} name={'email'} size={20} color={colors.text} />}
                        value={'yourname@gmail.com'}
                        placeholder={'Emai'}
                        onChangeText={() => { }}
                    />
                </View>
                <View
                    style={{
                        paddingHorizontal: 15,
                    }}
                >
                    <GradientBtn title={'Save'} />
                </View>
            </View>
        </>
    )
}

export default memo(EmailSheet)