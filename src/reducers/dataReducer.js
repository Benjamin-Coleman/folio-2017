export default function reducer(state={
    worksData: {},
  }, action) {

    switch (action.type) {
      case "WORK_DATA_FETCHED": {
        return {...state, worksData: action.payload}
      }
    }

    return state
}