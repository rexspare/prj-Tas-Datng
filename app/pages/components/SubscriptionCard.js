import { ImageBackground, StyleSheet, Text, View } from 'react-native'
import React, { memo } from 'react'
import GradientBtn from './GradientBtn'
import { isIOS } from '../../utils/helpers'
import DropShadow from 'react-native-drop-shadow'
import { useTheme } from '@react-navigation/native'
import Divider from '../../components/Dividers/Divider'
import { useLanguage, usePurchase } from '../../contexts'
import { COLORS, FONTS, IMAGES } from '../../constants/theme'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

const SubscriptionCard = ({ item }) => {
    const { title, name, localizedPrice, productId, timePeriod, features } = item
    const { t } = useLanguage()
    const { colors } = useTheme()
    const Styles = styles(colors)
    const isPremium = title.includes('PREMIUM')
    const { handlePurchase, handlePackage } = usePurchase()

    const SubscriptionMAP = {
        ['unlimited']: [
            { text: t('subFeature1'), isAvailable: true },
            { text: t('subFeature2'), isAvailable: true },
            { text: t('subFeature3'), isAvailable: true },
            { text: t('subFeature5'), isAvailable: true },
            { text: t('subFeature6'), isAvailable: true },
        ],
        ['pro']: [
            { text: t('subFeature1'), isAvailable: true },
            { text: t('subFeature2'), isAvailable: true },
            { text: t('subFeature4'), isAvailable: true },
            { text: t('subFeature5'), isAvailable: true },
            { text: t('subFeature6'), isAvailable: false },
        ],
        ['standard']: [
            { text: t('subFeature7'), isAvailable: true },
            { text: t('subFeature8'), isAvailable: true },
            { text: t('subFeature9'), isAvailable: true },
            { text: t('subFeature5'), isAvailable: false },
            { text: t('subFeature6'), isAvailable: false },
        ],
        ['basic']: [
            { text: t('subFeature7'), isAvailable: true },
            { text: t('subFeature8'), isAvailable: true },
            { text: t('subFeature2'), isAvailable: false },
            { text: t('subFeature5'), isAvailable: false },
            { text: t('subFeature6'), isAvailable: false },
        ],
    }


    const Feature = ({ item }) => (
        <>
            <View style={Styles.priceListItem}>
                <FontAwesome5
                    style={{ marginRight: item?.isAvailable ? 8 : 11 }}
                    color={item.isAvailable ? COLORS.success : COLORS.danger}
                    size={14}
                    name={item.isAvailable ? 'check' : 'times'}
                />
                <Text style={Styles.featureText}>{item?.text}</Text>
            </View>
            <Divider style={Styles.noMargin} dashed />
        </>
    )

    const renderPricingDetails = () => (
        <>
            <Text numberOfLines={2} style={Styles.title}>{name}</Text>
            <View style={Styles.priceWrapper}>
                <Text style={Styles.priceText}>{localizedPrice}</Text>
                <Text style={Styles.whiteText}>/ {t('annually')}</Text>
            </View>
        </>
    )

    const handleBuy = async () => {
        try {
            // await handlePurchase(productId)
            await handlePackage(productId)
        } catch (error) {
            console.log('handleBuy error', error)
        }
    }

    return (
        <DropShadow style={Styles.shadowStyle}>
            <View style={Styles.container}>
                {isPremium ?
                    <ImageBackground source={IMAGES.pattern1} style={Styles.packageDetails}>
                        {renderPricingDetails()}
                    </ImageBackground>
                    :
                    <View style={Styles.packageDetails}>
                        {renderPricingDetails()}
                    </View>
                }

                <View style={Styles.featuresLayout}>
                    <Text style={[FONTS.h5, { color: colors.title }]}>{t('features')}:</Text>
                    <View style={{ marginBottom: 15 }}>
                        {SubscriptionMAP[productId]?.map((item, index) => (
                            <Feature item={item} key={index} />
                        ))}
                    </View>
                    <View style={Styles.buttonContainer}>
                        <GradientBtn title={t('subscribeNow')} onPress={handleBuy} />
                    </View>
                </View>
            </View>
        </DropShadow>
    )
}

export default memo(SubscriptionCard)

const styles = (colors) => StyleSheet.create({
    shadowStyle: {
        shadowColor: "#000",
        shadowOffset: {
            width: 4,
            height: 4,
        },
        shadowOpacity: .15,
        shadowRadius: 5,
        marginRight: 15,
        borderRadius: 20,
        backgroundColor: isIOS() && colors.cardBg,
    },
    container: {
        backgroundColor: colors.cardBg,
        width: 300,
        overflow: 'hidden',
        borderRadius: 20,
    },
    packageDetails: { paddingHorizontal: 20, paddingVertical: 25, backgroundColor: '#221743', },
    title: { ...FONTS.h2, color: COLORS.white, width: '70%' },
    priceWrapper: {
        // position: 'absolute',
        // bottom: 10,
        // right: 20,
        alignItems: 'flex-end',
        // backgroundColor: 'red',
    },
    priceText: { ...FONTS.h2, color: COLORS.white, lineHeight: 33, },
    whiteText: { ...FONTS.font, fontSize: 16, opacity: .8, color: COLORS.white, },
    featuresLayout: { paddingHorizontal: 15, paddingVertical: 20, },
    noMargin: { marginBottom: 0, marginTop: 0, },
    buttonContainer: { paddingHorizontal: 15, paddingVertical: 10, },

    priceListItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    checkIcon: { marginRight: 8, },
    featureText: { ...FONTS.font, color: colors.text, },
})
