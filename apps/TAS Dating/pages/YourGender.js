import React, { useState } from 'react';
import {  SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { GlobalStyleSheet } from '../constants/StyleSheet';
import { FONTS } from '../constants/theme';
import CheckList from './components/CheckList';
import GradientBtn from './components/GradientBtn';

const YourGender = ({navigation}) => {

    const {colors} = useTheme();

    const genderData= ["Women" , "Men", "Other"];
    const [activeGender , setGender] = useState(genderData[1]);

    return (
        <SafeAreaView
            style={{
                flex:1,
                backgroundColor:colors.cardBg,
            }}
        >
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
                        <Text style={{...FONTS.h3,color:colors.title,marginBottom:20}}>What's your gender ?</Text>
                        
                        <View>
                            {genderData.map((data,index) => {
                                return(
                                    <CheckList
                                        onPress={() => setGender(data)}
                                        item={data}
                                        checked={data == activeGender ? true : false}
                                        key={index}
                                    />
                                )
                            })}
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
                    onPress={() => navigation.navigate('Orientation')}
                    title={'Next'}
                />
            </View>
        </SafeAreaView>
    );
};


export default YourGender;