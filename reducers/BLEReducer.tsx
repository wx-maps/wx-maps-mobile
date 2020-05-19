import { 
  ADD_DEVICE, 
  CONNECTED_DEVICE, 
  ADD_WIFI_DATA, 
  RECONSTRUCT_WIFI_DATA, 
  SET_IP_ADDRESS, 
  SET_INTERNET_CONNECTION_STATUS, 
  CLEAR_WIFI_DATA,
  SHOW_CONNECT_DIALOG,
  HIDE_CONNECT_DIALOG,
  RECONSTRUCT_AIRPORT_DATA,
  ADD_AIRPORT_DATA,
  UPDATE_STATUS_STRING,
} from '../actions/BLEActions'

const INITIAL_STATE = {
  manager: null,
  devices: [],
  wifiDataBuffer: [],
  wifiNetworks: [],
  connectedDevice: null,
  isConnected: false,
  airportDataBuffer: [],
  airports: [],
  lightsOn: true,
  statusString: "Searching for WX Map",
  wifi: { 
    connectedToInternet: false,
    ipAddress: null,
    connectDialogVisible: false,
    connecting: false,
    selectedWifiNetwork: '',
    wifiPassword: null,
  }
};

export const BLEReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD_DEVICE:
      return {...state, devices: state.devices.concat(action.payload)}
    case ADD_WIFI_DATA:
      return {...state, wifiDataBuffer: state.wifiDataBuffer.concat(action.payload)}
    case CLEAR_WIFI_DATA:
     return {...state, wifiDataBuffer: [], wifiNetworkData: []}
     // DRY these reconstructs up
    case RECONSTRUCT_WIFI_DATA:
      const wifiNetworkData = state.wifiDataBuffer.join('');
      try{  
        return {...state, wifiNetworks:  JSON.parse(wifiNetworkData) }
      } catch {
        console.log('Failed to parse state:')
        console.log(wifiNetworkData)
        return {...state}
      }
    case RECONSTRUCT_AIRPORT_DATA:
      const airportWeatherData = state.airportDataBuffer.join('');
      try{  
        const data = JSON.parse(airportWeatherData)
        return {...state, airportDataBuffer: [], airports: data }
      } catch {
        console.log('Failed to parse state:')
        console.log(airportWeatherData)
        return {...state, airportDataBuffer: []}
      }
    case CONNECTED_DEVICE:
      return {...state, connectedDevice: action.payload, isConnected: true}
    case SET_IP_ADDRESS:
      return {...state, wifi: { ...state.wifi, ipAddress: action.payload}}
    case SET_INTERNET_CONNECTION_STATUS:
      return {...state, wifi: { ...state.wifi, connectedToInternet: action.payload } }
    case SHOW_CONNECT_DIALOG:
      return {...state, wifi: { ...state.wifi, connectDialogVisible: true, selectedWifiNetwork: action.payload}}
    case HIDE_CONNECT_DIALOG:
      return {...state, wifi: { ...state.wifi, connectDialogVisible: false}} 
    case ADD_AIRPORT_DATA:
        return {...state, airportDataBuffer: state.airportDataBuffer.concat(action.payload)}
    case UPDATE_STATUS_STRING:
      return{...state, statusString: action.payload}
    default:
      return state
  }
};
