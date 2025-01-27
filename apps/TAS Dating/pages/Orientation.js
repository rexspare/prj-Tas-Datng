import React, { useState } from 'react';
import {  Platform, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import CheckBox from '@react-native-community/checkbox';
import { List } from 'react-native-paper';
import { GlobalStyleSheet } from '../constants/StyleSheet';
import { COLORS, FONTS } from '../constants/theme';
import GradientBtn from './components/GradientBtn';

const Orientation = ({navigation}) => {

    const {colors} = useTheme();

    const Data = [
        {
            title : "Straight",
            checked : false,
        },
        {
            title : "Gay",
            checked : false,
        },
        {
            title : "Lesbian",
            checked : false,
        },
        {
            title : "Bisexual",
            checked : false,
        },
        {
            title : "Asexual",
            checked : false,
        },
        {
            title : "Queer",
            checked : false,
        },
        {
            title : "Demisexual",
            checked : false,
        },
    ]

    const [ orientationData , setOrientationData] = useState(Data);

    const handleOrientationSelected = (val) => {
        let Data = orientationData.map((data) => {
            if (val === data.title) {
                return { ...data, checked: !data.checked };
            }
            return data;
        });
        setOrientationData(Data);
    }

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
                        <Text style={{...FONTS.h3,color:colors.title,marginBottom:20}}>Your sexual orientation ?</Text>
                        
                        {orientationData.map((data,index) => {
                            return(
                                <List.Item 
                                onPress={() => handleOrientationSelected(data.title)} 
                                    key={index}
                                    left={() => 
                                        <View
                                            style={[
                                                Platform.OS === 'ios' && {
                                                    transform : [{scale:.75}]
                                                }
                                            ]}
                                        >
                                            <CheckBox
                                                tintColors={{ true: COLORS.primary, false: colors.text }}
                                                style={{left:10}}
                                                boxType='square'
                                                tintColor={colors.borderColor}
                                                onTintColor={COLORS.primary}
                                                value={data.checked}
                                                onCheckColor={COLORS.white}
                                                onFillColor={COLORS.primary}
                                                
                                                disabled
                                            />
                                        </View>
                                    }
                                    title={() => <Text  style={{...FONTS.font,...FONTS.fontMedium,top:-1,color:colors.title}}>{data.title}</Text>}
                                />
                            )
                        })}

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
                    onPress={() => navigation.navigate('Intrested')}
                    title={'Next'}
                />
            </View>
        </SafeAreaView>
    );
};


export default Orientation;