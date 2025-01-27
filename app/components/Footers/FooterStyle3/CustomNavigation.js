import React, { useEffect, useRef } from 'react';
import { Image, StyleSheet, TouchableOpacity, View, Animated } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { COLORS, FONTS, SIZES } from '../../../constants/theme';

import home from '../../../assets/images/icons/home.png';
import collage from '../../../assets/images/icons/collage.png';
import profile from '../../../assets/images/icons/user.png';
import heart from '../../../assets/images/icons/heart.png';
import blog from '../../../assets/images/icons/blog.png';

const CustomNavigation = ({state,navigation,descriptors}) => {
    
    const {colors} = useTheme();

    const tabWidth = SIZES.width - 40;

    const circlePosition = useRef(
        new Animated.Value(
            tabWidth < SIZES.container ? tabWidth / 2.5 : SIZES.container / 2.5,
        ),
    ).current;
    
    const tabW =
        tabWidth < SIZES.container ? tabWidth / 5 : SIZES.container / 5;

    const onTabPress = (index) => {
        Animated.spring(circlePosition, {
            toValue: index * tabW,
            useNativeDriver: true,
        }).start();
    };

    useEffect(() => {
        Animated.spring(circlePosition, {
            toValue: state.index * tabW,
            useNativeDriver: true,
        }).start();
    },[state.index]);

    return (
        <>
            <View style={{
                height:65,
                flexDirection:'row',
                position:'absolute',
                width:'auto',
                paddingHorizontal:10,
                left:10,
                right:10,
                bottom:10,
                borderRadius: 20,
                backgroundColor: colors.cardBg,
                shadowColor: "rgba(0,0,0,.6)",
                shadowOffset: {
                    width: 0,
                    height: 4,
                },
                shadowOpacity: 0.30,
                shadowRadius: 4.65,

                elevation: 8,
            }}>
                <Animated.View style={{transform: [{translateX: circlePosition}]}}>
                    <View style={{
                        width: tabWidth < SIZES.container ? tabWidth / 5 : SIZES.container / 5,
                        position:'absolute',
                        zIndex:1,
                        bottom: 7.5,
                        left:0,
                        alignItems:'center',
                        justifyContent:'center',
                    }}>
                        <View
                            style={{
                                height:4,
                                width:50,
                                borderRadius:6,
                                backgroundColor:COLORS.primary,
                            }}
                        />
                    </View>
                </Animated.View>
                {state.routes.map((route, index) => {

                    const { options } = descriptors[route.key];
                    const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                        ? options.title
                        : route.name;

                    const isFocused = state.index === index;
                    
                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });
        
                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate({name: route.name, merge: true});
                            onTabPress(index);
                        }
                    };

                    return(
                        <View style={styles.tabItem} key={index}>
                            <TouchableOpacity
                                style={styles.tabLink}
                                onPress={onPress}
                            >
                                <Image
                                    style={{
                                        height:22,
                                        width:22,
                                        resizeMode:'contain',
                                        marginBottom:5,
                                        opacity:isFocused ? 1 : .6,
                                        tintColor:isFocused ? COLORS.primary : colors.text,
                                    }}
                                    source={
                                        label === "Home" ? home :
                                        label === "Markets" ? heart:
                                        label === "Change" ? collage:
                                        label === "Wallet" ? blog :
                                        label === "Profile" && profile
                                    }
                                />
                            </TouchableOpacity>
                        </View>
                    )
                })}
            </View>
        </>
    );
};



const styles = StyleSheet.create({
    tabLink:{
        alignItems:'center',
        padding:10,
    },
    tabItem:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    },
    navText:{
        ...FONTS.fontSm,
    }
})


export default CustomNavigation;