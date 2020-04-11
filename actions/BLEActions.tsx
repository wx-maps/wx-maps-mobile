export const ADD_DEVICE = 'ADD_DEVICE'
export const DC_FROM_DEVICE = 'DC_FROM_DEVICE'

export const addDevice = device => (
    {
        type: ADD_DEVICE,
        payload: device,
    }
)

export const dc_from_device = device => (
    {
        type: DC_FROM_DEVICE,
        payload: device,
    }
)
    
export const startScan = () => {
    return (dispatch, _getState, BLEManager) => {
        // you can use Device Manager here
        console.log("thunk startScan");
        const subscription = BLEManager.onStateChange((state) => {
            if (state === 'PoweredOn') {
                dispatch(scan());
                subscription.remove();
            }
        }, true);
    };
}

export const scan = () => {
    console.log("Thunk scan")
    return (dispatch, getState, BLEManager) => {
        BLEManager.startDeviceScan([getState().BLE.mapService], null, (error, device) => {
            
            if (error) { console.log(error.message); }
            
            console.log("Adding device")
            dispatch(addDevice(device))
        });
    }
}
