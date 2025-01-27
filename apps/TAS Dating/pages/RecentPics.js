import React, { useState } from 'react';
import {  Image, PermissionsAndroid, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import uuid from 'react-native-uuid';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { GlobalStyleSheet } from '../constants/StyleSheet';
import { COLORS, FONTS, IMAGES, SIZES } from '../constants/theme';
import GradientBtn from './components/GradientBtn';

const RecentPics = ({navigation}) => {

    const {colors} = useTheme();

    const [imageData , setImageData] = useState([{
        id : uuid.v4(),
        imagePath : IMAGES.likedPic6,
    }]);
    
    const UploadFile = async (type) => {
        try {
            if(Platform.OS === 'ios'){
                let options = {
                    mediaType: type,
                    maxWidth: 200,
                    maxHeight: 200,
                    quality: 1,
                };
                launchImageLibrary(options, (response) => {
                    if(!response.didCancel){
                        setImageData([...imageData , {id : uuid.v4(),image : response.assets[0].uri}])
                    }
                })
            }else{
                await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
                ]).then((result) => {
                    if (result['android.permission.CAMERA']
                    && result['android.permission.READ_EXTERNAL_STORAGE'] === 'granted') {
                        let options = {
                            mediaType: type,
                            maxWidth: 200,
                            maxHeight: 200,
                            quality: 1,
                        };
                        launchImageLibrary(options, (response) => {
                            if(!response.didCancel){
                                setImageData([...imageData , {id : uuid.v4(),image : response.assets[0].uri}])
                            }
                        })
                    }
                });
            }
        } catch (err) {
            console.warn(err);
        }


    }

    const removeImageItem = (index) => {
        setImageData([
            ...imageData.slice(0, index),
            ...imageData.slice(index + 1, imageData.length)
        ]);
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
                        <Text style={{...FONTS.h3,color:colors.title,marginBottom:20}}>Add your recent pics</Text>
                    
                        <View
                            style={{
                                flexDirection:'row',
                                flexWrap:'wrap',
                            }}
                        >
                            <View style={GlobalStyleSheet.col66}>
                                <TouchableOpacity
                                    onPress={() => UploadFile('photo')}
                                    activeOpacity={.9}
                                    style={[styles.imageBox,{height:SIZES.width / 1.8,borderColor:colors.borderColor}]}
                                >
                                    {imageData[0] ?
                                        <>
                                            <Image
                                                source={ imageData[0].image ? {uri : imageData[0].image} : imageData[0].imagePath}
                                                style={{
                                                    width:'100%',
                                                    height:'100%',
                                                    borderRadius:SIZES.radius,
                                                    
                                                }}
                                            />
                                            <TouchableOpacity
                                                onPress={() => removeImageItem(0)}
                                                activeOpacity={.8}
                                                style={{
                                                    height:25,
                                                    width:25,
                                                    borderRadius:20,
                                                    position:'absolute',
                                                    top: 8,
                                                    right: 8,
                                                    zIndex:1,
                                                    alignItems:'center',
                                                    justifyContent:'center',
                                                    backgroundColor:COLORS.danger,
                                                }}
                                            >
                                                <FeatherIcon name='x' size={16} color={COLORS.white}/>
                                            </TouchableOpacity>
                                        </>
                                        :
                                        <FeatherIcon name='image' color={colors.borderColor} size={45}/>
                                    }
                                </TouchableOpacity>
                            </View>
                            <View style={GlobalStyleSheet.col33}>
                                <TouchableOpacity
                                    onPress={() => UploadFile('photo')}
                                    activeOpacity={.9}
                                    style={[styles.imageBox,{borderColor:colors.borderColor}]}
                                >
                                    {imageData[1] ?
                                        <>
                                            <Image
                                                source={{uri : imageData[1].image}}
                                                style={{
                                                    width:'100%',
                                                    height:'100%',
                                                    borderRadius:SIZES.radius,
                                                    
                                                }}
                                            />
                                            <TouchableOpacity
                                                onPress={() => removeImageItem(1)}
                                                activeOpacity={.8}
                                                style={{
                                                    height:25,
                                                    width:25,
                                                    borderRadius:20,
                                                    position:'absolute',
                                                    top: 8,
                                                    right: 8,
                                                    zIndex:1,
                                                    alignItems:'center',
                                                    justifyContent:'center',
                                                    backgroundColor:COLORS.danger,
                                                }}
                                            >
                                                <FeatherIcon name='x' size={16} color={COLORS.white}/>
                                            </TouchableOpacity>
                                        </>
                                        :
                                        <FeatherIcon name='plus' color={colors.borderColor} size={40}/>
                                    }
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => UploadFile('photo')}
                                    activeOpacity={.9}
                                    style={[styles.imageBox,{borderColor:colors.borderColor}]}
                                >
                                    {imageData[2] ?
                                        <>
                                            <Image
                                                source={{uri : imageData[2].image}}
                                                style={{
                                                    width:'100%',
                                                    height:'100%',
                                                    borderRadius:SIZES.radius,
                                                    
                                                }}
                                            />
                                            <TouchableOpacity
                                                onPress={() => removeImageItem(2)}
                                                activeOpacity={.8}
                                                style={{
                                                    height:25,
                                                    width:25,
                                                    borderRadius:20,
                                                    position:'absolute',
                                                    top: 8,
                                                    right: 8,
                                                    zIndex:1,
                                                    alignItems:'center',
                                                    justifyContent:'center',
                                                    backgroundColor:COLORS.danger,
                                                }}
                                            >
                                                <FeatherIcon name='x' size={16} color={COLORS.white}/>
                                            </TouchableOpacity>
                                        </>
                                        :
                                        <FeatherIcon name='plus' color={colors.borderColor} size={40}/>
                                    }
                                </TouchableOpacity>
                            </View>
                            <View style={GlobalStyleSheet.col33}>
                                <TouchableOpacity
                                    onPress={() => UploadFile('photo')}
                                    activeOpacity={.9}
                                    style={[styles.imageBox,{borderColor:colors.borderColor}]}
                                >
                                    {imageData[3] ?
                                        <>
                                            <Image
                                                source={{uri : imageData[3].image}}
                                                style={{
                                                    width:'100%',
                                                    height:'100%',
                                                    borderRadius:SIZES.radius,
                                                    
                                                }}
                                            />
                                            <TouchableOpacity
                                                onPress={() => removeImageItem(3)}
                                                activeOpacity={.8}
                                                style={{
                                                    height:25,
                                                    width:25,
                                                    borderRadius:20,
                                                    position:'absolute',
                                                    top: 8,
                                                    right: 8,
                                                    zIndex:1,
                                                    alignItems:'center',
                                                    justifyContent:'center',
                                                    backgroundColor:COLORS.danger,
                                                }}
                                            >
                                                <FeatherIcon name='x' size={16} color={COLORS.white}/>
                                            </TouchableOpacity>
                                        </>
                                        :
                                        <FeatherIcon name='plus' color={colors.borderColor} size={40}/>
                                    }
                                </TouchableOpacity>
                            </View>
                            <View style={GlobalStyleSheet.col33}>
                                <TouchableOpacity
                                    onPress={() => UploadFile('photo')}
                                    activeOpacity={.9}
                                    style={[styles.imageBox,{borderColor:colors.borderColor}]}
                                >
                                    {imageData[4] ?
                                        <>
                                            <Image
                                                source={{uri : imageData[4].image}}
                                                style={{
                                                    width:'100%',
                                                    height:'100%',
                                                    borderRadius:SIZES.radius,
                                                    
                                                }}
                                            />
                                            <TouchableOpacity
                                                activeOpacity={.8}
                                                onPress={() => removeImageItem(4)}
                                                style={{
                                                    height:25,
                                                    width:25,
                                                    borderRadius:20,
                                                    position:'absolute',
                                                    top: 8,
                                                    right: 8,
                                                    zIndex:1,
                                                    alignItems:'center',
                                                    justifyContent:'center',
                                                    backgroundColor:COLORS.danger,
                                                }}
                                            >
                                                <FeatherIcon name='x' size={16} color={COLORS.white}/>
                                            </TouchableOpacity>
                                        </>
                                        :
                                        <FeatherIcon name='plus' color={colors.borderColor} size={40}/>
                                    }
                                </TouchableOpacity>
                            </View>
                            <View style={GlobalStyleSheet.col33}>
                                <TouchableOpacity
                                    onPress={() => UploadFile('photo')}
                                    activeOpacity={.9}
                                    style={[styles.imageBox,{borderColor:colors.borderColor}]}
                                >
                                    {imageData[5] ?
                                        <>
                                            <Image
                                                source={{uri : imageData[5].image}}
                                                style={{
                                                    width:'100%',
                                                    height:'100%',
                                                    borderRadius:SIZES.radius,
                                                    
                                                }}
                                            />
                                            <TouchableOpacity
                                                onPress={() => removeImageItem(5)}
                                                activeOpacity={.8}
                                                style={{
                                                    height:25,
                                                    width:25,
                                                    borderRadius:20,
                                                    position:'absolute',
                                                    top: 8,
                                                    right: 8,
                                                    zIndex:1,
                                                    alignItems:'center',
                                                    justifyContent:'center',
                                                    backgroundColor:COLORS.danger,
                                                }}
                                            >
                                                <FeatherIcon name='x' size={16} color={COLORS.white}/>
                                            </TouchableOpacity>
                                        </>
                                        :
                                        <FeatherIcon name='plus' color={colors.borderColor} size={40}/>
                                    }
                                </TouchableOpacity>
                            </View>
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
                    onPress={() => navigation.navigate('DrawerNavigation')}
                    title={'Next'}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    imageBox : {
        flex:1,
        borderWidth:1.3,
        marginVertical:5,
        borderRadius:SIZES.radius,
        borderStyle:'dashed',
        minHeight:SIZES.width/3.5,
        alignItems:'center',
        justifyContent:'center',
        padding:12,
    }
})

export default RecentPics;