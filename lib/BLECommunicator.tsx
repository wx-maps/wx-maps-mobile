import { BleManager } from "react-native-ble-plx"
import { scan, addDevice, connectTo } from '../actions/BLEActions'

export const MAP_SERVICE                          = 'a5023bbe-29f9-4385-ab43-a9b3600ab7c4'
export const IP_CHARACTERISTIC                    = '7d17ff43-b02a-4586-a488-5a7fd0bc8856'


export const WIFI_SERVICE                         = 'ed6695dd-be8a-44d6-a11d-cb3348faa85a'
export const SCAN_CHARACTERISTIC                  = 'fe600987-e2ea-4c16-b938-f5d04e904af2'
export const CONNECTED_TO_INTERNET_CHARACTERISTIC = '544eb8bb-c6ba-4e94-b2e9-581855102634'
export const CONNECTION_CHARACTERISTIC            = 'b4a7d251-7467-440c-9bf8-570f1fbc929f'


export const decode = (value: string) => {
    return new Buffer(value, 'base64').toString('utf8');
}
