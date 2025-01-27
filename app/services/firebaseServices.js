import auth from '@react-native-firebase/auth'
import { isIOS, showFlash } from '../utils/helpers'
import storage from '@react-native-firebase/storage'
import firestore from '@react-native-firebase/firestore'
import functions from '@react-native-firebase/functions'
import { FIRESTORE_COLLECTIONS, STORAGE } from '../constants/enums'
import { GoogleSignin } from '@react-native-google-signin/google-signin'

export async function saveData(collection, doc, jsonObject, merge = true) {
    await firestore()
        .collection(collection)
        .doc(doc)
        .set(jsonObject, { merge })
        .catch(function (error) {
            console.error('Error writing document: ', error)
        })
}

export async function saveDataInSubCollection(
    collection,
    doc,
    subCollection,
    subDoc,
    jsonObject,
    merge = true,
    includeDocumentId = false
) {
    const docRef = firestore()
        .collection(collection)
        .doc(doc)
        .collection(subCollection)
        .doc(subDoc);

    if (includeDocumentId) {
        jsonObject.documentId = docRef.id
    }

    try {
        await docRef.set(jsonObject, { merge });
    } catch (error) {
        console.error('Error writing document: ', error);
        throw error;
    }
}

export async function getSubCollectionDocument(collection, doc, subCollection, subDoc) {
    let found = {}
    await firestore()
        .collection(collection)
        .doc(doc)
        .collection(subCollection)
        .doc(subDoc)
        .get()
        .then((doc) => {
            if (doc.exists) {
                found = { ...doc.data() }
            }
        })
    return found
}

export async function getSubCollectionData(collection, doc, subCollection) {
    try {
        const querySnapshot = await firestore()
            .collection(collection)
            .doc(doc)
            .collection(subCollection)
            .get()

        if (!querySnapshot.empty) {
            const data = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            return data
        }

        return []
    } catch (error) {
        console.error('Error fetching subcollection data:', error)
        return []
    }
}

export async function doesSubCollectionDocumentExist(collection, doc, subCollection, subDoc) {
    try {
        const documentSnapshot = await firestore()
            .collection(collection)
            .doc(doc)
            .collection(subCollection)
            .doc(subDoc)
            .get();

        return documentSnapshot.exists;
    } catch (error) {
        console.error('Error checking document existence:', error);
        return false;
    }
}

