import { Linking, PermissionsAndroid, Platform } from 'react-native'
import moment from 'moment'
import geohash from 'ngeohash'
import { COLORS } from '../constants/theme'
import Snackbar from 'react-native-snackbar'
import ImagePicker from 'react-native-image-crop-picker'
import Geolocation from 'react-native-geolocation-service'
import { request, check, PERMISSIONS, RESULTS } from 'react-native-permissions'

export const showFlash = (message, color = COLORS.primary) => {
    Snackbar.show({
        text: message,
        backgroundColor: color,
        duration: Snackbar.LENGTH_SHORT,
    })
}

export const openCamera = () => {
    return new Promise((resolve, reject) => {
        ImagePicker.openCamera({
            height: 600,
            width: 400,
            mediaType: 'photo',
        })
            .then(async (image) => resolve(image))
            .catch((err) => reject(err))
    })
}

export const openGallery = (options = {}) => {
    return new Promise((resolve, reject) => {
        ImagePicker.openPicker({
            height: 600,
            width: 400,
            mediaType: 'photo',
            ...options,
        })
            .then((image) => resolve(image))
            .catch((err) => reject(err))
    })
}

export const emptyFunction = () => { }

export const isIOS = () => {
    return Platform.OS == 'ios'
}

export const textLimit = (text, limit) => {
    if (text?.length >= limit) {
        return `${text?.slice(0, limit)}...`
    } else {
        return text
    }
}

export function calculateTime(timestamp) {
    const nanoseconds = timestamp?.nanoseconds
    const seconds = timestamp?.seconds
    const milliseconds = Math.floor(nanoseconds / 1e6)
    const date = new Date(0)
    date.setSeconds(seconds)
    date.setMilliseconds(milliseconds)
    const timeString = date?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })

    return timeString
}

export const getUnixTimestamp = (dateString) => {
    let dob = new Date()
    if (dateString) {
        dob = new Date(dateString)
    }
    const unixTimestamp = dob?.getTime()
    const unixTimestampInSeconds = Math.floor(unixTimestamp / 1000)
    return unixTimestampInSeconds
}

export const getAge = (unixTimestamp) => {
    const birthDate = new Date(unixTimestamp * 1000)
    const currentDate = new Date()
    let age = currentDate.getFullYear() - birthDate.getFullYear()
    if (
        currentDate.getMonth() < birthDate.getMonth() ||
        (currentDate.getMonth() === birthDate.getMonth() &&
            currentDate.getDate() < birthDate.getDate())
    ) {
        age--
    }
    return age
}

export function timeElapsedString(timestamp, string = 'Online') {
    if (!timestamp || !timestamp.seconds || !timestamp.nanoseconds) {
        return "Timestamp is invalid";
    }

    const currentTimestamp = new Date();
    const providedTimestamp = new Date(Number(timestamp.seconds) * 1000 + Math.round(Number(timestamp.nanoseconds) / 1e6));

    const elapsedMilliseconds = currentTimestamp - providedTimestamp;
    const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
    const elapsedMinutes = Math.floor(elapsedSeconds / 60);
    const elapsedHours = Math.floor(elapsedMinutes / 60);
    const elapsedDays = Math.floor(elapsedHours / 24);
    const elapsedMonths = Math.floor(elapsedDays / 30);
    const elapsedYears = Math.floor(elapsedDays / 365);

    if (elapsedYears > 0) {
        return `${string} ${elapsedYears}y ago`;
    } else if (elapsedMonths > 0) {
        return `${string} ${elapsedMonths}mo ago`;
    } else if (elapsedDays > 0) {
        return `${string} ${elapsedDays}d ago`;
    } else if (elapsedHours > 0) {
        return `${string} ${elapsedHours}h ago`;
    } else {
        return `${string} ${elapsedMinutes}m ago`;
    }
}

