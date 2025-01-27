import { StyleSheet, Text, View, ScrollView, Image } from 'react-native'
import React, { useRef, memo } from 'react'
import { List } from 'react-native-paper'
import { useAuth, useLanguage } from '../../contexts'
import { useTheme } from '@react-navigation/native'
import RBSheet from 'react-native-raw-bottom-sheet'
import { FONTS, IMAGES } from '../../constants/theme'
import firestore from '@react-native-firebase/firestore'

const ReelReportSheet = ({ sheetRef, onSubmit }) => {
    const { t } = useLanguage()
    const { colors } = useTheme()
    const { userData } = useAuth()
    const Styles = styles(colors)
    const refSuccessSheet = useRef()
    const onReportClose = () => { refSuccessSheet.current.open(); sheetRef.current.close() }

    const reportData = [
        { label: t('spamReport'), value: "It's spam" },
        { label: t('nudityReport'), value: "Nudity or sexual activity" },
        { label: t('hateSpeechReport'), value: "Hate speech or symbols" },
        { label: t('dontLikeReport'), value: "I just dont't like it" },
        { label: t('bullyingReport'), value: "Bullying or harassment" },
        { label: t('falseInfoReport'), value: "False information" },
        { label: t('violenceReport'), value: "Violence or dangerous organizations" },
        { label: t('scamReport'), value: "Scam or fraud" },
        { label: t('intellectualReport'), value: "Intellectual property violation" },
        { label: t('illegalSaleReport'), value: "Sale of illegal or regulated goods" },
        { label: t('suicideReport'), value: "Suicide or self-injury" },
        { label: t('eatingDisordersReport'), value: "Eating disorders" },
        { label: t('elseReport'), value: "Something else" },
    ]

    const handleReport = async (reason) => {
        if (reason) {
            const formattedReport = {
                reportedBy: userData?.uid,
                reason: reason,
                createdAt: firestore.FieldValue.serverTimestamp(),
            }
            onSubmit(formattedReport)
            onReportClose()
        }
    }

    return (
        <>
            <RBSheet
                height={600}
                ref={sheetRef}
                openDuration={300}
                closeOnDragDown={true}
                customStyles={Styles.sheetStyle}
            >
                <View style={Styles.reportHeader}>
                    <Text style={Styles.titleStyle}>{t('report')}</Text>
                </View>
                <View style={Styles.layout}>
                    <Text style={Styles.heading}>{t('reportPostHeading')}</Text>
                    <Text style={Styles.description}>{t('reportPostSubheading')}</Text>
                </View>
                <ScrollView contentContainerStyle={Styles.scrollStyle}>
                    {reportData.map((data, index) => (
                        <List.Item
                            key={index}
                            title={data?.label}
                            titleStyle={Styles.labelStyle}
                            onPress={() => handleReport(data?.value)}
                        />
                    ))}
                </ScrollView>
            </RBSheet>

            <RBSheet
                height={180}
                openDuration={300}
                ref={refSuccessSheet}
                closeOnDragDown={true}
                customStyles={Styles.sheetStyle}
            >
                <View style={Styles.successLayout}>
                    <Image source={IMAGES.check} style={Styles.imageStyle} />
                    <Text style={Styles.titleStyle}>{t('thanksForTelling')}</Text>
                </View>
            </RBSheet>
        </>
    )
}

export default memo(ReelReportSheet)

const styles = (colors) => StyleSheet.create({
    sheetStyle: {
        wrapper: {
            backgroundColor: 'rgba(0,0,0,.3)',
        },
        container: {
            backgroundColor: colors.card,
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
        },
    },
    reportHeader: {
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: colors.borderColor,
        paddingBottom: 8,
        paddingTop: 4,
    },
    layout: { padding: 15 },
    titleStyle: { ...FONTS.h5, color: colors.title, },
    heading: { ...FONTS.h6, color: colors.title },
    description: { ...FONTS.fontSm, color: colors.text, },
    scrollStyle: { paddingBottom: 20 },
    labelStyle: { color: colors.title },
    successLayout: { alignItems: 'center', paddingTop: 25 },
    imageStyle: {
        height: 50,
        width: 50,
        marginBottom: 20,
    },
})