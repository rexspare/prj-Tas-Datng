import React from 'react';
import { 
    Image, 
    ImageBackground, 
    Platform, 
    SafeAreaView, 
    ScrollView, 
    StyleSheet, 
    Text, 
    TouchableOpacity, 
    View 
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import * as Progress from 'react-native-progress';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FeatherIcon from 'react-native-vector-icons/Feather';
import DropShadow from 'react-native-drop-shadow';
import { COLORS, FONTS, IMAGES } from '../../constants/theme';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import GradientBtn from '../components/GradientBtn';
import Divider from '../../components/Dividers/Divider';

const Profile = ({navigation}) => {
    
    const {colors} = useTheme();

    const Features = [
        "Unlimited likes",
        "Beeline",
        "Advanced filters",
        "Incognito mode",
        "Travel mode",
        "5 SuperSwipes a week",
        "1 Spotlight a week",
        "Unlimited Extends",
        "Unlimited Rematch",
        "Unlimited Backtrack",
    ]

    return (
        <>
            <SafeAreaView style={{flex:1,backgroundColor:colors.background}}>
                <ScrollView>
                    <DropShadow
                        style={[{
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 4,
                                height: 4,
                            },
                            shadowOpacity: .15,
                            shadowRadius: 5,
                        },Platform.OS === 'ios' && {
                            backgroundColor:colors.cardBg
                        }]}
                    >
                        <View
                            style={[styles.profileArea,{
                                backgroundColor:colors.cardBg,  
                            }]}
                        >
                            <View
                                style={styles.headerArea}
                            >
                                <Text style={{...FONTS.h5,color:colors.title}}>Profile</Text>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('Filter')}
                                    style={[GlobalStyleSheet.headerBtn,{borderColor:colors.borderColor,}]}
                                >
                                <Image
                                    style={{
                                        height:22,
                                        width:22,
                                        tintColor:colors.title,
                                    }}
                                    source={IMAGES.filter}
                                />
                                </TouchableOpacity>
                            </View>
                            <View
                                style={{
                                    flexDirection:'row',
                                    alignItems:'center',
                                    justifyContent:'space-around',
                                    marginBottom:25,
                                }}
                            >
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('Settings')}
                                    style={styles.actionBtn}
                                >
                                    <FontAwesome5 color={COLORS.primary} size={22} name={'cog'}/>
                                </TouchableOpacity>
                                <View
                                    style={{
                                        alignItems:'center',
                                        justifyContent:'center',
                                    }}
                                >
                                    <View
                                        style={{transform:[{rotate : '180deg'}]}}
                                    >
                                        <Progress.Circle 
                                            borderWidth={0}
                                            unfilledColor={'#d4e8f2'}
                                            color={COLORS.primary}
                                            progress={0.4} 
                                            size={130} 
                                            thickness={5}
                                            strokeCap={'round'}
                                        />
                                    </View>
                                    <Image
                                        style={{
                                            height:120,
                                            width:120,
                                            borderRadius:100,
                                            position:'absolute',
                                        }}
                                        source={IMAGES.userPic}
                                    />
                                    <View
                                        style={[styles.profileProgress,{
                                            borderColor:colors.cardBg,
                                        }]}
                                    >
                                        <Text style={{...FONTS.font,...FONTS.fontBold,color:COLORS.white}}>40%</Text>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('EditProfile')}
                                    style={styles.actionBtn}
                                >
                                    <FontAwesome5 color={COLORS.primary} size={20} name={'pencil-alt'}/>
                                </TouchableOpacity>
                            </View>
                            <View style={{alignItems:'center'}}>
                                <Text style={{...FONTS.h4,color:colors.title,lineHeight:22}}>Richard , 20</Text>
                                <View
                                    style={{flexDirection:'row',alignItems:'center'}}
                                >
                                    <FeatherIcon color={colors.text} size={13} style={{marginRight:5,top:1}} name='map-pin' />
                                    <Text style={{...FONTS.font,color:colors.text}}>Mantreal, Canada</Text>
                                </View>
                            </View>
                        </View>
                    </DropShadow>
                    <View style={GlobalStyleSheet.container}>
                        <View style={GlobalStyleSheet.row}>
                            <View style={GlobalStyleSheet.col50}>
                                <DropShadow
                                    style={{
                                        shadowColor: "#000",
                                        shadowOffset: {
                                            width: 4,
                                            height: 4,
                                        },
                                        shadowOpacity: .15,
                                        shadowRadius: 5,
                                    }}
                                >
                                    <TouchableOpacity
                                        style={{
                                            backgroundColor:colors.cardBg,
                                            borderRadius:10,
                                            paddingHorizontal:12,
                                            paddingVertical:15,
                                            flexDirection:'row',
                                            alignItems:'center',
                                        }}
                                    >
                                        <Image
                                            style={{
                                                height:26,
                                                width:26,
                                                marginRight:12,
                                                tintColor:COLORS.primary,
                                            }}
                                            source={IMAGES.sparkle}
                                        />
                                        <View>
                                            <Text style={{...FONTS.font,...FONTS.fontBold,color:colors.title}}>Spotlight</Text>
                                            <Text style={{...FONTS.font,color:colors.text}}>from 18.50 INR</Text>
                                        </View>
                                    </TouchableOpacity>
                                </DropShadow>
                            </View>
                            <View style={GlobalStyleSheet.col50}>
                                <DropShadow
                                    style={{
                                        shadowColor: "#000",
                                        shadowOffset: {
                                            width: 4,
                                            height: 4,
                                        },
                                        shadowOpacity: .15,
                                        shadowRadius: 5,
                                    }}
                                >
                                    <TouchableOpacity
                                        style={{
                                            backgroundColor:colors.cardBg,
                                            borderRadius:10,
                                            paddingHorizontal:12,
                                            paddingVertical:15,
                                            flexDirection:'row',
                                            alignItems:'center',
                                        }}
                                    >
                                        <Image
                                            style={{
                                                height:26,
                                                width:26,
                                                marginRight:12,
                                                tintColor:COLORS.primary,
                                            }}
                                            source={IMAGES.star}
                                        />
                                        <View>
                                            <Text style={{...FONTS.font,...FONTS.fontBold,color:colors.title}}>SuperSwipe</Text>
                                            <Text style={{...FONTS.font,color:colors.text}}>from 10.50 INR</Text>
                                        </View>
                                    </TouchableOpacity>
                                </DropShadow>
                            </View>
                        </View>
                    </View>
                
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingLeft:15,
                            paddingTop:15,
                            paddingBottom:90,
                        }}
                    >
                        <DropShadow
                            style={[{
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 4,
                                    height: 4,
                                },
                                shadowOpacity: .15,
                                shadowRadius: 5,
                                marginRight:15,
                                borderRadius:20,
                            },Platform.OS === 'ios' && {
                                backgroundColor: colors.cardBg,
                            }]}
                        >
                            <View
                                style={{
                                    backgroundColor:colors.cardBg,
                                    width:300,
                                    overflow:'hidden',
                                    borderRadius:20,
                                }}
                            >
                                <ImageBackground
                                    source={IMAGES.pattern1}
                                    style={{
                                        paddingHorizontal:20,
                                        paddingVertical:25,
                                    }}
                                >
                                    <Text style={{...FONTS.h2,color:COLORS.white}}>PREMIUM - {'\n'}PRO</Text>
                                    <View 
                                        style={{
                                            position:'absolute',
                                            bottom:10,
                                            right:20,
                                            alignItems:'flex-end',
                                        }}
                                    >
                                        <Text style={{...FONTS.h2,color:COLORS.white,lineHeight:30}}>$45.15</Text>
                                        <Text style={{...FONTS.font,fontSize:16,opacity:.8,color:COLORS.white}}>/ month</Text>
                                    </View>
                                </ImageBackground>
                                <View
                                    style={{
                                        paddingHorizontal:15,
                                        paddingVertical:20,
                                    }}
                                >
                                    <Text style={[FONTS.h5,{color:colors.title}]}>Features:</Text>
                                    <View style={{marginBottom:15}}>
                                        {Features.map((data,index) => {
                                            return(
                                                <View
                                                    key={index}
                                                >
                                                    <View 
                                                        style={{...styles.priceListItem,borderColor:colors.borderColor}}>
                                                        <FontAwesome5 style={{marginRight:8}} color={COLORS.success} size={14} name='check'/>
                                                        <Text style={{...FONTS.font,color:colors.text}}>{data}</Text>
                                                    </View>
                                                    <Divider style={{marginBottom:0,marginTop:0}} dashed/>
                                                </View>
                                            )
                                        })}
                                    </View>
                                    <View style={{paddingHorizontal:15,paddingVertical:10}}>    
                                        <GradientBtn
                                            title={"Subscribe now"}
                                        />
                                    </View>
                                </View>
                            </View>
                        </DropShadow>
                        <DropShadow
                            style={[{
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 4,
                                    height: 4,
                                },
                                shadowOpacity: .15,
                                shadowRadius: 5,
                                marginRight:15,
                                borderRadius:20,
                            },Platform.OS === 'ios' && {
                                backgroundColor:colors.cardBg,
                            }]}
                        >
                            <View
                                style={{
                                    backgroundColor:colors.cardBg,
                                    width:300,
                                    borderRadius:20,
                                    overflow:'hidden',
                                }}
                            >
                                <View
                                    style={{
                                        paddingHorizontal:20,
                                        paddingVertical:25,
                                        backgroundColor:'#221743',
                                    }}
                                >
                                    <Text style={{...FONTS.h2,color:COLORS.white}}>BOOST - {'\n'}BASIC</Text>
                                    <View 
                                        style={{
                                            position:'absolute',
                                            bottom:10,
                                            right:20,
                                            alignItems:'flex-end',
                                        }}
                                    >
                                        <Text style={{...FONTS.h2,color:COLORS.white,lineHeight:30}}>$25.10</Text>
                                        <Text style={{...FONTS.font,fontSize:16,opacity:.8,color:COLORS.white}}>/ month</Text>
                                    </View>
                                </View>
                                <View
                                    style={{
                                        paddingHorizontal:15,
                                        paddingVertical:20,
                                    }}
                                >
                                    <Text style={[FONTS.h5,{color:colors.title}]}>Features:</Text>
                                    <View style={{marginBottom:15}}>
                                        {Features.map((data,index) => {
                                            return(
                                                <View
                                                    key={index}
                                                >
                                                    <View 
                                                        style={{...styles.priceListItem,borderColor:colors.borderColor}}>
                                                        <FontAwesome5 style={{marginRight:8}} color={COLORS.success} size={14} name='check'/>
                                                        <Text style={{...FONTS.font,color:colors.text}}>{data}</Text>
                                                    </View>
                                                    <Divider style={{marginBottom:0,marginTop:0}} dashed/>
                                                </View>
                                            )
                                        })}
                                    </View>
                                    <View style={{paddingHorizontal:15,paddingVertical:10}}>    
                                        <GradientBtn
                                            title={"Subscribe now"}
                                        />
                                    </View>
                                </View>
                            </View>
                        </DropShadow>
                    </ScrollView>
                
                </ScrollView>

            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    headerArea : {
        flexDirection:'row',
        paddingTop:15,
        paddingBottom:20,
        alignItems:'center',
        justifyContent:'space-between',
    },
    actionBtn : {
        height:50,
        width:50,
        borderRadius:50,
        backgroundColor:COLORS.primayLight,
        alignItems:'center',
        justifyContent:'center',
    },
    profileArea : {
        paddingBottom:40,
        paddingHorizontal:15,
    },
    profileProgress : {
        position:'absolute',
        bottom:-10,
        backgroundColor:COLORS.primary,
        paddingHorizontal:8,
        paddingVertical:2,
        borderRadius:20,
        borderWidth:2,
    },
    priceListItem:{
        flexDirection:'row',
        alignItems:'center',
        paddingVertical:8,
    }
})

export default Profile;