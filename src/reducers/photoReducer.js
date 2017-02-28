export default function reducer(state={
    photos: [],
    currentIndex:5
  }, action) {

    switch (action.type) {
      case "SET_PHOTO_INDEX": {
        return {...state, currentIndex: action.payload}
      }
      case "INCREMENT_PHOTO_INDEX": {        
        const currentIndex = (state.currentIndex < state.photos.length - 1 ) ? state.currentIndex + 1 : 0;
        return {...state, currentIndex: currentIndex}
      }
      case "DECREMENT_PHOTO_INDEX": {
        return {...state, currentIndex: state.currentIndex - 1}
      }
      case "PHOTOS_DATA_FETCHED": {
        return {...state, photos: action.payload}
      }
    }

    return state
}