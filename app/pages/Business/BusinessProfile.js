import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react'
import Header from '../../layout/Header'
import { FONTS } from '../../constants/theme'
import { useTheme } from '@react-navigation/native'
import { useAuth, useLanguage } from '../../contexts'
import { saveData, uploadImage } from '../../services'
import firestore from '@react-native-firebase/firestore'
import { FIRESTORE_COLLECTIONS, STORAGE } from '../../constants/enums'
import { GradientBtn, ImagePicker, IndustrySheet } from '../components'
import { handleGalleryPermission, openGallery, showFlash } from '../../utils/helpers'

const BusinessProfile = ({ navigation }) => {
    const { t } = useLanguage()
    const industryRef = useRef()
    const { colors } = useTheme()
    const Styles = styles(colors)
    const { userData, updateUser, businessData } = useAuth()
    const [loading, setLoading] = useState(false)
    const [businessForm, setBusinessForm] = useState({
        companyName: businessData?.companyName || '',
        businessEmail: businessData?.businessEmail || '',
        websiteUrl: businessData?.websiteUrl || '',
        industry: businessData?.industry || {},
        description: businessData?.description || '',
        logoImage: businessData?.logoImage || {},
    })
    const updateForm = (key, value) => setBusinessForm({ ...businessForm, [key]: value })

    const handleSave = async () => {
        const { companyName, businessEmail, websiteUrl, industry, description, logoImage } = businessForm
        const isFormComplete = companyName && businessEmail && websiteUrl && industry?.value && description && logoImage?.uri
        if (isFormComplete) {
            setLoading(true)

            const uploadedImage = await uploadImage(logoImage?.uri, STORAGE.BUSINESSES)

            if (uploadedImage == 'false') {
                showFlash(t('errorWarning'))
                setLoading(false)
                return
            }

            const formattedData = {
                ...businessForm,
                logoImage: uploadedImage,
            }

            if (userData?.businessProfileId) {
                await saveData(FIRESTORE_COLLECTIONS.BUSINESSES, userData?.businessProfileId, formattedData)
            } else {
                await createNewBusiness(formattedData)
            }
            setLoading(false)
            showFlash(t('profileUpdateSuccess'))
            navigation.goBack()
        } else {
            showFlash(t('enterDataWarning'))
        }
    }

    const createNewBusiness = async (jsonObject) => {
        try {
            let formattedData = {
                ...jsonObject,
                createdAt: firestore.FieldValue.serverTimestamp(),
                userId: userData?.uid,
            }
            const docRef = firestore().collection(FIRESTORE_COLLECTIONS.BUSINESSES).doc()
            formattedData.businessProfileId = docRef?.id
            await docRef.set(formattedData, { merge: true })
            await updateUser({ businessProfileId: docRef?.id })
        } catch (e) {
            console.log('Error creating new business profile')
        }
    }

    const UploadFile = async () => {
        handleGalleryPermission(() => selectImage())
    }

    const selectImage = async () => {
        const image = await openGallery()
        if (image) {
            updateForm('logoImage', { uri: image?.path })
        }
    }

    const removeImageItem = () => {
        updateForm('logoImage', {})
    }

    return (
        <SafeAreaView style={Styles.mainScreen}>

            <Header
                leftIcon={'back'}
                titleLeft
                title={t('editBusinessProfile')}
            />

            <IndustrySheet
                sheetRef={industryRef}
                value={businessForm?.industry}
                onSelect={(x) => updateForm('industry', x)}
            />

            <ScrollView
                bounces={false}
                overScrollMode='never'
                showsVerticalScrollIndicator={false}
            >

                <View style={Styles.imageContainer}>
                    <ImagePicker
                        data={businessForm?.logoImage}
                        style={{ marginVertical: 0 }}
                        onSelect={() => UploadFile()}
                        onRemove={() => removeImageItem()}
                        icon={{ name: 'image', size: 45 }}
                    />
                </View>

                <View style={{ paddingHorizontal: '5%' }}>

                    <View style={Styles.fieldContainer}>
                        <Text style={Styles.heading}>{t('companyName')}</Text>
                        <TextInput
                            value={businessForm?.companyName}
                            style={Styles.inputStyle}
                            placeholder={t('companyNamePlaceholder')}
                            placeholderTextColor={colors.textLight}
                            onChangeText={(x) => updateForm('companyName', x)}
                        />
                    </View>

                    <View style={Styles.fieldContainer}>
                        <Text style={Styles.heading}>{t('businessEmail')}</Text>
                        <TextInput
                            value={businessForm?.businessEmail}
                            style={Styles.inputStyle}
                            keyboardType='email-address'
                            placeholder={t('businessEmailPlaceholder')}
                            placeholderTextColor={colors.textLight}
                            onChangeText={(x) => updateForm('businessEmail', x)}
                        />
                    </View>

                    <View style={Styles.fieldContainer}>
                        <Text style={Styles.heading}>{t('websiteUrl')}</Text>
                        <TextInput
                            value={businessForm?.websiteUrl}
                            style={Styles.inputStyle}
                            placeholder={t('websiteUrlPlaceholder')}
                            placeholderTextColor={colors.textLight}
                            onChangeText={(x) => updateForm('websiteUrl', x)}
                        />
                    </View>

                    <View style={Styles.fieldContainer}>
                        <Text style={Styles.heading}>{t('industry')}</Text>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            style={Styles.inputStyle}
                            onPress={() => industryRef.current?.open()}
                        >
                            <Text style={[Styles.inputText, businessForm?.industry?.value && { color: colors.title }]}>{t(businessForm?.industry?.label || 'industryPlaceholder')}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={Styles.fieldContainer}>
                        <Text style={Styles.heading}>{t('description')}</Text>
                        <TextInput
                            multiline
                            value={businessForm?.description}
                            style={[Styles.inputStyle, Styles.multilineInput]}
                            placeholder={t('descriptionPlaceholder')}
                            placeholderTextColor={colors.textLight}
                            onChangeText={(x) => updateForm('description', x)}
                        />
                    </View>

                    <GradientBtn
                        title={t('save')}
                        isLoading={loading}
                        onPress={handleSave}
                        style={Styles.buttonStyle}
                    />
                </View>


            </ScrollView>
        </SafeAreaView>
    )
}

export default BusinessProfile


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
    imageContainer: {
        height: 160,
        width: 160,
        marginBottom: 20,
        marginTop: 20,
        alignSelf: 'center',
    },
    fieldContainer: {
        marginVertical: 6,
    },
    inputText: {
        ...FONTS.font,
        fontSize: 15,
        color: colors.textLight,
        marginVertical: 3,
    },
    multilineInput: {
        textAlignVertical: 'top',
        height: 150,
    },
    buttonStyle: {
        marginVertical: 20,
    },
})
