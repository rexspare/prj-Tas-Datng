import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import FeatherIcon from "react-native-vector-icons/Feather";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation, useTheme } from '@react-navigation/native';
import { IconButton } from 'react-native-paper';
import { COLORS, FONTS, IMAGES } from '../constants/theme';

const Header = (props) => {

    const navigation = useNavigation();
    const { colors } = useTheme();

    return (
        <>
            {props.main ?

                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 15,
                        paddingVertical: 10,
                    }}
                >
                    <TouchableOpacity
                        onPress={() => navigation.openDrawer()}
                        style={{
                            height: 50,
                            width: 50,
                            justifyContent: 'center',
                        }}
                    >
                        <FeatherIcon name='menu' color={'#B9BCD3'} size={26} />
                    </TouchableOpacity>
                    <Text style={{ ...FONTS.h4, flex: 1, textAlign: 'center' }}>{props.title}</Text>
                    <TouchableOpacity>
                        <Image
                            style={{
                                height: 50,
                                width: 50,
                                borderRadius: 25,
                            }}
                            source={IMAGES.user}
                        />
                    </TouchableOpacity>
                </View>
                :
                <View
                    style={[{
                        height: props.productId ? 60 : 50,
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 10,
                        backgroundColor: colors.cardBg,
                        borderBottomWidth: 1,
                        borderColor: colors.borderColor,
                    }, props.transparent && {
                        position: 'absolute',
                        zIndex: 2,
                        left: 0,
                        right: 0,
                        borderBottomWidth: 0,
                    }, props.borderNone && {
                        borderBottomWidth: 0
                    }]}
                >
                    {props.leftIcon == "back" &&
                        <IconButton
                            style={{
                                marginLeft: -2,
                            }}
                            onPress={() => props.backAction ? props.backAction() : navigation.goBack()}
                            color={props.transparent ? "#fff" : colors.title}
                            icon={() => <MaterialIcons size={18} color={colors.title} style={{ left: 4 }} name="arrow-back-ios" />}
                        />
                    }
                    <View style={{ flex: 1 }}>
                        <Text style={{ ...FONTS.h6, color: colors.title, top: 1, textAlign: props.titleLeft ? 'left' : 'center' }}>{props.title}</Text>
                        {props.productId &&
                            <Text style={{ ...FONTS.font, textAlign: 'center' }}>{props.productId}</Text>
                        }
                    </View>
                    {props?.rightIcon &&
                        <IconButton
                            icon={props.rightIcon}
                            onPress={() => props?.onRightPress && props.onRightPress()}
                        />
                    }
                </View>
            }
        </>
    );
};



export default Header;