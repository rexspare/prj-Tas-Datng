import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { FONTS } from '../../constants/theme';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import CheckList from './CheckList';

const GenderSheet = () => {

    const {colors} = useTheme();

    const genderData= ["Women" , "Men", "Everyone"];
    const [activeGender , setGender] = useState(genderData[1]);

    return (
        <>
            <View style={{
                    paddingHorizontal:15,
                    borderBottomWidth:1,
                    borderColor:colors.borderColor,
                    paddingVertical:12,
                }}>
                    <Text style={{...FONTS.h5,color:colors.title}}>Show Me</Text>
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

export default GenderSheet;