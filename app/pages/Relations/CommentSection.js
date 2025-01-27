import { ActivityIndicator, Alert, FlatList, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View, TextInput, SafeAreaView, Text } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Header from '../../layout/Header'
import { useAuth, useLanguage } from '../../contexts'
import { useTheme } from '@react-navigation/native'
import firestore from '@react-native-firebase/firestore'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { COLORS, FONTS, SIZES } from '../../constants/theme'
import { FIRESTORE_COLLECTIONS } from '../../constants/enums'
import { convertUnixToDateTime, formateToFullDate } from '../../utils/helpers'
import { getDocumentData, saveData, addDataInSubCollection } from '../../services'

export default function CommentSection({ route }) {
    const postId = route?.params?.postId
    const { t } = useLanguage()
    const { colors } = useTheme()
    const Styles = styles(colors)
    const { userData } = useAuth()
    const flatListRef = useRef(null)
    const [comments, setComments] = useState([])
    const [loading, setloading] = useState(true)
    const [commentText, setCommentText] = useState('')

    useEffect(() => {
        const unsubscribe = firestore()
            .collection(FIRESTORE_COLLECTIONS.REELS)
            .doc(postId)
            .collection(FIRESTORE_COLLECTIONS.COMMENTS)
            .orderBy('createdAt', 'asc')
            .onSnapshot(async snapshot => {
                try {
                    const commentsPromises = snapshot.docs.map(async doc => {
                        const commentData = doc.data()
                        const commentId = doc.id
                        const user = await getDocumentData(
                            FIRESTORE_COLLECTIONS.USERS,
                            commentData.user,
                        )
                        return {
                            id: commentId,
                            ...commentData,
                            user: {
                                name: user?.name,
                                id: user?.uid,
                            },
                        }
                    })
                    const commentsData = await Promise.all(commentsPromises)
                    await saveData(FIRESTORE_COLLECTIONS.REELS, postId, {
                        comments: commentsData.length,
                    })
                    setComments(commentsData)
                    setTimeout(() => {
                        _scrollToEnd()
                    }, 100)
                } catch (error) {
                    console.error(
                        'Error updating comment count or fetching user data:',
                        error,
                    )
                } finally {
                    setloading(false)
                }
            })
        return () => unsubscribe()
    }, [postId])

    const _scrollToEnd = () => {
        flatListRef.current?.scrollToEnd({ animated: true })
    }

    const addNewComment = async () => {
        if (commentText != '') {
            let data = {
                text: commentText,
                createdAt: firestore.FieldValue.serverTimestamp(),
                user: userData?.uid,
            }
            try {
                let result = await addDataInSubCollection(
                    FIRESTORE_COLLECTIONS.REELS,
                    postId,
                    FIRESTORE_COLLECTIONS.COMMENTS,
                    data,
                )
                if (result?.id) {
                    setCommentText('')
                }
            } catch (error) {
                console.error('Error saving comment:', error)
            }
        } else {
            Alert.alert(t('addCommentWarning'))
        }
    }

    const CommentView = ({ item }) => (
        <View style={Styles.commentView}>
            <View style={Styles.messageContainer}>
                <Text style={Styles.textBold}>{item?.user?.name}</Text>
                <Text style={Styles.text}>{item?.text}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
                <Text style={Styles.timeText}>{formateToFullDate(convertUnixToDateTime(item?.createdAt?.seconds))}</Text>
            </View>
        </View>
    )

    return (
        <SafeAreaView style={Styles.container}>
            <KeyboardAvoidingView
                style={Styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : null}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >

                    <Header
                        titleLeft
                        leftIcon={'back'}
                        title={t('comments')}
                    />

                    {loading && (
                        <ActivityIndicator style={{ marginTop: 10 }} color={'red'} />
                    )}

                    <FlatList
                        ref={flatListRef}
                        bounces={false}
                        data={comments}
                        overScrollMode="never"
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={({ item }) => <CommentView postId={postId} item={item} />}
                    />

                    <View style={Styles.inputContainer}>
                        <TextInput
                            value={commentText}
                            style={Styles.input}
                            placeholder={t('commentPlaceholder')}
                            placeholderTextColor={colors.border}
                            onChangeText={e => setCommentText(e)}
                        />
                        <TouchableOpacity onPress={addNewComment} disabled={!commentText}>
                            <Ionicons name={'send'} size={24} color={colors.text} />
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = (colors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    inputContainer: {
        height: 60,
        borderRadius: SIZES.radius_md,
        marginHorizontal: 10,
        paddingHorizontal: 20,
        marginBottom: 15,
        backgroundColor: colors.card,
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        height: '100%',
        flex: 1,
        marginRight: '2%',
        color: colors.text,
    },

    commentView: {
        marginVertical: 8,
        paddingHorizontal: '5%',
    },
    nameInitialsBg: {
        height: 45,
        width: 45,
        borderRadius: SIZES.radius_md,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        maxWidth: '75%',
        marginHorizontal: 20,
    },
    messageContainer: {
        paddingHorizontal: 25,
        paddingVertical: 10,
        borderRadius: 10,
        borderBottomRightRadius: 0,
        backgroundColor: COLORS.white,
    },
    sender: {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 10,
    },
    text: {
        color: COLORS.textLight,
        ...FONTS.fontMedium
    },
    textBold: {
        color: COLORS.text,
        ...FONTS.fontBold,
    },
    timeText: {
        color: colors.text,
        marginTop: 5,
        textAlign: 'right',
    },
});
