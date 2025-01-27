import React from 'react';
import { Image, StyleSheet, Text, TextInput, View } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useTheme } from '@react-navigation/native';
import { FONTS, IMAGES, SIZES } from '../../constants/theme';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import GradientBtn from './GradientBtn';

const PhoneNumberSheet = () => {

    const {colors} = useTheme();

    const countriesWithFlags = [
        {title: '+971', image: IMAGES.UnitedArabEmiratesFlag},
        {title: '+61', image: IMAGES.AustraliaFlag},
        {title: '+91', image: IMAGES.indiaFlag},
        {title: '+1', image: IMAGES.UnitedStatesFlag},
    ];

    return (
        <>
            <View style={{
                    paddingHorizontal:15,
                    borderBottomWidth:1,
                    borderColor:colors.borderColor,
                    paddingVertical:12,
                }}>
                    <Text style={{...FONTS.h5,color:colors.title}}>Phone Number</Text>
            </View>
            <View style={GlobalStyleSheet.container}>
                <View style={[styles.inputStyle,{borderColor:colors.borderColor}]}>   
                    <View
                        style={{
                            flexDirection:'row',
                            alignItems:'center',
                        }}
                    >
                        <SelectDropdown
                            data={countriesWithFlags}
                            defaultValue={countriesWithFlags[0]}
                            onSelect={(selectedItem, index) => {}}
                            buttonStyle={{
                                padding:0,
                                backgroundColor:'transparent',
                                width:102,
                                paddingRight:0,
                                height:24,
                            }}
                            renderDropdownIcon={() => {
                                return <FeatherIcon size={16} color={colors.textLight} name='chevron-down'/>
                            }}
                            renderCustomizedButtonChild={(selectedItem, index) => {
                                return (
                                <View style={{flexDirection:'row'}}>
                                    {selectedItem ? 
                                    <View
                                        style={{
                                            borderWidth:1,
                                            borderColor:colors.borderColor,
                                            overflow:'hidden',
                                            marginRight:6,
                                            borderRadius:4,
                                        }}
                                    >
                                        <Image
                                            style={{
                                                width:30,
                                                height:20,
                                            }}
                                            source={selectedItem.image}
                                        />
                                    </View>
                                    : undefined
                                    }
                                    <Text  style={{...FONTS.fontLg,color:colors.title,top:1}}>{selectedItem ? selectedItem.title : '000'}</Text>
                                </View>
                                );
                            }}
                            dropdownStyle={{
                                width:100,
                                borderRadius:4,
                            }}
                            rowStyle={{
                                height:40,
                                borderBottomColor:colors.borderColor,
                            }}
                            renderCustomizedRowChild={(item, index) => {
                                return (
                                    <View style={{flexDirection:'row',paddingHorizontal:10}}>
                                        <View
                                            style={{
                                                borderWidth:1,
                                                borderColor:colors.borderColor,
                                                overflow:'hidden',
                                                marginRight:6,
                                            }}
                                        >
                                            <Image
                                                style={{
                                                    width:30,
                                                    height:20,
                                                }}
                                                source={item.image}
                                            />
                                        </View>
                                        <Text style={{...FONTS.fontLg,color:colors.title}}>{item.title}</Text>
                                    </View>
                                );
                            }}
                        />
                    </View>

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
                        defaultValue='+00 0540 4705'
                        keyboardType='number-pad'
                        placeholder='Phone number'
                        placeholderTextColor={colors.textLight}
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

const styles = StyleSheet.create({

    inputStyle:{
        height:50,
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

export default PhoneNumberSheet;