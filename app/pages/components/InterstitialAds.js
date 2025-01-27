import React, { useEffect, memo } from 'react'
import {
  InterstitialAd,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads'
import { GOOGLE_ADS_ID } from '../../constants/enums'

const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : GOOGLE_ADS_ID

const InterstitialAds = () => {

  // const [interstitial, setInterstitial] = useState(
  //   InterstitialAd.createForAdRequest(adUnitId, {
  //     requestNonPersonalizedAdsOnly: true,
  //   })
  // )

  // const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: true,
      keywords: ['fashion', 'clothing'],
    })

    const adListener = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      interstitial.show()
    })

    interstitial.load()

    return () => {
      adListener()
    }
  }, [])

  // const showInterstitialAd = () => {
  //   if (loaded && interstitial) {
  //     interstitial.show()
  //   } else {
  //     console.log('Ad is not loaded yet')
  //   }
  // }

  return <></>

}

export default memo(InterstitialAds)
