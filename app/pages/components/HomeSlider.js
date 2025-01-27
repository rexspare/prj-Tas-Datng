import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import FavStar from './FavStar'
import EmptyCard from './EmptyCard'
import RoundButton from './RoundButton'
import { useAuth } from '../../contexts'
import VerifiedBadge from './VerifiedBadge'
import Swiper from 'react-native-deck-swiper'
import FastImage from 'react-native-fast-image'
import { showFlash } from '../../utils/helpers'
import { COLORS, FONTS } from '../../constants/theme'
import { useNavigation } from '@react-navigation/native'
import firestore from '@react-native-firebase/firestore'
import LinearGradient from 'react-native-linear-gradient'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { FIRESTORE_COLLECTIONS, SCREEN } from '../../constants/enums'
import { simpleLike, removeSuperLike, getSuperLikeData, superLike, saveData } from '../../services'

const HEIGHT = Dimensions.get('window').height

const CARD_HEIGHT = HEIGHT * 0.78

const HomeSlider = ({ data }) => {
    const swiperRef = useRef(null)
    const { userData } = useAuth()
    const { navigate } = useNavigation()
    const [isEmpty, setIsEmpty] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)

    const CustomCard = ({ card, index }) => {
        const [imageIndex, setImageIndex] = useState(0)
        const [isSuperLiked, setIsSuperLiked] = useState('')
        const [superLikeCount, setSuperLikeCount] = useState(userData?.subscription?.superLikesUsed ?? 0)

        const moveToNextImage = (imagesLength) => {
            if (imageIndex < imagesLength - 1) {
                setImageIndex(prev => prev + 1)
            }
        }

        const moveToPreviousImage = () => {
            if (imageIndex > 0) {
                setImageIndex(prev => prev - 1)
            }
        }

        useEffect(() => {
            if (data?.length > 0) {
                getSuperLikes()
            }
        }, [index])

        const getSuperLikes = async () => {
            const likesData = await getSuperLikeData(data[index]?.uid)
            if (likesData?.length >= 1) {
                setIsSuperLiked(likesData?.length ? likesData[0]?.documentId : '')
            } else {
                setIsSuperLiked('')
            }
        }

        function isSubscriptionExpired(expiresAt) {
            const currentTimestamp = firestore.Timestamp.now()
            return expiresAt < currentTimestamp
        }

        async function toggleSuperLike() {
            const subscription = userData?.subscription

            const canSuperLike = (subscription?.packageId === 'unlimited' && superLikeCount < 25)
                || (subscription?.packageId === 'pro' && superLikeCount < 15)
                || (subscription?.packageId === 'standard' && superLikeCount < 10)

            if (isSuperLiked) {
                await removeSuperLike(isSuperLiked)
                getSuperLikes()
            } else {
                if (!isSubscriptionExpired(subscription?.expiresAt) && canSuperLike) {
                    const value = superLikeCount + 1
                    setSuperLikeCount(value)

                    await superLike(card)
                    await getSuperLikes()

                    await saveData(FIRESTORE_COLLECTIONS.USERS, userData?.uid, {
                        subscription: { superLikesUsed: value }
                    }, true)

                } else {
                    if (isSubscriptionExpired(subscription?.expiresAt)) {
                        showFlash('Your subscription has expired')
                    } else {
                        showFlash('You do not have any super likes left')
                    }
                }
            }
        }

        return (
            <View style={styles.card}>
                <LinearGradient
                    colors={card?.cardColors || COLORS.transparentGradient}
                    style={styles.gradientStyle}
                >
                    <View style={styles.flex}>
                        <FastImage
                            source={{ uri: card?.images?.[imageIndex]?.uri || '' }}
                            style={styles.imageStyle}
                        />

                        <LinearGradient
                            style={styles.gradientLayer}
                            colors={["rgba(0,0,0,0)", "rgba(0,0,0,.8)"]}
                        >
                            <TouchableOpacity
                                style={styles.padding}
                                onPress={() => navigate(SCREEN.PROFILE_DETAILS, { item: card })}
                            >
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={styles.textBold}>{card?.name} , {card?.age}</Text>
                                    {card?.verified?.isActive && <VerifiedBadge style={{ marginTop: 3 }} />}
                                </View>
                                <Text style={styles.subText}>{card?.about}</Text>
                            </TouchableOpacity>
                        </LinearGradient>

                        <FavStar isLiked={isSuperLiked} onPress={() => toggleSuperLike(card)} style={styles.starCircle} />
                        <RoundButton
                            iconName={'arrowleft'}
                            style={styles.leftSide}
                            onPress={() => moveToPreviousImage()}
                        />
                        <RoundButton
                            iconName={'arrowright'}
                            style={styles.rightSide}
                            onPress={() => moveToNextImage(card?.images?.length)}
                        />
                    </View>
                </LinearGradient>
            </View>
        )
    }

    const renderCard = (card, index) => (
        <CustomCard card={card} index={index} />
    )

    const onSwipedLeft = () => { }

    const onSwipedRight = (index) => {
        if (data[index]?.uid) {
            simpleLike(data[index])
        }
    }

    const onSwiped = (index) => {
        setCurrentIndex(index + 1)
    }

    const onSwipedAll = () => {
        setIsEmpty(true)
    }

    return (
        <>
            <Swiper
                ref={swiperRef}
                cards={data}
                renderCard={renderCard}
                onSwiped={onSwiped}
                cardIndex={currentIndex}
                onSwipedAll={onSwipedAll}
                onSwipedLeft={onSwipedLeft}
                onSwipedRight={onSwipedRight}
                stackSize={2}
                stackSeparation={10}
                disableTopSwipe
                disableBottomSwipe
                animateOverlayLabelsOpacity
                overlayLabels={{
                    left: {
                        element: (
                            <>
                                <View style={styles.nopeLayer}>
                                    <View style={styles.nopeCircle}>
                                        <FontAwesome5 size={24} color={COLORS.white} name="times" />
                                    </View>
                                </View>
                            </>
                        ),
                    },
                    right: {
                        element: (
                            <>
                                <View style={styles.successLayer}>
                                    <View style={styles.successCircle}>
                                        <FontAwesome5 size={24} color={COLORS.white} name="check" />
                                    </View>
                                </View>
                            </>
                        ),
                    },
                }}
                animateCardOpacity
                containerStyle={styles.mainContainer}
            />

            {isEmpty && <EmptyCard />}
        </>
    )
}

