import React, { useState } from 'react';
import {  SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { GlobalStyleSheet } from '../constants/StyleSheet';
import { FONTS } from '../constants/theme';
import CheckList from './components/CheckList';
import GradientBtn from './components/GradientBtn';

const LookingFor = ({navigation}) => {

    const {colors} = useTheme();

    const genderData= [
        "Long-term partner" , 
        "Long-term, open to short", 
        "Short-term, open to long",
        "Short-term fun",
        "New friends",
        "Stil figuring it out",
    ];
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
                        <Text style={{...FONTS.h3,color:colors.title,marginBottom:20}}>What are you looking for right now ?</Text>
                        
                        <View>
                            {genderData.map((data,index) => {
                                return(
                                    <CheckList
                                        onPress={() => setGender(data)}
                                        item={data}
                                        checked={data == activeGender ? true : false}
                                        key={index}
                                    />
                                    // <TouchableOpacity
                                    //     onPress={() => setGender(data)}
                                    //     key={index}
                                    //     style={[{
                                    //         borderWidth:1,
                                    //         borderColor:colors.borderColor,
                                    //         marginBottom:12,
                                    //         borderRadius:6,
                                    //         paddingHorizontal:15,
                                    //         paddingVertical:10,
                                    //         flexDirection:'row',
                                    //         alignItems:'center',
                                    //     }, data == activeGender && {
                                    //         borderColor:COLORS.primary,
                                    //     }]}
                                    // >
                                    //     <Text style={[{...FONTS.h6,color:colors.text,flex:1},data == activeGender && {color: COLORS.primary}]}>{data}</Text>
                                    //     <View
                                    //         style={[{
                                    //             height:16,
                                    //             width:16,
                                    //             borderWidth:1,
                                    //             borderRadius:10,
                                    //             borderColor:colors.textLight,
                                    //             alignItems:'center',
                                    //             justifyContent:'center',
                                    //         }, data == activeGender && {
                                    //             borderColor:COLORS.primary
                                    //         }]}
                                    //     >
                                    //         {data == activeGender && 
                                    //             <View
                                    //                 style={{
                                    //                     height:10,
                                    //                     width:10,
                                    //                     backgroundColor:COLORS.primary,
                                    //                     borderRadius:8,
                                    //                 }}
                                    //             />
                                    //         }
                                    //     </View>
                                    // </TouchableOpacity>
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
                    onPress={() => navigation.navigate('RecentPics')}
                    title={'Next'}
                />
            </View>
        </SafeAreaView>
    );
};


export default LookingFor;