export const getGeoHashRange = (latitude, longitude, distance = 5) => {
    // distance is measured in miles
    const lat = 0.0144927536231884 // degrees latitude per mile
    const lon = 0.0181818181818182 // degrees longitude per mile

    const lowerLat = latitude - lat * distance
    const lowerLon = longitude - lon * distance

    const upperLat = latitude + lat * distance
    const upperLon = longitude + lon * distance

    const lower = geohash.encode(lowerLat, lowerLon)
    const upper = geohash.encode(upperLat, upperLon)

    return { lower, upper }
}

export const handleLocationRequest = () => {
    const locationPermission = isIOS()
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION

    return new Promise((resolve, reject) => {
        check(locationPermission)
            .then((result) => {
                if (result === RESULTS.GRANTED) {
                    resolve()
                } else {
                    request(locationPermission)
                        .then((result) => {
                            if (result === RESULTS.GRANTED) {
                                resolve()
                            } else {
                                reject('Location permission denied')
                            }
                        })
                        .catch((error) => reject(error))
                }
            })
            .catch((error) => reject(error))
    })
}

export const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
            (position) => {
                resolve(position.coords)
            },
            (error) => {
                reject(error)
            },
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        )
    })
}

export const handleCurrentLocation = () => {
    return new Promise((resolve, reject) => {
        handleLocationRequest()
            .then(() => getCurrentLocation())
            .then((coords) => resolve(coords))
            .catch((error) => reject(error))
    })
}

export async function androidNotificationPermission() {

    let permission;

    if (Platform.Version < 33) {
        permission = PERMISSIONS.ANDROID.POST_NOTIFICATIONS;
        return true
    }
    else {
        permission = PERMISSIONS.ANDROID.POST_NOTIFICATIONS;

    }

    const hasPermission = await check(permission);

    if (hasPermission === 'granted') {

        return true;
    }

    return await request(permission);
}

export function formateToFullDate(date) {
    if (date) {
        const formatedDate = moment(date).format('MMMM DD, YYYY')
        return formatedDate || ''
    }
}

export function convertUnixToDateTime(unixTimestamp, time = false) {
    const dateTime = moment.unix(unixTimestamp)

    if (time) {
        const formattedDateTime = dateTime.format('YYYY-MM-DD HH:mm')
        return formattedDateTime || ''
    } else {
        const formattedDateTime = dateTime.utc().format('YYYY-MM-DD')
        return formattedDateTime || ''
    }
}

export async function handleGalleryPermission(callBack) {
    try {
        if (Platform.OS === 'ios') {
            callBack()
        } else {

            if (Platform.Version >= 33) {
                await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
                ]).then((result) => {
                    if (result['android.permission.CAMERA']
                        && result['android.permission.READ_MEDIA_IMAGES'] === 'granted') {
                        callBack()
                    }
                })
            } else {
                await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
                ]).then((result) => {
                    if (result['android.permission.CAMERA']
                        && result['android.permission.READ_EXTERNAL_STORAGE'] === 'granted') {
                        callBack()
                    }
                })
            }
        }
    } catch (err) {
        console.warn(err)
    }
}

export const openUrl = (url) => {
    const canOpen = Linking.canOpenURL(url)
    if (canOpen) {
        Linking.openURL(url)
    }
}

export const shuffleArray = (array) => {
    let currentIndex = array.length, randomIndex
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--

        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
    }

    return array
}

export const mergeCampaignsAndReels = (campaigns, reelsWithoutAds) => {

    if (campaigns?.length === 0) {
        return reelsWithoutAds
    }

    const mergedArray = []
    mergedArray.push(reelsWithoutAds.shift())

    const maxCampaigns = Math.min(
        Math.ceil(reelsWithoutAds.length / 1.5),
        campaigns.length
    )

    const selectedCampaigns = shuffleArray(campaigns.slice(0, maxCampaigns))

    for (let i = 0; i < reelsWithoutAds.length; i++) {
        if (selectedCampaigns.length > 0 && Math.random() < 0.5) {
            mergedArray.push(selectedCampaigns.shift())
        }

        mergedArray.push(reelsWithoutAds[i])
    }

    while (selectedCampaigns.length > 0) {
        mergedArray.push(selectedCampaigns.shift())
    }

    return mergedArray
}