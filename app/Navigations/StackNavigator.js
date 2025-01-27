import { StatusBar } from 'react-native'
import React from 'react'
import Pages from '../pages/Index'
import { useAuth } from '../contexts'
import { NAV } from '../constants/enums'
import { useTheme } from '@react-navigation/native'
import SplashScreen from '../pages/Splash/SplashScreen'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

// import Components from '../Screens/Components/Components'
// import AccordionScreen from '../Screens/Components/Accordion'
// import ActionSheet from '../Screens/Components/ActionSheet'
// import ActionModals from '../Screens/Components/ActionModals'
// import Buttons from '../Screens/Components/Buttons'
// import Charts from '../Screens/Components/Charts'
// import Chips from '../Screens/Components/Chips'
// import CollapseElements from '../Screens/Components/CollapseElements'
// import DividerElements from '../Screens/Components/DividerElements'
// import FileUploads from '../Screens/Components/FileUploads'
// import Headers from '../Screens/Components/Headers'
// import Inputs from '../Screens/Components/Inputs'
// import ListScreen from '../Screens/Components/Lists'
// import Paginations from '../Screens/Components/Paginations'
// import Pricings from '../Screens/Components/Pricings'
// import Snackbars from '../Screens/Components/Snackbars'
// import Socials from '../Screens/Components/Socials'
// import SwipeableScreen from '../Screens/Components/Swipeable'
// import Tabs from '../Screens/Components/Tabs'
// import Tables from '../Screens/Components/Tables'
// import Toggles from '../Screens/Components/Toggles'
// import Footers from '../Screens/Components/Footers'
// import TabStyle1 from '../components/Footers/FooterStyle1'
// import TabStyle2 from '../components/Footers/FooterStyle2'
// import TabStyle3 from '../components/Footers/FooterStyle3'
// import TabStyle4 from '../components/Footers/FooterStyle4'
// import Reels from '../Screens/Components/Reels'

const StackComponent = createNativeStackNavigator()

const StackNavigator = () => {
    const theme = useTheme()
    const { colors } = theme
    const { showSplash } = useAuth()

    if (showSplash) {
        return <SplashScreen />
    }

    return (
        <>
            <StatusBar backgroundColor={theme.dark ? colors.card : colors.card} barStyle={theme.dark ? 'light-content' : 'dark-content'} />
            <StackComponent.Navigator
                detachInactiveScreens={true}
                screenOptions={{
                    headerShown: false,
                    cardStyle: { backgroundColor: "transparent" },
                }}
            >
                <StackComponent.Screen name={NAV.PAGES} component={Pages} />

                {/* <StackComponent.Screen name={"Components"} component={Components} />
                <StackComponent.Screen name={"Accordion"} component={AccordionScreen} />
                <StackComponent.Screen name={"ActionSheet"} component={ActionSheet} />
                <StackComponent.Screen name={"ActionModals"} component={ActionModals} />
                <StackComponent.Screen name={"Buttons"} component={Buttons} />
                <StackComponent.Screen name={"Charts"} component={Charts} />
                <StackComponent.Screen name={"Chips"} component={Chips} />
                <StackComponent.Screen name={"CollapseElements"} component={CollapseElements} />
                <StackComponent.Screen name={"DividerElements"} component={DividerElements} />
                <StackComponent.Screen name={"FileUploads"} component={FileUploads} />
                <StackComponent.Screen name={"Headers"} component={Headers} />
                <StackComponent.Screen name={"Footers"} component={Footers} />
                <StackComponent.Screen name={"Inputs"} component={Inputs} />
                <StackComponent.Screen name={"lists"} component={ListScreen} />
                <StackComponent.Screen name={"Paginations"} component={Paginations} />
                <StackComponent.Screen name={"Pricings"} component={Pricings} />
                <StackComponent.Screen name={"Snackbars"} component={Snackbars} />
                <StackComponent.Screen name={"Socials"} component={Socials} />
                <StackComponent.Screen name={"Swipeable"} component={SwipeableScreen} />
                <StackComponent.Screen name={"Tabs"} component={Tabs} />
                <StackComponent.Screen name={"Tables"} component={Tables} />
                <StackComponent.Screen name={"Toggles"} component={Toggles} />
                <StackComponent.Screen name={"Reels"} component={Reels} />
                <StackComponent.Screen name={"TabStyle1"} component={TabStyle1} />
                <StackComponent.Screen name={"TabStyle2"} component={TabStyle2} />
                <StackComponent.Screen name={"TabStyle3"} component={TabStyle3} />
                <StackComponent.Screen name={"TabStyle4"} component={TabStyle4} /> */}

            </StackComponent.Navigator>
        </>
    )
}

export default StackNavigator