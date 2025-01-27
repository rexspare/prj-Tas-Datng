import React, { useState } from 'react';
import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import CheckBox from '@react-native-community/checkbox';
import DropShadow from 'react-native-drop-shadow';
import { List } from 'react-native-paper';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { GlobalStyleSheet } from '../constants/StyleSheet';
import GradientBtn from './components/GradientBtn';

const Filter = ({navigation}) => {
    
    const {colors} = useTheme();
    const [toggleCheckBox, setToggleCheckBox] = useState(false);
    const [toggleCheckBox2, setToggleCheckBox2] = useState(false);
    const [toggleCheckBox3, setToggleCheckBox3] = useState(false);

    const [ageValue , setAgeValue] = useState([18 , 30]);
    const [distanceVal , setDistanceVal] = useState([30]);

    return (
        <>
            <SafeAreaView
                style={{flex:1,backgroundColor:colors.background}}
            >
                <View
                    style={{
                        flexDirection:'row',
                        alignItems:'center',
                        paddingHorizontal:10,
                        paddingVertical:10,
                    }}
                >
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={{
                            padding:10,
                            top:-1,
                            marginRight:10,
                        }}
                    >
                        <FeatherIcon size={24} color={colors.title} name='arrow-left'/>
                    </TouchableOpacity>
                    <Text style={{...FONTS.h5,color:colors.title}}>Date filter</Text>
                </View>
                <View style={{flex:1}}>
                    <ScrollView>
                        <View style={GlobalStyleSheet.container}>
                            
                                <View
                                    style={[styles.infoCard,GlobalStyleSheet.shadow,{
                                        backgroundColor:colors.cardBg, 
                                    }]}
                                >
                                    <Text style={[styles.cardtitle,{
                                        color:colors.text,
                                        borderColor:colors.borderColor,
                                    }]}>Who you want to date</Text>
                                    
                                    <List.Item
                                        onPress={() => setToggleCheckBox(!toggleCheckBox)}
                                        title={'Men'}
                                        titleStyle={{
                                            color:colors.title
                                        }}
                                        rippleColor={colors.borderColor}
                                        style={{
                                            paddingVertical:2,
                                            marginHorizontal:-15,
                                        }}
                                        right={() =>
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
                                                    onCheckColor={COLORS.white}
                                                    onFillColor={COLORS.primary}
                                                    value={toggleCheckBox}
                                                    onValueChange={(newValue) => setToggleCheckBox(newValue)}
                                                />
                                            </View>
                                        }
                                    />
                                    <List.Item
                                        onPress={() => setToggleCheckBox2(!toggleCheckBox2)}
                                        title={'Women'}
                                        titleStyle={{
                                            color:colors.title
                                        }}
                                        rippleColor={colors.borderColor}
                                        style={{
                                            paddingVertical:2,
                                            marginHorizontal:-15,
                                        }}
                                        right={() =>
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
                                                    onCheckColor={COLORS.white}
                                                    onFillColor={COLORS.primary}
                                                    value={toggleCheckBox2}
                                                    onValueChange={(newValue) => setToggleCheckBox2(newValue)}
                                                />
                                            </View>
                                        }
                                    />
                                    <List.Item
                                        onPress={() => setToggleCheckBox3(!toggleCheckBox3)}
                                        title={'Nonbinary people'}
                                        titleStyle={{
                                            color:colors.title
                                        }}
                                        rippleColor={colors.borderColor}
                                        style={{
                                            paddingVertical:2,
                                            marginHorizontal:-15,
                                        }}
                                        right={() =>
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
                                                    onCheckColor={COLORS.white}
                                                    onFillColor={COLORS.primary}
                                                    value={toggleCheckBox3}
                                                    onValueChange={(newValue) => setToggleCheckBox3(newValue)}
                                                />
                                            </View>
                                        }
                                    />
                                    
                                </View>
                            
                            
                                <View
                                    style={[styles.infoCard,GlobalStyleSheet.shadow,{
                                        backgroundColor:colors.cardBg, 
                                    }]}
                                >
                                    <Text style={[styles.cardtitle,{
                                        color:colors.text,
                                        borderColor:colors.borderColor,
                                    }]}>Age</Text>
                                    <Text style={{...FONTS.h6,color:colors.title}}>Between {ageValue[0]} and {ageValue[1]}</Text>
                                    <View>

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
                                            min={18}
                                            sliderLength={SIZES.width - 60}
                                            max={100}
                                        />

                                    </View>
                                </View>
                            
                            
                                <View
                                    style={[styles.infoCard,GlobalStyleSheet.shadow,{
                                        backgroundColor:colors.cardBg, 
                                    }]}
                                >
                                    <Text style={[styles.cardtitle,{
                                        color:colors.text,
                                        borderColor:colors.borderColor,
                                    }]}>Distance</Text>
                                    <Text style={{...FONTS.h6,color:colors.title}}>Up to {distanceVal[0]} kilometers away</Text>
                                    <View>

                                        <MultiSlider
                                            trackStyle={{height:4,borderRadius:2,backgroundColor:'rgba(142,165,200,.3)'}}
                                            selectedStyle={{
                                                backgroundColor:COLORS.primary,
                                            }}
                                            markerStyle={{
                                                backgroundColor:COLORS.white,
                                                top:1,
                                                height:16,
                                                width:16,
                                                borderWidth:3,
                                                borderColor:COLORS.primary,
                                            }}
                                            values={distanceVal}
                                            onValuesChange={(val) => setDistanceVal(val)}
                                            min={1}
                                            sliderLength={SIZES.width - 60}
                                            max={100}
                                        />

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
                        title={'Apply'}
                    />
                </View>
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    infoCard : {
        borderRadius:10,
        paddingHorizontal:15,
        paddingVertical:15,
        marginBottom:15,
    },
    cardtitle : {
        ...FONTS.fontBold,
        ...FONTS.font,
        borderBottomWidth:1,
        paddingBottom:8,
        marginBottom:10,
    }
})

export default Filter;