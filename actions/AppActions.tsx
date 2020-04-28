export const HIDE_SNACKBAR = 'HIDE_SNACKBAR'
export const SHOW_SNACKBAR = 'SHOW_SNACKBAR'

export const hideSnackbar = () => (
    {
        type: HIDE_SNACKBAR,
        payload: null,
    }
)

export const showSnackbar = (text: String) => (
    {
        type: SHOW_SNACKBAR,
        payload: text,
    }
)

export const showConnectedSnackbar = (device) => (
    {
        type: SHOW_SNACKBAR,
        payload: "Connected to device " + device.name + "\n(" + device.id + ')'
    }
)

export const showError = (error: Error) => (
    {
        type: SHOW_SNACKBAR,
        payload: "An error occured: \n" + error
    }
)