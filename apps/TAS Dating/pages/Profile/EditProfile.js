import React, { useRef, useState } from 'react';
import { Image, PermissionsAndroid, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { List } from 'react-native-paper';
import uuid from 'react-native-uuid';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { launchImageLibrary } from 'react-native-image-picker';
import RBSheet from 'react-native-raw-bottom-sheet';
import Header from '../../layout/Header';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { COLORS, FONTS, IMAGES, SIZES } from '../../constants/theme';
import IntrestSheet from '../components/IntrestSheet';
import RelationshipGoalsSheet from '../components/RelationshipGoalsSheet';
import SexualOrientationSheet from '../components/SexualOrientationSheet';


const EditProfile = () => {

    const {colors} = useTheme();

    const profileSheet = useRef();
    const sheetRef = useRef();

    const [imageData , setImageData] = useState([{
        id : uuid.v4(),
        imagePath : IMAGES.likedPic6,
    }]);
    const [sheetType , setSheetType] = useState('');

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
            }
            else{
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
        <>
            
            <IntrestSheet sheetRef={profileSheet}/>

            <RBSheet
                ref={sheetRef}
                height={480}
                openDuration={100}
                closeOnDragDown={true}
                customStyles={{
                    wrapper: {
                    },
                    container:{
                        backgroundColor: colors.cardBg,
                        borderTopLeftRadius:15,
                        borderTopRightRadius:15,
                    },
                    draggableIcon: {
                        marginTop:5,
                        marginBottom:0,
                        height:5,
                        width:90,
                        backgroundColor: colors.borderColor,
                    }
                }}
            >
                {sheetType == "relation" ?
                    <RelationshipGoalsSheet/>
                    :
                sheetType == "orientation" ?
                    <SexualOrientationSheet/>
                    :
                    <></>
                }
            </RBSheet>
            

            <SafeAreaView
                style={{
                    flex:1,
                    backgroundColor:colors.background,
                }}
            >
                <Header
                    leftIcon={'back'}
                    title={'Edit Profile'}
                    titleLeft
                />

                <ScrollView>
                    <View style={GlobalStyleSheet.container}>

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
                                    style={[styles.imageBox,{height:SIZES.width / 1.8,borderColor:colors.borderColor,backgroundColor:colors.cardBg}]}
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
                                    style={[styles.imageBox,{borderColor:colors.borderColor,backgroundColor:colors.cardBg}]}
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
                                    style={[styles.imageBox,{borderColor:colors.borderColor,backgroundColor:colors.cardBg}]}
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
                                    style={[styles.imageBox,{borderColor:colors.borderColor,backgroundColor:colors.cardBg}]}
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
                                    style={[styles.imageBox,{borderColor:colors.borderColor,backgroundColor:colors.cardBg}]}
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
                                    style={[styles.imageBox,{borderColor:colors.borderColor,backgroundColor:colors.cardBg}]}
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

                        <View
                            style={[GlobalStyleSheet.card,{
                                backgroundColor:colors.cardBg,
                                borderColor:colors.borderColor,
                                paddingBottom:5,
                                marginTop:25,
                            }]}
                        >
                            <Text style={{
                                ...FONTS.font,
                                ...FONTS.fontBold,
                                color:colors.title,
                                paddingBottom:8,
                                marginBottom:5,
                                borderBottomWidth:1,
                                borderBottomColor:colors.borderColor,
                            }}>Intrests</Text>
                            <List.Item
                                onPress={() => {profileSheet.current.open()}}
                                style={{
                                    marginHorizontal:-15,
                                }}
                                titleStyle={{...FONTS.font,fontSize:16,color:colors.text}}
                                title={'Photography,Tea, Travel'}
                            />
                        </View>
                        <View
                            style={[GlobalStyleSheet.card,{
                                backgroundColor:colors.cardBg,
                                borderColor:colors.borderColor,
                                paddingBottom:5,
                            }]}
                        >
                            <Text style={{
                                ...FONTS.font,
                                ...FONTS.fontBold,
                                color:colors.title,
                                paddingBottom:8,
                                marginBottom:5,
                                borderBottomWidth:1,
                                borderBottomColor:colors.borderColor,
                            }}>Relationship Goals</Text>
                            <List.Item
                                onPress={() => {setSheetType('relation');sheetRef.current.open()}}
                                style={{
                                    marginHorizontal:-15,
                                }}
                                right={() => <FeatherIcon size={18} color={colors.text} name='chevron-right'/>}
                                titleStyle={{...FONTS.font,fontSize:16,color:colors.text}}
                                title={'Long-term partner'}
                            />
                        </View>
                        <View
                            style={[GlobalStyleSheet.card,{
                                backgroundColor:colors.cardBg,
                                borderColor:colors.borderColor,
                                paddingBottom:5,
                            }]}
                        >
                            <Text style={{
                                ...FONTS.font,
                                ...FONTS.fontBold,
                                color:colors.title,
                                paddingBottom:8,
                                marginBottom:5,
                                borderBottomWidth:1,
                                borderBottomColor:colors.borderColor,
                            }}>Language I Know</Text>
                            <List.Item
                                onPress={() => {}}
                                style={{
                                    marginHorizontal:-15,
                                }}
                                titleStyle={{...FONTS.font,fontSize:16,color:colors.text}}
                                title={'English, Hindi'}
                            />
                        </View>
                        <View
                            style={[GlobalStyleSheet.card,{
                                backgroundColor:colors.cardBg,
                                borderColor:colors.borderColor,
                                paddingBottom:5,
                            }]}
                        >
                            <Text style={{
                                ...FONTS.font,
                                ...FONTS.fontBold,
                                color:colors.title,
                                paddingBottom:8,
                                marginBottom:5,
                                borderBottomWidth:1,
                                borderBottomColor:colors.borderColor,
                            }}>Sexual Orientation</Text>
                            <List.Item
                                onPress={() => {setSheetType('orientation');sheetRef.current.open()}}
                                style={{
                                    marginHorizontal:-15,
                                }}
                                right={() => <FeatherIcon size={18} color={colors.text} name='chevron-right'/>}
                                titleStyle={{...FONTS.font,fontSize:16,color:colors.text}}
                                title={'Straight'}
                            />
                        </View>
                    </View> 
                </ScrollView>

            </SafeAreaView>
        </>
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

export default EditProfile;