export const addDataInSubCollection = async (
    collection,
    doc,
    subCollection,
    jsonObject,
    includeDocumentId = true,
) => {
    const docRef = firestore()
        .collection(collection)
        .doc(doc)
        .collection(subCollection)
        .doc();
    if (includeDocumentId) {
        jsonObject.documentId = docRef.id;
    }
    try {
        await docRef.set(jsonObject, { merge: true });
        return docRef;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export async function addNewDoc(collection, jsonObject) {
    try {
        let formattedData = {
            ...jsonObject,
            createdAt: firestore.FieldValue.serverTimestamp(),
        }
        const docRef = firestore().collection(collection).doc()
        formattedData.documentId = docRef?.id
        await docRef.set(formattedData, { merge: true })
    } catch (e) {
        console.log('Error creating new document', e)
    }
}

export async function getCollectionDataWhere(collection, key, id, query = '==') {
    let data = []
    let querySnapshot = await firestore()
        .collection(collection)
        .where(key, query, id)
        .get()
    querySnapshot.forEach(function (doc) {
        if (doc.exists) {
            data.push({ ...doc.data() })
        }
    })
    return data
}

export async function getCollectionData(collection) {
    let data = []
    let querySnapshot = await firestore()
        .collection(collection)
        .orderBy('createdAt', 'desc')
        .get()
    querySnapshot.forEach(function (doc) {
        if (doc.exists) {
            data.push({ ...doc.data() })
        }
    })
    return data
}

export async function getCollectionDataDoubleWhere(collection, key, id, key1, id1) {
    let data = []
    let querySnapshot = await firestore()
        .collection(collection)
        .where(key, '==', id)
        .where(key1, '==', id1)
        .get()
    querySnapshot.forEach(function (doc) {
        if (doc.exists) {
            data.push({ ...doc.data() })
        }
    })
    return data
}

export async function Delete(collection, doc) {
    await firestore().collection(collection).doc(doc).delete()
}

export const getDocumentData = async (collection, doc) => {
    let found = {}
    await firestore()
        .collection(collection)
        .doc(doc)
        .get()
        .then((doc) => {
            if (doc.exists) {
                found = { ...doc.data() }
            }
        })
    return found
}

export const uploadImage = async (path, folder = STORAGE.IMAGES) => {
    const uri = path
    const filename = uri?.substring(uri?.lastIndexOf('/') + 1)
    const uploadUri = isIOS() ? uri?.replace('file://', '') : uri

    const task = storage().ref(`${folder}/${filename}`).putFile(uploadUri)

    try {
        await task
        const url = await storage().ref(`${folder}/${filename}`).getDownloadURL()
        return { uri: url, name: filename }
    } catch (e) {
        console.log('Error while uploading image to storage', e)
        return 'false'
    }
}

export const deleteImage = async (folder, filename) => {
    try {
        await storage().ref(`${folder}/${filename}`).delete()
        return true
    } catch (e) {
        console.log('Error deleting image', e)
        return 'false'
    }
}

export const simpleLike = async (otherUser) => {
    try {
        // There can be one simple like for one user
        const currentUserUid = auth().currentUser.uid
        const exists = await getCollectionDataDoubleWhere(FIRESTORE_COLLECTIONS.LIKES, 'likedBy', currentUserUid, 'profileId', otherUser?.uid)
        if (exists?.length == 0) {
            const dataToUpload = {
                likedBy: currentUserUid,
                profileId: otherUser?.uid,
                isSuperLike: false,
            }
            await addNewDoc(FIRESTORE_COLLECTIONS.LIKES, dataToUpload)

            const formattedNotification = {
                title: `${otherUser?.name} liked your profile`,
                message: 'Check out his/her profile',
                FCMToken: otherUser?.fcmToken,
                userId: otherUser?.uid,
                type: 'likedProfile',
            }

            await functions()
                .httpsCallable('sendPushNotification')(formattedNotification)
                .then(response => {
                    // console.log('Notification sent', response)
                })
                .catch(e => console.log('Error sending notification ======>', e))

        } else {
            showFlash('You already liked this profile')
        }
    } catch (error) {
        console.error('Error updating super like:', error)
    }
}

export const superLike = async (otherUser) => {
    try {
        const currentUserUid = auth().currentUser.uid
        const exists = await getCollectionDataDoubleWhere(FIRESTORE_COLLECTIONS.LIKES, 'likedBy', currentUserUid, 'profileId', otherUser?.uid)
        const dataToUpload = {
            likedBy: currentUserUid,
            profileId: otherUser?.uid,
            isSuperLike: true,
        }
        // If the simple list exits then update it to super like otherwise create new super like
        if (exists?.length >= 1) {
            await saveData(FIRESTORE_COLLECTIONS.LIKES, exists[0]?.documentId, dataToUpload)
        } else {
            await addNewDoc(FIRESTORE_COLLECTIONS.LIKES, dataToUpload)
        }

        const formattedNotification = {
            title: `${otherUser?.name} liked your profile`,
            message: 'Check out his/her profile',
            FCMToken: otherUser?.fcmToken,
            userId: otherUser?.uid,
            type: 'likedProfile',
        }

        await functions()
            .httpsCallable('sendPushNotification')(formattedNotification)
            .then(response => {
            })
            .catch(e => console.log('Error sending notification ======>', e))

    } catch (error) {
        console.error('Error updating super like:', error)
    }
}

export const removeSuperLike = async (documentId) => {
    await Delete(FIRESTORE_COLLECTIONS.LIKES, documentId)
}

export const getSuperLikeData = async (otherUseId) => {
    let data = []
    const currentUserUid = auth().currentUser.uid
    let querySnapshot = await firestore()
        .collection(FIRESTORE_COLLECTIONS.LIKES)
        .where('likedBy', '==', currentUserUid)
        .where('profileId', '==', otherUseId)
        .where('isSuperLike', '==', true)
        .get()
    querySnapshot.forEach(function (doc) {
        if (doc.exists) {
            data.push({ ...doc.data() })
        }
    })
    return data
}

const reauthenticateGoogleUser = async () => {
    const user = auth().currentUser;

    // reauthenticate is required for google sign in users but not for phone number users.
    if (user) {
        if (user?.email) {
            try {
                // Get the user's Google ID token
                const { idToken } = await GoogleSignin.signInSilently();

                // Create a Google credential
                const credential = auth.GoogleAuthProvider.credential(idToken);

                console.log(idToken)
                await user.reauthenticateWithCredential(credential);
                console.log('User reauthenticated successfully');
                return true

            } catch (error) {
                console.error('Error reauthenticating or deleting user:', error);
                if (error.code === 'auth/requires-recent-login') {
                    console.log('Reauthentication required.');
                }
                return false
            }
        } else {
            // If email is null then it is a phone number user
            return true
        }
    } else {
        console.log('No user is currently logged in.');
    }
};

export const deleteAccount = async (setLoading) => {

    const isAuthenticated = await reauthenticateGoogleUser()
    if (isAuthenticated) {

        let uid = auth().currentUser?.uid
        setLoading(true)
        auth().currentUser.delete()
            .then(() => {
                firestore()
                    .collection(FIRESTORE_COLLECTIONS.USERS)
                    .doc(uid)
                    .delete()
                    .then(() => {
                        setLoading(false)
                    })
                    .catch((err) => {
                        setLoading(false)
                        alert(JSON.stringify(err?.message))
                    })
            })
            .catch((error) => {
                setLoading(false)
                console.log(error.message)
                alert(JSON.stringify(error?.message))
            })
    } else {
        console.log('isAuthenticated is false')
    }

}