export default HomeSlider

const styles = StyleSheet.create({
    mainContainer: {
        top: '4%',
        position: 'absolute',
        backgroundColor: 'transparent',
    },
    flex: { flex: 1, backgroundColor: COLORS.light, borderRadius: 22, },
    card: {
        height: CARD_HEIGHT,
        borderRadius: 4,
        borderRadius: 20,
        justifyContent: 'center',
        marginTop: 0,
        overflow: 'hidden',
    },
    gradientStyle: {
        flex: 1,
        padding: 3,
        borderRadius: 22,
        overflow: 'hidden',
    },
    imageStyle: {
        flex: 1,
        height: null,
        width: null,
        resizeMode: "cover",
        borderRadius: 20,
        backgroundColor: COLORS.light,
    },

    nopeLayer: {
        position: 'absolute',
        height: CARD_HEIGHT,
        width: '100%',
        top: 0,
        left: 0,
        borderRadius: 20,
        opacity: 0.5,
        backgroundColor: COLORS.danger,
    },
    successLayer: {
        position: 'absolute',
        flex: 1,
        height: CARD_HEIGHT,
        width: '100%',
        top: 0,
        left: 0,
        opacity: 0.5,
        borderRadius: 20,
        backgroundColor: "#00c37b",
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

    padding: { paddingVertical: 25, paddingHorizontal: 20, },
    textBold: { ...FONTS.h4, color: COLORS.white, },
    subText: { ...FONTS.font, color: COLORS.white, opacity: .75, },
    gradientLayer: {
        position: "absolute",
        height: 200,
        width: "100%",
        bottom: 0,
        borderRadius: 20,
        justifyContent: "flex-end",
        alignItems: "flex-start",
    },
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
