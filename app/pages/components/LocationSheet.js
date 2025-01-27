import { Text, View } from 'react-native'
import React, { memo } from 'react'
import GradientBtn from './GradientBtn'
import { FONTS } from '../../constants/theme'
import { useTheme } from '@react-navigation/native'
import FeatherIcon from 'react-native-vector-icons/Feather'
import CustomInput from '../../components/Input/CustomInput'
import { GlobalStyleSheet } from '../../constants/StyleSheet'

const LocationSheet = () => {

    const { colors } = useTheme()

    return (
        <>
            <View style={{
                paddingHorizontal: 15,
                borderBottomWidth: 1,
                borderColor: colors.borderColor,
                paddingVertical: 12,
            }}>
                <Text style={{ ...FONTS.h5, color: colors.title }}>Location</Text>
            </View>
            <View style={GlobalStyleSheet.container}>
                <View style={{ marginBottom: 15 }}>
                    <CustomInput
                        icon={<FeatherIcon style={{ opacity: .6 }} name={'map-pin'} size={20} color={colors.text} />}
                        value={'2300 Traverwood Dr.Ann Arbor, MI 48105 United States'}
                        placeholder={'location'}
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

export default memo(LocationSheet)