import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useRef, useState } from 'react'
import { List } from 'react-native-paper'
import Header from '../../layout/Header'
import { SCREEN } from '../../constants/enums'
import { showFlash } from '../../utils/helpers'
import { useTheme } from '@react-navigation/native'
import RBSheet from 'react-native-raw-bottom-sheet'
import { useAuth, useLanguage } from '../../contexts'
import { deleteImage, uploadImage } from '../../services'
import FeatherIcon from 'react-native-vector-icons/Feather'
import { GlobalStyleSheet } from '../../constants/StyleSheet'
import { COLORS, FONTS, IMAGES } from '../../constants/theme'
import { GalleryPicker, GradientBtn, HoroscopeSheet, InterestSheet, LanguagesSheet, RelationshipGoalsSheet, SexualOrientationSheet } from '../components'

const EditProfile = ({ navigation }) => {
    const sheetRef = useRef()
    const { t } = useLanguage()
    const profileSheet = useRef()
    const languageSheet = useRef()
    const { colors } = useTheme()
    const Styles = styles(colors)
    const { userData, updateUser } = useAuth()
    const [sheetType, setSheetType] = useState('')
    const [loading, setLoading] = useState(false)
    const [showButton, setShowButton] = useState(false)

    const [images, setImages] = useState(userData?.images || [])
    const [lookingFor, setLookingFor] = useState(userData?.lookingFor)
    const [orientation, setOrientation] = useState(userData?.orientation)
    const [horoscope, setHoroscope] = useState(userData?.horoscope)
    const [interests, setInterests] = useState(userData?.interests || [])
    const [languages, setLanguages] = useState(userData?.languages || [])
    const [deletedImages, setDeletedImages] = useState([])

    const openSheet = (type) => {
        setSheetType(type)
        sheetRef.current.open()
    }

    const onChange = (callBack) => {
        return (x) => {
            callBack(x)
            setShowButton(true)
        }
    }

    const updateLocalFields = (data) => {
        if (data?.interests >= 1) {
            setInterests(data?.interests)
        }
        if (data.languages >= 1) {
            setLanguages(data?.languages)
        }
        setImages(data?.images)
        setLookingFor(data?.lookingFor)
        setOrientation(data?.orientation)
        setHoroscope(data?.horoscope)
    }

    const handleSaveChanges = async () => {
        if (images.length >= 1) {
            setLoading(true)
            let uploadedImages = []
            for (const item of images) {
                let uploadedItem = item
                if (!uploadedItem.uri?.includes('https:') && !uploadedItem.uri?.includes('http:')) {
                    uploadedItem = await uploadImage(item?.uri, userData?.uid)
                    if (uploadedItem === 'false') {
                        // console.log('Something Went Wrong')
                        setLoading(false)
                        return
                    }
                }
                uploadedImages?.push(uploadedItem)
            }

            let updatedObject = {
                ...userData,
                orientation,
                horoscope,
                lookingFor,
                images: uploadedImages,
            }

            if (interests?.length >= 1) {
                updatedObject.interests = interests
            } else {
                delete updatedObject.interests
            }
            if (languages?.length >= 1) {
                updatedObject.languages = languages
            } else {
                delete updatedObject.languages
            }

            await updateUser(updatedObject, true)

            updateLocalFields(updatedObject)

            if (deletedImages?.length >= 1) {
                for (const item of deletedImages) {
                    if (item?.name) {
                        const deleted = await deleteImage(userData?.uid, item?.name)
                        if (deleted === 'false') {
                            // console.log('Something Went Wrong')
                            setLoading(false)
                            return
                        }
                    }
                    // else {
                    //     console.log('deleted Image name not found')
                    // }
                }
                setDeletedImages([])
            }
            setLoading(false)
            setShowButton(false)
        } else {
            showFlash(t('emptyImageWarning'))
        }
    }

    const handleRemoveImage = (index) => {
        const foundImage = images[index]
        setDeletedImages([...deletedImages, foundImage])
    }

    const renderBusinessIcon = () => (
        <Image
            resizeMode='contain'
            source={IMAGES.briefcase}
            style={Styles.businessIcon}
        />
    )

    return (
        <>
            <InterestSheet
                data={interests}
                setData={onChange(setInterests)}
                sheetRef={profileSheet}
            />
            <LanguagesSheet
                data={languages}
                setData={onChange(setLanguages)}
                sheetRef={languageSheet}
            />

            <RBSheet
                ref={sheetRef}
                height={480}
                openDuration={100}
                closeOnDragDown={true}
                customStyles={Styles.sheetStyle}
            >
                {sheetType == "relation" ?
                    <RelationshipGoalsSheet value={lookingFor} onSelect={onChange(setLookingFor)} />
                    :
                    sheetType == "orientation" ?
                        <SexualOrientationSheet value={orientation} onSelect={onChange(setOrientation)} />
                        :
                        sheetType == 'horoscope' ?
                            <HoroscopeSheet value={horoscope} onSelect={onChange(setHoroscope)} />
                            :
                            <></>
                }
            </RBSheet>

            <SafeAreaView style={Styles.mainScreen}>
                <Header
                    leftIcon={'back'}
                    title={t('editProfile')}
                    titleLeft
                    rightIcon={userData?.isBusinessProfile && renderBusinessIcon}
                    onRightPress={() => navigation.navigate(SCREEN.BUSINESS_PROFILE)}
                />

                <ScrollView>
                    <View style={GlobalStyleSheet.container}>

                        <GalleryPicker
                            imageData={images}
                            setImageData={onChange(setImages)}
                            onRemovePress={onChange(handleRemoveImage)}
                            style={{ marginBottom: 20 }}
                        />

                        <View style={Styles.cardStyle}>
                            <Text style={Styles.heading}>{t('interests')}</Text>
                            <List.Item
                                style={Styles.itemStyle}
                                titleStyle={Styles.textStyle}
                                onPress={() => profileSheet.current.open()}
                                title={interests?.length >= 1 ? interests?.join(', ') : t('noInterestsAdded')}
                            />
                        </View>
                        <View style={Styles.cardStyle}>
                            <Text style={Styles.heading}>{t('relationshipGoals')}</Text>
                            <List.Item
                                title={lookingFor}
                                style={Styles.itemStyle}
                                titleStyle={Styles.textStyle}
                                onPress={() => openSheet('relation')}
                                right={() => <FeatherIcon size={18} color={colors.text} name='chevron-right' />}
                            />
                        </View>
                        <View style={Styles.cardStyle}>
                            <Text style={Styles.heading}>{t('languagesIKnow')}</Text>
                            <List.Item
                                style={Styles.itemStyle}
                                titleStyle={Styles.textStyle}
                                onPress={() => languageSheet.current.open()}
                                title={languages?.length >= 1 ? languages?.join(', ') : t('noLanguagesAdded')}
                            />
                        </View>
                        <View style={Styles.cardStyle}>
                            <Text style={Styles.heading}>{t('sexualOrientation')}</Text>
                            <List.Item
                                title={orientation}
                                style={Styles.itemStyle}
                                titleStyle={Styles.textStyle}
                                onPress={() => openSheet('orientation')}
                                right={() => <FeatherIcon size={18} color={colors.text} name='chevron-right' />}
                            />
                        </View>

                        <View style={Styles.cardStyle}>
                            <Text style={Styles.heading}>{t('horoscope')}</Text>
                            <List.Item
                                title={horoscope || t('noHoroscopeAdded')}
                                style={Styles.itemStyle}
                                titleStyle={Styles.textStyle}
                                onPress={() => openSheet('horoscope')}
                                right={() => <FeatherIcon size={18} color={colors.text} name='chevron-right' />}
                            />
                        </View>

                        {showButton &&
                            <GradientBtn
                                title={t('save')}
                                isLoading={loading}
                                onPress={handleSaveChanges}
                            />
                        }
                    </View>
                </ScrollView>

            </SafeAreaView>
        </>
    )
}

export default EditProfile

const styles = (colors) => StyleSheet.create({
    mainScreen: { flex: 1, backgroundColor: colors.background, },
    cardStyle: {
        paddingBottom: 5,
        ...GlobalStyleSheet.card,
        backgroundColor: colors.cardBg,
        borderColor: colors.borderColor,
    },
    heading: {
        ...FONTS.font,
        ...FONTS.fontBold,
        color: colors.title,
        paddingBottom: 8,
        marginBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderColor,
    },
    itemStyle: { marginHorizontal: -15, },
    textStyle: { ...FONTS.font, fontSize: 16, color: colors.text, },
    sheetStyle: {
        wrapper: {},
        container: {
            backgroundColor: colors.cardBg,
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
        },
        draggableIcon: {
            marginTop: 5,
            marginBottom: 0,
            height: 5,
            width: 90,
            backgroundColor: colors.borderColor,
        }
    },
    businessIcon: {
        height: 22,
        width: 22,
        tintColor: COLORS.primary,
    }
})