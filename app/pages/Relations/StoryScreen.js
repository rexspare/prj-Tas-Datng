import { SafeAreaView, ActivityIndicator, Dimensions, Text, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Video from 'react-native-video'
import { SCREEN } from '../../constants/enums'
import FastImage from 'react-native-fast-image'
import * as Progress from 'react-native-progress'
import { useTheme } from '@react-navigation/native'
import { COLORS, FONTS } from '../../constants/theme'
import { timeElapsedString } from '../../utils/helpers'
// import convertToProxyURL from 'react-native-video-cache'
import FeatherIcon from 'react-native-vector-icons/Feather'
import { useApp, useAuth, useLanguage } from '../../contexts'
import LinearGradient from 'react-native-linear-gradient'

const SCREEN_WIDTH = Dimensions.get('window').width

const StoryScreen = ({ route, navigation }) => {
    const { index, isMyStory } = route?.params
    const { t } = useLanguage()
    const { stories } = useApp()
    const videoRef = useRef(null)
    const { colors } = useTheme()
    const Styles = styles(colors)
    const { userData } = useAuth()

    const [paused, setPaused] = useState(false)
    const [loading, setLoading] = useState(false)
    const [videoDuration, setVideoDuration] = useState(5)
    const [videoProgress, setVideoProgress] = useState(0)
    const [currentIndex, setCurrentIndex] = useState(index)

    const currentStory = isMyStory ? userData : stories[currentIndex]
    const userColors = currentStory?.profileColors || [colors.textLight, colors.textLight]
    const formattedTime = timeElapsedString(currentStory?.story?.timestamp, t('posted')) || ''

    const onError = error => {
        console.log('error', error)
    }

    const handleNextVideo = () => {
        if (isMyStory) {
            navigation.goBack()
            return
        }
        if (currentIndex < stories.length - 1) {
            setVideoProgress(0)
            let nextIndex = currentIndex + 1
            setCurrentIndex(nextIndex)
        } else {
            navigation.goBack()
        }
    }

    const handleOnLoad = (data) => {
        setVideoDuration(data.duration)
    }

    const handlePressOut = () => {
        if (paused) {
            setPaused(false)
        }
    }

    const handleOnProgress = (data) => {
        setLoading(false)
        setVideoProgress(data.currentTime / videoDuration)
    }

    useEffect(() => {
        if (currentStory?.story?.mediaType !== 'video') {
            setVideoDuration(5)
            setVideoProgress(0)

            const interval = setInterval(() => {
                setVideoProgress(prev => {
                    const newProgress = prev + (100 / (5 * 1000))
                    if (newProgress >= 1) {
                        clearInterval(interval)
                        handleNextVideo()
                    }
                    return newProgress
                })
            }, 100)

            return () => clearInterval(interval)
        }
    }, [currentStory])

    const openProfile = () => {
        navigation.navigate(SCREEN.REELS_LIST, { userId: currentStory?.uid })
    }

    return (
        <SafeAreaView style={Styles.mainScreen}>
            <View style={Styles.mainScreen}>
                <TouchableOpacity
                    activeOpacity={0.9}
                    style={Styles.screenWrapper}
                    onPress={() => handleNextVideo()}
                    onPressOut={() => handlePressOut()}
                    onLongPress={() => setPaused(prev => !prev)}
                >
                    {loading &&
                        <View style={Styles.loader}>
                            <ActivityIndicator size={'small'} color={COLORS.white} />
                        </View>
                    }
                    {currentStory?.story?.mediaType == 'video' ?
                        <Video
                            repeat={false}
                            onError={onError}
                            videoRef={videoRef}
                            resizeMode={'cover'}
                            // source={{ uri: convertToProxyURL(currentStory?.story?.mediaUrl?.uri) }}
                            source={{ uri: currentStory?.story?.mediaUrl?.uri }}
                            style={Styles.screenWrapper}
                            onLoad={handleOnLoad}
                            onProgress={handleOnProgress}
                            onEnd={() => handleNextVideo()}
                            onLoadStart={() => setLoading(true)}
                            onBuffer={() => setLoading(true)}
                            preventsDisplaySleepDuringVideoPlayback
                            paused={paused}
                        />
                        :
                        <FastImage
                            source={currentStory?.story.mediaUrl}
                            style={Styles.screenWrapper}
                            resizeMode='contain'
                        />
                    }
                </TouchableOpacity>

                <View style={Styles.progressContainer}>
                    <Progress.Bar
                        height={4}
                        borderRadius={0}
                        width={SCREEN_WIDTH}
                        color={COLORS.primary}
                        unfilledColor={colors}
                        progress={videoProgress}
                        borderColor={'transparent'}
                    />
                    <View style={Styles.headerView}>
                        <TouchableOpacity activeOpacity={0.7} onPress={openProfile} style={Styles.textContainer}>
                            <LinearGradient
                                colors={userColors}
                                style={Styles.gradientBorder}
                            >
                                <FastImage
                                    source={currentStory?.images?.length >= 1 && { uri: currentStory?.images[0]?.uri }}
                                    style={Styles.profileImage}
                                />
                            </LinearGradient>
                            <View style={{ maxWidth: 220, }}>
                                <Text numberOfLines={1} style={Styles.textBold}>{currentStory?.name}</Text>
                                <Text style={Styles.text}>{formattedTime}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={Styles.crossButton}
                            onPress={() => navigation.goBack()}
                        >
                            <FeatherIcon name='x' size={26} color={COLORS.white} />
                        </TouchableOpacity>
                    </View>
                </View>

            </View>
        </SafeAreaView>
    )
}

export default StoryScreen

const styles = (colors) => StyleSheet.create({
    mainScreen: { flex: 1, backgroundColor: 'black' },
    screenWrapper: {
        width: '100%',
        height: '100%',
    },
    crossButton: {
        height: 48,
        width: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loader: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressContainer: {
        position: 'absolute',
        top: 0,
        alignSelf: 'center',
        zIndex: 2,
    },
    headerView: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        paddingHorizontal: '5%',
    },
    textBold: {
        ...FONTS.h6,
        color: COLORS.white,
    },
    text: {
        ...FONTS.fontBold,
        fontSize: 12,
        lineHeight: 14,
        color: COLORS.white,
    },
    textContainer: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    gradientBorder: {
        height: 55,
        width: 55,
        borderRadius: 50,
        marginEnd: '5%',
        padding: 2.5,
    },
    profileImage: {
        height: '100%',
        width: '100%',
        borderRadius: 50,
    },
})