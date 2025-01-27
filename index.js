/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import 'intl-pluralrules';
import 'react-native-gesture-handler';
import { name as appName } from './app.json';
import * as ZIM from 'zego-zim-react-native';
import * as ZPNs from 'zego-zpns-react-native';
import ZegoUIKitPrebuiltCallService from '@zegocloud/zego-uikit-prebuilt-call-rn';

ZegoUIKitPrebuiltCallService.useSystemCallingUI([ZIM, ZPNs]);

AppRegistry.registerComponent(appName, () => App);
