import { StyleSheet, View } from 'react-native'
import React, { memo } from 'react'
import ImagePicker from './ImagePicker'
import { GlobalStyleSheet } from '../../constants/StyleSheet'
import { handleGalleryPermission, openGallery } from '../../utils/helpers'

const GalleryPicker = ({ imageData = [], setImageData, style, onRemovePress }) => {

    const UploadFile = async (index) => {
        handleGalleryPermission(() => selectImage(index))
    }

    const selectImage = async (index) => {
        const image = await openGallery()
        if (image) {
            setImageData(prevImageData => {
                const newData = [...prevImageData]
                newData[index] = { uri: image?.path }
                return newData
            })
        }
    }

    const removeImageItem = (index) => {
        onRemovePress && onRemovePress(index)
        setImageData([
            ...imageData?.slice(0, index),
            ...imageData?.slice(index + 1, imageData?.length)
        ])
    }

    return (
        <View style={[styles.wrapper, style]}>
            <View style={GlobalStyleSheet.col66}>
                <ImagePicker
                    data={imageData[0]}
                    onSelect={() => UploadFile(0)}
                    onRemove={() => removeImageItem(0)}
                    icon={{ name: 'image', size: 45 }}
                />
            </View>
            <View style={GlobalStyleSheet.col33}>
                <ImagePicker
                    data={imageData[1]}
                    onSelect={() => UploadFile(1)}
                    onRemove={() => removeImageItem(1)}
                />
                <ImagePicker
                    data={imageData[2]}
                    onSelect={() => UploadFile(2)}
                    onRemove={() => removeImageItem(2)}
                />
            </View>
            <View style={GlobalStyleSheet.col33}>
                <ImagePicker
                    data={imageData[3]}
                    onSelect={() => UploadFile(3)}
                    onRemove={() => removeImageItem(3)}
                />
            </View>
            <View style={GlobalStyleSheet.col33}>
                <ImagePicker
                    data={imageData[4]}
                    onSelect={() => UploadFile(4)}
                    onRemove={() => removeImageItem(4)}
                />
            </View>
            <View style={GlobalStyleSheet.col33}>
                <ImagePicker
                    data={imageData[5]}
                    onSelect={() => UploadFile(5)}
                    onRemove={() => removeImageItem(5)}
                />
            </View>
        </View>
    )
}

export default memo(GalleryPicker)

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
})