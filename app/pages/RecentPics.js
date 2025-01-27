import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { uploadImage } from '../services'
import { FONTS } from '../constants/theme'
import { showFlash } from '../utils/helpers'
import auth from '@react-native-firebase/auth'
import { useAuth, useLanguage } from '../contexts'
import { useTheme } from '@react-navigation/native'
import { GalleryPicker, GradientBtn } from './components'
import { GlobalStyleSheet } from '../constants/StyleSheet'
import FeatherIcon from 'react-native-vector-icons/Feather'

const RecentPics = ({ navigation }) => {
    const { t } = useLanguage()
    const { colors } = useTheme()
    const Styles = styles(colors)
    const [loading, setLoading] = useState(false)
    const { updateUser, userData, getUserData, user } = useAuth()
    const [images, setImages] = useState(userData?.images || [])

    const handleNextPress = async () => {
        if (images?.length == 6) {
            setLoading(true)
            let uploadedImages = []
            for (const item of images) {
                const uploadedItem = await uploadImage(item?.uri, userData?.uid)
                uploadedImages.push(uploadedItem)
            }
            const isUpdated = updateUser({ images: uploadedImages })
            if (isUpdated) {
                getUserData(user?.uid)
                showFlash(t('imageUploadSuccess'))
                // if (userData?.phone == undefined) {
                //     saveData(FIRESTORE_COLLECTIONS.USERS,auth()?.currentUser.)
                //     updateUser({ phone: auth()?.currentUser?.phoneNumber })
                // }
            }
            setLoading(false)
        } else {
            showFlash(t('addImagesWarning'))
        }
    }

    return (
        <SafeAreaView style={Styles.mainScreen}>
            <View style={Styles.flex}>
                <ScrollView>
                    <View style={GlobalStyleSheet.container}>
                        <TouchableOpacity
                            style={Styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <FeatherIcon size={26} color={colors.title} name={'chevron-left'} />
                        </TouchableOpacity>
                        <Text style={Styles.titleStyle}>{t('addPicsHeading')}</Text>
                        <GalleryPicker imageData={images} setImageData={setImages} />
                    </View>
                </ScrollView>
            </View>
            <View style={Styles.bottomView}>
                <GradientBtn
                    title={t('next')}
                    isLoading={loading}
                    onPress={handleNextPress}
                />
            </View>
        </SafeAreaView>
    )
}

const styles = (colors) => StyleSheet.create({
    mainScreen: {
        flex: 1,
        backgroundColor: colors.cardBg,
    },
    flex: {
        flex: 1,
    },
    backButton: {
        height: 48,
        width: 48,
        borderRadius: 48,
        backgroundColor: colors.bgLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
    },
    titleStyle: {
        ...FONTS.h3,
        color: colors.title,
        marginBottom: 20,
    },
    bottomView: {
        paddingHorizontal: 45,
        paddingVertical: 35,
    },
})

export default RecentPics