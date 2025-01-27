import React from 'react';
import { Text, View } from 'react-native';
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { useTheme } from '@react-navigation/native';
import { FONTS } from '../../constants/theme';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import CustomInput from '../../components/Input/CustomInput';
import GradientBtn from './GradientBtn';

const EmailSheet = () => {

    const {colors} = useTheme();

    return (
        <>
            <View style={{
                    paddingHorizontal:15,
                    borderBottomWidth:1,
                    borderColor:colors.borderColor,
                    paddingVertical:12,
                }}>
                    <Text style={{...FONTS.h5,color:colors.title}}>Email Address</Text>
            </View>
            <View style={GlobalStyleSheet.container}>
                <View style={{marginBottom:15}}>
                    <CustomInput
                        icon={<MaterialIcon style={{opacity:.6}} name={'email'} size={20} color={colors.text}/> }
                        value={'yourname@gmail.com'}    
                        placeholder={'Emai'}
                        onChangeText={(value)=> console.log(value)}
                    />
                </View>
                <View
                    style={{
                        paddingHorizontal:15,
                    }}
                >
                    <GradientBtn title={'Save'}/>
                </View>
            </View>
        </>
    );
};

export default EmailSheet;