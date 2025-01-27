
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useState, useMemo } from 'react'
import { useLanguage } from '../contexts'
import Header from '../layout/Header'
import { allLanguagesData } from '../languages'
import { COLORS, FONTS } from '../constants/theme'
import { useTheme } from '@react-navigation/native'
import CustomInput from '../components/Input/CustomInput'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

// const allLanguagesData = [
//   { "id": 1, "filename": "ach", "name": "Acholi" },
//   { "id": 2, "filename": "am", "name": "Amharic" },
//   { "id": 3, "filename": "ass", "name": "Assamese" },
//   { "id": 4, "filename": "ay", "name": "Aymara" },
//   { "id": 5, "filename": "az", "name": "Azerbaijani" },
//   { "id": 6, "filename": "ban", "name": "Balinese" },
//   { "id": 7, "filename": "bal", "name": "Balochi" },
//   { "id": 8, "filename": "eu", "name": "Basque" },
//   { "id": 9, "filename": "bar", "name": "Bavarian" },
//   { "id": 10, "filename": "bn", "name": "Bengali" },
//   { "id": 11, "filename": "bem", "name": "Bemba" },
//   { "id": 12, "filename": "bho", "name": "Bhojpuri" },
//   { "id": 13, "filename": "my", "name": "Burmese" },
//   { "id": 14, "filename": "ceb", "name": "Cebuano" },
//   { "id": 15, "filename": "ny", "name": "Chewa" },
//   { "id": 16, "filename": "hne", "name": "Chhattisgarhi" },
//   { "id": 17, "filename": "ctg", "name": "Chittagonian" },
//   { "id": 18, "filename": "cs", "name": "Czech" },
//   { "id": 19, "filename": "dcc", "name": "Deccan" },
//   { "id": 20, "filename": "nl", "name": "Dutch" },
//   { "id": 21, "filename": "mnp", "name": "Eastern Min" },
//   { "id": 22, "filename": "pa", "name": "Eastern Punjabi" },
//   { "id": 23, "filename": "arz", "name": "Egyptian Arabic" },
//   { "id": 24, "filename": "en", "name": "English" },
//   { "id": 25, "filename": "fj", "name": "Fijian" },
//   { "id": 26, "filename": "fr", "name": "French" },
//   { "id": 27, "filename": "gan", "name": "Gan Chinese" },
//   { "id": 28, "filename": "cab", "name": "Garifuna" },
//   { "id": 29, "filename": "de", "name": "German" },
//   { "id": 30, "filename": "lg", "name": "Ganda" },
//   { "id": 31, "filename": "el", "name": "Greek" },
//   { "id": 32, "filename": "gu", "name": "Gujarati" },
//   { "id": 33, "filename": "ht", "name": "Haitian Creole" },
//   { "id": 34, "filename": "hak", "name": "Hakka Chinese" },
//   { "id": 35, "filename": "ha", "name": "Hausa" },
//   { "id": 36, "filename": "he", "name": "Hebrew" },
//   { "id": 37, "filename": "acw", "name": "Hejazi Arabic" },
//   { "id": 38, "filename": "hi", "name": "Hindi" },
//   { "id": 39, "filename": "hu", "name": "Hungarian" },
//   { "id": 40, "filename": "ig", "name": "Igbo" },
//   { "id": 41, "filename": "id", "name": "Indonesian" },
//   { "id": 42, "filename": "fa", "name": "Iranian Persian" },
//   { "id": 43, "filename": "it", "name": "Italian" },
//   { "id": 44, "filename": "ja", "name": "Japanese" },
//   { "id": 45, "filename": "jv", "name": "Javanese" },
//   { "id": 46, "filename": "cjy", "name": "Jin Chinese" },
//   { "id": 47, "filename": "kn", "name": "Kannada" },
//   { "id": 48, "filename": "kk", "name": "Kazakh" },
//   { "id": 49, "filename": "km", "name": "Khmer" },
//   { "id": 50, "filename": "rw", "name": "Kinyarwanda" },
//   { "id": 51, "filename": "rn", "name": "Kirundi" },
//   { "id": 52, "filename": "kg", "name": "Kongo" },
//   { "id": 53, "filename": "ko", "name": "Korean" },
//   { "id": 54, "filename": "mai", "name": "Maithili" },
//   { "id": 55, "filename": "mg", "name": "Malagasy" },
//   { "id": 56, "filename": "ms", "name": "Malay" },
//   { "id": 57, "filename": "ml", "name": "Malayalam" },
//   { "id": 58, "filename": "zh", "name": "Mandarin Chinese" },
//   { "id": 59, "filename": "mag", "name": "Magahi" },
//   { "id": 60, "filename": "arn", "name": "Mapudungun" },
//   { "id": 61, "filename": "mr", "name": "Marathi" },
//   { "id": 62, "filename": "acm", "name": "Mesopotamian Arabic" },
//   { "id": 63, "filename": "ary", "name": "Moroccan Arabic" },
//   { "id": 64, "filename": "mos", "name": "Mossi" },
//   { "id": 65, "filename": "ne", "name": "Nepali" },
//   { "id": 66, "filename": "fuv", "name": "Nigerian Fulfulde" },
//   { "id": 67, "filename": "apc", "name": "North Levantine Arabic" },
//   { "id": 68, "filename": "kmr", "name": "Northern Kurdish" },
//   { "id": 69, "filename": "pbu", "name": "Northern Pashto" },
//   { "id": 70, "filename": "uzn", "name": "Northern Uzbek" },
//   { "id": 71, "filename": "or", "name": "Odia" },
//   { "id": 72, "filename": "pl", "name": "Polish" },
//   { "id": 73, "filename": "pt", "name": "Portuguese" },
//   { "id": 74, "filename": "qu", "name": "Quechua" },
//   { "id": 75, "filename": "ro", "name": "Romanian" },
//   { "id": 76, "filename": "ru", "name": "Russian" },
//   { "id": 77, "filename": "aec", "name": "Sa'idi Arabic" },
//   { "id": 78, "filename": "sm", "name": "Samoan" },
//   { "id": 79, "filename": "ayn", "name": "Sanaani Spoken Arabic" },
//   { "id": 80, "filename": "skr", "name": "Saraiki" },
//   { "id": 81, "filename": "sn", "name": "Shona" },
//   { "id": 82, "filename": "sd", "name": "Sindhi" },
//   { "id": 83, "filename": "si", "name": "Sinhalese" },
//   { "id": 84, "filename": "so", "name": "Somali" },
//   { "id": 85, "filename": "ajp", "name": "South Levantine Arabic" },
//   { "id": 86, "filename": "sdh", "name": "Southern Kurdish" },
//   { "id": 87, "filename": "nan", "name": "Southern Min" },
//   { "id": 88, "filename": "es", "name": "Spanish" },
//   { "id": 89, "filename": "su", "name": "Sundanese" },
//   { "id": 90, "filename": "sv", "name": "Swedish" },
//   { "id": 91, "filename": "syl", "name": "Sylheti" },
//   { "id": 92, "filename": "acq", "name": "Ta'izzi-Adeni Arabic" },
//   { "id": 93, "filename": "tl", "name": "Tagalog" },
//   { "id": 94, "filename": "ta", "name": "Tamil" },
//   { "id": 95, "filename": "shi", "name": "Tachelhit" },
//   { "id": 96, "filename": "te", "name": "Telugu" },
//   { "id": 97, "filename": "th", "name": "Thai" },
//   { "id": 98, "filename": "ti", "name": "Tigrinya" },
//   { "id": 99, "filename": "ts", "name": "Tsonga" },
//   { "id": 100, "filename": "tn", "name": "Tswana" },
//   { "id": 101, "filename": "aeb", "name": "Tunisian Arabic" },
//   { "id": 102, "filename": "tr", "name": "Turkish" },
//   { "id": 103, "filename": "to", "name": "Tongan" },
//   { "id": 104, "filename": "tw", "name": "Twi" },
//   { "id": 105, "filename": "uk", "name": "Ukrainian" },
//   { "id": 106, "filename": "ug", "name": "Uighur" },
//   { "id": 107, "filename": "vi", "name": "Vietnamese" },
//   { "id": 108, "filename": "pnb", "name": "Western Punjabi" },
//   { "id": 109, "filename": "wuu", "name": "Wu Chinese" },
//   { "id": 110, "filename": "hsn", "name": "Xiang Chinese" },
//   { "id": 111, "filename": "xh", "name": "Xhosa" },
//   { "id": 112, "filename": "yo", "name": "Yoruba" },
//   { "id": 113, "filename": "yue", "name": "Yue Chinese" },
//   { "id": 114, "filename": "zu", "name": "Zulu" },
//   { "id": 115, "filename": "ff", "name": "Fula" },
//   { "id": 116, "filename": "nac", "name": "Min Nan Chinese" },
//   { "id": 217, "filename": "ba", "name": "Bashkir" },
//   { "id": 118, "filename": "vls", "name": "Flemish" },
//   { "id": 119, "filename": "gd", "name": "Scottish Gaelic" },
//   { "id": 120, "filename": "oc", "name": "Occitan" },
//   { "id": 121, "filename": "tt", "name": "Tatar" },
//   { "id": 122, "filename": "fy", "name": "Western Frisian" },
//   { "id": 123, "filename": "wo", "name": "Wolof" },
//   { "id": 124, "filename": "cyrl", "name": "Cyrillic", },
//   { "id": 125, "filename": "ga", "name": "Ganda", },
//   { "id": 126, "filename": "ln", "name": "Lingala", },
//   { "id": 127, "filename": "mbc", "name": "Min Bei Chinese", },
//   { "id": 128, "filename": "ur", "name": "Urdu", },
//   { "id": 129, "filename": "urg", "name": "Uyghur", },
// ]

