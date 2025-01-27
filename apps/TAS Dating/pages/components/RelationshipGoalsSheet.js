import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { COLORS, FONTS } from '../../constants/theme';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import CheckList from './CheckList';

const RelationshipGoalsSheet = () => {

    const {colors} = useTheme();
    const genderData= [
        "Long-term partner" , 
        "Long-term, open to short", 
        "Short-term, open to long",
        "Short-term fun",
        "New friends",
        "Stil figuring it out",
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
                    <Text style={{...FONTS.h5,color:colors.title}}>Relationship Goals</Text>
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

export default RelationshipGoalsSheet;