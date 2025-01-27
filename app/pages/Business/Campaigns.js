import { ActivityIndicator, FlatList, SafeAreaView, StatusBar, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useCallback, useState } from 'react'
import Header from '../../layout/Header'
import { openUrl, showFlash } from '../../utils/helpers'
import FastImage from 'react-native-fast-image'
import { useTheme } from '@react-navigation/native'
import { useAuth, useLanguage } from '../../contexts'
import { COLORS, FONTS } from '../../constants/theme'
import { getCollectionDataWhere } from '../../services'
import { useFocusEffect } from '@react-navigation/native'
import FeatherIcon from 'react-native-vector-icons/Feather'
import { FIRESTORE_COLLECTIONS, SCREEN } from '../../constants/enums'

const Campaigns = ({ navigation }) => {
    const { t } = useLanguage()
    const { colors } = useTheme()
    const Styles = styles(colors)
    const { userData } = useAuth()
    const [loading, setLoading] = useState(false)
    const [campaigns, setCampaigns] = useState([])

    useFocusEffect(
        useCallback(() => {
            fetchCampaigns()
        }, [])
    )

    const fetchCampaigns = async () => {
        if (userData?.businessProfileId) {
            setLoading(true)
            const found = await getCollectionDataWhere(FIRESTORE_COLLECTIONS.CAMPAIGNS, 'businessProfileId', userData?.businessProfileId)
            if (found?.length >= 1) {
                setCampaigns(found)
            } else {
                setCampaigns([])
            }
            setLoading(false)
        } else {
            showFlash(t('businessUpdateError'))
        }
    }

    const renderCampaignCard = ({ item }) => {
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                style={Styles.cardContainer}
                onPress={() => navigation.navigate(SCREEN.CAMPAIGNS_DETAILS, { id: item?.documentId })}
            >
                <FastImage
                    source={{ uri: item?.media?.uri }}
                    style={Styles.mediaStyle}
                    resizeMode='cover'
                />
                <View style={Styles.contentContainer}>
                    <Text style={Styles.title}>{item?.title}</Text>
                    <Text numberOfLines={3} style={Styles.description}>{item?.description}</Text>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={Styles.ctaButton}
                        onPress={() => openUrl(item?.redirectUrl)}
                    >
                        <Text style={Styles.ctaText}>{t(item?.ctaButton?.label)}</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        )
    }

    const moveToAddCampaign = () => {
        if (userData?.businessProfileId) {
            navigation.navigate(SCREEN.NEW_CAMPAIGN)
        } else {
            showFlash(t('businessUpdateError'))
        }
    }

    return (
        <SafeAreaView style={Styles.mainScreen}>
            <Header
                titleLeft
                leftIcon={'back'}
                title={t('campaigns')}
                onRightPress={moveToAddCampaign}
                rightIcon={() => <FeatherIcon name={'plus'} color={colors.textLight} size={25} />}
            />

            {loading && (
                <View style={Styles.loader}>
                    <StatusBar backgroundColor={COLORS.backdrop} />
                    <ActivityIndicator color={COLORS.primary} size={'large'} />
                </View>
            )}

            <FlatList
                data={campaigns}
                renderItem={renderCampaignCard}
                keyExtractor={(item) => item.documentId}
                contentContainerStyle={Styles.listContent}
            />
        </SafeAreaView>
    )
}

export default Campaigns

const styles = (colors) => StyleSheet.create({
    mainScreen: {
        flex: 1,
        backgroundColor: colors.background,
    },
    loader: {
        height: '100%',
        width: '100%',
        zIndex: 1,
        position: 'absolute',
        backgroundColor: COLORS.backdrop,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardContainer: {
        backgroundColor: colors.cardBg,
        borderRadius: 10,
        marginHorizontal: 15,
        marginVertical: 10,
        overflow: 'hidden',
        elevation: 3,
    },
    mediaStyle: {
        width: '100%',
        height: 200,
    },
    contentContainer: {
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    title: {
        ...FONTS.h5,
        marginBottom: -3,
        color: colors.title,
    },
    description: {
        ...FONTS.font,
        color: colors.textLight,
        marginBottom: 10,
    },
    ctaButton: {
        backgroundColor: COLORS.primary,
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
    listContent: {
        paddingBottom: 16,
    },
}) 
