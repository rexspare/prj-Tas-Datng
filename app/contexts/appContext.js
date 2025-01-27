import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react'
import { debounce } from 'lodash'
import { useAuth } from './authContext'
import { useLanguage } from './languageContext'
import firestore from '@react-native-firebase/firestore'
import functions from '@react-native-firebase/functions'
import { FIRESTORE_COLLECTIONS } from '../constants/enums'
import { emptyFunction, getGeoHashRange, showFlash } from '../utils/helpers'
import { getCollectionData, getCollectionDataWhere, getDocumentData, getSubCollectionDocument } from '../services'

export const AppContext = createContext({
    homeFeeds: [],
    ageRange: [],
    setAgeRange: emptyFunction,
    distanceVal: [],
    setDistanceVal: emptyFunction,
    yourLikes: [],
    matches: [],
    matchListener: emptyFunction,
    conversations: [],
    sendMessage: emptyFunction,
    chatListener: emptyFunction,
    followUser: emptyFunction,
    unfollowUser: emptyFunction,
    isUserFollowing: emptyFunction,
    stories: [],
    setStories: emptyFunction,
    reelsData: [],
    setReelsData: emptyFunction,
    users: [],
    newMatches: [],
    setNewMatches: [],
    campaigns: [],
    streams: [],
    setStreams: emptyFunction,
    getAllUsers: emptyFunction,
})

const loadingData = [
    { loading: true },
    { loading: true },
    { loading: true },
    { loading: true },
    { loading: true },
    { loading: true },
]

export const useApp = () => useContext(AppContext)

