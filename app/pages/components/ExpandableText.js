import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useState, memo } from 'react'
import { useLanguage } from '../../contexts'
import { textLimit } from '../../utils/helpers'
import Collapsible from 'react-native-collapsible'
import { COLORS, FONTS } from '../../constants/theme'

const ExpandableText = ({ text, limit = 80 }) => {
    const { t } = useLanguage()
    const [isCollapsed, setIsCollapsed] = useState(true)

    const toggleExpanded = () => {
        setIsCollapsed(!isCollapsed)
    }

    return (
        <View style={styles.container}>
            <Collapsible collapsed={isCollapsed}>
                <Text style={styles.text}>{text}</Text>
            </Collapsible>

            {text?.length <= limit ?
                <Text style={styles.text}>{text}</Text>
                :
                isCollapsed ? (
                    <View style={styles.collapsedContainer}>
                        <Text style={styles.text}>
                            {textLimit(text, limit)}
                        </Text>
                        <TouchableOpacity onPress={toggleExpanded}>
                            <Text style={styles.moreOrLessText}>{t('more')}</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity onPress={toggleExpanded}>
                        <Text style={styles.moreOrLessText}>{t('less')}</Text>
                    </TouchableOpacity>
                )
            }
        </View>
    )
}

export default memo(ExpandableText)

const styles = StyleSheet.create({
    container: {
        marginVertical: 6,
    },
    text: {
        width: '100%',
        ...FONTS.font,
        color: COLORS.white,
    },
    collapsedContainer: {
        flexWrap: 'wrap',
    },
    moreOrLessText: {
        ...FONTS.fontBold,
        color: COLORS.primary,
    },
})
