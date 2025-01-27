import { View } from 'react-native'
import React from 'react'
import { saveData } from '../services'
// import ZegoUIKitPrebuiltLiveStreaming, {
//     HOST_DEFAULT_CONFIG,
//     AUDIENCE_DEFAULT_CONFIG,
// } from '@zegocloud/zego-uikit-prebuilt-live-streaming-rn'
// "@zegocloud/zego-uikit-prebuilt-live-streaming-rn": "^2.1.2",
import { FIRESTORE_COLLECTIONS, ZEGO_APP_ID, ZEGO_APP_SIGN } from '../constants/enums'

export default function LivePage({ route, navigation }) {
    const { isHost, userId, username, streamId } = route?.params

    // console.log(HOST_DEFAULT_CONFIG)
    // console.log('=-=-=-=-=-=-=')
    // console.log(AUDIENCE_DEFAULT_CONFIG)

    // const handleEndStream = async () => {
    //     navigation.goBack()
    //     if (isHost) {
    //         await saveData(FIRESTORE_COLLECTIONS.LIVE_STREAMS, streamId, { isActive: false })
    //     }
    // }

    return (
        <View style={{ flex: 1, backgroundColor: '#000', }}>
            {/* <ZegoUIKitPrebuiltLiveStreaming
                appID={ZEGO_APP_ID}
                appSign={ZEGO_APP_SIGN}
                userID={userId}
                userName={username}
                liveID={streamId}
                config={{
                    // ...(isHost === true ? HOST_DEFAULT_CONFIG : AUDIENCE_DEFAULT_CONFIG),
                    // onLeaveLiveStreaming: handleEndStream,
                }}
            /> */}
        </View>
    )
}