const Languages = () => {
  const { colors } = useTheme()
  const Styles = styles(colors)
  const [searchText, setSearchText] = useState('')
  const { t, changeLanguage, currentLanguage } = useLanguage()

  const filteredData = useMemo(() => {
    return allLanguagesData?.filter(item =>
      item?.name?.toLowerCase()?.includes(searchText?.toLowerCase())
    )
  }, [searchText])

  const handleSelectLanguage = async (language) => {
    await changeLanguage(language?.filename)
  }

  const renderItem = ({ item }) => {
    const isSelected = currentLanguage == item?.filename
    return (
      <TouchableOpacity
        style={[
          Styles.item,
          isSelected && { borderColor: COLORS.primary },
        ]}
        activeOpacity={0.75}
        onPress={() => handleSelectLanguage(item)}
      >
        <Text style={{ color: isSelected ? COLORS.primary : colors.text }}>
          {item.name}
        </Text>
      </TouchableOpacity>
    )
  }

  return (
    <View style={Styles.mainScreen}>

      <Header
        titleLeft
        title={t('languages')}
        leftIcon={'back'}
      />

      <CustomInput
        icon={<FontAwesome style={{ opacity: .6 }} name={'search'} size={20} color={colors.text} />}
        value={searchText}
        style={Styles.input}
        placeholder={t('search')}
        inputContainer={Styles.inputContainer}
        onChangeText={(value) => setSearchText(value)}
      />

      <FlatList
        bounces={false}
        data={filteredData}
        overScrollMode='never'
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.id.toString()}
      />

    </View>
  )
}

export default Languages

const styles = (colors) => StyleSheet.create({
  mainScreen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  item: {
    padding: 15,
    marginVertical: 8,
    borderRadius: 9,
    borderWidth: 1,
    marginHorizontal: 15,
    borderColor: colors.borderColor,
    ...FONTS.fontMedium,
  },
  inputContainer: {
    marginHorizontal: 15,
    marginTop: 24,
    marginBottom: 12,
  },
})