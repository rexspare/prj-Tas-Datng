import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState, memo } from 'react'
import { useLanguage } from '../../contexts'
import { languagesNames } from '../../languages'
import RBSheet from 'react-native-raw-bottom-sheet'
import { useTheme } from '@react-navigation/native'
import { COLORS, FONTS } from '../../constants/theme'
import FeatherIcon from 'react-native-vector-icons/Feather'

const LanguagesSheet = ({ sheetRef, data, setData }) => {
    const { t } = useLanguage()
    const { colors } = useTheme()
    const Styles = styles(colors)
    const notSelectedTags = languagesNames?.filter(x => !data?.includes(x))
    const [search, setSearch] = useState('')
    const [searchResult, setSearchResult] = useState(notSelectedTags)
    const closeSheet = () => sheetRef.current.close()

    const handleAddTag = (tag) => {
        setData([...data, tag])
        const remainingData = searchResult?.filter(x => x !== tag)
        setSearchResult(remainingData)
    }

    const handleRemoveTag = (tag) => {
        const filteredData = data?.filter(x => x !== tag)
        setData(filteredData)
        setSearchResult([...searchResult, tag])
    }

    const handleSearch = (text) => {
        if (text) {
            setSearch(text)
            const newArray = notSelectedTags?.filter((item) => item?.toLocaleLowerCase()?.includes(text?.toLocaleLowerCase()))
            setSearchResult(newArray)
        } else {
            setSearch('')
            setSearchResult(notSelectedTags)
        }
    }

    return (
        <RBSheet
            ref={sheetRef}
            height={450}
            openDuration={100}
            closeOnDragDown={true}
            customStyles={Styles.sheetStyle}
        >
            <View style={Styles.layoutStyle}>
                <Text style={Styles.title}>{t('languages')}</Text>
                <TouchableOpacity onPress={closeSheet} style={Styles.crossButton}>
                    <FeatherIcon size={24} color={colors.title} name='x' />
                </TouchableOpacity>
            </View>
            <View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                >
                    <View style={Styles.selectedWrapper}>
                        {data?.map((data, index) => {
                            return (
                                // <TouchableOpacity key={index} style={Styles.selectedItem}>
                                //     <FeatherIcon color={COLORS.white} size={14} style={{ marginRight: 6 }} name={data.icon} />
                                //     <Text style={Styles.selectedText}>{data.title}</Text>
                                //     <TouchableOpacity>
                                //         <FeatherIcon style={{ marginLeft: 6 }} size={16} color={COLORS.white} name='x' />
                                //     </TouchableOpacity>
                                // </TouchableOpacity>
                                <View key={index} style={Styles.selectedItem}>
                                    <Text style={Styles.selectedText}>{data}</Text>
                                    <TouchableOpacity onPress={() => handleRemoveTag(data)}>
                                        <FeatherIcon style={Styles.crossStyle} size={16} color={COLORS.white} name='x' />
                                    </TouchableOpacity>
                                </View>
                            )
                        })}
                    </View>
                </ScrollView>
            </View>
            <View style={Styles.inputContainer}>
                <TextInput
                    value={search}
                    style={Styles.inputStyle}
                    onChangeText={handleSearch}
                    placeholder={t('searchPlaceholder')}
                    placeholderTextColor={colors.textLight}
                />
                <FeatherIcon style={Styles.searchIcon} name='search' size={18} color={colors.textLight} />
            </View>
            <TouchableOpacity activeOpacity={1} style={{ flex: 1 }}>
                <ScrollView>
                    <View style={Styles.listWrapper}>
                        {searchResult?.map((data, index) => {
                            return (
                                <TouchableOpacity key={index} style={Styles.notSelectedItem} onPress={() => handleAddTag(data)}>
                                    <Text style={Styles.notSelectedText}>{data}</Text>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                </ScrollView>
            </TouchableOpacity>
        </RBSheet>
    )
}

export default memo(LanguagesSheet)

const styles = (colors) => StyleSheet.create({
    sheetStyle: {
        wrapper: {
        },
        container: {
            backgroundColor: colors.cardBg,
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
        },
        draggableIcon: {
            marginTop: 5,
            marginBottom: 0,
            height: 5,
            width: 90,
            backgroundColor: colors.borderColor,
        }
    },
    layoutStyle: {
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderColor: colors.borderColor,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: { ...FONTS.h5, color: colors.title, flex: 1, },
    crossButton: { padding: 5, },
    selectedWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 12,
        paddingHorizontal: 15,
    },
    inputContainer: {
        marginVertical: 5,
        marginHorizontal: 15,
    },
    inputStyle: {
        backgroundColor: colors.bgLight,
        borderRadius: 30,
        paddingLeft: 45,
        height: 38,
        paddingRight: 15,
        paddingVertical: 6,
    },
    searchIcon: {
        position: 'absolute',
        left: 15,
        top: 10,
    },
    listWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    selectedItem: {
        marginRight: 8,
        marginBottom: 8,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 30,
        paddingHorizontal: 12,
        paddingVertical: 5,
        backgroundColor: COLORS.primary,
    },
    notSelectedItem: {
        backgroundColor: 'rgba(0,0,0,0.03)',
        marginRight: 8,
        marginBottom: 8,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.borderColor,
        borderRadius: 30,
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    selectedText: { ...FONTS.font, color: COLORS.white, top: -1, },
    notSelectedText: { ...FONTS.font, color: colors.text, top: -1, },
    crossStyle: { marginLeft: 6, },
})