import React, { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { GlobalStyleSheet } from '../constants/StyleSheet';
import { FONTS, SIZES } from '../constants/theme';
import GradientBtn from './components/GradientBtn';

import {CountryPicker} from "react-native-country-codes-picker";


const PhoneNumber = ({navigation}) => {

    const theme = useTheme();
    const {colors} = theme;

    const [show, setShow] = useState(false);
    const [countryCode, setCountryCode] = useState('+91');



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
                <CountryPicker
                    show={show}
                    pickerButtonOnPress={(item) => {
                        setCountryCode(item.dial_code);
                        setShow(false);
                    }}
                    onBackdropPress={() => setShow(false)}
                    style={{
                        modal : {
                            height : '60%',
                            backgroundColor: colors.cardBg,
                        },
                        textInput : {
                            paddingHorizontal:12,
                            height:48,
                            color: colors.title,
                            backgroundColor:colors.bgLight
                        },
                        dialCode: {
                            ...FONTS.fontLg,
                            ...FONTS.fontSemiBold,
                            color: colors.title,
                        },
                        countryName : {
                            ...FONTS.font,
                            ...FONTS.fontSemiBold,
                            color: colors.text,
                        },
                        countryButtonStyles: {
                            height: 50,
                            backgroundColor:colors.cardBg,
                            borderRadius:0,
                            borderBottomWidth:1,
                            borderBottomColor:colors.borderColor,
                            marginBottom:0,
                        },
                    }}
                />
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
                            <Text style={{...FONTS.h3,color:colors.title,marginBottom:20}}>Please Enter your Phone Number</Text>

                            <View style={[styles.inputStyle,{borderColor:colors.borderColor}]}>
                                
                                <TouchableOpacity
                                    onPress={() => setShow(true)}
                                    style={{
                                        flexDirection:'row',
                                        alignItems:'center',
                                        paddingRight:8,
                                    }}
                                >
                                    <Text style={{
                                        ...FONTS.fontLg,
                                        color:colors.title,
                                    }}>{countryCode}</Text>
                                    <FeatherIcon style={{marginLeft:2}} color={colors.title} size={18} name="chevron-down"/>
                                </TouchableOpacity>

                                <TextInput
                                    style={{
                                        ...FONTS.font,
                                        fontSize:16,
                                        color:colors.title,
                                        flex:1,
                                        top:0,
                                        borderLeftWidth:1,
                                        borderLeftColor:colors.borderColor,
                                        paddingVertical:0,
                                        paddingLeft:12,
                                    }}
                                    //autoFocus
                                    keyboardType='number-pad'
                                    placeholder='Phone number'
                                    placeholderTextColor={colors.textLight}
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
                        onPress={() => navigation.navigate('EnterCode')}
                        title={'Next'}
                    />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({

    inputStyle:{
        height:55,
        padding:5,
        paddingHorizontal:15,
        borderWidth : 1,
        borderRadius: SIZES.radius,
        marginBottom:15,
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'rgba(255,255,255,.05)',
    },
    
})


export default PhoneNumber;