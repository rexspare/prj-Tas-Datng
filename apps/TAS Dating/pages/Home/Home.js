import React from 'react';
import { useTheme } from '@react-navigation/native';
import { Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { FONTS, IMAGES } from '../../constants/theme';
import MainSlider from '../components/MainSlider';

const Home = ({navigation}) => {

    const {colors} = useTheme();

    return (
        <SafeAreaView
            style={{
                flex:1,
                backgroundColor:colors.background,
            }}
        >
            <View
                style={GlobalStyleSheet.homeHeader}
            >
                <TouchableOpacity
                    onPress={() => navigation.openDrawer()}
                    style={[GlobalStyleSheet.headerBtn,{borderColor:colors.borderColor,}]}
                >
                    <FeatherIcon color={colors.title} size={22} name={'grid'}/> 
                </TouchableOpacity>
                <Text style={{...FONTS.h5,flex:1,textAlign:'center',color:colors.title}}>Home</Text>
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
            <MainSlider navigation={navigation}/>
        </SafeAreaView>
    );
};


export default Home;