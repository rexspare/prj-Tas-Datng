import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { FONTS } from '../../constants/theme';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import CheckList from './CheckList';

const SexualOrientationSheet = () => {

    const {colors} = useTheme();
    const genderData= [
        "Straight" , 
        "Gay", 
        "Lesbian",
        "Bisexual",
        "Asexual",
        "Queer",
    ];
    const [activeGender , setGender] = useState(genderData[1]);

    return (
        <>
            <View style={{
                    paddingHorizontal:15,
                    borderBottomWidth:1,
                    borderColor:colors.borderColor,
                    paddingVertical:12,
                }}>
                    <Text style={{...FONTS.h5,color:colors.title}}>Sexual Orientation</Text>
            </View>
            <View style={GlobalStyleSheet.container}>
                {genderData.map((data,index) => {
                    return(
                        <CheckList
                            onPress={() => setGender(data)}
                            item={data}
                            checked={data == activeGender ? true : false}
                            key={index}
                        />
                    )
                })}
            </View>
        </>
    );
};

export default SexualOrientationSheet;