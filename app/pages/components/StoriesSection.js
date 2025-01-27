import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import React, { memo } from 'react'
import StoriesCircle from './StoriesCircle'
import { SCREEN } from '../../constants/enums'
import { COLORS, FONTS } from '../../constants/theme'
import firestore from '@react-native-firebase/firestore'
import FeatherIcon from 'react-native-vector-icons/Feather'
import { useApp, useAuth, useLanguage } from '../../contexts'
import { useNavigation, useTheme } from '@react-navigation/native'

const StoriesSection = ({ onAddPress, loading }) => {
    const { t } = useLanguage()
    const { colors } = useTheme()
    const Styles = styles(colors)
    const { userData } = useAuth()
    const { stories } = useApp()
    const { navigate } = useNavigation()
    const currentTimestamp = firestore.Timestamp.now()

    const isStoryActive = userData?.story && userData?.story?.expiresAt > currentTimestamp

    const handlePress = (isMyStory, index) => {
        navigate(SCREEN.STORY, { index, isMyStory })
    }

    return (
        <View style={Styles.container}>
            <View style={Styles.header}>
                <Text style={Styles.heading}>{t('stories')}</Text>
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
                {isStoryActive &&
                    <StoriesCircle
                        isMyStory
                        item={userData}
                        onPress={() => handlePress(true, -1)}
                    />
                }
                {stories?.map((data, index) => (
                    <StoriesCircle
                        item={data}
                        key={index}
                        index={index}
                        onPress={() => handlePress(false, index)}
                    />
                ))}
            </ScrollView>
            {stories?.length === 0 && !isStoryActive &&
                <Text style={Styles.emptyText}>{t('noStoriesFound')}</Text>
            }
        </View>
    )
}

export default memo(StoriesSection)

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
})