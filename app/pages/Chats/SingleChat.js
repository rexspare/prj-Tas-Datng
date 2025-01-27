import { FlatList, Image, KeyboardAvoidingView, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native'
import React, { useEffect, useState, useMemo, useRef } from 'react'
import { useApp, useAuth, useLanguage } from '../../contexts'
import { MsgComponent } from '../components'
import { useTheme } from '@react-navigation/native'
import firestore from '@react-native-firebase/firestore'
import FeatherIcon from 'react-native-vector-icons/Feather'
import { GlobalStyleSheet } from '../../constants/StyleSheet'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { COLORS, FONTS, IMAGES, SIZES } from '../../constants/theme'
import { FIRESTORE_COLLECTIONS } from '../../constants/enums'
import { ZegoSendCallInvitationButton } from '@zegocloud/zego-uikit-prebuilt-call-rn'
import { emptyFunction, isIOS, textLimit, timeElapsedString } from '../../utils/helpers'

const SingleChat = ({ navigation, route }) => {
    const { chatId, userDetail } = route?.params
    const { t } = useLanguage()
    const flatListRef = useRef()
    const { colors } = useTheme()
    const Styles = styles(colors)
    const { userData } = useAuth()
    const { sendMessage } = useApp()
    const [messages, setMessages] = useState([])
    const [inputText, setInputText] = useState('')
    const [disabled, setDisabled] = useState(false)
    const memoizedMessages = useMemo(() => messages, [messages])

    useEffect(() => {
        const messagesRef = firestore()
            .collection(FIRESTORE_COLLECTIONS.CHATS)
            .doc(chatId)
            .collection(FIRESTORE_COLLECTIONS.MESSAGES)
            .orderBy('timestamp', 'asc')

        const unsubscribe = messagesRef.onSnapshot(async (querySnapshot) => {
            const fetchedMessages = []

            querySnapshot.forEach(async (doc) => {
                const messageObj = doc?.data()

                fetchedMessages.push({
                    id: doc?.id,
                    ...messageObj,
                })

                if (messageObj?.receiver == userData?.uid) {
                    await firestore()
                        .collection(FIRESTORE_COLLECTIONS.CHATS)
                        .doc(chatId)
                        .collection(FIRESTORE_COLLECTIONS.MESSAGES)
                        .doc(doc?.id)
                        .set({ messageSeen: true }, { merge: true })
                        .catch(function (error) {
                            console.error('Error writing document: ', error)
                        })
                }
            })

            setMessages(fetchedMessages)

            if (fetchedMessages[fetchedMessages.length - 1]?.receiver == userData?.uid) {
                await firestore()
                    .collection(FIRESTORE_COLLECTIONS.CHATS)
                    .doc(chatId)
                    .update({
                        "lastMessage.messageSeen": true,
                    })
                    .catch((error) => {
                        console.error('Error updating chat:', error)
                    })
            }

            if (fetchedMessages?.length != 0) {
                flatListRef.current?.scrollToEnd({ animated: true })
            }

        })

        return () => unsubscribe()
    }, [chatId, messages?.length])

    const onSendMessage = () => {
        if (inputText) {
            setDisabled(true)
            const callback = () => {
                setInputText('')
                setDisabled(false)
            }

            sendMessage(inputText, callback, chatId, userDetail)
        }
    }

    const handleDeleteMessage = async (item) => {
        Alert.alert(
            t('deleteMessage'),
            t('deleteConfirmation'),
            [
                { text: t('cancel'), onPress: emptyFunction, style: 'cancel' },
                { text: t('delete'), onPress: () => deleteMessage(item) },
            ])
    }

    const deleteMessage = async (item) => {
        const isLastMessage = messages[messages.length - 1]?.documentId === item.documentId

        try {
            await firestore()
                .collection(FIRESTORE_COLLECTIONS.CHATS)
                .doc(chatId)
                .collection(FIRESTORE_COLLECTIONS.MESSAGES)
                .doc(item?.documentId)
                .delete()

            if (isLastMessage) {
                const chatRef = firestore().collection(FIRESTORE_COLLECTIONS.CHATS).doc(chatId)
                const remainingMessages = messages.filter(msg => msg.documentId !== item.documentId)
                const newLastMessage = remainingMessages[remainingMessages.length - 1]

                if (newLastMessage) {
                    const updatedLastMessage = {
                        documentId: newLastMessage.documentId,
                        sender: newLastMessage.sender,
                        receiver: newLastMessage.receiver,
                        message: newLastMessage.message,
                        messageSent: true,
                        messageSeen: newLastMessage.messageSeen,
                        timestamp: newLastMessage.timestamp,
                    }

                    await chatRef.set({ lastMessage: updatedLastMessage }, { merge: true })
                } else {
                    await chatRef.update({ lastMessage: firestore.FieldValue.delete() })
                }
            }

        } catch (e) {
            console.log(e)
        }
    }

    return (
        <SafeAreaView style={Styles.mainScreen}>
            <KeyboardAvoidingView style={Styles.flex} behavior={isIOS() ? 'padding' : ''}>

                <View style={Styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={Styles.backButton}>
                        <FeatherIcon color={colors.title} size={24} name='arrow-left' />
                    </TouchableOpacity>
                    <View style={Styles.headerData}>
                        <Image
                            source={userDetail?.profileImage ? { uri: userDetail?.profileImage } : IMAGES.userPic}
                            style={Styles.profileImage}
                        />
                        <View>
                            <Text style={Styles.title}>{textLimit(userDetail?.name, 9)} , {userDetail?.age}</Text>
                            <Text style={Styles.statusText}>{userDetail?.isActive ? 'Active' : timeElapsedString(userDetail?.lastOnline)}</Text>
                        </View>
                    </View>
                    <View style={{ marginRight: 10 }}>
                        <ZegoSendCallInvitationButton
                            invitees={[{ userID: userDetail?.uid, userName: userDetail?.name }]}
                            resourceID={"zego_data"}
                            isVideoCall={false}
                            height={40}
                            width={40}
                            borderRadius={10}
                            backgroundColor={COLORS.primayLight}
                            icon={{ uri: 'https://dummyimage.com/' }}
                            text={<FontAwesome5 size={16} color={COLORS.primary} name='phone-alt' />}
                        />
                    </View>
                    <ZegoSendCallInvitationButton
                        invitees={[{ userID: userDetail?.uid, userName: userDetail?.name }]}
                        resourceID={"Tas_Dating_Call"}
                        isVideoCall={true}
                        height={40}
                        width={40}
                        borderRadius={10}
                        backgroundColor={COLORS.primayLight}
                        icon={{ uri: 'https://dummyimage.com/' }}
                        text={<FontAwesome size={16} color={COLORS.primary} name='video-camera' />}
                    />
                </View>

                <View style={Styles.flex}>
                    <FlatList
                        ref={flatListRef}
                        data={memoizedMessages}
                        contentContainerStyle={[GlobalStyleSheet.container, { paddingTop: 30 }]}
                        renderItem={({ item, index }) => (
                            <MsgComponent
                                key={index}
                                item={item}
                                isSender={userData?.uid == item?.sender}
                                onLongPress={() => handleDeleteMessage(item)}
                            />
                        )}
                    />
                </View>

                <View>
                    <TextInput
                        value={inputText}
                        style={Styles.inputStyle}
                        placeholder={t('sendMessages')}
                        onChangeText={(x) => setInputText(x)}
                        placeholderTextColor={colors.textLight}
                    />
                    <TouchableOpacity
                        activeOpacity={.7}
                        disabled={disabled}
                        style={Styles.sendButton} onPress={onSendMessage}
                    >
                        <FeatherIcon color={COLORS.primary} size={22} name={'send'} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default SingleChat

const styles = (colors) => StyleSheet.create({
    mainScreen: { flex: 1, backgroundColor: colors.cardBg, },
    flex: { flex: 1 },
    listContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 15,
        backgroundColor: colors.cardBg,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderColor,
    },
    backButton: { padding: 10, marginRight: 5, },
    headerData: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileImage: {
        height: 45,
        width: 45,
        borderRadius: 40,
        marginRight: 15,
    },
    title: { ...FONTS.h6, fontSize: SIZES.font, color: colors.title, lineHeight: 20, marginBottom: 2, },
    statusText: { ...FONTS.font, color: colors.textLight, },
    inputStyle: {
        ...FONTS.font,
        backgroundColor: colors.cardBg,
        borderTopWidth: 1,
        borderTopColor: colors.borderColor,
        paddingHorizontal: 20,
        paddingVertical: 15,
        paddingRight: 70,
        fontSize: 15,
    },
    sendButton: {
        height: 45,
        width: 45,
        borderRadius: 40,
        position: 'absolute',
        right: 10,
        top: 7,
        backgroundColor: COLORS.primayLight,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 5,
    },
})