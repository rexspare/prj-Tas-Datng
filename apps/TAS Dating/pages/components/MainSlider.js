import React, { Component } from 'react';
import { Animated, Image, View, PanResponder, Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { COLORS, FONTS, IMAGES, SIZES } from '../../constants/theme';
import EmptyCard from './EmptyCard';

const Foods = [
    { id: "1", image: IMAGES.slderPic1, name : "Harleen", age : "24" ,about : "Product Designer" },
    { id: "2", image: IMAGES.slderPic2, name : "Richard", age : "22" ,about : "Job Holder" },
    { id: "3", image: IMAGES.slderPic3, name : "Harleen", age : "25" ,about : "Product Designer" },
    { id: "4", image: IMAGES.slderPic4, name : "Harleen", age : "22" ,about : "Product Designer" },
    { id: "5", image: IMAGES.slderPic5, name : "Harleen", age : "21" ,about : "Product Designer" },
]

class MainSlider extends Component {

    constructor() {
        super()
        this.position = new Animated.ValueXY()
        this.state = {
           currentIndex: 0,
           isEmpty : false
        }
        this.rotate = this.position.x.interpolate({
          inputRange: [-SIZES.width / 2, 0, SIZES.width / 2],
          outputRange: ['-10deg', '0deg', '10deg'],
          extrapolate: 'clamp'
        })
        this.rotateAndTranslate = {
          transform: [{
            rotate: this.rotate
          },
          ...this.position.getTranslateTransform()
          ]
        }
        this.likeOpacity = this.position.x.interpolate({
          inputRange: [-SIZES.width / 2, 0, SIZES.width / 2],
          outputRange: [0, 0, 1],
          extrapolate: 'clamp'
        })
        this.layerlikeOpacity = this.position.x.interpolate({
          inputRange: [-SIZES.width / 2, 0, SIZES.width / 2],
          outputRange: [0, 0, .4],
          extrapolate: 'clamp'
        })
        this.nopeOpacity = this.position.x.interpolate({
          inputRange: [-SIZES.width / 2, 0, SIZES.width / 2],
          outputRange: [1, 0, 0],
          extrapolate: 'clamp'
        })
        this.nlayerOpacity = this.position.x.interpolate({
          inputRange: [-SIZES.width / 2, 0, SIZES.width / 2],
          outputRange: [.4, 0, 0],
          extrapolate: 'clamp'
        })

        // this.topLayerOpacity = this.position.y.interpolate({
        //   inputRange: [-SIZES.width / 2, 0, SIZES.width / 2],
        //   outputRange: [.4, 0, 0],
        //   extrapolate: 'clamp'
        // })

        this.nextCardOpacity = this.position.x.interpolate({
          inputRange: [-SIZES.width / 2, 0, SIZES.width / 2],
          outputRange: [1, 0, 1],
          extrapolate: 'clamp'
        })

        // this.nextCardOpacityY = this.position.y.interpolate({
        //   inputRange: [-SIZES.width / 2, 0, SIZES.width / 2],
        //   outputRange: [1, 0, 1],
        //   extrapolate: 'clamp'
        // })

        this.nextCardScale = this.position.x.interpolate({
          inputRange: [-SIZES.width / 2, 0, SIZES.width / 2],
          outputRange: [1, 0.8, 1],
          extrapolate: 'clamp'
        })
    }

   
    
    PanResponder = PanResponder.create({
        onStartShouldSetPanResponder: (evt, gestureState) => true,
        onPanResponderMove: (evt, gestureState) => {
            this.position.setValue({ x: gestureState.dx, y: 0 });
            //console.log(gestureState.dx,gestureState.dy,gestureState);
        },
        onPanResponderRelease: (evt, gestureState) => {
          if (gestureState.dx > 120) {
            Animated.spring(this.position, {
              toValue: { x: SIZES.width + 100, y: gestureState.dy },
              useNativeDriver: false,
            }).start(() => {
              this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
                this.position.setValue({ x: 0, y: 0 })
              })
            })
            if(Foods.length == this.state.currentIndex + 1){
              this.setState({ isEmpty : true })
            }
          } else if (gestureState.dx < -120) {
            Animated.spring(this.position, {
              toValue: { x: -SIZES.width - 100, y: gestureState.dy },
              useNativeDriver: false,
            }).start(() => {
              this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
                this.position.setValue({ x: 0, y: 0 })
              })
            })
            if(Foods.length == this.state.currentIndex + 1){
              this.setState({ isEmpty : true })
            }
          // }else if(gestureState.dy < -200){
          //   Animated.spring(this.position, {
          //     toValue: { y: -SIZES.height - 100, x: gestureState.dy },
          //     useNativeDriver: false,
          //   }).start(() => {
          //     this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
          //       this.position.setValue({ x: 0, y: 0 })
          //     })
          //   })
          //   if(Foods.length == this.state.currentIndex + 1){
          //     this.setState({ isEmpty : true })
          //   }
          }else{  
              Animated.spring(this.position, {
                toValue: { x: 0, y: 0 },
                friction: 4,
                useNativeDriver: false,
              }).start()
          }
        }
    })
    

    renderFoods = () => {
        return Foods.map((item, i) => {
            if (i < this.state.currentIndex) {
                return null;
              } else if (i == this.state.currentIndex) {
                return (
                  <Animated.View
                    {...this.PanResponder.panHandlers}
                    key={i}
                    style={[
                      this.rotateAndTranslate,
                    {
                        height: '100%',
                        width: SIZES.width,
                        padding: 10,
                        position: "absolute"
                    }
                  ]}
                  >
                    
                  <Animated.View
                        style={{
                          opacity: this.likeOpacity,
                          alignItems:'center',
                          justifyContent:'center',
                          position: "absolute",
                          top: 50,
                          left: 40,
                          height:50,
                          width:50,
                          borderRadius:50,
                          backgroundColor:COLORS.success,
                          zIndex: 1000
                        }}
                      >
                       <FontAwesome5 size={24} color={COLORS.white} name='check' />
                      </Animated.View>
                      <Animated.View
                        style={{
                          opacity: this.nopeOpacity,
                          alignItems:'center',
                          justifyContent:'center',
                          position: "absolute",
                          top: 50,
                          right: 40,
                          height:50,
                          width:50,
                          borderRadius:50,
                          backgroundColor:COLORS.danger,
                          zIndex: 1000
                        }}
                      >
                        <FontAwesome5 size={24} color={COLORS.white} name='times' />
                      </Animated.View>
                    <View
                      style={{flex:1}}
                    >
                      <Image
                        style={{
                          flex: 1,
                          height: null,
                          width: null,
                          resizeMode: "cover",
                          borderRadius: 20
                        }}
                        source={item.image}
                      />
                      <Animated.View
                        style={{
                          opacity: this.nlayerOpacity,
                          position:'absolute',
                          height:'100%',
                          width:'100%',
                          top:0,
                          left:0,
                          backgroundColor:COLORS.danger,
                          borderRadius: 20,
                        }}
                      >
                      </Animated.View>
                      <Animated.View
                        style={{
                          opacity: this.layerlikeOpacity,
                          position:'absolute',
                          height:'100%',
                          width:'100%',
                          top:0,
                          left:0,
                          backgroundColor:"#00c37b",
                          borderRadius: 20,
                        }}
                      >
                      </Animated.View>
                      {/* <Animated.View
                        style={{
                          opacity: this.topLayerOpacity,
                          position:'absolute',
                          height:'100%',
                          width:'100%',
                          top:0,
                          left:0,
                          backgroundColor: "#0062FF",
                          backgroundColor: COLORS.primary,
                          borderRadius: 20,
                        }}
                      >
                      </Animated.View> */}
                      <LinearGradient
                        colors={["rgba(0,0,0,0)", "rgba(0,0,0,.8)"]}
                        style={{
                          position : "absolute",
                          height : 200,
                          width:"100%",
                          bottom : 0,
                          borderRadius:20,
                          justifyContent: "flex-end",
                          alignItems:"flex-start",
                        }}
                        >
                        <TouchableOpacity
                          onPress={() => this.props.navigation.navigate('ProfileDetails',{item : item})}
                          style={{
                            paddingVertical : 25,
                            paddingHorizontal : 20,
                          }}
                        >
                          <Text style={{...FONTS.h4,color:COLORS.white}}>{item.name} , {item.age}</Text>
                          <Text style={{...FONTS.font,color:COLORS.white,opacity:.75}}>{item.about}</Text>
                        </TouchableOpacity>
                      </LinearGradient>
                      <TouchableOpacity
                        style={{
                          height:50,
                          width:50,
                          borderRadius:50,
                          alignItems:'center',
                          justifyContent:'center',
                          position:'absolute',
                          bottom:20,
                          right:20,
                          backgroundColor:COLORS.primary,
                        }}
                      >
                        <Image style={{height:28,width:28,top:1,tintColor:COLORS.white}} source={IMAGES.star}/>
                      </TouchableOpacity>
                    </View>
                  </Animated.View>
                );
              } else {
                return (
                  <Animated.View
                    key={i} 
                    style={[{
                      opacity: this.nextCardOpacity,
                      transform: [{ scale: this.nextCardScale }],
                      height: '100%',
                      width: SIZES.width, 
                      padding: 10, 
                      position: 'absolute'
                    }]}
                  >
                    <View
                      style={{flex:1}}
                    >
                      <Image
                        style={{
                          flex: 1,
                          height: null,
                          width: null,
                          resizeMode: "cover",
                          borderRadius: 20
                        }}
                        source={item.image}
                      />
                      <LinearGradient
                        colors={["rgba(0,0,0,0)", "rgba(0,0,0,.8)"]}
                        style={{
                          position : "absolute",
                          height : 200,
                          width:"100%",
                          bottom : 0,
                          borderRadius:20,
                          justifyContent: "flex-end",
                          paddingHorizontal : 20,
                          paddingVertical : 25,
                        }}
                      >
                        <Text style={{...FONTS.h4,color:COLORS.white}}>{item.name} , {item.age}</Text>
                        <Text style={{...FONTS.font,color:COLORS.white,opacity:.75}}>{item.about}</Text>
                      </LinearGradient>
                      <TouchableOpacity
                        style={{
                          height:50,
                          width:50,
                          borderRadius:50,
                          alignItems:'center',
                          justifyContent:'center',
                          position:'absolute',
                          bottom:20,
                          right:20,
                          backgroundColor:COLORS.primary,
                        }}
                      >
                        <Image style={{height:28,width:28,top:1,tintColor:COLORS.white}} source={IMAGES.star}/>
                      </TouchableOpacity>
                    </View>
                  </Animated.View>
                );
            }
        }).reverse();
    };

    render(){
        return (
            <>
                <View style={{ flex: 1 }}>
                    <View style={{ flex: 1 ,paddingBottom: 60 }}>
                        {this.renderFoods()}
                        {this.state.isEmpty &&
                          <EmptyCard/>
                        }
                    </View>
                </View>
            </>
        );
    }
};

export default MainSlider;