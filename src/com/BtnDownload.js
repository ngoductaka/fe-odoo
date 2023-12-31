import {
    Table, Upload, Button, Modal, Form, Input, Select, DatePicker,
    InputNumber, Drawer, TimePicker, Card, Breadcrumb, Popover
} from "antd";
import { findIndex, get, isEmpty, isArray } from "lodash";
import Styled from "styled-components";
import moment from "moment";
import {
    PlusCircleOutlined, UploadOutlined, PlusOutlined, PauseCircleOutlined, CheckCircleOutlined, CloseCircleOutlined, RightCircleOutlined, PlayCircleOutlined, ScheduleOutlined, EditOutlined, DeleteOutlined, DownloadOutlined, SwapOutlined, VerticalAlignBottomOutlined, HomeOutlined, UserOutlined,
} from "@ant-design/icons";
import { ENDPOINT, MONGO_SERVER } from "_config/constant";
import { convert2StringQuery } from "helper/convert_data/to_string_query";
import { ACCESS_TOKEN, SERVER_URL } from "_config/storage_key";
import { apiClient } from "helper/request/api_client";
import { openNotificationWithIcon } from "helper/request/notification_antd";

export const _handleDownLoadFile = async ({ params, url }) => {
    try {
        let queryString = convert2StringQuery({
            ...params,
            // urlproxy: urlServer,
            dd: moment().valueOf()
        });

        const link = document.createElement('a');

        const fullLink = ENDPOINT.BASE + '/' + url + '?' + queryString;


        // const { data } = await apiClient.get(url, params)
        console.log('fullLink', fullLink)
        const access_token = await localStorage.getItem(ACCESS_TOKEN)

        const result = await fetch(fullLink, {
            headers: { Authorization: `Bearer ${access_token}` }
        })


        const blob = await result.blob()
        const href = window.URL.createObjectURL(blob)

        link.download = 'report'
        link.href = href

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (err) {
        openNotificationWithIcon('error', JSON.stringify(err))
    }

}

export const _handleDownLoadFile_ = async ({ params, url }) => {
    try {
        let queryString = convert2StringQuery({
            ...params,
        });

        const link = document.createElement('a');

        link.href = ENDPOINT.BASE + '/' + url + '?' + queryString;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    } catch (err) {
        console.log('234', err)
    }
}

const BtnDownload = ({
    url, text = 'Download', params
}) => {
    const _onDownLoad = async () => {
        _handleDownLoadFile({ params, url })
    }
    // const queryString = convert2StringQuery();
    //     // return 1;
    //     // BASE_URL.DOWNLOAD
    //     const link = document.createElement('a');
    //     link.href = MONGO_SERVER + url + '?'+ queryString;
    //     console.log(link.href)
    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);
    return (
        <Button
            border={false}
            type="text"
            onClick={_onDownLoad} icon={<DownloadOutlined />} >
            {text}
        </Button>
    )
}

export default BtnDownload;