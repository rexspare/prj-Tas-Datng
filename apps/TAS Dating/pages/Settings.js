import React, { useRef, useState } from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import RBSheet from 'react-native-raw-bottom-sheet';
import { List } from 'react-native-paper';
import Header from '../layout/Header';
import { GlobalStyleSheet } from '../constants/StyleSheet';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import PhoneNumberSheet from './components/PhoneNumberSheet';
import EmailSheet from './components/EmailSheet';
import LocationSheet from './components/LocationSheet';
import GenderSheet from './components/GenderSheet';

const Settings = () => {

    const {colors} = useTheme();

    const settingSheet = useRef();
    const genderSheet = useRef();
    const [sheetType , setSettingSheet] = useState();
    const [ageValue , setAgeValue] = useState([18 , 30]);
    const [distanceVal , setDistanceVal] = useState([30]);
    
    return (
        <>
            <RBSheet
                ref={settingSheet}
                height={240}
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
                {sheetType == "phoneNumber" ? <PhoneNumberSheet/> :
                sheetType == "email" ? <EmailSheet/> :
                sheetType == "location" ? <LocationSheet/> :
                <></>
                }
            </RBSheet>
            <RBSheet
                ref={genderSheet}
                height={300}
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
                <GenderSheet/>
            </RBSheet>

            <SafeAreaView
                style={{
                    flex:1,
                    backgroundColor:colors.background,
                }}
            >
                <Header
                    leftIcon={'back'}
                    titleLeft
                    title={'Settings'}
                />
                <ScrollView>
                    <View style={GlobalStyleSheet.container}>
                        <Text style={{...FONTS.h6,color:colors.title,marginBottom:8}}>Account Setting</Text>
                        <View
                            style={[GlobalStyleSheet.card,{
                                backgroundColor:colors.cardBg,
                                borderColor:colors.borderColor,
                                paddingBottom:5,
                                marginBottom:8
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
                            }}>Phone Number</Text>
                            <List.Item
                                onPress={() => {setSettingSheet('phoneNumber'); settingSheet.current.open()}}
                                style={{
                                    marginHorizontal:-15,
                                }}
                                left={() => <FeatherIcon style={{marginLeft:12,left:5}} size={18} color={colors.textLight} name='phone-call'/>}
                                titleStyle={{...FONTS.font,fontSize:16,color:colors.text}}
                                title={'+00 0540 4705'}
                            />
                        </View>
                        <View
                            style={[GlobalStyleSheet.card,{
                                backgroundColor:colors.cardBg,
                                borderColor:colors.borderColor,
                                paddingBottom:5,
                                marginBottom:8
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
                            }}>Email Address</Text>
                            <List.Item
                                onPress={() => {setSettingSheet('email'); settingSheet.current.open()}}
                                style={{
                                    marginHorizontal:-15,
                                }}
                                left={() => <FeatherIcon style={{marginLeft:12,left:5}} size={18} color={colors.textLight} name='mail'/>}
                                titleStyle={{...FONTS.font,fontSize:16,color:colors.text}}
                                title={'yourname@gmail.com'}
                            />
                        </View>
                        <Text style={{...FONTS.h6,color:colors.title,marginBottom:8,marginTop:10}}>Discovery Setting</Text>
                        <View
                            style={[GlobalStyleSheet.card,{
                                backgroundColor:colors.cardBg,
                                borderColor:colors.borderColor,
                                paddingBottom:5,
                                marginBottom:8
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
                            }}>Location</Text>
                            <List.Item
                                onPress={() => {setSettingSheet('location'); settingSheet.current.open()}}
                                style={{
                                    marginHorizontal:-15,
                                }}
                                left={() => <FeatherIcon style={{marginLeft:12,left:5}} size={18} color={colors.textLight} name='map-pin'/>}
                                titleStyle={{...FONTS.font,fontSize:16,color:colors.text}}
                                title={'2300 Traverwood Dr.Ann Arbor, MI 48105 United States'}
                            />
                        </View>
                        <Text style={{...FONTS.h6,color:colors.title,marginBottom:8,marginTop:10}}>Other</Text>
                        <View
                            style={[GlobalStyleSheet.card,{
                                backgroundColor:colors.cardBg,
                                borderColor:colors.borderColor,
                                paddingBottom:5,
                                marginBottom:8
                            }]}
                        >
                            <View
                                style={{
                                    paddingBottom:8,
                                    marginBottom:5,
                                    borderBottomWidth:1,
                                    borderBottomColor:colors.borderColor,
                                    flexDirection:'row',
                                    justifyContent:'space-between',
                                    alignItems:'center',
                                }}
                            >
                                <Text style={{
                                    ...FONTS.font,
                                    ...FONTS.fontBold,
                                    color:colors.title,
                                    
                                }}>Maximum Distance</Text>
                                <Text style={{...FONTS.h6,color:colors.title}}>{distanceVal[0]}ml</Text>
                            </View>
                            <MultiSlider
                                trackStyle={{height:4,borderRadius:2,backgroundColor:'rgba(142,165,200,.3)'}}
                                selectedStyle={{
                                    backgroundColor:COLORS.primary,
                                }}
                                values={distanceVal}
                                markerStyle={{
                                    backgroundColor:COLORS.white,
                                    top:1,
                                    height:16,
                                    width:16,
                                    borderWidth:3,
                                    borderColor:COLORS.primary,
                                }}
                                onValuesChange={(val) => setDistanceVal(val)}
                                sliderLength={SIZES.width - 60}
                                min={1}
                                max={100}
                            />
                        </View>
                        <View
                            style={[GlobalStyleSheet.card,{
                                backgroundColor:colors.cardBg,
                                borderColor:colors.borderColor,
                                paddingBottom:5,
                                marginBottom:8
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
                            }}>Show Me</Text>
                            <List.Item
                                onPress={() => {genderSheet.current.open()}}
                                style={{
                                    marginHorizontal:-15,
                                }}
                                right={() => <FeatherIcon size={18} color={colors.text} name='chevron-right'/>}
                                titleStyle={{...FONTS.font,fontSize:16,color:colors.text}}
                                title={'Women'}
                            />
                        </View>
                        <View
                            style={[GlobalStyleSheet.card,{
                                backgroundColor:colors.cardBg,
                                borderColor:colors.borderColor,
                                paddingBottom:5,
                                marginBottom:8
                            }]}
                        >
                            <View
                                style={{
                                    paddingBottom:8,
                                    marginBottom:5,
                                    borderBottomWidth:1,
                                    borderBottomColor:colors.borderColor,
                                    flexDirection:'row',
                                    justifyContent:'space-between',
                                    alignItems:'center',
                                }}
                            >
                                <Text style={{
                                    ...FONTS.font,
                                    ...FONTS.fontBold,
                                    color:colors.title,
                                    
                                }}>Age Range</Text>
                                <Text style={{...FONTS.h6,color:colors.title}}>{ageValue[0]}-{ageValue[1]}</Text>
                            </View>
                            <MultiSlider
                                trackStyle={{height:4,borderRadius:2,backgroundColor:'rgba(142,165,200,.3)'}}
                                selectedStyle={{
                                    backgroundColor:COLORS.primary,
                                }}
                                values={ageValue}
                                markerStyle={{
                                    backgroundColor:COLORS.white,
                                    top:1,
                                    height:16,
                                    width:16,
                                    borderWidth:3,
                                    borderColor:COLORS.primary,
                                }}
                                onValuesChange={(val) => setAgeValue(val)}
                                sliderLength={SIZES.width - 60}
                                min={18}
                                max={100}
                            />
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    );
};


export default Settings;