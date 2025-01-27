import { Animated, View, PanResponder, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { Component, memo } from 'react'
import FavStar from './FavStar'
import EmptyCard from './EmptyCard'
import RoundButton from './RoundButton'
import VerifiedBadge from './VerifiedBadge'
import FastImage from 'react-native-fast-image'
import { showFlash } from '../../utils/helpers'
import firestore from '@react-native-firebase/firestore'
import LinearGradient from 'react-native-linear-gradient'
import { COLORS, FONTS, SIZES } from '../../constants/theme'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { FIRESTORE_COLLECTIONS, SCREEN } from '../../constants/enums'
import { simpleLike, removeSuperLike, getSuperLikeData, superLike, saveData } from '../../services'

class MainSlider extends Component {

  constructor(props) {
    super()
    this.position = new Animated.ValueXY()
    this.state = {
      currentIndex: 0,
      isEmpty: false,
      isSuperLiked: '',
      superLikeCount: props?.currentUser?.subscription?.superLikesUsed,
      imageIndex: 0,
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
      this.position.setValue({ x: gestureState.dx, y: 0 })
      //console.log(gestureState.dx,gestureState.dy,gestureState)
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx > 120) {
        Animated.spring(this.position, {
          toValue: { x: SIZES.width + 100, y: gestureState.dy },
          useNativeDriver: false,
        }).start(() => {
          this.setState({ currentIndex: this.state.currentIndex + 1, imageIndex: 0 }, () => {
            this.position.setValue({ x: 0, y: 0 })
          })
        })
        if (this.props?.data[this.state?.currentIndex]?.uid) {
          simpleLike(this.props?.data[this.state?.currentIndex])
        }
        if (this.props?.data?.length == this.state.currentIndex + 1) {
          this.setState({ isEmpty: true })
        }
      } else if (gestureState.dx < -120) {
        Animated.spring(this.position, {
          toValue: { x: -SIZES.width - 100, y: gestureState.dy },
          useNativeDriver: false,
        }).start(() => {
          this.setState({ currentIndex: this.state.currentIndex + 1, imageIndex: 0 }, () => {
            this.position.setValue({ x: 0, y: 0 })
          })
        })
        if (this.props?.data?.length == this.state.currentIndex + 1) {
          this.setState({ isEmpty: true })
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
        //   if(this.props?.data?.length == this.state.currentIndex + 1){
        //     this.setState({ isEmpty : true })
        //   }
      } else {
        Animated.spring(this.position, {
          toValue: { x: 0, y: 0 },
          friction: 4,
          useNativeDriver: false,
        }).start()
      }
    }
  })

  renderFoods = () => {
    return this.props?.data?.map((item, i) => {
      if (i < this.state.currentIndex) {
        return null
      } else if (i == this.state.currentIndex) {
        return (
          <Animated.View
            key={i}
            {...this.PanResponder.panHandlers}
            style={[this.rotateAndTranslate, styles.cardStyle]}
          >
            <Animated.View style={[{ opacity: this.likeOpacity }, styles.successCircle]}>
              <FontAwesome5 size={24} color={COLORS.white} name='check' />
            </Animated.View>
            <Animated.View style={[{ opacity: this.nopeOpacity }, styles.nopeCircle]}>
              <FontAwesome5 size={24} color={COLORS.white} name='times' />
            </Animated.View>
            <LinearGradient
              colors={item?.cardColors || COLORS.transparentGradient}
              style={styles.gradientStyle}
            >
              <View style={styles.flex}>

                <RoundButton
                  iconName={'arrowleft'}
                  style={styles.leftSide}
                  onPress={() => this.moveToPreviousImage()}
                />
                <RoundButton
                  iconName={'arrowright'}
                  style={styles.rightSide}
                  onPress={() => this.moveToNextImage(item?.images?.length)}
                />

                <FastImage
                  source={{ uri: item?.images?.length >= 1 ? item?.images[this?.state?.imageIndex]?.uri : '' }}
                  style={styles.imageStyle}
                />
                <Animated.View
                  style={[{ opacity: this.nlayerOpacity }, styles.nopeLayer]}
                />
                <Animated.View
                  style={[{ opacity: this.layerlikeOpacity }, styles.successLayer]}
                />
                {/* <Animated.View
                style={{
                  opacity: this.topLayerOpacity,
                  position: 'absolute',
                  height: '100%',
                  width: '100%',
                  top: 0,
                  left: 0,
                  backgroundColor: "#0062FF",
                  backgroundColor: COLORS.primary,
                  borderRadius: 20,
                }}
              >
              </Animated.View> */}
                <LinearGradient
                  style={styles.gradientLayer}
                  colors={["rgba(0,0,0,0)", "rgba(0,0,0,.8)"]}
                >
                  <TouchableOpacity
                    style={styles.padding}
                    onPress={() => this.props.navigation.navigate(SCREEN.PROFILE_DETAILS, { item })}
                  >
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={styles.textBold}>{item?.name} , {item?.age}</Text>
                      {item?.verified?.isActive && <VerifiedBadge style={{ marginTop: 3 }} />}
                    </View>
                    <Text style={styles.subText}>{item?.about}</Text>
                  </TouchableOpacity>
                </LinearGradient>
                <FavStar isLiked={this.state.isSuperLiked} onPress={() => this.toggleSuperLike(item)} style={styles.starCircle} />
              </View>
            </LinearGradient>

          </Animated.View>
        )
      } else {
        return (
          <Animated.View
            key={i}
            style={[{
              opacity: this.nextCardOpacity,
              transform: [{ scale: this.nextCardScale }],
            }, styles.cardStyle]}
          >
            <LinearGradient
              colors={item?.cardColors || COLORS.transparentGradient}
              style={styles.gradientStyle}
            >
              <View style={styles.flex}>

                <RoundButton
                  iconName={'arrowleft'}
                  style={styles.leftSide}
                  onPress={() => this.moveToPreviousImage()}
                />
                <RoundButton
                  iconName={'arrowright'}
                  style={styles.rightSide}
                  onPress={() => this.moveToNextImage(item?.images?.length)}
                />

                <FastImage
                  source={{ uri: item?.images?.length >= 1 ? item?.images[0]?.uri : '' }}
                  style={styles.imageStyle}
                />
                <LinearGradient
                  colors={["rgba(0,0,0,0)", "rgba(0,0,0,.8)"]}
                  style={[styles.gradientLayer, styles.padding]}
                >
                  <Text style={styles.textBold}>{item?.name} , {item?.age}</Text>
                  <Text style={styles.subText}>{item?.about}</Text>
                </LinearGradient>
                <FavStar isLiked={false} style={styles.starCircle} />
              </View>
            </LinearGradient>
          </Animated.View >
        )
      }
    }).reverse()
  }

  componentDidMount() {
    if (this.props.data?.length >= 1) {
      this.getSuperLikes()
    } else {
      this.setState({ isEmpty: true })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.state.isEmpty) {
      if (this.props.data?.length >= 1) {
        this.getSuperLikes()
      }
      if (
        prevState.currentIndex !== this.state.currentIndex ||
        prevProps.data?.length !== this.props.data?.length ||
        prevProps.data[this.state.currentIndex]?.uid !== this.props.data[this.state.currentIndex]?.uid
      ) {
        if (this.props.data?.length < 1) {
          this.setState({ isEmpty: true })
        }
      }
    } else {
      if (prevProps?.data !== this.props?.data && this.props.data.length >= 1) {
        this.setState({ isEmpty: false, currentIndex: 0 })
      }
    }
  }

  moveToNextImage(imagesLength) {
    const { imageIndex } = this?.state
    if (imageIndex < imagesLength - 1) {
      this.setState({ imageIndex: imageIndex + 1 })
    }
  }

  moveToPreviousImage() {
    const { imageIndex } = this?.state
    if (imageIndex > 0) {
      this.setState({ imageIndex: imageIndex - 1 })
    }
  }

  async getSuperLikes() {
    const likesData = await getSuperLikeData(this.props?.data[this.state?.currentIndex]?.uid)
    if (likesData?.length >= 1) {
      this.setState({ isSuperLiked: likesData[0]?.documentId })
    } else {
      this.setState({ isSuperLiked: '' })
    }
  }

  async toggleSuperLike(item) {
    function isSubscriptionExpired(expiresAt) {
      const currentTimestamp = firestore.Timestamp.now()
      return expiresAt < currentTimestamp
      // var subDateMillis = (subDate?.seconds * 1000) + (subDate?.nanoseconds / 1000000)
      // var currentDate = new Date().getTime()
      // var thirtyDaysInMillis = 30 * 24 * 60 * 60 * 1000
      // var subscriptionEndDate = subDateMillis + thirtyDaysInMillis
      // return currentDate > subscriptionEndDate
    }



    const subscription = this.props?.currentUser?.subscription
    const canSuperLike = subscription?.packageId == 'unlimited' && this.state?.superLikeCount < 25
      || subscription?.packageId == 'pro' && this.state?.superLikeCount < 15
      || subscription?.packageId == 'standard' && this.state?.superLikeCount < 10

    if (this.state?.isSuperLiked) {
      await removeSuperLike(this.state.isSuperLiked)
      this.getSuperLikes()
    } else {
      if (!isSubscriptionExpired(subscription?.expiresAt) && canSuperLike) {
        // console.log('liking...', this.state.superLikeCount)
        const value = this.state.superLikeCount + 1
        await superLike(item)
        await this.getSuperLikes()
        this.setState({ superLikeCount: value })
        await saveData(FIRESTORE_COLLECTIONS.USERS, this.props.currentUser?.uid, { subscription: { superLikesUsed: value } }, true)
        // console.log('Saved Value', value)
      } else {
        if (isSubscriptionExpired(subscription?.expiresAt)) {
          showFlash('Your subscription has been expired')
        } else {
          showFlash('You do not have any super likes')
        }
      }
    }
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        {this.renderFoods()}
        {this.state.isEmpty &&
          <EmptyCard />
        }
      </View>
    )
  }
}

