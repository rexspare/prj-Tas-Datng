import React, { memo } from 'react'
import { COLORS } from '../../constants/theme'
import { useTheme } from '@react-navigation/native'
import ToggleSwitch from 'toggle-switch-react-native'

const CustomSwitch = ({ value, onToggle }) => {
    const theme = useTheme()

    return (
        <ToggleSwitch
            isOn={value}
            size={'medium'}
            onColor={COLORS.primary}
            onToggle={isOn => onToggle(isOn)}
            offColor={theme.dark ? COLORS.darkBorder_2 : '#e8e9ea'}
        />
    )
}

export default memo(CustomSwitch)
