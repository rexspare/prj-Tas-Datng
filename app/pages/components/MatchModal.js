
import { Modal, View, Text, Image, StyleSheet, ImageBackground, StatusBar, TouchableOpacity, Dimensions } from 'react-native'
import React, { memo, useState } from 'react'
import GradientBtn from './GradientBtn'
import Swiper from 'react-native-swiper'
import LottieView from 'lottie-react-native'
import Feather from 'react-native-vector-icons/Feather'
import { useNavigation } from '@react-navigation/native'
import { saveDataInSubCollection } from '../../services'
import firestore from '@react-native-firebase/firestore'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useApp, useAuth, useLanguage } from '../../contexts'
import { FIRESTORE_COLLECTIONS, SCREEN } from '../../constants/enums'
import { COLORS, FONTS, IMAGES, ANIMATIONS } from '../../constants/theme'

const height = Dimensions.get('window').height

const MatchModal = ({ }) => {
    const { t } = useLanguage()
    const { newMatches, setNewMatches } = useApp()
    const [currentIndex, setCurrentIndex] = useState(0)
    const { userData } = useAuth()
    const { navigate } = useNavigation()

    const visible = newMatches?.length !== 0

    const handleChangeIndexValue = (index) => {
        setCurrentIndex(index)
    }

    const onClose = async () => {
        setNewMatches([])
        for (const item of newMatches) {
            const formattedData = {
                matchNotified: true,
                createdAt: firestore.FieldValue.serverTimestamp(),
            }
            await saveDataInSubCollection(
                FIRESTORE_COLLECTIONS.USERS,
                userData.uid,
                FIRESTORE_COLLECTIONS.MATCHES,
                item?.matchId,
                formattedData,
                true,
                true,
            )
        }
    }

    const openChat = () => {
        const item = newMatches[currentIndex]

        const currentUserStr = userData?.uid.toString()
        const otherUserStr = item?.uid?.toString()
        const sortedUserIds = [currentUserStr, otherUserStr].sort()
        const chatId = sortedUserIds.join('_')
        const profileImage = item?.images?.length >= 1 ? item?.images[0]?.uri : ''
        const formattedUser = { ...item, profileImage }
        onClose()
        navigate(SCREEN.SINGLE_CHAT, { chatId: chatId, userDetail: formattedUser })
    }

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType='fade'
            onRequestClose={onClose}
        >
            <ImageBackground
                style={styles.modalWrapper}
                source={IMAGES.matchBackground}
            >
                {/* #9a56bd  #0c0e2a*/}
                <StatusBar backgroundColor={'black'} />

                <LottieView
                    loop
                    autoPlay
                    style={styles.animationStyle}
                    source={ANIMATIONS.CELEBRATION}
                />

                <TouchableOpacity
                    onPress={onClose}
                    activeOpacity={0.7}
                    style={styles.crossButton}
                >
                    <Feather name='x' size={26} color={COLORS.white} />
                </TouchableOpacity>


                <View style={{ minHeight: height * 0.68 }}>
                    <Swiper
                        loop={false}
                        pagingEnabled
                        index={currentIndex}
                        dotColor={COLORS.light}
                        activeDotColor={COLORS.primary}
                        onIndexChanged={handleChangeIndexValue}
                        showsPagination={newMatches.length !== 1}
                    >
                        {newMatches?.map((item, index) => {
                            return (
                                <View key={index}>
                                    <View style={styles.cardContainer}>
                                        <View style={styles.rotateLeft}>
                                            <Image source={userData?.images?.length >= 1 && { uri: userData?.images[0]?.uri }} style={styles.rotatableCard} />
                                        </View>
                                        <View style={styles.rotateRight}>
                                            <View style={[styles.circle, styles.rotateRight]}>
                                                <AntDesign name={'heart'} color={COLORS.primary} size={30} />
                                            </View>
                                            <Image source={item?.images?.length >= 1 && { uri: item?.images[0]?.uri }} style={styles.rotatableCard} />
                                        </View>
                                    </View>

                                    <Text style={styles.modalTitle}>{t('matchHeading')}</Text>
                                    <Text style={styles.text}>{t('matchDescription')}</Text>

                                </View>
                            )
                        })}
                    </Swiper>
                </View>

                <View style={styles.buttonContainer}>
                    <GradientBtn title={t('chatUserText')} onPress={openChat} />
                </View>

            </ImageBackground>
        </Modal>
    )
}

export default memo(MatchModal)

const styles = StyleSheet.create({
    modalWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: '5%',
        backgroundColor: '#4d0a61',
    },
    horizontalView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardContainer: {
        minHeight: 380,
        width: '100%',
        alignItems: 'center',
        zIndex: 0,
    },
    animationStyle: {
        // height: '60%',
        // width: '100%',
        position: 'absolute',
        // backgroundColor: 'red',
        // top: '5%',
        // zIndex: 1,
    },
    modalTitle: {
        ...FONTS.h1,
        color: COLORS.white,
        textAlign: 'center',
    },
    text: {
        ...FONTS.fontMedium,
        color: COLORS.white,
        textAlign: 'center',
        paddingHorizontal: '10%',
    },
    rotatableCard: {
        height: 270,
        width: 180,
        borderRadius: 15,
    },
    rotateLeft: {
        transform: [{ rotate: '-9deg' }],
        zIndex: 1,
        position: 'absolute',
        left: '8%',
        top: 15,
    },
    rotateRight: {
        transform: [{ rotate: '9deg' }],
        zIndex: 2,
        position: 'absolute',
        bottom: '3%',
        right: '8%',
    },
    buttonContainer: {
        marginTop: 30,
        width: '85%',
        alignSelf: 'center',
    },
    circle: {
        height: 70,
        width: 70,
        backgroundColor: COLORS.white,
        borderRadius: 80,
        position: 'absolute',
        zIndex: 3,
        top: -15,
        left: -15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    crossButton: {
        position: 'absolute',
        top: 20,
        right: '5%',
    },
})