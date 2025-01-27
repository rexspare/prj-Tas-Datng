import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

const Button = (props) => {
    return (
        <TouchableOpacity
            activeOpacity={.8}
            onPress={()=> props.onPress && props.onPress()}
            style={[{
                ...props.style,
                backgroundColor: props.color ? props.color : COLORS.primary,
                paddingHorizontal:12,
                paddingVertical:12,
                height:48,
                flexDirection:'row',
                borderRadius: props.btnSquare ? 0 : props.btnRounded ? 30 : SIZES.radius,
                alignItems:'center',
                justifyContent:'center',
            }]}
        >
            <Text numberOfLines={1} style={[{fontSize:15,lineHeight:20,...FONTS.fontSemiBold,color:COLORS.white}, props.textColor && {color : props.textColor}]}>{props.title}</Text>
        </TouchableOpacity>
    );
};


export default Button;