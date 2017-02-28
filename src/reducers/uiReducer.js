const initialState = {
	width: null,
	height: null
}

const viewport = (state = initialState, action) => {
	switch (action.type) {
		case 'SCREEN_RESIZE':
			return Object.assign({}, state, {
					width: action.viewport.width,
					height: action.viewport.height
			});

		default:
			return state
	}
};

export default viewport;
