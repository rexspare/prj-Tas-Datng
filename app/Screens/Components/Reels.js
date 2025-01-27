import React, {useState} from 'react';
import { 
    Image, 
    SafeAreaView, 
    ScrollView, 
    StyleSheet, 
    Text, 
    TouchableOpacity, 
    View,
    TextInput,
} from 'react-native';
import Animated from "react-native-reanimated";
import BottomSheet from 'reanimated-bottom-sheet';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Swiper from 'react-native-swiper';
import { List } from 'react-native-paper';
import { useNavigation, useTheme } from '@react-navigation/native';
import { SvgXml } from 'react-native-svg';
import RBSheet from 'react-native-raw-bottom-sheet';
import SingleReel from '../../components/SingleReel';
import { COLORS, FONTS, ICONS, IMAGES, SIZES, VIDEOS } from '../../constants/theme';

const sendData = [
    {
        image : IMAGES.userPic,
        name : 'Andy Lee',
    },
    {
        image : IMAGES.userPic2,
        name : 'Brian Harahap',
    },
    {
        image : IMAGES.userPic3,
        name : 'Christian Hang',
    },
    {
        image : IMAGES.userPic4,
        name : 'Chloe Mc. Jenskin',
    },
    {
        image : IMAGES.userPic5,
        name : 'David Bekam',
    },
    {
        image : IMAGES.userPic6,
        name : 'Dons John',
    },
    {
        image : IMAGES.userPic7,
        name : 'Eric Leew',
    },
    {
        image : IMAGES.userPic8,
        name : 'Richard Sigh',
    },
    {
        image : IMAGES.userPic5,
        name : 'David Bekam',
    },
    {
        image : IMAGES.userPic6,
        name : 'Dons John',
    },
    {
        image : IMAGES.userPic7,
        name : 'Eric Leew',
    },
    {
        image : IMAGES.userPic8,
        name : 'Richard Sigh',
    },
] 

//let fall = new Animated.Value(1)

