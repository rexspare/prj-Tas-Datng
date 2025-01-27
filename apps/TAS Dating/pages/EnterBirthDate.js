import React, { useState } from 'react';
import {  SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';
import { GlobalStyleSheet } from '../constants/StyleSheet';
import { FONTS } from '../constants/theme';
import GradientBtn from './components/GradientBtn';

const EnterBirthDate = ({navigation}) => {

    const {colors} = useTheme();
    const [datePicker, setDatePicker] = useState(false);
    const [date, setDate] = useState(new Date());
    const [birthDate, setBirthDate] = useState(false);

    function onDateSelected(event, value) {
        setDate(value);
        setDatePicker(false);
        setBirthDate(true);
    };

    return (
        <SafeAreaView
            style={{
                flex:1,
                backgroundColor:colors.cardBg,
            }}
        >
            {datePicker && (
                <DateTimePicker
                    value={date}
                    mode={'date'}
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    is24Hour={true}
                    onChange={onDateSelected}
                />
            )}

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
                        <Text style={{...FONTS.h3,color:colors.title,marginBottom:20}}>Enter your Birth Date ?</Text>
                        
                        <View>
                            <TextInput
                                style={{
                                    ...FONTS.font,
                                    fontSize:18,
                                    lineHeight:24,
                                    color:colors.title,
                                    borderBottomWidth:1,
                                    borderBottomColor:colors.borderColor,
                                    paddingHorizontal:15,
                                    paddingVertical:15,
                                }}
                                value={birthDate ?  date.getDate() +"/"+ date.getMonth() +"/"+ date.getFullYear() : ""}
                                editable={false}
                                placeholder='DD/MM/YYYY'
                                placeholderTextColor={colors.textLight}
                            />
                            <TouchableOpacity
                                onPress={() => setDatePicker(true)}
                                style={{
                                    position:'absolute',
                                    top:0,
                                    left:0,
                                    bottom:0,
                                    right:0,
                                }}
                            >
                            </TouchableOpacity>
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
                    onPress={() => navigation.navigate('YourGender')}
                    title={'Next'}
                />
            </View>
        </SafeAreaView>
    );
};


export default EnterBirthDate;