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