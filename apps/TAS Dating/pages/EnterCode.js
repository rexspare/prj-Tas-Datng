import React from 'react';
import {  KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import OTPTextInput from 'react-native-otp-textinput';
import { GlobalStyleSheet } from '../constants/StyleSheet';
import { COLORS, FONTS } from '../constants/theme';
import GradientBtn from './components/GradientBtn';

const EnterCode = ({navigation}) => {

    const {colors} = useTheme();

    return (
        <SafeAreaView
            style={{
                flex:1,
                backgroundColor:colors.cardBg,
            }}
        >
            <KeyboardAvoidingView
                style={{flex: 1}}
                behavior={Platform.OS === 'ios' ? 'padding' : ''}>
                <View style={{flex:1}}>
                    <ScrollView>
                        <View style={GlobalStyleSheet.container}>
                            <TouchableOpacity
                                onPress={() => navigation.goBack()}
                                style={{
                                    height:48,
                                    width:48,
                                    borderRadius:48,
                                    backgroundColor:colors.bgLight,
                                    alignItems:'center',
                                    justifyContent:'center',
                                    marginBottom:15,
                                }}
                            >
                                <FeatherIcon size={26} color={colors.title} name={'chevron-left'}/>
                            </TouchableOpacity>
                            <Text style={{...FONTS.h3,color:colors.title,marginBottom:20}}>Enter your code</Text>
                            <View style={{alignItems:'center'}}>
                                <OTPTextInput 
                                    tintColor={COLORS.primary}
                                    textInputStyle={{
                                        borderBottomWidth : 2,
                                        color :colors.title,
                                    }}
                                    containerStyle={{
                                        width : 300,
                                    }}
                                />
                            </View>
                        </View>
                    </ScrollView>
                </View>
                <View
                    style={{
                        paddingHorizontal:45,
                        paddingVertical:35,
                    }}
                >
                    <GradientBtn
                        onPress={() => navigation.navigate('FirstName')}
                        title={'Next'}
                    />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};


export default EnterCode;