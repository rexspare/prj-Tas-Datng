import React from 'react';
import { Image, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { COLORS, FONTS, IMAGES } from '../../constants/theme';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import MsgComponent from '../../components/MsgComponent';

const SingleChat = ({navigation}) => {
    
    const {colors} = useTheme();
    
    const MsgData = [
        {
            msg : "Hi Richard , thanks for adding me",
            time : "08:35",
        },
        {
            msg : "Hi Miselia , your welcome , nice to meet you too",
            time : "08:37",
            sender : true,
        },
        {
            msg : "I look you're singer, can you sing for me",
            time : "08:35",
        },
        {
            msg : "Sure",
            time : "08:35",
            sender : true,
        },
        {
            msg : "Why not",
            time : "08:35",
            sender : true,
        },
    ]

    return (
        <>
            <SafeAreaView
                style={{
                    flex:1,
                    backgroundColor:colors.cardBg,
                }}
            >
                <KeyboardAvoidingView
                    style={{flex: 1}}
                    behavior={Platform.OS === 'ios' ? 'padding' : ''}>
                    <View
                        style={{
                            flexDirection:'row',
                            alignItems:'center',
                            paddingHorizontal:15,
                            paddingVertical:15,
                            backgroundColor:colors.cardBg,
                            borderBottomWidth:1,
                            borderBottomColor:colors.borderColor,
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={{
                                padding:10,
                                marginRight:5,
                            }}
                        >
                            <FeatherIcon color={colors.title} size={24} name='arrow-left'/>
                        </TouchableOpacity>
                        <View
                            style={{
                                flexDirection:'row',
                                alignItems:'center',
                                flex:1,
                            }}
                        >
                            <Image
                                style={{
                                    height:45,
                                    width:45,
                                    borderRadius:40,
                                    marginRight:15,
                                }}
                                source={IMAGES.userPic}
                            />
                            <View>
                                <Text style={{...FONTS.h6,color:colors.title,lineHeight:20,marginBottom:2}}>Misellia , 24</Text>
                                <Text style={{...FONTS.font,color:colors.textLight}}>Online 24m ago</Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            style={{
                                height:40,
                                width:40,
                                borderRadius:10,
                                backgroundColor:COLORS.primayLight,
                                alignItems:'center',
                                justifyContent:'center',
                                marginRight:10,
                            }}
                        >
                            <FontAwesome5 size={16} color={COLORS.primary} name='phone-alt'/>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                height:40,
                                width:40,
                                borderRadius:10,
                                backgroundColor:COLORS.primayLight,
                                alignItems:'center',
                                justifyContent:'center',
                            }}
                        >
                            <FontAwesome size={16} color={COLORS.primary} name='video-camera'/>
                        </TouchableOpacity>
                    </View>
                    <View 
                        style={{flex:1}}
                    >
                        <ScrollView>
                            <View style={[GlobalStyleSheet.container,{paddingTop:30}]}>
                                {MsgData.map((data,index) => {
                                    return(
                                        <MsgComponent
                                            key={index}
                                            sender={data.sender}
                                            item={data}
                                        />
                                    )
                                })}
                            </View>
                        </ScrollView>
                    </View>
                    <View>
                        <TextInput
                            style={{
                                ...FONTS.font,
                                backgroundColor:colors.cardBg,
                                borderTopWidth:1,
                                borderTopColor:colors.borderColor,
                                paddingHorizontal:20,
                                paddingVertical:15,
                                paddingRight:70,
                                fontSize:15,
                            }}
                            placeholder='Send Messages'
                            placeholderTextColor={colors.textLight}
                        />
                        <TouchableOpacity
                            style={{
                                height:45,
                                width:45,
                                borderRadius:40,
                                position:'absolute',
                                right:10,
                                top:7,
                                backgroundColor:COLORS.primayLight,
                                alignItems:'center',
                                justifyContent:'center',
                            }}
                        >
                            <FeatherIcon color={COLORS.primary} size={22} name='send'/>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </>
    );
};

export default SingleChat;