export default function reducer(state={
    current_hovered_project: null,
    current_active_project: null
  }, action) {

    switch (action.type) {
      case "PROJECT_HOVERED": {
        return {...state, current_hovered_project: action.payload}
      }
      case "PROJECT_OUT": {
        return {...state, current_hovered_project: null}
      }
      case "PROJECT_ACTIVE": {
        return {...state, current_active_project: action.payload}
      }
    }

    return state
}