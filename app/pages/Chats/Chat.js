import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FONTS } from '../../constants/theme'
import { useTheme } from '@react-navigation/native'
import { useApp, useLanguage } from '../../contexts'
import { GlobalStyleSheet } from '../../constants/StyleSheet'
import { ChatItem, LikeCircle, MatchCircle, MatchModal } from '../components'

const Chat = () => {
    const { t } = useLanguage()
    const { colors } = useTheme()
    const Styles = styles(colors)
    const [showModal, setShowModal] = useState(false)
    const { matches, chatListener, conversations, matchListener } = useApp()

    useEffect(() => {
        const unsubscribeChat = chatListener()
        const unsubscribeMatch = matchListener()
        return () => {
            unsubscribeChat()
            unsubscribeMatch()
        }
    }, [])

    return (
        <SafeAreaView style={Styles.mainScreen}>
            <ScrollView>
                <View style={GlobalStyleSheet.container}>
                    <Text style={Styles.heading}>{t('newMatches')}</Text>
                </View>
                {matches?.length >= 1 ?
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingLeft: 15 }}
                    >
                        <LikeCircle />
                        {matches?.map((data, index) => (
                            <MatchCircle item={data} key={index} />
                        ))}

                    </ScrollView>
                    :
                    <Text style={Styles.emptyMessage}>{t('noMatchFound')}</Text>
                }

                <View style={[GlobalStyleSheet.container, { marginTop: 10 }]}>
                    <Text style={Styles.heading}>{t('messages')}</Text>
                </View>

                <View style={{ marginBottom: 80 }}>
                    {conversations?.length >= 1 ? conversations?.map((data, index) => (
                        <ChatItem item={data} key={index} />
                    ))
                        :
                        <Text style={Styles.emptyMessage}>{t('noChatFound')}</Text>
                    }
                </View>
            </ScrollView>
            <MatchModal visible={showModal} setVisible={setShowModal} />
        </SafeAreaView>
    )
}

export default Chat

const styles = (colors) => StyleSheet.create({
    mainScreen: { flex: 1, backgroundColor: colors.background, },
    heading: { ...FONTS.h6, color: colors.title, },
    emptyMessage: { ...FONTS.fontMedium, textAlign: 'center', color: colors.title, },
})