export const fetchPhotosData = (data) => {
	return {
		type: 'PHOTOS_DATA_FETCHED',
		payload: data
	}
}

export const setIndexPhoto = (index) => {
	return {
		type: 'SET_PHOTO_INDEX',
		payload: index
	}
}

export const incrementIndexPhoto = () => {
	return {
		type: 'INCREMENT_PHOTO_INDEX'
	}
}

export const decrementIndexPhoto = () => {
	return {
		type: 'DECREMENT_PHOTO_INDEX'
	}
}