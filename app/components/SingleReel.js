import { Image, Text, TouchableOpacity, StyleSheet, View, ActivityIndicator, Dimensions } from 'react-native'
import React, { useRef, useState, memo, useEffect } from 'react'
import { saveData } from '../services'
import Video from 'react-native-video'
import { COLORS, FONTS } from '../constants/theme'
import { ExpandableText } from '../pages/components'
import { useNavigation } from '@react-navigation/native'
import Ionicons from 'react-native-vector-icons/Ionicons'
// import convertToProxyURL from 'react-native-video-cache'
import { useApp, useAuth, useLanguage } from '../contexts'
import FeatherIcon from 'react-native-vector-icons/Feather'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { FIRESTORE_COLLECTIONS, SCREEN } from '../constants/enums'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const SingleReel = ({ item, index, currentIndex, refRBSheet, sheetRef, hasNavigation }) => {
    const { t } = useLanguage()
    const videoRef = useRef(null)
    const { userData } = useAuth()
    const { navigate } = useNavigation()
    const [mute, setMute] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isFollowed, setIsFollowed] = useState(false)
    const { followUser, unfollowUser, isUserFollowing } = useApp()
    const [isLiked, setIsLiked] = useState(item?.likes?.includes(userData?.uid))
    const [videoLikes, setVideoLikes] = useState(item?.likes?.length >= 1 ? item?.likes : [])

    useEffect(() => {
        getFollowStatus()
    }, [item?.uid])

    const getFollowStatus = async () => {
        const followStatus = await isUserFollowing(item?.uid)
        setIsFollowed(followStatus)
    }

    const toggleFollow = async () => {
        if (isFollowed) {
            await unfollowUser(userData?.uid, item?.uid)
            setIsFollowed(false)
        } else {
            await followUser(userData?.uid, item?.uid)
            setIsFollowed(true)
        }
    }

    const onError = error => {
        console.log('error', error)
    }

    const toggleLike = () => isLiked ? onDislike() : onLike()

    const onLike = async () => {
        const prevLikes = videoLikes?.length >= 1 ? item.likes : []
        const newData = { likes: [...prevLikes, userData?.uid] }
        setVideoLikes([...prevLikes, userData?.uid])
        setIsLiked(true)
        await saveData(FIRESTORE_COLLECTIONS.REELS, item?.documentId, newData)
    }

    const onDislike = async () => {
        const newLikes = videoLikes?.filter(x => x !== userData?.uid)
        const newData = { likes: newLikes }
        setVideoLikes(newLikes)
        setIsLiked(false)
        await saveData(FIRESTORE_COLLECTIONS.REELS, item?.documentId, newData)
    }

    const openProfile = () => {
        navigate(SCREEN.REELS_LIST, { userId: item?.uid })
    }

    return (
        <>
            <View style={styles.mainContainer}>

                {loading &&
                    <View style={styles.loader}>
                        <ActivityIndicator size={'small'} color={COLORS.white} />
                    </View>
                }

                <TouchableOpacity
                    activeOpacity={0.9}
                    style={styles.screenWrapper}
                    onPress={() => setMute(!mute)}
                >
                    <Video
                        muted={mute}
                        repeat={true}
                        onError={onError}
                        videoRef={videoRef}
                        resizeMode={'cover'}
                        style={styles.screenWrapper}
                        paused={currentIndex !== index}
                        onLoad={() => setLoading(false)}
                        onLoadStart={() => setLoading(true)}
                        // source={{ uri: convertToProxyURL(item?.videoUrl?.uri) }}
                        source={{ uri: item?.videoUrl?.uri }}
                    />
                </TouchableOpacity>

                <View style={[styles.userProfileView, { paddingVertical: hasNavigation ? 40 : 20, }]}>
                    <View style={styles.row}>
                        <TouchableOpacity style={styles.row} onPress={openProfile}>
                            <Image
                                style={styles.profileImage}
                                source={{ uri: item?.profileImage }}
                            />
                            <Text style={styles.nameText}>{item?.username}</Text>
                        </TouchableOpacity>
                        {(item?.uid !== userData?.uid) &&
                            <TouchableOpacity style={styles.followButton} onPress={toggleFollow}>
                                <Text style={styles.followText}>{isFollowed ? t('following') : t('follow')}</Text>
                            </TouchableOpacity>
                        }
                    </View>

                    <ExpandableText text={item?.caption} />
                    <View style={styles.tagWrapper}>
                        {item?.tags.map((x, i) => (
                            <Text style={styles.tagStyle} key={i}>#{x}</Text>
                        ))}
                    </View>

                </View>

                <View style={styles.actionView}>
                    <View style={styles.buttonView}>
                        <TouchableOpacity
                            onPress={() => toggleLike()}
                            style={{ padding: 5 }}
                        >
                            <FontAwesome color={isLiked ? COLORS.brightRed : COLORS.white} size={26} name={isLiked ? 'heart' : 'heart-o'} />
                        </TouchableOpacity>
                        <Text style={{ ...FONTS.font, color: COLORS.white }}>{videoLikes?.length}</Text>
                    </View>

                    <View style={styles.buttonView}>
                        <TouchableOpacity style={{ padding: 5 }} onPress={() => navigate(SCREEN.COMMENT, { postId: item?.documentId })}>
                            <FontAwesome color={COLORS.white} size={26} name='comment-o' />
                        </TouchableOpacity>
                        <Text style={{ ...FONTS.font, color: COLORS.white }}>{item?.comments}</Text>
                    </View>

                    <View style={[styles.buttonView, { marginBottom: 10 }]}>
                        <TouchableOpacity
                            //onPress={() => sheetRef.current.snapTo(0)}
                            onPress={() => sheetRef.current.open()}
                            style={{ padding: 6 }}
                        >
                            <Ionicons color={COLORS.white} size={28} name='paper-plane-outline' />
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.buttonView, { marginBottom: 0 }]}>
                        <TouchableOpacity
                            onPress={() => refRBSheet.current.open()}
                            style={{ padding: 8 }}
                        >
                            <FeatherIcon color={COLORS.white} size={24} name='more-vertical' />
                        </TouchableOpacity>
                    </View>

                </View>

            </View>
        </>
    )
}

export default memo(SingleReel)

const styles = StyleSheet.create({
    mainContainer: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        // width: "100%",
        // height: "100%",
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loader: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    screenWrapper: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    userProfileView: {
        position: 'absolute',
        bottom: 50,
        left: 0,
        width: '100%',
        paddingHorizontal: 15,
        paddingRight: 70,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileImage: {
        height: 40,
        width: 40,
        borderRadius: 30,
        marginRight: 8,
    },
    nameText: {
        ...FONTS.font, ...FONTS.fontPoppins, color: COLORS.white,
    },
    followButton: {
        borderWidth: 1,
        borderColor: COLORS.white,
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 4,
        marginLeft: 20,
    },
    followText: {
        ...FONTS.font, color: COLORS.white, top: -1
    },
    actionView: {
        position: 'absolute',
        bottom: 50,
        right: 0,
        paddingBottom: 20,
        paddingTop: 20,
        width: 70,
        alignItems: 'center',
    },
    buttonView: {
        alignItems: 'center', marginBottom: 15,
    },

    captionStyle: {
        ...FONTS.font, color: COLORS.white,
        marginVertical: 4,
    },
    tagWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 10,
    },
    tagStyle: { ...FONTS.fontBold, color: COLORS.white },
})