import {
    combineReducers
} from "redux";
import navReducer from "./nav";
import mainReducer from "./main";
import navigationReducer from "./navigation";
import streamingReducer from "./streaming";
import currentUserReducer from "./currentuser";
import configReducer from "./config";
// ... other reducers

export default combineReducers({
    navReducer,
    mainReducer,
    navigationReducer,
    streamingReducer,
    currentUserReducer,
    configReducer
    // ... other reducers
});