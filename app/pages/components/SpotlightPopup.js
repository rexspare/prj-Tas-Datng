import { StyleSheet, View, Modal, StatusBar, TouchableWithoutFeedback } from 'react-native'
import React, { memo } from 'react'
import LottieView from 'lottie-react-native'
import { COLORS } from '../../constants/theme'
import { animationsList } from '../../constants/enums'
import firestore from '@react-native-firebase/firestore'

const SpotlightPopup = ({ spotlight, closeModal }) => {
    const currentTimestamp = firestore.Timestamp.now()
    const visible = (spotlight?.isActive && spotlight?.expiresAt > currentTimestamp) ? true : false

    const selectedAnimation = animationsList?.find(x => x?.id == spotlight?.animation)

    return (
        <Modal
            transparent
            visible={visible}
            onRequestClose={closeModal}
        >
            <StatusBar backgroundColor={COLORS.backdrop} />
            <View style={styles.modalWrapper}>
                <TouchableWithoutFeedback onPress={closeModal}>
                    <LottieView source={selectedAnimation?.animation} autoPlay loop />
                </TouchableWithoutFeedback>
            </View>
        </Modal>
    )
}

export default memo(SpotlightPopup)

const styles = StyleSheet.create({
    modalWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: '5%',
        backgroundColor: COLORS.backdrop,
    },
})