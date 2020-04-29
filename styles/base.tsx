export const container = {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
}

export const statusBoxContainer = {
    flexDirection: "row", 
    flex: 1,  
    flexWrap: 'wrap', 
    justifyContent: 'space-evenly' 
}

export const statusBox = {
    padding: 20, 
    margin: 5, 
    textAlign: 'center', 
}

export const airportBoxContainer = {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    alignItems: 'center',

}
export const airportBox = {
    width: 165,
    height: 115,
    padding: 20,
}

export const airportBoxText = {
    color: "#fff",
}

export const statusBoxButton = {
    ...statusBox,
    paddingTop: 40, 
    paddingBottom: 40,
}