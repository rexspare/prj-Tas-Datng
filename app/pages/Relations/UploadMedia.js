import { SafeAreaView, StyleSheet, ScrollView, Text, TouchableOpacity, Image, View } from 'react-native'
import React, { useState } from 'react'
import Header from '../../layout/Header'
import { GradientBtn } from '../components'
import { useTheme } from '@react-navigation/native'
import { useAuth, useLanguage } from '../../contexts'
import { addNewDoc, uploadImage } from '../../services'
import FeatherIcon from 'react-native-vector-icons/Feather'
import { COLORS, FONTS, SIZES } from '../../constants/theme'
import CustomInput from '../../components/Input/CustomInput'
import { GlobalStyleSheet } from '../../constants/StyleSheet'
import { FIRESTORE_COLLECTIONS, STORAGE } from '../../constants/enums'
import { handleGalleryPermission, openGallery, showFlash } from '../../utils/helpers'

const UploadMedia = () => {
    const { t } = useLanguage()
    const { colors } = useTheme()
    const Styles = styles(colors)
    const { userData } = useAuth()
    const [tags, setTags] = useState([])
    const [caption, setCaption] = useState('')
    const [tagValue, setTagValue] = useState('')
    const [loading, setLoading] = useState(false)
    const [selectedVideo, setSelectedVideo] = useState('')

    const selectImage = async () => {
        const callbackFunction = async () => {
            const video = await openGallery({ mediaType: 'video' })
            if (video?.path) {
                setSelectedVideo(video.path)
            }
        }

        handleGalleryPermission(callbackFunction)
    }

    const removeImageItem = () => setSelectedVideo('')

    const addNewTag = () => {
        if (tagValue) {
            if (!tags?.includes(tagValue)) {
                setTags((prev) => [...prev, tagValue?.trim()])
                setTagValue('')
            } else {
                showFlash(t('hashtagExitsWarning'))
            }
        }
    }
    const removeTag = (index) => {
        const newArray = [...tags]
        newArray.splice(index, 1)
        setTags(newArray)
    }

    const handleUpload = async () => {
        if (selectedVideo && caption && tags?.length >= 1) {
            try {
                setLoading(true)
                const uploadVideo = await uploadImage(selectedVideo, STORAGE.REELS)

                const formattedData = {
                    postedBy: userData.uid,
                    videoUrl: uploadVideo,
                    caption,
                    tags,
                }

                await addNewDoc(FIRESTORE_COLLECTIONS.REELS, formattedData)

                showFlash(t('reelCreatedSuccess'))
                setCaption('')
                setSelectedVideo('')
                setTagValue('')
                setTags([])

            } catch (e) {
                console.log('Error creating reel', e)
            } finally {
                setLoading(false)
            }
        } else {
            showFlash(t('enterDataWarning'))
        }
    }

    return (
        <SafeAreaView style={Styles.mainScreen}>
            <View style={Styles.mainScreen}>

                <Header
                    titleLeft
                    leftIcon={'back'}
                    title={t('fileUpload')}
                />

                <ScrollView>
                    <View style={GlobalStyleSheet.container}>

                        <View style={[GlobalStyleSheet.card, GlobalStyleSheet.shadow, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
                            <Text style={Styles.heading}>{t('addVideo')}</Text>

                            <TouchableOpacity
                                activeOpacity={.8}
                                style={Styles.imagePicker}
                                onPress={() => selectImage()}
                            >
                                {selectedVideo ?
                                    <>
                                        <TouchableOpacity
                                            activeOpacity={.8}
                                            style={Styles.crossButton}
                                            onPress={() => removeImageItem()}
                                        >
                                            <FeatherIcon name='x' size={16} color={COLORS.white} />
                                        </TouchableOpacity>
                                        <Image
                                            style={Styles.videoStyle}
                                            source={{ uri: selectedVideo }}
                                        />
                                    </>
                                    :
                                    <FeatherIcon name='image' color={colors.borderColor} size={70} />
                                }
                            </TouchableOpacity>

                            <Text style={Styles.heading}>{t('caption')}</Text>

                            <View style={{ marginBottom: 15 }}>
                                <CustomInput
                                    value={caption}
                                    onChangeText={setCaption}
                                    placeholder={t('captionPlaceholder')}
                                />
                            </View>

                            <Text style={Styles.heading}>{t('hashtags')}</Text>

                            <View style={{ justifyContent: 'center', marginBottom: 15 }}>
                                <CustomInput
                                    value={tagValue}
                                    onChangeText={setTagValue}
                                    style={{ paddingRight: 35 }}
                                    placeholder={t('hashtagsPlaceholder')}
                                />
                                <TouchableOpacity activeOpacity={.8} onPress={addNewTag} style={Styles.addButton}>
                                    <FeatherIcon name='plus' color={colors.text} size={25} />
                                </TouchableOpacity>
                            </View>

                            <View style={Styles.tagContainer}>
                                {tags.map((item, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        activeOpacity={.8}
                                        style={Styles.item}
                                        onPress={() => removeTag(index)}
                                    >
                                        <Text style={Styles.itemText}>#{item}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <GradientBtn title={t('upload')} onPress={handleUpload} isLoading={loading} />

                        </View>
                    </View>
                </ScrollView>

            </View>
        </SafeAreaView>
    )
}

export default UploadMedia

const styles = (colors) => StyleSheet.create({
    mainScreen: {
        flex: 1,
        backgroundColor: colors.background,
        marginBottom: 60,
    },
    heading: {
        ...FONTS.h6, color: colors.title,
        marginBottom: 5,
    },
    imagePicker: {
        height: 340,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderRadius: SIZES.radius,
        marginBottom: 10,
        borderColor: colors.borderColor,
        alignItems: 'center',
        justifyContent: 'center',
    },
    crossButton: {
        height: 25,
        width: 25,
        borderRadius: 20,
        position: 'absolute',
        top: -5,
        right: -5,
        zIndex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.danger,
    },
    videoStyle: {
        height: '100%',
        width: '100%',
        borderRadius: SIZES.radius,
    },
    addButton: {
        position: 'absolute',
        right: 9,
    },
    item: {
        paddingHorizontal: 10,
        paddingTop: 5,
        paddingBottom: 7,
        borderRadius: SIZES.radius_sm,
        backgroundColor: COLORS.primary,
    },
    itemText: {
        ...FONTS.font, color: COLORS.white,
    },
    tagContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        marginBottom: 15,
        flexWrap: 'wrap',
    },
})