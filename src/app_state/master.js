import { createSlice } from '@reduxjs/toolkit';

import { masterService } from './services';
import { handleErr } from '../helper/request/handle_err_request';

const initialState = {
    master: {},
    itemcode: [],
    locations: {},
};

// Slice
const slice = createSlice({
    name: 'master_state',
    initialState,
    reducers: {
        getMasterData: (state, { payload }) => {
            state.master = { 
                ...payload,
                qc_status: payload.status
             };
        },
        getItemCodeData: (state, { payload }) => {
            state.itemcode = payload
        },
        getLocations: (state, { payload }) => {
            state.locations = payload;
        },
    },
});

// ACTION
const { getMasterData, getItemCodeData, getLocations } = slice.actions;

export const fetchMasterData = () => async (dispatch) => {
    try {
        const { data } = await masterService.findAllMater();

        await dispatch(getMasterData(data));
    } catch (err) {
        handleErr(err);
        return 0;
    }
};

export const fetchItemCodeData = () => async (dispatch) => {
    try {
        const { data } = await masterService.findItemCode();

        await dispatch(getItemCodeData(data?.data || []));
    } catch (err) {
        handleErr(err);
        return 0;
    }
};

export const fetchLocations = () => async (dispatch) => {
    try {
        const res = await masterService.findAllLocation();
        const data = res.data?.data;

        const locations = Object.keys(data).reduce(
            (total, currentValue) => [...total, ...data[currentValue]],
            []
        );

        await dispatch(getLocations(locations));
    } catch (err) {
        handleErr(err);
        return 0;
    }
};

// SELECTOR
export const masterDataSelector = (state) => state.master_data.master;
export const itemCodeDataSelector = (state) => state.master_data.itemcode;
export const locationsSelector = (state) => state.master_data.locations;

export default slice.reducer;