export default memo(MainSlider)

const styles = StyleSheet.create({
  mainContainer: { flex: 1, paddingBottom: 60, },
  cardStyle: {
    height: '100%',
    width: SIZES.width,
    padding: 10,
    position: "absolute",
  },
  successCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    position: "absolute",
    top: 50,
    left: 40,
    height: 50,
    width: 50,
    borderRadius: 50,
    zIndex: 1000,
    backgroundColor: COLORS.success,
  },
  nopeCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    position: "absolute",
    top: 50,
    right: 40,
    height: 50,
    width: 50,
    borderRadius: 50,
    backgroundColor: COLORS.danger,
    zIndex: 1000,
  },
  gradientStyle: {
    flex: 1,
    padding: 3,
    borderRadius: 22,
    overflow: 'hidden',
  },
  flex: { flex: 1, backgroundColor: COLORS.light, borderRadius: 22, },
  imageStyle: {
    flex: 1,
    height: null,
    width: null,
    resizeMode: "cover",
    borderRadius: 20,
  },
  nopeLayer: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    top: 0,
    left: 0,
    borderRadius: 20,
    backgroundColor: COLORS.danger,
  },
  successLayer: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    top: 0,
    left: 0,
    borderRadius: 20,
    backgroundColor: "#00c37b",
  },
  gradientLayer: {
    position: "absolute",
    height: 200,
    width: "100%",
    bottom: 0,
    borderRadius: 20,
    justifyContent: "flex-end",
    alignItems: "flex-start",
  },
  padding: { paddingVertical: 25, paddingHorizontal: 20, },
  textBold: { ...FONTS.h4, color: COLORS.white, },
  subText: { ...FONTS.font, color: COLORS.white, opacity: .75, },
  starCircle: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  leftSide: {
    zIndex: 1,
    position: 'absolute',
    left: 20,
    top: '46%',
  },
  rightSide: {
    zIndex: 1,
    position: 'absolute',
    right: 20,
    top: '46%',
  },
})
