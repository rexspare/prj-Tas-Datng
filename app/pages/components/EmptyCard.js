import { Image, Text, View } from 'react-native'
import React, { memo } from 'react'
import { useLanguage } from '../../contexts'
import { SCREEN } from '../../constants/enums'
import Button from '../../components/Button/Button'
import { FONTS, IMAGES } from '../../constants/theme'
import { useNavigation, useTheme } from '@react-navigation/native'

const EmptyCard = () => {
    const { t } = useLanguage()
    const { colors } = useTheme()
    const navigation = useNavigation()

    return (
        <>
            <View
                style={{
                    flex: 1,
                    backgroundColor: colors.cardBg,
                    marginHorizontal: 15,
                    borderRadius: 20,
                    marginBottom: 12,
                    justifyContent: 'center',
                    paddingHorizontal: 30,
                }}
            >
                <View style={{ alignItems: 'center' }}>
                    <View
                        style={{
                            borderRadius: 100,
                            borderWidth: 5,
                            borderColor: colors.cardBg,
                            marginBottom: 20,
                            shadowColor: "rgba(0,0,0,.4)",
                            shadowOffset: {
                                width: 0,
                                height: 4,
                            },
                            shadowOpacity: 0.30,
                            shadowRadius: 4.65,

                            elevation: 8,
                        }}
                    >
                        <Image
                            style={{
                                height: 100,
                                width: 100,
                                borderRadius: 100,
                            }}
                            source={IMAGES.userPic}
                        />
                    </View>
                </View>
                <Text style={{ ...FONTS.font, textAlign: 'center', color: colors.text, marginBottom: 25 }}>{t('emptyCardTitle')}</Text>
                <Button
                    btnRounded
                    title={t('goGlobal')}
                    onPress={() => navigation.navigate(SCREEN.FILTER)}
                />
            </View>
        </>
    )
}

export default memo(EmptyCard)