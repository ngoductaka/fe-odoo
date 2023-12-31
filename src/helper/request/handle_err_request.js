import { get } from 'lodash';
import { openNotificationWithIcon } from './notification_antd';

export const handleErr = (error, showNoti = true) => {
    console.log("res" ,error);
    if (error.response) {
        if (showNoti) {
            openNotificationWithIcon("error", get(error, 'response.data.message', 'Request lỗi'));
        }
        return {
            msg: get(error, 'response.data.message', 'Request lỗi'),
            status: get(error, 'response.status'),
            header: get(error, 'response.headers'),
        }
    } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
    } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
        openNotificationWithIcon("error", error.message);
    }
}