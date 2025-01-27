import { Image, StyleSheet, Text, TouchableOpacity, View, Modal } from 'react-native'
import React, { useState, memo } from 'react'
import GradientBtn from './GradientBtn'
import { useAuth, useLanguage } from '../../contexts'
import { useTheme } from '@react-navigation/native'
import { COLORS, FONTS } from '../../constants/theme'
import LinearGradient from 'react-native-linear-gradient'
import FeatherIcon from 'react-native-vector-icons/Feather'
import ColorPicker, { Panel1, HueSlider, Swatches } from 'reanimated-color-picker'

const defaultBorders = [COLORS.primary, COLORS.secondary]

const CustomizeCardModal = ({ visible, setVisible }) => {
    const { t } = useLanguage()
    const { colors } = useTheme()
    const Styles = styles(colors)
    const onClose = () => setVisible(false)
    const { userData, updateUser } = useAuth()
    const [activeTab, setActiveTab] = useState(0)
    const [gradientColors, setGradientColors] = useState(userData?.cardColors || defaultBorders)

    const onSelectColor = ({ hex }) => {
        setGradientColors((prevColors) => {
            const updatedColors = [...prevColors]
            updatedColors[activeTab] = hex
            return updatedColors
        })
    }

    const handleSave = async () => {
        await updateUser({ cardColors: gradientColors })
        onClose()
    }

    return (
        <Modal
            transparent
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={Styles.modal}>

                <View style={Styles.modalContainer}>

                    <View style={Styles.headerStyle}>
                        <Text style={Styles.title}>{t('customizeDatingCard')}</Text>
                        <TouchableOpacity onPress={onClose} style={Styles.crossButton}>
                            <FeatherIcon size={24} color={colors.title} name='x' />
                        </TouchableOpacity>
                    </View>

                    <LinearGradient colors={gradientColors} style={Styles.gradientBorder}>
                        <Image
                            source={{ uri: userData?.images?.length >= 1 ? userData?.images[0]?.uri : '' }}
                            style={Styles.imageStyle}
                        />
                    </LinearGradient>

                    <View style={Styles.tabContainer}>
                        <TouchableOpacity
                            style={[Styles.tab, activeTab === 0 && Styles.activeTab]}
                            onPress={() => setActiveTab(0)}
                        >
                            <Text style={[Styles.tabText, activeTab === 0 && Styles.activeTabText]}>{t('primaryColor')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[Styles.tab, activeTab === 1 && Styles.activeTab]}
                            onPress={() => setActiveTab(1)}
                        >
                            <Text style={[Styles.tabText, activeTab === 1 && Styles.activeTabText]}>{t('secondaryColor')}</Text>
                        </TouchableOpacity>
                    </View>

                    <ColorPicker
                        value={gradientColors[activeTab]}
                        onComplete={onSelectColor}
                        style={Styles.colorContainer}
                    >
                        <Panel1 style={[Styles.space, Styles.colorPanel]} />
                        <HueSlider style={Styles.space} />
                        <Swatches style={[Styles.space, Styles.swatchesView]} />
                    </ColorPicker>

                    <View style={Styles.space}>
                        <GradientBtn title={t('save')} onPress={handleSave} />
                    </View>

                </View>
            </View>
        </Modal>
    )
}

export default memo(CustomizeCardModal)

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
    modal: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: '5%',
        backgroundColor: COLORS.textLight,
    },
    modalContainer: {
        backgroundColor: colors.cardBg,
        borderRadius: 15,
        paddingBottom: 20,
        paddingHorizontal: '5%',
    },
    headerStyle: {
        borderBottomWidth: 1,
        borderColor: colors.borderColor,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: { ...FONTS.h5, color: colors.title, flex: 1, },
    crossButton: { padding: 5, },
    gradientBorder: {
        width: 120,
        height: 170,
        borderRadius: 15,
        marginBottom: 10,
        alignSelf: 'center',
        padding: 3,
    },
    imageStyle: {
        width: '100%',
        height: '100%',
        borderRadius: 15,
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 10,
    },
    tab: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderColor: 'transparent',
    },
    activeTab: {
        borderColor: COLORS.primary,
    },
    tabText: {
        color: colors.text,
    },
    activeTabText: {
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    colorContainer: {
        width: '100%',
    },
    colorPanel: {
        backgroundColor: 'blue',
        borderWidth: 20,
        borderColor: 'red',
    },
    space: {
        marginVertical: 10,
    },
    swatchesView: {
        justifyContent: 'flex-start',
    },
})
