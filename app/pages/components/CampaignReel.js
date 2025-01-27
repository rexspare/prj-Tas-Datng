import { StyleSheet, Text, ActivityIndicator, Dimensions, View, TouchableOpacity, Linking } from 'react-native'
import React, { useRef, useState, memo } from 'react'
import Video from 'react-native-video'
import { saveData } from '../../services'
import { useLanguage } from '../../contexts'
import ExpandableText from './ExpandableText'
import { openUrl } from '../../utils/helpers'
import FastImage from 'react-native-fast-image'
import { COLORS, FONTS } from '../../constants/theme'
// import convertToProxyURL from 'react-native-video-cache'
import firestore from '@react-native-firebase/firestore'
import FeatherIcon from 'react-native-vector-icons/Feather'
import { FIRESTORE_COLLECTIONS } from '../../constants/enums'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const CampaignReel = ({ item, currentIndex, index, refRBSheet }) => {
    const videoRef = useRef()
    const { t } = useLanguage()
    const [loading, setLoading] = useState(false)
    const [viewIncremented, setViewIncremented] = useState(false)

    const businessData = item?.businessData

    const handleIncrement = async (key) => {
        const formattedData = {
            [key]: firestore.FieldValue.increment(1),
        }
        await saveData(FIRESTORE_COLLECTIONS.CAMPAIGNS, item?.documentId, formattedData)
        // console.log(key + ' increased by one')
    }

    const handleClick = async (link, key) => {
        openUrl(link)
        handleIncrement(key)
    }

    const onError = error => {
        console.log('error', error)
    }

    const handleVideoLoad = () => {
        setLoading(false)
        onViewIncrement()
    }

    const onViewIncrement = () => {
        if (!viewIncremented) {
            handleIncrement('views')
            setViewIncremented(true)
        }
    }

    return (
        <View style={styles.mainContainer}>

            {loading &&
                <View style={styles.loader}>
                    <ActivityIndicator size={'small'} color={COLORS.white} />
                </View>
            }

            <TouchableOpacity
                activeOpacity={0.9}
                style={styles.screenWrapper}
                onPress={() => handleClick(item?.redirectUrl, 'clicks')}
            >
                {item?.mediaType === 'video' ?
                    <Video
                        repeat={true}
                        onError={onError}
                        videoRef={videoRef}
                        resizeMode={'cover'}
                        onLoad={handleVideoLoad}
                        style={styles.screenWrapper}
                        paused={currentIndex !== index}
                        onLoadStart={() => setLoading(true)}
                        // source={{ uri: convertToProxyURL(item?.media?.uri) }}
                        source={{ uri: item?.media?.uri }}
                    />
                    :
                    <FastImage
                        style={styles.screenWrapper}
                        resizeMode='contain'
                        onLoadEnd={() => onViewIncrement()}
                        source={{ uri: item?.media?.uri }}
                    />
                }
            </TouchableOpacity>

            <View style={styles.contentContainer}>

                <View style={styles.justifyRow}>
                    <TouchableOpacity style={styles.row} onPress={() => handleClick(businessData?.websiteUrl, 'websiteVisits')}>
                        <FastImage
                            style={styles.profileImage}
                            source={{ uri: businessData?.logoImage?.uri }}
                        />
                        <Text style={styles.nameText}>{businessData?.companyName}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => refRBSheet.current.open()}
                        style={{ padding: 8 }}
                    >
                        <FeatherIcon color={COLORS.white} size={24} name='more-vertical' />
                    </TouchableOpacity>
                </View>

                <ExpandableText
                    text={item?.description}
                    numberOfLines={2}
                />

                <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.ctaButton}
                    onPress={() => handleClick(item?.redirectUrl, 'clicks')}
                >
                    <Text style={styles.ctaText}>{t(item?.ctaButton?.label)}</Text>
                </TouchableOpacity>

            </View>

        </View>
    )
}

export default memo(CampaignReel)

const styles = StyleSheet.create({
    mainContainer: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
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
    contentContainer: {
        position: 'absolute',
        bottom: 50,
        left: 0,
        width: '100%',
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    justifyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileImage: {
        height: 40,
        width: 40,
        marginRight: 8,
        borderRadius: 30,
    },
    nameText: {
        ...FONTS.font,
        ...FONTS.fontPoppins,
        color: COLORS.white,
    },
    ctaButton: {
        backgroundColor: COLORS.info,
        borderRadius: 8,
        paddingTop: 7.5,
        paddingBottom: 10,
        paddingHorizontal: 20,
        alignSelf: 'flex-start',
    },
    ctaText: {
        ...FONTS.font,
        color: COLORS.white,
    },
})