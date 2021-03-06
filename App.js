import React from "react";
import { StyleSheet, View } from "react-native";
import { Provider } from "react-redux";
import { createStore, applyMiddleware} from "redux";
import { createMiddleware } from "./app/middleware";
import AppWithNavigationState from "./app/navigators/appnavigator";
import MessageBarNavigator from "./app/navigators/messagebarnavigator";

import reducers from "./app/reducers";
// other imports...

// create store...
const store = createStore(
    reducers,
    applyMiddleware(...createMiddleware()),
);

export default class App extends React.Component {
    render() {
        return <View style={styles.container}>
            <Provider store={store}>
                <AppWithNavigationState />
            </Provider>
            <MessageBarNavigator refName="alert" />
        </View>;
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});