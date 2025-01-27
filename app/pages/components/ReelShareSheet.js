
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, TextInput, Pressable, Keyboard, ActivityIndicator } from 'react-native'
import React, { memo, useMemo, useState } from 'react'
import { showFlash } from '../../utils/helpers'
import RBSheet from 'react-native-raw-bottom-sheet'
import { useTheme } from '@react-navigation/native'
import FeatherIcon from 'react-native-vector-icons/Feather'
import { COLORS, FONTS, SIZES } from '../../constants/theme'
import { useApp, useAuth, useLanguage } from '../../contexts'

const ReelShareSheet = ({ sheetRef, userFollowings, loading, reelData }) => {
    const { t } = useLanguage()
    const { colors } = useTheme()
    const Styles = styles(colors)
    const { userData } = useAuth()
    const { sendMessage } = useApp()
    const [search, setSearch] = useState('')
    const [message, setMessage] = useState('')
    const closeSheet = () => sheetRef.current.close()
    const [buttonLoader, setButtonLoader] = useState(false)

    const filteredUsers = useMemo(() => {
        return userFollowings?.filter(item =>
            item?.name?.toLowerCase()?.includes(search?.toLowerCase())
        )
    }, [search, userFollowings])

    const generateChatId = (otherUserId) => {
        const currentUserStr = userData?.uid?.toString()
        const otherUserStr = otherUserId?.toString()
        const sortedUserIds = [currentUserStr, otherUserStr]?.sort()
        const chatId = sortedUserIds.join('_')
        return chatId
    }

    const handleSendReel = (otherUser) => {
        const callback = () => {
            setButtonLoader(false)
            closeSheet()
            showFlash(t('reelSentSuccess'))
            setMessage('')
            setSearch('')
        }
        setButtonLoader(true)
        const chatId = generateChatId(otherUser?.uid)
        sendMessage(message, callback, chatId, otherUser, reelData)
    }

    const ProfileView = ({ item }) => (
        <View style={Styles.itemContainer}>
            <Image
                style={Styles.profileImage}
                source={item?.images?.length >= 1 && { uri: item?.images[0]?.uri }}
            />
            <Text style={Styles.textBold}>{item?.name}</Text>
            <TouchableOpacity
                disabled={buttonLoader}
                activeOpacity={0.7}
                style={Styles.sendButton}
                onPress={() => handleSendReel(item)}
            >
                {buttonLoader ?
                    <ActivityIndicator size={18} color={COLORS.white} />
                    :
                    <Text style={Styles.buttonText}>{t('send')}</Text>
                }
            </TouchableOpacity>
        </View>
    )

    const renderEmptyComponent = () => (
        <View style={Styles.noDataContainer}>
            <Text style={Styles.noDataText}>{t('noData')}</Text>
        </View>
    )

    const renderLoader = () => (
        <View style={Styles.noDataContainer}>
            <ActivityIndicator color={COLORS.primary} size={'small'} />
        </View>
    )

    return (
        <RBSheet
            ref={sheetRef}
            openDuration={300}
            closeOnDragDown={true}
            height={SIZES.height - 250}
            customStyles={Styles.sheetStyle}
        >
            <Pressable onPress={() => Keyboard.dismiss()} style={{ flex: 1 }}>
                <View style={Styles.header}>
                    <TextInput
                        value={message}
                        style={Styles.messageInput}
                        placeholderTextColor={colors.text}
                        onChangeText={(x) => setMessage(x)}
                        placeholder={t('messagePlaceholder')}
                    />
                </View>

                <View style={Styles.contentLayout}>
                    <View style={Styles.searchInputContainer}>
                        <TextInput
                            value={search}
                            style={Styles.searchInput}
                            placeholderTextColor={colors.text}
                            onChangeText={(x) => setSearch(x)}
                            placeholder={t('searchPlaceholder')}
                        />
                        <View style={Styles.searchIcon}>
                            <FeatherIcon name='search' color={colors.text} size={24} />
                        </View>
                    </View>
                    {loading ? (
                        renderLoader()
                    ) : (
                        <FlatList
                            data={filteredUsers}
                            ListEmptyComponent={renderEmptyComponent}
                            keyExtractor={(_, index) => index?.toString()}
                            renderItem={({ item }) => <ProfileView item={item} />}
                            contentContainerStyle={filteredUsers?.length === 0 && { flex: 1 }}
                        />
                    )}
                </View>
            </Pressable>
        </RBSheet>
    )
}

export default memo(ReelShareSheet)

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
    header: {
        backgroundColor: colors.card,
        marginBottom: -1,
        borderBottomWidth: 1,
        borderColor: colors.borderColor,
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        alignItems: 'center',
    },
    messageInput: {
        ...FONTS.font,
        paddingHorizontal: 15,
        color: colors.title,
        width: '100%',
    },
    contentLayout: {
        flex: 1,
        backgroundColor: colors.card,
        paddingBottom: 70,
    },
    searchInputContainer: {
        marginHorizontal: 15,
        marginVertical: 15,
    },
    searchIcon: {
        height: 50,
        width: 50,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        right: 0,
        top: -1,
        zIndex: 1,
    },
    searchInput: {
        height: 50,
        borderWidth: 1,
        borderColor: colors.borderColor,
        borderRadius: SIZES.radius,
        paddingHorizontal: 15,
        ...FONTS.font,
        color: colors.title,
        paddingRight: 40,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    profileImage: {
        height: 40,
        width: 40,
        borderRadius: 20,
        marginRight: 8,
    },
    textBold: {
        ...FONTS.h6,
        fontSize: 14,
        flex: 1,
        color: colors.title,
    },
    sendButton: {
        minWidth: 63,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        // paddingHorizontal: 14.2,
        paddingVertical: 6,
        borderRadius: 6,
    },
    buttonText: {
        ...FONTS.font,
        ...FONTS.fontBold,
        color: COLORS.white,
        lineHeight: 18,
    },
    noDataContainer: {
        flex: 1,
        paddingBottom: '5%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    noDataText: {
        ...FONTS.font,
        fontSize: 16,
        color: COLORS.text,
        textAlign: 'center',
    },
})
