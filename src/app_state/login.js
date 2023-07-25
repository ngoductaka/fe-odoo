import { createSlice } from '@reduxjs/toolkit';
// com
import { openNotificationWithIcon } from "../helper/request/notification_antd";
import { handleErr } from "../helper/request/handle_err_request";
// helper
import {
    finishedLoadingSuccess,
    finishedLoadingFailure,
    isLoadingRequest,
} from '../helper/redux/slice_redux';
import { authServices } from './services';
import { ACCESS_TOKEN, REFRESH_TOKEN, SERVER_URL } from '../_config/storage_key';
import _ from 'lodash';
import { apiRPC } from 'helper/request/rpc_proxy';

const ROLE = {
    ADMIN: 13,
}

const initialState = {
    userrole: 3,
    user: {}
};

// Slice
const slice = createSlice({
    name: 'app_state',
    initialState,
    reducers: {
        loginRequest: (state, { payload }) => {
            isLoadingRequest(state);
            state.isLogin = false;
        },
        loginSuccess: (state, { payload }) => {
            finishedLoadingSuccess(state);
            state.isLogin = true;
            state.userrole = payload.userrole;
            state.user = payload;
        },
        loginFail: (state, { payload }) => {
            finishedLoadingFailure(state)
            state.isLogin = false;
        },
        logout: (state) => {
            state.isLogin = false;
            state.userrole = null;
            state.user = {}
            console.log('ddddd', state);
            finishedLoadingSuccess(state);
        }
    }
});
// ACTION
const { loginRequest, loginSuccess, loginFail, logout } = slice.actions;

export const requestLogin = (body) => async (dispatch) => {
    try {
        dispatch(loginRequest());
        const { data } = await apiRPC.post('/login', body);
        localStorage.setItem('odoo_id', data.uid);

        await dispatch(loginSuccess(data));
        openNotificationWithIcon("success", data.msg);
        return data;
    } catch (err) {
        openNotificationWithIcon("error", err.message);
        console.log("err ", err.response);
        handleErr(err);
        dispatch(loginFail())
        return 0;
    }
}

export const requestLogout = (body) => async (dispatch) => {
    try {
        localStorage.clear();
        dispatch(logout())
        return 1;
    } catch (err) {
        handleErr(err);
        dispatch(loginFail())
        return 0;
    }
}

// SELECTOR

export const isLoginSelector = state => {
    return state.app.isLogin
};
export const appStateSelector = state => {
    return state.app
};

export const getRole = state => _.get(state, 'app.userrole');
export const isAdminSelector = state => _.get(state, 'app.userrole') == ROLE.ADMIN;


export default slice.reducer;
