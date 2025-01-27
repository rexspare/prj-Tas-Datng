import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react'
import Header from '../../layout/Header'
import FastImage from 'react-native-fast-image'
import { useTheme } from '@react-navigation/native'
import { useAuth, useLanguage } from '../../contexts'
import { addNewDoc, uploadImage } from '../../services'
import FeatherIcon from 'react-native-vector-icons/Feather'
import { COLORS, FONTS, SIZES } from '../../constants/theme'
import { CallToActionSheet, GradientBtn } from '../components'
import { FIRESTORE_COLLECTIONS, STORAGE } from '../../constants/enums'
import { handleGalleryPermission, openGallery, showFlash } from '../../utils/helpers'

const NewCampaign = ({ navigation }) => {
    const ctaRef = useRef()
    const { t } = useLanguage()
    const { colors } = useTheme()
    const Styles = styles(colors)
    const { userData } = useAuth()
    const [loading, setLoading] = useState(false)
    const [campaignForm, setCampaignForm] = useState({})
    const updateForm = (key, value) => setCampaignForm({ ...campaignForm, [key]: value })

    const createNewCampaign = async () => {
        const { title, description, redirectUrl, ctaButton, media } = campaignForm
        const isFormComplete = title && description && redirectUrl && ctaButton?.value && media?.uri && media?.type

        if (isFormComplete) {
            setLoading(true)

            const uploadedContent = await uploadImage(media.uri, STORAGE.CAMPAIGNS)
            if (uploadedContent === 'false') {
                showFlash(t('errorWarning'))
                setLoading(false)
                return
            }

            const formattedData = {
                ...campaignForm,
                businessProfileId: userData?.businessProfileId,
                userId: userData?.uid,
                media: uploadedContent,
                mediaType: media?.type,
            }

            await addNewDoc(FIRESTORE_COLLECTIONS.CAMPAIGNS, formattedData)
            setLoading(false)
            showFlash(t('uploadCampaignSuccess'))
            navigation.goBack()
        } else {
            showFlash(t('enterDataWarning'))
        }
    }

    const selectMedia = async () => {
        const callbackFunction = async () => {
            const selected = await openGallery({ mediaType: 'any' })
            if (selected?.path) {
                updateForm('media', { uri: selected?.path, type: selected?.mime == 'video/mp4' ? 'video' : 'image' })
            }
        }

        handleGalleryPermission(callbackFunction)
    }

    const removeMedia = () => {
        updateForm('media', {})
    }

    return (
        <SafeAreaView style={Styles.mainScreen}>

            <Header
                leftIcon={'back'}
                titleLeft
                title={t('campaigns')}
            />

            <CallToActionSheet sheetRef={ctaRef} value={campaignForm?.ctaButton} onSelect={(x) => updateForm('ctaButton', x)} />

            <ScrollView>
                <View style={{ paddingHorizontal: '5%' }}>

                    <View style={Styles.fieldContainer}>
                        <Text style={Styles.heading}>{t('campaignTitle')}</Text>
                        <TextInput
                            value={campaignForm?.title}
                            style={Styles.inputStyle}
                            placeholder={t('titlePlaceholder')}
                            placeholderTextColor={colors.textLight}
                            onChangeText={(x) => updateForm('title', x)}
                        />
                    </View>

                    <View style={Styles.fieldContainer}>
                        <Text style={Styles.heading}>{t('description')}</Text>
                        <TextInput
                            multiline
                            value={campaignForm?.description}
                            style={[Styles.inputStyle, Styles.multilineInput]}
                            placeholder={t('descriptionPlaceholder')}
                            placeholderTextColor={colors.textLight}
                            onChangeText={(x) => updateForm('description', x)}
                        />
                    </View>

                    <View style={Styles.fieldContainer}>
                        <Text style={Styles.heading}>{t('redirectUrl')}</Text>
                        <TextInput
                            value={campaignForm?.redirectUrl}
                            style={Styles.inputStyle}
                            placeholder={t('redirectUrlPlaceholder')}
                            placeholderTextColor={colors.textLight}
                            onChangeText={(x) => updateForm('redirectUrl', x)}
                        />
                    </View>

                    <View style={Styles.fieldContainer}>
                        <Text style={Styles.heading}>{t('ctaTitle')}</Text>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            style={Styles.inputStyle}
                            onPress={() => ctaRef.current?.open()}
                        >
                            <Text style={[Styles.inputText, campaignForm?.ctaButton?.value && { color: colors.title }]}>{t(campaignForm?.ctaButton?.label || 'ctaPlaceholder')}</Text>
                        </TouchableOpacity>
                    </View>


                    <View style={Styles.fieldContainer}>
                        <Text style={Styles.heading}>{t('ctaTitle')}</Text>

                        <TouchableOpacity
                            activeOpacity={.8}
                            style={Styles.mediaContainer}
                            onPress={() => selectMedia()}
                        >
                            {campaignForm?.media?.uri ?
                                <>
                                    <TouchableOpacity
                                        activeOpacity={.8}
                                        style={Styles.crossButton}
                                        onPress={() => removeMedia()}
                                    >
                                        <FeatherIcon name='x' size={16} color={COLORS.white} />
                                    </TouchableOpacity>
                                    <FastImage
                                        style={Styles.mediaStyle}
                                        source={{ uri: campaignForm?.media?.uri }}
                                    />
                                </>
                                :
                                <FeatherIcon name='image' color={colors.borderColor} size={40} />
                            }
                        </TouchableOpacity>
                    </View>

                    <GradientBtn
                        title={t('launchCampaign')}
                        isLoading={loading}
                        onPress={createNewCampaign}
                        style={Styles.buttonStyle}
                    />

                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default NewCampaign

const styles = (colors) => StyleSheet.create({
    mainScreen: { flex: 1, backgroundColor: colors.background, },
    heading: {
        ...FONTS.h6,
        color: colors.title,
    },
    inputStyle: {
        ...FONTS.font,
        fontSize: 15,
        color: colors.title,
        borderRadius: 7,
        paddingTop: 10,
        paddingBottom: 10,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: colors.borderColor,
        backgroundColor: colors.cardBg,
    },
    fieldContainer: {
        marginVertical: 6,
    },
    multilineInput: {
        textAlignVertical: 'top',
        height: 150,
    },
    inputText: {
        ...FONTS.font,
        fontSize: 15,
        color: colors.textLight,
        marginVertical: 3,
    },
    mediaContainer: {
        height: 350,
        borderWidth: 2,
        alignItems: 'center',
        borderStyle: 'dashed',
        justifyContent: 'center',
        borderRadius: SIZES.radius,
        backgroundColor: colors.cardBg,
        borderColor: colors.borderColor,
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
    mediaStyle: {
        height: '100%',
        width: '100%',
        borderRadius: SIZES.radius,
    },
    addButton: {
        position: 'absolute',
        right: 9,
    },
    buttonStyle: {
        marginVertical: 20,
    },
})
