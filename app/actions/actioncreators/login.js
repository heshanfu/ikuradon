import { AsyncStorage } from "react-native";
import * as CONST_API from "../../constants/api";
import Networking from "../../networking";
import * as Nav from "../actiontypes/nav";
import * as Main from "../actiontypes/main";
import * as Streaming from "../actiontypes/streaming";
import I18n from "../../i18n";
import { MessageBarManager } from "react-native-message-bar";
import * as Session from "../../util/session";
import * as CurrentUser from "../actiontypes/currentuser";

export function login(domain) {
    return async dispatch => {
        let url, client_id, client_secret;
        try {
            let data = await Networking.fetch(domain, CONST_API.REGISTERING_AN_APPLICATION);
            url = createUrl(domain, data);
            client_id = data.client_id;
            client_secret = data.client_secret;
            //この時点ではまだログインしていません
            dispatch({ type: Nav.NAV_AUTHORIZE, domain, url, client_id, client_secret });
        } catch (e) {
            MessageBarManager.showAlert({
                title: I18n.t("messages.login_failed"),
                message: e.message,
                alertType: "error",
            });
        }
    };
}

export function loginSelectAccounts(index) {
    return async dispatch => {
        await Session.setIndex(index);
        let { domain, access_token } = await Session.getDomainAndToken();
        if (access_token && domain) {
            try {
                let user_credentials = await Networking.fetch(domain, CONST_API.GET_CURRENT_USER, null, {}, access_token);
                dispatch({ type: CurrentUser.UPDATE_CURRENT_USER, user_credentials, domain, access_token });
                dispatch({
                    type: Nav.NAV_MAIN,
                });
                return;
            } catch (e) {
                //LOGIN ERROR!
                await Session.setDefault();
            }
        }
        dispatch({ type: Nav.NAV_LOGIN });
    };
}

export function logout() {
    return async dispatch => {
        try {
            await Session.deleteCurrentItems();
            await AsyncStorage.removeItem("timeline_cache");
            await dispatch({ type: Streaming.STREAM_STOP });
            await dispatch({ type: CurrentUser.DELETED_CURRENT_USER });
            await dispatch({ type: Main.ALLCLEAR_MASTOLIST });
            MessageBarManager.showAlert({
                title: I18n.t("messages.logout_success"),
                alertType: "success",
            });
            dispatch({ type: Nav.NAV_LOGIN });
        } catch (e) {
            MessageBarManager.showAlert({
                title: I18n.t("messages.logout_failed"),
                alertType: "error",
            });
        }
    };
}

export function accountChange() {
    return async dispatch => {
        try {
            await Session.setDefault();
            await AsyncStorage.removeItem("timeline_cache");
            await dispatch({ type: Streaming.STREAM_STOP });
            await dispatch({ type: Main.ALLCLEAR_MASTOLIST });
            await dispatch({ type: CurrentUser.DELETED_CURRENT_USER });
            MessageBarManager.showAlert({
                title: I18n.t("messages.logout_success"),
                alertType: "success",
            });
            dispatch({ type: Nav.NAV_LOGIN });
        } catch (e) {
            MessageBarManager.showAlert({
                title: I18n.t("messages.logout_failed"),
                alertType: "error",
            });
        }
    };
}

function createUrl(domain, data) {
    return `https://${domain}/oauth/authorize?` +
        `client_id=${data.client_id}&` +
        "response_type=code&" +
        "redirect_uri=urn:ietf:wg:oauth:2.0:oob&" +
        "scope=read%20write%20follow";
}

