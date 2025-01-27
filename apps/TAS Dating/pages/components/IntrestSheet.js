import React from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useTheme } from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { COLORS, FONTS } from '../../constants/theme';

const intrestData = [
    {
        icon : "camera",
        title : "Photography",
    },
    {
        icon : "music",
        title : "Music",
    },
    {
        icon : "book",
        title : "Study",
    },
    {
        icon : "film",
        title : "Movies",
    },
    {
        icon : "instagram",
        title : "Instagram",
    },
    {
        icon : "map-pin",
        title : "Travelling",
    },
]

const tags = ["Ludo","Football","Cricket","Tea","Brunch","Shopping","Instagram",
"Collecting","Travel","Cofee","Dancing","Wine","Manga","Anime","Memes","Fashion","Gym","Drawing",
"Boxing","Walking","Basketball","Running","Movies","Web Series","Cars","Bike","Maggi","Sushi"];

const IntrestSheet = ({sheetRef}) => {

    const {colors} = useTheme();
    

    return (
        <RBSheet
            ref={sheetRef}
            height={450}
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
            <View style={{
                paddingHorizontal:15,
                borderBottomWidth:1,
                borderColor:colors.borderColor,
                paddingVertical:10,
                flexDirection:'row',
                alignItems:'center',
            }}>
                <Text style={{...FONTS.h5,color:colors.title,flex:1}}>Interests</Text>
                <TouchableOpacity
                    onPress={() => sheetRef.current.close()}
                    style={{
                        padding:5,
                    }}
                >
                    <FeatherIcon size={24} color={colors.title} name='x'/>
                </TouchableOpacity>
            </View>
            <View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                >
                    <View
                        style={{
                            flexDirection:'row',
                            flexWrap:'wrap',
                            marginTop:12,
                            paddingHorizontal:15,
                        }}
                    >
                        {intrestData.map((data,index) => {
                            return(
                                <TouchableOpacity
                                    key={index}
                                    style={{
                                        backgroundColor: COLORS.primary,
                                        marginRight:8,
                                        marginBottom:8,
                                        flexDirection:'row',
                                        alignItems:'center',
                                        //borderWidth:1,
                                        //borderColor:colors.borderColor,
                                        borderRadius:30,
                                        paddingHorizontal:12,
                                        paddingVertical:5,
                                    }}
                                >
                                    <FeatherIcon color={COLORS.white} size={14} style={{marginRight:6}} name={data.icon}/>
                                    <Text style={{...FONTS.font,color:COLORS.white,top:-1}}>{data.title}</Text>
                                    <TouchableOpacity>
                                        <FeatherIcon style={{marginLeft:6}} size={16} color={COLORS.white} name='x'/>
                                    </TouchableOpacity>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                </ScrollView>
            </View>
            <View
                style={{
                    paddingHorizontal:15,
                    paddingVertical:5,
                }}
            >
                <View>
                    <TextInput
                        style={{
                            backgroundColor:colors.bgLight,
                            borderRadius:30,
                            paddingLeft:45,
                            height:38,
                            paddingRight:15,
                            paddingVertical:6,
                        }}
                        placeholder='Search...'
                        placeholderTextColor={colors.textLight}
                    />
                    <FeatherIcon 
                        style={{
                            position:'absolute',
                            left:15,
                            top:10,
                        }}
                        name='search' size={18} color={colors.textLight}/>
                </View>
            </View>
            <TouchableOpacity
                activeOpacity={1}
                style={{
                    flex:1,
                }}
            >   
                <ScrollView>
                    <View
                        style={{
                            flexDirection:'row',
                            flexWrap:'wrap',
                            paddingHorizontal:15,
                            paddingVertical:10,
                        }}
                    >
                        {tags.map((data,index) => {
                            return(
                                <TouchableOpacity
                                    key={index}
                                    style={{
                                        backgroundColor:'rgba(0,0,0,0.03)',
                                        marginRight:8,
                                        marginBottom:8,
                                        flexDirection:'row',
                                        alignItems:'center',
                                        borderWidth:1,
                                        borderColor:colors.borderColor,
                                        borderRadius:30,
                                        paddingHorizontal:12,
                                        paddingVertical:4,
                                    }}
                                >
                                    <Text style={{...FONTS.font,color:colors.text,top:-1}}>{data}</Text>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                </ScrollView>
            </TouchableOpacity>
        </RBSheet>
    );
};

export default IntrestSheet;