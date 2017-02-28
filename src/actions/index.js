export const screenResize = (viewport) => {
	return {
		type: 'SCREEN_RESIZE',
		viewport
	}
}

export const projectHovered = (project) => {
	return {
		type: 'PROJECT_HOVERED',
		payload: project
	}
}

export const setProjectActive = (project) => {
	return {
		type: 'PROJECT_ACTIVE',
		payload: project
	}
}

export const projectOut = (project) => {
	return {
		type: 'PROJECT_OUT'
	}
}

export const fetchWorksData = (data) => {
	return {
		type: 'WORK_DATA_FETCHED',
		payload: data
	}
}
