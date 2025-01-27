import React from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, FONTS, IMAGES } from '../../constants/theme';
import { GlobalStyleSheet } from '../../constants/StyleSheet';

const Likes = ({navigation}) => {

    const {colors} = useTheme();

    const LikedData = [
        {
            image : IMAGES.likedPic1,
            name : "Chelsea",
            age : 25,
            about : "Harward University",
        },
        {
            image : IMAGES.likedPic2,
            name : "Abby",
            age : 27,
            about : "Chapman University",
        },
        {
            image : IMAGES.likedPic3,
            name : "Javelle",
            age : 23,
            about : "Law student at stanford",
        },
        {
            image : IMAGES.likedPic4,
            name : "Veronica",
            age : 25,
            about : "Chapman University",
        },
        {
            image : IMAGES.likedPic5,
            name : "Richard",
            age : 22,
            about : "Harward University",
        },
        {
            image : IMAGES.likedPic6,
            name : "chelsea",
            age : 25,
            about : "Harward University",
        },
        {
            image : IMAGES.likedPic1,
            name : "Chelsea",
            age : 25,
            about : "Harward University",
        },
        {
            image : IMAGES.likedPic2,
            name : "Abby",
            age : 27,
            about : "Chapman University",
        },
        {
            image : IMAGES.likedPic3,
            name : "Javelle",
            age : 23,
            about : "Law student at stanford",
        },
        {
            image : IMAGES.likedPic4,
            name : "Veronica",
            age : 25,
            about : "Chapman University",
        },
        {
            image : IMAGES.likedPic5,
            name : "Richard",
            age : 22,
            about : "Harward University",
        },
        {
            image : IMAGES.likedPic6,
            name : "chelsea",
            age : 25,
            about : "Harward University",
        },
    ]

    return (
        <>
            <SafeAreaView
                style={{
                    flex:1,
                    backgroundColor:colors.background,
                }}
            >
                <View
                    style={[styles.headerArea,{borderColor:colors.borderColor}]}
                >
                    <Text style={{...FONTS.h5,color:colors.title}}>Liked you</Text>
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

                <ScrollView
                    contentContainerStyle={{paddingBottom:80}}
                >
                    <View
                        style={GlobalStyleSheet.container}
                    >
                        <View style={GlobalStyleSheet.row}>
                            {LikedData.map((data,index) => {
                                return(
                                    <View
                                        style={[GlobalStyleSheet.col50,{marginBottom:10}]}
                                        key={index}
                                    >
                                        <TouchableOpacity
                                            onPress={() => navigation.navigate('ProfileDetails',{item : data})}
                                        >
                                            <Image
                                                style={{
                                                    width:'100%',
                                                    height:220,
                                                    borderRadius:10,
                                                }}
                                                source={data.image}
                                            />
                                            <LinearGradient
                                                colors={['rgba(0,0,0,0.1)','rgba(0,0,0,.7)']}
                                                style={{
                                                    position : 'absolute',
                                                    height: '100%',
                                                    width:'100%',
                                                    top:0,
                                                    borderRadius:10,
                                                    paddingHorizontal:15,
                                                    paddingVertical:15,
                                                    justifyContent:'flex-end',
                                                }}
                                            >
                                                <Text style={{...FONTS.h6,color:COLORS.white}}>{data.name}</Text>
                                                <Text style={{...FONTS.font,color:COLORS.white,opacity:.75}} numberOfLines={1}>{data.about}</Text>
                                            </LinearGradient>
                                        </TouchableOpacity>
                                    </View>
                                )
                            })}
                        </View>
                    </View>
                </ScrollView>

            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    headerArea:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        paddingHorizontal:15,
        paddingVertical:10,
        borderBottomWidth:1,
    },
    
})

export default Likes;