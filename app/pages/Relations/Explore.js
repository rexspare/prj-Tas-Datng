import { Image, FlatList, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import React, { useState, useMemo, useEffect } from 'react'
import Header from '../../layout/Header'
import { VerifiedBadge } from '../components'
import { SCREEN } from '../../constants/enums'
import { useTheme } from '@react-navigation/native'
import { useLanguage, useApp } from '../../contexts'
import { COLORS, FONTS } from '../../constants/theme'
import LinearGradient from 'react-native-linear-gradient'
import CustomInput from '../../components/Input/CustomInput'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GlobalStyleSheet } from '../../constants/StyleSheet'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

const Explore = ({ navigation }) => {
    const { t } = useLanguage()
    const { colors } = useTheme()
    const Styles = styles(colors)
    const { users, getAllUsers } = useApp()
    const [loading, setLoading] = useState(false)
    const [searchText, setSearchText] = useState('')

    useEffect(() => {
        setLoading(true)
        getAllUsers()
        setLoading(false)
    }, [])

    const filteredUsers = useMemo(() => {
        return users?.filter(item =>
            item?.name?.toLowerCase()?.includes(searchText?.toLowerCase())
        )
    }, [searchText, users])

    const renderItem = ({ item }) => {
        return (
            <View style={Styles.itemContainer}>
                <TouchableOpacity onPress={() => navigation.navigate(SCREEN.PROFILE_DETAILS, { item })}>
                    {item?.images && item?.images?.length > 0 ? (
                        <Image
                            source={{ uri: item?.images[0]?.uri }}
                            style={Styles.itemImage}
                        />
                    ) : (
                        <View style={[Styles.itemImage, { justifyContent: 'center', alignItems: 'center', backgroundColor: colors.placeholder }]}>
                            <Text style={Styles.whiteText}>No Image</Text>
                        </View>
                    )}
                    <LinearGradient colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,.7)']} style={Styles.gradientStyle}>
                        <View style={{ flexDirection: 'row', }}>
                            <Text style={Styles.whiteTitle}>{item?.name}</Text>
                            {item?.verified?.isActive && <VerifiedBadge />}
                        </View>
                        <Text style={Styles.whiteText} numberOfLines={1}>{item?.about}</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        )
    }

    const renderEmptyComponent = () => (
        <View style={Styles.noDataContainer}>
            <Text style={Styles.noDataText}>{t('noData')}</Text>
        </View>
    )

    return (
        <SafeAreaView style={Styles.mainScreen}>
            <View style={Styles.mainScreen}>
                <Header
                    leftIcon={'back'}
                    title={t('explore')}
                    titleLeft
                />

                <CustomInput
                    icon={<FontAwesome style={{ opacity: .6 }} name={'search'} size={20} color={colors.text} />}
                    value={searchText}
                    style={Styles.input}
                    placeholder={t('search')}
                    inputContainer={Styles.inputContainer}
                    onChangeText={(value) => setSearchText(value)}
                />

                {loading ?
                    <View style={Styles.loader}>
                        <ActivityIndicator color={COLORS.primary} />
                    </View>
                    :
                    <FlatList
                        numColumns={2}
                        data={filteredUsers}
                        renderItem={renderItem}
                        showsVerticalScrollIndicator={false}
                        columnWrapperStyle={GlobalStyleSheet.row}
                        ListEmptyComponent={renderEmptyComponent}
                        contentContainerStyle={Styles.scrollStyle}
                        keyExtractor={(_, index) => index.toString()}
                    />
                }

            </View>
        </SafeAreaView>
    )
}

export default Explore

const styles = (colors) => StyleSheet.create({
    mainScreen: {
        flex: 1,
        backgroundColor: colors.background,
    },
    itemContainer: { ...GlobalStyleSheet.col50, marginBottom: 10 },
    itemImage: {
        width: '100%',
        height: 220,
        borderRadius: 10,
    },
    gradientStyle: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        top: 0,
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 15,
        justifyContent: 'flex-end',
    },
    whiteTitle: { ...FONTS.h6, color: COLORS.white, },
    whiteText: { ...FONTS.font, color: COLORS.white, opacity: .75, },
    scrollStyle: { paddingBottom: 10, paddingHorizontal: 15 },
    noDataContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        padding: 20,
    },
    noDataText: {
        ...FONTS.font,
        color: COLORS.text,
        fontSize: 16,
        textAlign: 'center',
    },
    input: {
    },
    inputContainer: {
        marginHorizontal: 15,
        marginTop: 25,
        marginBottom: 12
    },
    loader: {
        flex: 1,
        alignItems: 'center',
        paddingBottom: '24%',
        justifyContent: 'center',
    },
})
