import * as StreamingActionTypes from "../actions/actiontypes/streaming";

const initialState = {
    home: false,
    local: false,
    federal: false
};

export default function Streaming(state = initialState, action = {}) {
    let newstate = Object.assign({}, state);
    switch (action.type) {
        case StreamingActionTypes.STREAM_START:
            newstate[action.reducerType] = true;
            return newstate;
        case StreamingActionTypes.STREAM_STOP:
            newstate[action.reducerType] = false;
            return newstate;
        default:
            return newstate;
    }
}