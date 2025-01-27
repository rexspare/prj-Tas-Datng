import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import React, { memo, useState } from 'react'
import FastImage from 'react-native-fast-image'
import { textLimit } from '../../utils/helpers'
import { COLORS, FONTS } from '../../constants/theme'
import firestore from '@react-native-firebase/firestore'
import LinearGradient from 'react-native-linear-gradient'
import FeatherIcon from 'react-native-vector-icons/Feather'
import { useApp, useAuth, useLanguage } from '../../contexts'
import { useNavigation, useTheme } from '@react-navigation/native'
import { FIRESTORE_COLLECTIONS, SCREEN } from '../../constants/enums'

const StreamSection = () => {
    const { t } = useLanguage()
    const { colors } = useTheme()
    const Styles = styles(colors)
    const { streams } = useApp()
    const { userData } = useAuth()
    const { navigate } = useNavigation()
    const [loading, setLoading] = useState(false)

    const handlePress = (item) => {
        // navigate(SCREEN.LIVE, {
        //     isHost: false,
        //     userId: userData?.uid,
        //     username: userData?.name,
        //     streamId: item?.documentId,
        // })
    }

    const onAddPress = async () => {
        // try {
        //     setLoading(true)
        //     let formattedData = {
        //         hostId: userData?.uid,
        //         host: userData,
        //         username: userData?.name,
        //         isActive: true,
        //         createdAt: firestore.FieldValue.serverTimestamp(),
        //     }
        //     const docRef = firestore().collection(FIRESTORE_COLLECTIONS.LIVE_STREAMS).doc()
        //     formattedData.documentId = docRef?.id
        //     await docRef.set(formattedData, { merge: true })

        //     setLoading(false)

        //     navigate(SCREEN.LIVE, {
        //         isHost: true,
        //         userId: userData?.uid,
        //         username: userData?.name,
        //         streamId: docRef?.id,
        //     })

        // } catch (e) {
        //     setLoading(false)
        //     console.log('Error creating new document', e)
        // }
    }

    const StreamCircle = ({ item, onPress }) => {
        const hostData = item?.host
        const userColors = hostData?.profileColors || [COLORS.primary, COLORS.primary3]

        if (item?.loading) {
            return <View style={Styles.loadContainer} />
        }

        return (
            <TouchableOpacity style={Styles.circleContainer} activeOpacity={0.7} onPress={onPress}>
                <LinearGradient
                    colors={userColors}
                    style={Styles.gradientBorder}
                >
                    <FastImage
                        source={{ uri: hostData?.images?.length >= 1 ? hostData?.images[0]?.uri : '' }}
                        style={Styles.image}
                    />
                </LinearGradient>
                <Text style={[Styles.text, { color: colors.title }]}>{textLimit(hostData?.name, 9)}</Text>
            </TouchableOpacity>
        )
    }

    return (
        <View style={Styles.container}>
            <View style={Styles.header}>
                <Text style={Styles.heading}>{t('liveStreams')}</Text>
                <TouchableOpacity disabled={loading} activeOpacity={0.7} onPress={() => onAddPress()}>
                    {loading ?
                        <ActivityIndicator color={COLORS.primary} />
                        :
                        <FeatherIcon name={'plus'} color={colors.text} size={20} />
                    }
                </TouchableOpacity>
            </View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingLeft: 15 }}
            >
                {streams?.map((data, index) => (
                    <StreamCircle
                        item={data}
                        key={index}
                        onPress={() => handlePress(data)}
                    />
                ))}
            </ScrollView>
            {streams?.length === 0 &&
                <Text style={Styles.emptyText}>{t('noStreamsFound')}</Text>
            }
        </View>
    )
}

export default memo(StreamSection)

const styles = (colors) => StyleSheet.create({
    container: {
        marginVertical: 10,
    },
    header: {
        flexDirection: 'row',
        marginHorizontal: 15,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 3,
    },
    heading: {
        ...FONTS.h6,
        color: colors.title,
        marginBottom: 5,
    },
    emptyText: {
        ...FONTS.fontMedium,
        fontSize: 15,
        color: colors.text,
        textAlign: 'center',
        marginVertical: 10,
    },

    circleContainer: {
        alignItems: 'center',
        marginRight: 18,
    },
    gradientBorder: {
        height: 60,
        width: 60,
        borderRadius: 60,
        padding: 2.5,
    },
    image: {
        height: '100%',
        width: '100%',
        borderRadius: 60,
        backgroundColor: colors.background,
    },
    text: { ...FONTS.fontSm, ...FONTS.fontBold, color: colors.title, marginTop: 3, },
    loadContainer: {
        marginRight: 18,
        height: 60,
        width: 60,
        borderRadius: 60,
        backgroundColor: colors.borderColor,
    },
})