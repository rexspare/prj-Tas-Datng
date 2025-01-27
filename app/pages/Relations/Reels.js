import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import SingleReel from '../../components/SingleReel'
import { COLORS, FONTS } from '../../constants/theme'
import { addDataInSubCollection, getCollectionDataWhere } from '../../services'
import firestore from '@react-native-firebase/firestore'
import { useNavigation } from '@react-navigation/native'
import FeatherIcon from 'react-native-vector-icons/Feather'
import { SwiperFlatList } from 'react-native-swiper-flatlist'
import { FIRESTORE_COLLECTIONS } from '../../constants/enums'
import { useApp, useAuth, useLanguage } from '../../contexts'
import { CampaignReel, ReelOptions, ReelReportSheet, ReelShareSheet, CampaignOptions } from '../components'

const Reels = ({ route }) => {
    const { t } = useLanguage()
    const { userData } = useAuth()
    const { reelsData } = useApp()
    const navigation = useNavigation()
    const data = route?.params?.data
    const index = route?.params?.index || 0
    const [currentIndex, setCurrentIndex] = useState(index)
    const [userFollowings, setUserFollowings] = useState([])
    const [shareLoading, setShareLoading] = useState(index)

    const reels = data || reelsData || []

    const shareSheetRef = useRef()
    const reportSheetRef = useRef()
    const reelOptionsRef = useRef()
    const campaignOptionsRef = useRef()

    const handleChangeIndexValue = ({ index }) => {
        setCurrentIndex(index)
    }

    useEffect(() => {
        fetchFollowers()
    }, [])

    const fetchFollowers = async () => {
        try {
            setShareLoading(true)
            const followedUsersRef = firestore()
                .collection(FIRESTORE_COLLECTIONS.USERS)
                .doc(userData?.uid)
                .collection(FIRESTORE_COLLECTIONS.FOLLOWING)

            const followedUsersSnapshot = await followedUsersRef.get()

            const followedUserIds = followedUsersSnapshot.docs.map(doc => doc.id)

            if (followedUserIds?.length === 0) {
                return
            }

            const followedUsersData = await getCollectionDataWhere(FIRESTORE_COLLECTIONS.USERS, 'uid', followedUserIds, 'in')
            setUserFollowings(followedUsersData)

        } catch (e) {
            console.log('Error fetching followed Users', e)
        } finally {
            setShareLoading(false)
        }
    }

    const submitReport = async (report) => {
        const currentReel = reels[currentIndex]
        if (!currentReel) return
        const id = currentReel?.documentId
        let completeReport = report

        if (currentReel?.businessProfileId) {
            completeReport.campaignId = id
            await addDataInSubCollection(FIRESTORE_COLLECTIONS.CAMPAIGNS, id, FIRESTORE_COLLECTIONS.REPORTS, completeReport)
        } else {
            completeReport.reelId = id
            await addDataInSubCollection(FIRESTORE_COLLECTIONS.REELS, id, FIRESTORE_COLLECTIONS.REPORTS, completeReport)
        }
    }

    const renderItem = useCallback(({ item, index }) => {
        const Component = item?.businessProfileId ? CampaignReel : SingleReel
        return (
            <Component
                item={item}
                index={index}
                currentIndex={currentIndex}
                key={item?.documentId || index}
                sheetRef={item?.businessProfileId ? undefined : shareSheetRef}
                refRBSheet={item?.businessProfileId ? campaignOptionsRef : reelOptionsRef}
            />
        )
    }, [currentIndex, reelOptionsRef, shareSheetRef, campaignOptionsRef])

    return (
        <>
            <ReelOptions
                sheetRef={reelOptionsRef}
                onSharePress={() => { }}
                onReportPress={() => reportSheetRef.current.open()}
            />

            <CampaignOptions
                sheetRef={campaignOptionsRef}
                onSharePress={() => { }}
                onReportPress={() => reportSheetRef.current.open()}
            />

            <ReelReportSheet
                onSubmit={submitReport}
                sheetRef={reportSheetRef}
            />

            <ReelShareSheet
                loading={shareLoading}
                sheetRef={shareSheetRef}
                reelData={reels[currentIndex]}
                userFollowings={userFollowings}
            />

            <SafeAreaView style={styles.mainScreen}>
                <View style={styles.mainScreen}>

                    <View style={styles.header}>
                        <Text style={styles.title}>{t('media')}</Text>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            style={styles.crossButton}
                            onPress={() => navigation.goBack()}
                        >
                            <FeatherIcon name='x' size={26} color={COLORS.white} />
                        </TouchableOpacity>
                    </View>

                    <SwiperFlatList
                        vertical
                        loop={false}
                        pagingEnabled
                        data={reels}
                        index={currentIndex}
                        showPagination={false}
                        renderItem={renderItem}
                        onChangeIndex={handleChangeIndexValue}
                    />

                </View>
            </SafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({
    mainScreen: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'absolute',
        zIndex: 1,
        width: '100%',
        top: 0,
        paddingLeft: 15,
        paddingRight: 5,
        paddingVertical: 5,
    },
    crossButton: {
        height: 48,
        width: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        ...FONTS.h4, color: COLORS.white,
    },
    shadowContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#000',
        zIndex: 1,
    },
    loader: {
        flex: 1, justifyContent: 'center', alignItems: 'center'
    },
})


export default Reels
