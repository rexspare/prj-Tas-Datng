import { StyleSheet, Text, TextInput, TouchableOpacity, View, Keyboard, Pressable } from 'react-native'
import React, { useState, memo } from 'react'
import GradientBtn from './GradientBtn'
import { addNewDoc } from '../../services'
import { showFlash } from '../../utils/helpers'
import RBSheet from 'react-native-raw-bottom-sheet'
import { useTheme } from '@react-navigation/native'
import { COLORS, FONTS } from '../../constants/theme'
import { useAuth, useLanguage } from '../../contexts'
import FeatherIcon from 'react-native-vector-icons/Feather'
import { FIRESTORE_COLLECTIONS } from '../../constants/enums'

const ReportModal = ({ sheetRef, otherUserId }) => {
    const { t } = useLanguage()
    const { user } = useAuth()
    const { colors } = useTheme()
    const Styles = styles(colors)
    const [reason, setReason] = useState('')
    const [loading, setLoading] = useState(false)
    const closeSheet = () => sheetRef.current.close()

    const handleReport = async () => {
        if (reason) {
            setLoading(true)
            const formattedData = {
                reportedUser: otherUserId,
                reportedBy: user?.uid,
                reason,
            }
            await addNewDoc(FIRESTORE_COLLECTIONS.REPORTS, formattedData)
            setLoading(false)
            setReason('')
            closeSheet()
            showFlash(t('userReportSuccess'))
        } else {
            showFlash(t('enterReasonWarning'))
        }
    }

    return (
        <RBSheet
            ref={sheetRef}
            height={400}
            openDuration={100}
            closeOnDragDown={true}
            customStyles={Styles.sheetStyle}
        >
            <Pressable onPress={() => Keyboard.dismiss()}>
                <>
                    <View style={Styles.layoutStyle}>
                        <Text style={Styles.title}>{t('reportUser')}</Text>
                        <TouchableOpacity onPress={closeSheet} style={Styles.crossButton}>
                            <FeatherIcon size={24} color={colors.title} name='x' />
                        </TouchableOpacity>
                    </View>

                    <TextInput
                        autoFocus
                        value={reason}
                        style={Styles.inputStyle}
                        placeholder={t('reasonPlaceholder')}
                        onChangeText={(x) => setReason(x)}
                        placeholderTextColor={colors.textLight}
                    />

                    <View style={Styles.buttonContainer}>
                        <GradientBtn title={t('report')} onPress={handleReport} isLoading={loading} />
                    </View>
                </>
            </Pressable>
        </RBSheet>
    )
}

export default memo(ReportModal)

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
    inputStyle: {
        ...FONTS.font,
        height: 200,
        fontSize: 14,
        borderRadius: 10,
        color: colors.title,
        paddingHorizontal: 17,
        paddingVertical: 10,
        marginHorizontal: '5%',
        textAlignVertical: 'top',
        backgroundColor: colors.cardBg,
        borderWidth: 1,
        borderColor: colors.borderColor,
        marginVertical: 15,
        elevation: 3,
        shadowColor: COLORS.dark,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
    },
    buttonContainer: {
        marginHorizontal: '5.5%',
        marginTop: 5,
    },
})