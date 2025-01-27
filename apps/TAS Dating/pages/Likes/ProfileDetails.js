import React from 'react';
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Header from '../../layout/Header';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { COLORS, FONTS, IMAGES, SIZES } from '../../constants/theme';

const ProfileDetails = ({route}) => {

    const {colors} = useTheme();
    const { item } = route.params;

    const intrestData = [
        {
            icon : "camera",
            title : "Photography",
        },
        {
            icon : "music",
            title : "Music",
        },
        {
            icon : "book",
            title : "Study",
        },
        {
            icon : "film",
            title : "Movies",
        },
        {
            icon : "instagram",
            title : "Instagram",
        },
        {
            icon : "map-pin",
            title : "Travelling",
        },
    ]

    const languagesData = ["English","Spanish","German"];
 
    return (
        <SafeAreaView
            style={{
                flex:1,
                backgroundColor:colors.cardBg,
            }}
        >
            <Header
                leftIcon={'back'}
                title={'Recommendation'}
                titleLeft
            />
            <ScrollView>
                <View style={GlobalStyleSheet.container}>
                    <View style={{marginBottom:15,marginHorizontal:-5}}>
                        <Image
                            style={{
                                width:'100%',
                                height:undefined,
                                aspectRatio : 1 / 1.3,
                                borderRadius:SIZES.radius,
                            }}
                            source={item.image}
                        />
                        <LinearGradient
                            colors={['rgba(0,0,0,0)','rgba(0,0,0,0)','rgba(0,0,0,.7)']}
                            style={{
                                position : 'absolute',
                                height: '100%',
                                width:'100%',
                                top:0,
                                borderRadius:10,
                                paddingHorizontal:18,
                                paddingVertical:25,
                                justifyContent:'flex-end',
                            }}
                        >
                            <View
                                style={{
                                    flexDirection:'row',
                                    alignItems:'center',
                                }}
                            >
                                <View style={{flex:1}}>
                                    <Text style={{...FONTS.h6,color:COLORS.white}}>{item.name}</Text>
                                    <Text style={{...FONTS.font,color:COLORS.white,opacity:.75}} numberOfLines={1}>{item.about}</Text>
                                </View>
                                <TouchableOpacity
                                    style={{
                                        height:50,
                                        width:50,
                                        borderRadius:50,
                                        alignItems:'center',
                                        justifyContent:'center',
                                        backgroundColor:COLORS.primary,
                                    }}
                                >
                                    <Image style={{height:28,width:28,top:1,tintColor:COLORS.white}} source={IMAGES.star}/>
                                </TouchableOpacity>
                            </View>
                        </LinearGradient>
                        <View
                            style={{
                                position:'absolute',
                                top:15,
                                left:15,
                                backgroundColor:'rgba(0,0,0,.8)',
                                borderRadius:20,
                                flexDirection:'row',
                                alignItems:'center',
                                paddingHorizontal:10,
                                paddingVertical:3,
                            }}
                        >
                            <View
                                style={{
                                    height:8,
                                    width:8,
                                    backgroundColor:COLORS.success,
                                    borderRadius:8,
                                    marginRight:6,
                                }}
                            />
                            <Text style={{...FONTS.fontSm,color:COLORS.white,top:-1}}>Recently active</Text>
                        </View>
                    </View>
                    <View style={{paddingHorizontal:8}}>
                        <Text style={{...FONTS.h6,fontSize:15,color:colors.title,marginBottom:2}}>Basic information</Text>
                        <Text style={{...FONTS.font,color:colors.textLight,lineHeight:18,marginBottom:15}}>Just moved back to jakarata after living at India for 10+ years. Di luar terlifiat cenger - center di dalam.</Text>
                        <Text style={{...FONTS.h6,fontSize:15,color:colors.title,marginBottom:4}}>Intrests</Text>
                        <View
                            style={{
                                flexDirection:'row',
                                flexWrap:'wrap',
                                marginBottom:8,
                            }}
                        >
                            {intrestData.map((data,index) => {
                                return(
                                    <TouchableOpacity
                                        key={index}
                                        style={{
                                            backgroundColor:'rgba(0,0,0,0.03)',
                                            marginRight:8,
                                            marginBottom:8,
                                            flexDirection:'row',
                                            alignItems:'center',
                                            borderWidth:1,
                                            borderColor:colors.borderColor,
                                            borderRadius:30,
                                            paddingHorizontal:12,
                                            paddingVertical:4,
                                        }}
                                    >
                                        <FeatherIcon color={colors.textLight} size={14} style={{marginRight:6}} name={data.icon}/>
                                        <Text style={{...FONTS.font,color:colors.title,top:-1}}>{data.title}</Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                        <Text style={{...FONTS.h6,fontSize:15,color:colors.title,marginBottom:4}}>Languages</Text>
                        <View
                            style={{
                                flexDirection:'row',
                                flexWrap:'wrap',
                                marginBottom:8,
                            }}
                        >
                            {languagesData.map((data,index) => {
                                return(
                                    <TouchableOpacity
                                        key={index}
                                        style={{
                                            backgroundColor:'rgba(0,0,0,0.03)',
                                            marginRight:8,
                                            marginBottom:8,
                                            flexDirection:'row',
                                            alignItems:'center',
                                            borderWidth:1,
                                            borderColor:colors.borderColor,
                                            borderRadius:30,
                                            paddingHorizontal:12,
                                            paddingVertical:4,
                                        }}
                                    >
                                        <Text style={{...FONTS.font,color:colors.title,top:-1}}>{data}</Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ProfileDetails;