const Reels = (props) => {

    const {colors} = useTheme();
    const navigation = useNavigation();
    const [currentIndex, setCurrentIndex] = useState(0);
    const refRBSheet = React.useRef();
    const RBSheetReport = React.useRef();
    const refSuccessSheet = React.useRef();
    const sheetRef = React.useRef(null);

    const handleChangeIndexValue = (index) => {
        setCurrentIndex(index);
    };

    const postOption = () => {
        return(
            <View>
                <List.Item
                    style={{paddingHorizontal:15}}
                    titleStyle={{...FONTS.font,fontSize:16,color:COLORS.danger}}
                    onPress={() => {RBSheetReport.current.open();refRBSheet.current.close()}}
                    title={"Report"}
                    left={() => 
                        <SvgXml
                            style={{
                                top:2,
                                marginRight:5,
                            }}
                            height={20}
                            width={20}
                            fill={COLORS.danger}
                            xml={ICONS.info}
                        />
                    }
                />
                <List.Item
                    style={{paddingHorizontal:15}}
                    titleStyle={{...FONTS.font,fontSize:16,color:colors.title}}
                    onPress={() => {}}
                    title={"Share"}
                    left={() => 
                        <SvgXml
                            style={{
                                top:0,
                                marginRight:5,
                            }}
                            height={20}
                            width={20}
                            stroke={colors.title}
                            xml={ICONS.share2}
                        />
                    }
                />
            </View>
        )
    }

    const reportData = [
        "It's spam",
        "Nudity or sexual activity",
        "Hate speech or symbols",
        "I just dont't like it",
        "Bullying or harassment",
        "False information",
        "Violence or dangerous organizations",
        "Scam or fraud",
        "Intellectual property violation",
        "Sale of illegal or regulated goods",
        "Suicide or self-injury",
        "Eating disorders",
        "Something else"
    ];


    const ReelsData = [
        {
            profileImg : IMAGES.userPic,
            userName : "as_Status_25",
            likes : "27k",
            comments : "500",
            url : VIDEOS.reel1,
            isLike : false,
        },
        {
            profileImg : IMAGES.userPic2,
            userName : "as_Status_25",
            likes : "15k",
            comments : "200",
            url : VIDEOS.reel2,
            isLike : true,
        },
        {
            profileImg : IMAGES.userPic3,
            userName : "as_Status_25",
            likes : "165k",
            comments : "800",
            url : VIDEOS.reel3,
            isLike : false,
        },
        {
            profileImg : IMAGES.userPic4,
            userName : "as_Status_25",
            likes : "1.5m",
            comments : "200k",
            url : VIDEOS.reel4,
            isLike : false,
        },
        {
            profileImg : IMAGES.userPic5,
            userName : "as_Status_25",
            likes : "907k",
            comments : "850",
            url : VIDEOS.reel5,
            isLike : false,
        },
    ]

    const renderHeader = () => (
        <View
            style={{
                backgroundColor:colors.card,
                marginBottom:-1,
                borderBottomWidth:1,
                borderColor:colors.borderColor,
                borderTopLeftRadius:18,
                borderTopRightRadius:18,
                alignItems:'center',
            }}
        >
            <TextInput
                style={{
                    ...FONTS.font,
                    paddingHorizontal:15,
                    color:colors.title,
                    width:'100%',
                }}
                placeholder="Write a message ..."
                placeholderTextColor={colors.text}
            />
        </View>
    )

    const renderContent = () => (
        <View
            style={{
                backgroundColor: colors.card,
                paddingBottom:70,
            }}
        >
          <View
            style={{
                marginHorizontal:15,
                marginVertical:15,
            }}
          >
            <TouchableOpacity
                style={{
                    height:50,
                    width:50,
                    alignItems:'center',
                    justifyContent:'center',
                    position:'absolute',
                    right:0,
                    top:-1,
                    zIndex:1,
                }}
            >
                <FeatherIcon name='search' color={colors.text} size={24}/>
            </TouchableOpacity>
            <TextInput
                style={{
                    height:50,
                    borderWidth:1,
                    borderColor:colors.borderColor,
                    borderRadius:SIZES.radius,
                    paddingHorizontal:15,
                    ...FONTS.font,
                    color:colors.title,
                }}
                placeholder="Search here..."
                placeholderTextColor={colors.text}
            />
          </View>
          {sendData.map((data,index) => {
            return(
                <View
                    key={index}
                    style={{
                        flexDirection:'row',
                        alignItems:'center',
                        paddingHorizontal:15,
                        paddingVertical:10,
                    }}
                >
                    <Image
                        style={{
                            height:40,
                            width:40,
                            borderRadius:20,
                            marginRight:8,
                        }}
                        source={data.image}
                    />
                    <Text style={{...FONTS.h6,fontSize:14,flex:1,color:colors.title}}>{data.name}</Text>
                    <TouchableOpacity
                        style={{
                            backgroundColor:COLORS.primary,
                            paddingHorizontal:14,
                            paddingVertical:6,
                            borderRadius:6,
                        }}
                    >
                        <Text style={{...FONTS.font,...FONTS.fontBold,color:COLORS.white,lineHeight:18}}>Send</Text>
                    </TouchableOpacity>
                </View>
            )
          })}
        </View>
    );

    // const renderShadow = () => {
    //     const animatedShadowOpacity = Animated.interpolateNode(fall, {
    //       inputRange: [0, 1],
    //       outputRange: [0.4, 0],
    //     })
    
    //     return (
    //       <Animated.View
    //         pointerEvents="none"
    //         style={[
    //           styles.shadowContainer,
    //           {
    //             opacity: animatedShadowOpacity,
    //           },
    //         ]}
    //       />
    //     )
    // }


    return (
        <>
            <RBSheet
                ref={refSuccessSheet}
                closeOnDragDown={true}
                height={180}
                openDuration={300}
                customStyles={{
                    wrapper: {
                        backgroundColor: 'rgba(0,0,0,.3)',
                    },
                    container:{
                        backgroundColor:colors.card,
                        borderTopLeftRadius:15,
                        borderTopRightRadius:15,
                    },
                }}
            >
                <View style={{alignItems:'center',paddingTop:25}}>

                    <Image
                        source={IMAGES.check}
                        style={{
                            height:50,
                            width:50,
                            marginBottom:20,
                        }}
                    />
                    <Text style={{...FONTS.h5,color:colors.title}}>Thanks for letting us know</Text>
                </View>
                
            </RBSheet>

            <RBSheet    
                ref={refRBSheet}
                closeOnDragDown={true}
                height={170}
                openDuration={300}
                customStyles={{
                    wrapper: {
                        backgroundColor: 'rgba(0,0,0,.3)',
                    },
                    container:{
                        backgroundColor:colors.card,
                        borderTopLeftRadius:15,
                        borderTopRightRadius:15,
                    },
                }}
            >
                {postOption()}
                
            </RBSheet>

            <RBSheet
                ref={RBSheetReport}
                closeOnDragDown={true}
                height={600}
                openDuration={300}
                customStyles={{
                    wrapper: {
                        backgroundColor: 'rgba(0,0,0,.3)',
                    },
                    container:{
                        backgroundColor:colors.card,
                        borderTopLeftRadius:15,
                        borderTopRightRadius:15,
                    },
                }}
            >
                <View style={{alignItems:'center',borderBottomWidth:1,borderColor:colors.borderColor,paddingBottom:8,paddingTop:4}}>
                    <Text style={{...FONTS.h5,color:colors.title}}>Report</Text>
                </View>
                <View style={{padding:15}}>
                    <Text style={{...FONTS.h6,color:colors.title}}>Why are you reporting this post?</Text>
                    <Text style={{...FONTS.fontSm,color:colors.text}}>Your report is anonymous, except if you're reporting an intellectual property infirngement. If someone is in immediate danger, call the local emergency services - don't wait.</Text>
                </View>
                <ScrollView contentContainerStyle={{paddingBottom:20}}>
                    {reportData.map((data,index) => (
                        <List.Item
                            titleStyle={{color:colors.title}}
                            onPress={() => {refSuccessSheet.current.open();RBSheetReport.current.close()}}
                            key={index}
                            title={data}
                        />
                    ))}
                </ScrollView>
            </RBSheet>
            

            <RBSheet
                ref={sheetRef}
                closeOnDragDown={true}
                height={SIZES.height - 250}
                openDuration={300}
                customStyles={{
                    wrapper: {
                        backgroundColor: 'rgba(0,0,0,.3)',
                    },
                    container:{
                        backgroundColor:colors.card,
                        borderTopLeftRadius:15,
                        borderTopRightRadius:15,
                    },
                }}
            >
                {renderHeader()}
                <ScrollView>
                    {renderContent()}
                </ScrollView>
            </RBSheet>


            <SafeAreaView
                style={{
                    flex:1,
                    backgroundColor:'#000',
                }}
            >

                
                {/* {renderShadow()} */}
                {/* <BottomSheet
                    ref={sheetRef}
                    initialSnap={2}
                    snapPoints={[500, SIZES.height - 150, 0]}
                    renderContent={renderContent}
                    renderHeader={renderHeader}
                    callbackNode={fall}
                /> */}

                <View style={{flex:1}}>
                    <View
                        style={{
                            flexDirection:'row',
                            alignItems:'center',
                            justifyContent:'space-between',
                            position:'absolute',
                            zIndex:1,
                            width:'100%',
                            top:0,
                            paddingLeft:15,
                            paddingRight:5,
                            paddingVertical:5,
                        }}
                    >
                        <Text style={{...FONTS.h4,color:COLORS.white}}>Media</Text>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={{
                                height:48,
                                width:48,
                                alignItems:'center',
                                justifyContent:'center',
                            }}
                        >
                            <FeatherIcon name='x' size={26} color={COLORS.white}/>
                        </TouchableOpacity>
                    </View>
                    <Swiper
                        loop={false}
                        horizontal={false}
                        showsPagination={false}
                        onIndexChanged={handleChangeIndexValue}
                    >
                        {ReelsData.map((data,index) => {
                            return(
                                <SingleReel 
                                    item={data} 
                                    key={index} 
                                    index={index} 
                                    currentIndex={currentIndex} 
                                    refRBSheet={refRBSheet}
                                    sheetRef={sheetRef}
                                />
                            )
                        })}
                    </Swiper>
                </View>
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    shadowContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#000',
        zIndex:1,
    },
})


export default Reels;