export const AppProvider = ({ children }) => {
    const { t } = useLanguage()
    const { userData, getProfileStatus } = useAuth()
    const [homeFeeds, setHomeFeeds] = useState([])
    const [likes, setLikes] = useState([])
    const [matches, setMatches] = useState(loadingData)
    const [ageRange, setAgeRange] = useState([18, 100])
    const [distanceVal, setDistanceVal] = useState([30])
    const [conversations, setConversations] = useState(loadingData)
    const memorizedChat = useMemo(() => conversations, [conversations])
    const memorizedMatches = useMemo(() => matches, [matches])
    const [stories, setStories] = useState(loadingData)
    const [streams, setStreams] = useState(loadingData)
    const [reelsData, setReelsData] = useState([])
    const [users, setUsers] = useState([])
    const [newMatches, setNewMatches] = useState([])
    const [allCampaigns, setAllCampaigns] = useState([])
    const memorizedCampaigns = useMemo(() => allCampaigns, [allCampaigns])
    const memorizedReels = useMemo(() => reelsData, [reelsData])

    useEffect(() => {
        if (userData?.uid) {
            debouncedGetHomeFeeds()
        }
    }, [ageRange, distanceVal, userData])

    useEffect(() => {
        if (userData?.uid) {
            getUserLikes()
            // getAllUsers()
            fetchCampaigns()
        }
    }, [userData?.uid])

    const getHomeFeeds = async () => {
        let allUsers = []
        await firestore()
            .collection(FIRESTORE_COLLECTIONS.USERS)
            .where('age', '>=', ageRange[0])
            .where('age', '<=', ageRange[1])
            .get().then(async (querySnapshot) => {
                querySnapshot.forEach(function (doc) {
                    if (doc.exists) {
                        allUsers.push({ ...doc.data() })
                    } else {
                        console.log('No document found!')
                    }
                })
            })
            .catch((e) => console.log('Error fetching user feed:', e))

        function kmToMiles(distanceInKm) {
            return distanceInKm * 0.621371
        }

        const currentUserLat = userData?.location?.coordinates?.latitude
        const currentUserLong = userData?.location?.coordinates?.longitude
        const range = getGeoHashRange(currentUserLat, currentUserLong, kmToMiles(distanceVal[0]))

        let filteredData = []

        if (currentUserLat && currentUserLong) {
            filteredData = allUsers?.filter((item) => {
                const isInsideRange = item?.location?.hashLocation >= range?.lower || item?.location?.hashLocation <= range?.upper
                // const percentage = getProfileStatus(item)
                const isInterestedInMatch = userData?.interestedIn === 'Everyone' || userData?.interestedIn === item?.gender
                // return isInsideRange && percentage == 100 && item?.uid !== userData?.uid && isInterestedInMatch
                return isInsideRange && item?.images?.length > 1 && item?.uid !== userData?.uid && isInterestedInMatch
                // return isInsideRange && item?.images?.length > 1 && item?.uid === userData?.uid && isInterestedInMatch
            })
        } else {
            showFlash(t('addLocationWarning'))
        }

        if (filteredData?.length >= 1) {

            const likesSnapshot = await firestore()
                .collection(FIRESTORE_COLLECTIONS.LIKES)
                .where('profileId', '==', userData?.uid)
                .get()

            const likedByCurrentUser = []

            likesSnapshot.forEach((doc) => {
                const likeData = doc.data()
                if (likeData.isSuperLike) {
                    const likedUser = filteredData?.find(user => user?.uid === likeData?.likedBy)
                    if (likedUser) {
                        likedByCurrentUser.push(likedUser)
                    }
                }
            })

            filteredData = filteredData.filter(user => !likedByCurrentUser.includes(user))

            filteredData.unshift(...likedByCurrentUser)
        }

        setHomeFeeds(filteredData)
    }

    const debouncedGetHomeFeeds = useCallback(debounce(getHomeFeeds, 400), [ageRange, distanceVal, userData?.uid, userData?.interestedIn])

    const getUserById = async (userId) => {
        const userData = await getDocumentData(FIRESTORE_COLLECTIONS.USERS, userId)
        if (userData) {
            return userData
        }
    }

    const fetchCampaigns = async () => {
        const campaignsData = await getCollectionData(FIRESTORE_COLLECTIONS.CAMPAIGNS)
        if (campaignsData?.length >= 1) {
            let campaignsArray = []
            for (const item of campaignsData) {
                const businessData = await getDocumentData(FIRESTORE_COLLECTIONS.BUSINESSES, item?.businessProfileId)
                if (businessData?.businessProfileId) {
                    campaignsArray.push({ ...item, businessData })
                }
            }
            setAllCampaigns(campaignsArray)
        }
    }

    const getUserLikes = async () => {
        const likesData = await getCollectionDataWhere(FIRESTORE_COLLECTIONS.LIKES, 'profileId', userData?.uid)
        let formattedData = []
        if (likesData?.length >= 1) {
            for (const item of likesData) {
                const user = await getUserById(item?.likedBy)
                if (user?.images?.length >= 1) {
                    formattedData.push(user)
                }
                // const percentage = getProfileStatus(user)
                // if (percentage == 100) {
                //     formattedData.push(user)
                // }
            }
        }
        setLikes(formattedData)
    }

    const getUserMatches = async () => {
        const likedByUser = await getCollectionDataWhere(FIRESTORE_COLLECTIONS.LIKES, 'likedBy', userData?.uid)
        const whoLikedUser = await getCollectionDataWhere(FIRESTORE_COLLECTIONS.LIKES, 'profileId', userData?.uid)

        const matchedArray = likedByUser?.filter(likedDoc =>
            whoLikedUser?.some(whoLikedDoc => whoLikedDoc?.likedBy === likedDoc?.profileId)
        )

        let formattedMatches = []
        let foundMatches = []
        if (matchedArray?.length >= 1) {
            for (const item of matchedArray) {
                const user = await getUserById(item?.profileId)
                const isNewMatch = await checkNewMatch(item?.documentId)
                if (user?.uid) {
                    if (isNewMatch) {
                        // matchId is the likeId of users that liked the current user
                        foundMatches.push({ ...user, matchId: item?.documentId })
                    }
                    formattedMatches.push(user)
                }
            }
        }
        setMatches(formattedMatches)
        setNewMatches(foundMatches)
    }

    const checkNewMatch = async (itemId) => {
        const oldMatches = await getSubCollectionDocument(
            FIRESTORE_COLLECTIONS.USERS,
            userData?.uid,
            FIRESTORE_COLLECTIONS.MATCHES,
            itemId,
        )
        if (!oldMatches) {
            return oldMatches
        }
    }

    const setupMatchListener = () => {
        const matchRef = firestore()
            .collection(FIRESTORE_COLLECTIONS.USERS)
            .where('superLikes', 'array-contains', userData?.uid)

        const unsubscribe = matchRef.onSnapshot(async () => {
            getUserMatches()
        })

        return unsubscribe
    }

    const fetchConversations = async () => {

        const getOtherParticipant = async (participants) => {
            const userId = participants?.find((participant) => participant !== userData?.uid)
            if (userId) {
                const userData = await getDocumentData(FIRESTORE_COLLECTIONS.USERS, userId)
                return userData
            }
        }

        const conversationsRef = firestore()
            .collection(FIRESTORE_COLLECTIONS.CHATS)
            .where('participants', 'array-contains', userData.uid)

        const querySnapshot = await conversationsRef.get()

        const fetchedConversations = []

        for (const doc of querySnapshot.docs) {
            const chatId = doc.id
            const conversation = doc.data()

            const otherParticipant = await getOtherParticipant(conversation.participants)

            const lastMessage = conversation?.lastMessage

            fetchedConversations.push({
                id: chatId,
                isActive: otherParticipant?.isActive,
                lastOnline: otherParticipant?.lastOnline,
                name: otherParticipant?.name,
                profileImage: otherParticipant?.images?.length >= 1 ? otherParticipant.images[0].uri : '',
                age: otherParticipant?.age,
                fcmToken: otherParticipant?.fcmToken,
                messageSent: lastMessage?.messageSent,
                lastMessage: lastMessage?.message,
                lastMessageTime: lastMessage?.timestamp,
                messageSeen: lastMessage?.messageSeen,
                lastUser: lastMessage?.sender,
            })
        }

        setConversations(fetchedConversations)
    }

    const setupConversationsListener = () => {
        const conversationsRef = firestore()
            .collection(FIRESTORE_COLLECTIONS.CHATS)
            .where('participants', 'array-contains', userData.uid)

        const unsubscribe = conversationsRef.onSnapshot(async () => {
            fetchConversations()
        })

        return unsubscribe
    }

    const handleSendMessage = async (inputText, callback, chatId, userDetail) => {
        if (inputText) {
            const getOtherParticipant = (id) => {
                const participants = id?.split('_')
                return participants.find((participant) => participant !== userData?.uid)
            }

            const sender = userData?.uid
            const receiver = getOtherParticipant(chatId)

            const chatRef = firestore().collection(FIRESTORE_COLLECTIONS.CHATS).doc(chatId)
            const messagesRef = chatRef.collection(FIRESTORE_COLLECTIONS.MESSAGES)

            const chatDoc = await chatRef.get()
            if (!chatDoc.exists) {
                await chatRef.set({
                    participants: [sender, receiver],
                })
            }

            const newMessageRef = messagesRef.doc();

            const formattedMessage = {
                documentId: newMessageRef.id,
                sender,
                receiver,
                message: inputText,
                messageSent: true,
                messageSeen: false,
                // timestamp: firestore.FieldValue.serverTimestamp(),
                timestamp: new Date(),
            }

            await chatRef.set({ lastMessage: formattedMessage }, { merge: true })

            await newMessageRef
                .set(formattedMessage)
                .catch((error) => console.log(error))

            callback()

            await sendNotification({
                title: `${userData?.name} sent you a message`,
                message: inputText,
                FCMToken: userDetail?.fcmToken,
                userId: userDetail?.uid,
                type: 'message',
            })

        }
    }

    const sendNotification = async (formattedMessage) => {
        await functions()
            .httpsCallable('sendPushNotification')(formattedMessage)
            .then(response => {
                console.log('Notification sent', response)
            })
            .catch(e => console.log('Error sending notification ======>', e))
    }

    const followUser = async (currentUserId, targetUserId) => {
        try {
            const batch = firestore().batch();

            const currentUserFollowingRef = firestore()
                .collection(FIRESTORE_COLLECTIONS.USERS)
                .doc(currentUserId)
                .collection(FIRESTORE_COLLECTIONS.FOLLOWING)
                .doc(targetUserId);

            const targetUserFollowersRef = firestore()
                .collection(FIRESTORE_COLLECTIONS.USERS)
                .doc(targetUserId)
                .collection(FIRESTORE_COLLECTIONS.FOLLOWERS)
                .doc(currentUserId);

            const currentUserRef = firestore().collection(FIRESTORE_COLLECTIONS.USERS).doc(currentUserId);

            const targetUserRef = firestore().collection(FIRESTORE_COLLECTIONS.USERS).doc(targetUserId);

            batch.set(currentUserFollowingRef, {
                followingId: targetUserId,
                followedAt: firestore.FieldValue.serverTimestamp(),
            });

            batch.set(targetUserFollowersRef, {
                followerId: currentUserId,
                followedAt: firestore.FieldValue.serverTimestamp(),
            });

            batch.update(currentUserRef, {
                followingCount: firestore.FieldValue.increment(1),
            });

            batch.update(targetUserRef, {
                followersCount: firestore.FieldValue.increment(1),
            });

            await batch.commit();

            // console.log(`User ${currentUserId} is now following User ${targetUserId}`);
        } catch (error) {
            console.error("Error following user: ", error);
            throw error;
        }
    };

    const unfollowUser = async (currentUserId, targetUserId) => {
        try {
            const batch = firestore().batch();

            const currentUserFollowingRef = firestore()
                .collection(FIRESTORE_COLLECTIONS.USERS)
                .doc(currentUserId)
                .collection(FIRESTORE_COLLECTIONS.FOLLOWING)
                .doc(targetUserId);

            const targetUserFollowersRef = firestore()
                .collection(FIRESTORE_COLLECTIONS.USERS)
                .doc(targetUserId)
                .collection(FIRESTORE_COLLECTIONS.FOLLOWERS)
                .doc(currentUserId);

            const currentUserRef = firestore().collection(FIRESTORE_COLLECTIONS.USERS).doc(currentUserId);

            const targetUserRef = firestore().collection(FIRESTORE_COLLECTIONS.USERS).doc(targetUserId);

            const currentUserDoc = await currentUserRef.get();
            const targetUserDoc = await targetUserRef.get();

            const currentUserFollowingCount = currentUserDoc.data().followingCount || 0;
            const targetUserFollowersCount = targetUserDoc.data().followersCount || 0;

            batch.delete(currentUserFollowingRef);

            batch.delete(targetUserFollowersRef);

            if (currentUserFollowingCount > 0) {
                batch.update(currentUserRef, {
                    followingCount: firestore.FieldValue.increment(-1),
                });
            }

            if (targetUserFollowersCount > 0) {
                batch.update(targetUserRef, {
                    followersCount: firestore.FieldValue.increment(-1),
                });
            }

            await batch.commit();
            // console.log(`User ${currentUserId} has unfollowed User ${targetUserId}`);
        } catch (error) {
            console.error("Error unfollowing user: ", error);
            throw error;
        }
    };

    const isUserFollowing = async (targetUserId) => {
        try {
            const followingDoc = await firestore()
                .collection(FIRESTORE_COLLECTIONS.USERS)
                .doc(userData?.uid)
                .collection(FIRESTORE_COLLECTIONS.FOLLOWING)
                .doc(targetUserId)
                .get();

            return followingDoc.exists;
        } catch (error) {
            console.error("Error checking if user is following: ", error);
            throw error;
        }
    };

    const getAllUsers = async () => {
        try {
            const data = await getCollectionDataWhere(FIRESTORE_COLLECTIONS.USERS, 'images', null, '!=')
            setUsers(data)
        } catch (error) {
            console.log("Error while fetching Users:", error)
        }
    }

    return (
        <AppContext.Provider
            value={{
                homeFeeds,
                ageRange,
                setAgeRange,
                distanceVal,
                setDistanceVal,
                yourLikes: likes,
                matches: memorizedMatches,
                matchListener: setupMatchListener,
                conversations: memorizedChat,
                sendMessage: handleSendMessage,
                chatListener: setupConversationsListener,
                followUser,
                unfollowUser,
                isUserFollowing,
                stories,
                setStories,
                reelsData: memorizedReels,
                setReelsData,
                users,
                newMatches,
                setNewMatches,
                campaigns: memorizedCampaigns,
                streams,
                setStreams,
                getAllUsers,
            }}>
            {children}
        </AppContext.Provider>
    )
}
