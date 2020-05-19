export const TOGGLE_LIGHTS = 'TOGGLE_LIGHTS'

export const toggleLights = () => (
    {
        type: TOGGLE_LIGHTS,
        payload: null,
    }
)

export const setRainbowMode = () => {
    console.log("Set Rainbow mode")
    return (dispatch, getState, {BleCommunicator}) => { BleCommunicator.setRainbowMode(getState().BLE.connectedDevice); }
}

export const setMetarMode = () => {
    console.log("Set metar mode")
    return (dispatch, getState, {BleCommunicator}) => { BleCommunicator.setMetarMode(getState().BLE.connectedDevice); }
}