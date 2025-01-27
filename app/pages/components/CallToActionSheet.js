import { Text, View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import React, { memo } from 'react'
import CheckList from './CheckList'
import { useLanguage } from '../../contexts'
import { FONTS } from '../../constants/theme'
import { useTheme } from '@react-navigation/native'
import RBSheet from 'react-native-raw-bottom-sheet'
import FeatherIcon from 'react-native-vector-icons/Feather'
import { GlobalStyleSheet } from '../../constants/StyleSheet'

const IndustrySheet = ({ sheetRef, value, onSelect }) => {
    const { t } = useLanguage()
    const { colors } = useTheme()
    const Styles = styles(colors)
    const closeSheet = () => sheetRef.current.close()

    const ctaOptions = [
        { label: 'shopNow', value: 'Shop Now' },
        { label: 'learnMore', value: 'Learn More' },
        { label: 'signUp', value: 'Sign Up' },
        { label: 'contactUs', value: 'Contact Us' },
        { label: 'bookNow', value: 'Book Now' },
        { label: 'download', value: 'Download' },
        { label: 'getStarted', value: 'Get Started' },
        { label: 'visitWebsite', value: 'Visit Website' },
        { label: 'watchVideo', value: 'Watch Video' },
        { label: 'joinNow', value: 'Join Now' },
        { label: 'subscribe', value: 'Subscribe' },
        { label: 'buyTickets', value: 'Buy Tickets' },
    ];

    const handlePress = (x) => {
        onSelect(x)
        closeSheet()
    }

    return (
        <RBSheet
            ref={sheetRef}
            height={500}
            openDuration={100}
            closeOnDragDown={true}
            customStyles={Styles.sheetStyle}
        >
            <View style={Styles.layoutStyle}>
                <Text style={Styles.title}>{t('ctaHeading')}</Text>
                <TouchableOpacity onPress={closeSheet} style={Styles.crossButton}>
                    <FeatherIcon size={24} color={colors.title} name='x' />
                </TouchableOpacity>
            </View>

            <ScrollView>
                <View style={GlobalStyleSheet.container}>
                    {ctaOptions?.map((data, index) => {
                        return (
                            <CheckList
                                key={index}
                                item={t(data?.label)}
                                onPress={() => handlePress(data)}
                                checked={data?.value === value ? true : false}
                            />
                        )
                    })}
                </View>
            </ScrollView>
        </RBSheet>
    )
}

export default memo(IndustrySheet)

const styles = (colors) => StyleSheet.create({
    sheetStyle: {
        wrapper: {
        },
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
    layoutStyle: {
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderColor: colors.borderColor,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: { ...FONTS.h5, color: colors.title, flex: 1, },
    crossButton: { padding: 5, },
})