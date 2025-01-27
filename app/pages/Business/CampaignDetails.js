import { SafeAreaView, ScrollView, Image, StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../../layout/Header'
import { useLanguage } from '../../contexts'
import { getDocumentData } from '../../services'
import { useTheme } from '@react-navigation/native'
import { COLORS, FONTS } from '../../constants/theme'
import firestore from '@react-native-firebase/firestore'
import { FIRESTORE_COLLECTIONS } from '../../constants/enums'

const CampaignDetails = ({ route }) => {
    const { t } = useLanguage()
    const { colors } = useTheme()
    const Styles = styles(colors)
    const [campaign, setCampaign] = useState({})
    const [loading, setLoading] = useState(false)

    const campaignId = route?.params?.id

    useEffect(() => {
        getCampaignData()
    }, [campaignId])

    const getCampaignData = async () => {
        try {
            setLoading(true)
            const campaignRef = firestore().collection(FIRESTORE_COLLECTIONS.CAMPAIGNS).doc(campaignId)
            const documentSnapshot = await campaignRef.get()

            if (documentSnapshot.exists) {
                const documentData = documentSnapshot.data()
                const reportsSnapshot = await campaignRef.collection(FIRESTORE_COLLECTIONS.REPORTS).get()
                let reports = []
                for (const item of reportsSnapshot.docs) {
                    const foundUser = await getDocumentData(FIRESTORE_COLLECTIONS.USERS, item?.data()?.reportedBy)
                    if (foundUser?.uid) {
                        reports.push({ ...item?.data(), user: { name: foundUser?.name, profileImage: foundUser?.images?.length >= 1 ? foundUser?.images[0]?.uri : '', uid: foundUser?.uid } })
                    }
                }
                const combinedData = { ...documentData, reports }
                setCampaign(combinedData)
                setLoading(false)
            }
        } catch (error) {
            console.error('Error fetching campaign data:', error)
            setLoading(false)
        }
    }

    const Box = ({ value, label }) => (
        <View style={Styles.analyticsBox}>
            <Text style={Styles.analyticsValue}>{value}</Text>
            <Text style={Styles.analyticsLabel}>{label}</Text>
        </View>
    )

    return (
        <SafeAreaView style={Styles.mainScreen}>

            <Header
                leftIcon={'back'}
                titleLeft
                title={t('campaignDetails')}
            />
            {loading ?
                <View style={Styles.loader}>
                    <ActivityIndicator color={COLORS.primary} size={'large'} />
                </View>
                :

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    overScrollMode='never'
                    bounces={false}
                    contentContainerStyle={Styles.layout}
                >

                    <Text style={Styles.titleStyle}>{campaign?.title}</Text>
                    <Text style={Styles.description}>{campaign?.description}</Text>

                    <View style={Styles.analyticsContainer}>

                        <Box label={'Website Visits'} value={campaign?.websiteVisits} />
                        <Box label={'Clicks'} value={campaign?.clicks} />
                        <Box label={'Views'} value={campaign?.views} />

                    </View>

                    <View style={Styles.reportsContainer}>
                        <Text style={Styles.reportsHeading}>{'User Reports'}</Text>
                        {!campaign?.reports && campaign?.reports?.length > 0 ? (
                            campaign.reports.map((item, index) => (
                                <View style={Styles.reportItem} key={index}>
                                    <Image source={{ uri: item?.user?.profileImage }} style={Styles.userImage} />
                                    <View style={Styles.infoContainer}>
                                        <Text numberOfLines={1} style={Styles.userName}>{item?.user?.name}</Text>
                                        <Text style={Styles.reportReason}>
                                            <Text style={Styles.reportLabel}>{'Reason:'}</Text> {item?.reason}
                                        </Text>
                                    </View>
                                </View>
                            ))

                        ) :
                            <Text style={Styles.emptyText}>{'No reports found'}</Text>
                        }
                    </View>
                </ScrollView>
            }

        </SafeAreaView>
    )
}

export default CampaignDetails

const styles = (colors) => StyleSheet.create({
    mainScreen: {
        flex: 1,
        backgroundColor: colors.background,
    },
    layout: {
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    loader: {
        flex: 1,
        paddingBottom: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },

    titleStyle: {
        ...FONTS.h2,
        color: COLORS.primary,
    },
    description: {
        ...FONTS.text,
        color: colors.textLight,
        marginBottom: 20,
    },

    analyticsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    analyticsBox: {
        width: '32%',
        borderRadius: 8,
        alignItems: 'center',
        backgroundColor: colors.cardBg,
    },
    analyticsLabel: {
        ...FONTS.fontSm,
        textAlign: 'center',
        color: COLORS.info,
        marginBottom: 15,
        marginTop: -7,
    },
    analyticsValue: {
        ...FONTS.h1,
        marginTop: 5,
        color: COLORS.primary,
    },

    reportsContainer: {
        marginTop: 20,
    },
    reportsHeading: {
        ...FONTS.h4,
        color: COLORS.primary,
        marginBottom: 10,
    },

    reportItem: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: colors.cardBg,
        borderRadius: 8,
        marginBottom: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    userImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    infoContainer: {
        flex: 1,
    },
    userName: {
        ...FONTS.fontBold,
        fontSize: 16,
        marginBottom: 4,
        color: colors.title,
    },
    reportReason: {
        ...FONTS.font,
        fontSize: 14,
        color: colors.textLight,
        marginBottom: 2,
    },
    reportLabel: {
        ...FONTS.fontBold,
        color: colors.title,
    },
    emptyText: {
        marginTop: '53%',
        textAlign: 'center',
        ...FONTS.fontMedium,
        color: colors.textLight,
    },
})