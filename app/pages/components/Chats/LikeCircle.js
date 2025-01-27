import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React, { memo } from 'react'
import { SCREEN } from '../../../constants/enums'
import { showFlash } from '../../../utils/helpers'
import { COLORS, FONTS } from '../../../constants/theme'
import { useNavigation, useTheme } from '@react-navigation/native'
import { useApp, useAuth, useLanguage, usePurchase } from '../../../contexts'

const LikeCircle = () => {
    const { t } = useLanguage()
    const { colors } = useTheme()
    const { userData } = useAuth()
    const { yourLikes } = useApp()
    const Styles = styles(colors)
    const navigation = useNavigation()
    const { isSubscriptionExpired } = usePurchase()

    // function isSubscriptionExpired(subDate) {
    //     var subDateMillis = (subDate?.seconds * 1000) + (subDate?.nanoseconds / 1000000)
    //     var currentDate = new Date().getTime()
    //     var thirtyDaysInMillis = 30 * 24 * 60 * 60 * 1000
    //     var subscriptionEndDate = subDateMillis + thirtyDaysInMillis
    //     return currentDate > subscriptionEndDate
    // }

    const handleMoveToLikes = () => {
        let subscription = userData?.subscription
        const canSuperLike = subscription == 'unlimited' || subscription == 'pro' || subscription == 'standard' || subscription == 'basic'

        if (!isSubscriptionExpired(subscription?.expiresAt) && canSuperLike) {
            navigation.navigate(SCREEN.USER_LIKES)
        } else {
            if (isSubscriptionExpired(subscription?.expiresAt)) {
                showFlash(t('subscriptionExpiredWarning'))
            } else {
                showFlash(t('purchaseToSeeLikesWarning'))
            }
        }
    }

    return (
        <>
            {yourLikes?.length >= 1 &&
                <TouchableOpacity style={Styles.container} onPress={handleMoveToLikes}>
                    <View style={Styles.circle}>
                        <Image source={{ uri: yourLikes[0]?.images[0]?.uri || '' }} style={Styles.image} />
                        <View style={Styles.overlay} />
                        <View style={Styles.bubble}>
                            <Text style={Styles.whiteText}>{yourLikes?.length}</Text>
                        </View>
                    </View>
                    <Text style={Styles.text}>{yourLikes?.length} {t('likes')}</Text>
                </TouchableOpacity>
            }
        </>
    )
}

export default memo(LikeCircle)

const styles = (colors) => StyleSheet.create({
    container: {
        alignItems: 'center',
        marginRight: 18,
    },
    circle: {
        height: 60,
        width: 60,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 3,
    },
    image: {
        height: 56,
        width: 56,
        borderRadius: 50,
    },
    overlay: {
        height: 56,
        width: 56,
        borderRadius: 56,
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0,.5)',
    },
    bubble: {
        height: 35,
        width: 35,
        borderRadius: 40,
        backgroundColor: COLORS.primary,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    whiteText: { ...FONTS.font, ...FONTS.fontBold, color: COLORS.white, },
    text: { ...FONTS.fontSm, ...FONTS.fontBold, color: colors.title, },
})