import { StyleSheet } from 'react-native'
import React, { memo } from 'react'
import { SvgXml } from 'react-native-svg'
import { List } from 'react-native-paper'
import { useLanguage } from '../../contexts'
import RBSheet from 'react-native-raw-bottom-sheet'
import { useTheme } from '@react-navigation/native'
import { COLORS, FONTS, ICONS } from '../../constants/theme'

const CampaignOptions = ({ sheetRef, onReportPress, onSharePress }) => {
    const { t } = useLanguage()
    const { colors } = useTheme()
    const Styles = styles(colors)

    const onOptionClose = () => sheetRef.current.close()

    const handlePress = (callBack) => {
        callBack()
        onOptionClose()
    }

    return (
        <RBSheet
            height={170}
            ref={sheetRef}
            openDuration={300}
            closeOnDragDown={true}
            customStyles={Styles.sheetStyle}
        >

            <List.Item
                title={t('report')}
                style={Styles.optionLayout}
                titleStyle={Styles.redLabel}
                onPress={() => handlePress(onReportPress)}
                left={() =>
                    <SvgXml
                        width={20}
                        height={20}
                        xml={ICONS.info}
                        fill={COLORS.danger}
                        style={Styles.reportIcon}
                    />
                }
            />

            {/* <List.Item
                title={t('share')}
                titleStyle={Styles.label}
                style={Styles.optionLayout}
                onPress={() => handlePress(onSharePress)}
                left={() =>
                    <SvgXml
                        width={20}
                        height={20}
                        xml={ICONS.share2}
                        stroke={colors.title}
                        style={Styles.shareIcon}
                    />
                }
            /> */}

        </RBSheet>
    )
}

export default memo(CampaignOptions)

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
    optionLayout: { paddingHorizontal: 15 },
    label: { ...FONTS.font, fontSize: 16, color: colors.title },
    redLabel: { ...FONTS.font, fontSize: 16, color: COLORS.danger },
    shareIcon: {
        top: 0,
        marginRight: 5,
    },
    reportIcon: {
        top: 2,
        marginRight: 5,
    }
})