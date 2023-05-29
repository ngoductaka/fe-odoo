import React from 'react';
import { Input, Button, Form, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { get, isEmpty } from 'lodash';
import { apiClient } from 'helper/request/api_client';
import { openNotificationWithIcon } from 'helper/request/notification_antd';
import axios from 'axios';
import { REAL_SER } from '_config/constant';
import { apiClientMongo } from 'helper/request/api_client_v1';
import { GeneralHeader } from 'com/app_layout/general_header';
import { handleErr } from 'helper/request/handle_err_request';
import { hex2a } from 'helper/convert_data/convert_hex_2_text';
const HOST = `${REAL_SER}/order-list`;

const list = new Array(25).fill(0);
const App = () => {
    const [form] = Form.useForm();
    const _handleUpload = async () => {
        try {
            if (!String.prototype.cordwood) {
                String.prototype.cordwood = function (cordlen) {
                    if (cordlen === undefined || cordlen > this.length) {
                        cordlen = this.length;
                    }
                    var yardstick = new RegExp(`.{${cordlen}}`, 'g');
                    var pieces = this.match(yardstick);
                    var accumulated = (pieces.length * cordlen);
                    var modulo = this.length % accumulated;
                    if (modulo) pieces.push(this.slice(accumulated));
                    return pieces;
                };
            }

            const dataUpload = form.getFieldValue();
            const { lot_number, rfid } = dataUpload;
            const stringRfid = hex2a(rfid.trim().split(/\W/).join(''));
            const rfidList = removeDuplicates(stringRfid.cordwood(12)).filter(i => i.length === 12)

            await apiClientMongo.post('box-material/box-in-factory', {
                list_box: rfidList,
                'order': lot_number,
            })
            form.resetFields();
            openNotificationWithIcon('success', "Add rfid success")

        } catch (err) {
            handleErr(err);
        }
    }
    return (
        <>
            <GeneralHeader title='Scan Material In Factory' />
            <div style={{ padding: 10 }}>
                <Form form={form} >
                    {/* <Form.Item name={'lot_number'} key={'lot'} style={{ marginTop: 10, marginBottom: 0 }}>
                        <Input allowClear autocomplete="off" autoComplete={false}
                            placeholder='Order No' />
                    </Form.Item> */}
                    <Form.Item name={'rfid'} key={'rfid'} style={{ marginTop: 10, marginBottom: 0 }}>
                        <Input.TextArea style={{ height: '100vh' }} allowClear autocomplete="off" autoComplete={false}
                            placeholder='List Rfid ' />
                    </Form.Item>

                    {/* {list.map((i, index) => <Form.Item name={index + ''} key={index + ''} style={{ marginTop: 10, marginBottom: 0 }}>
                        <Input allowClear autocomplete="off" autoComplete={false} name={index + ''}
                            placeholder='rfid' key={index + ''} />
                    </Form.Item>
                    )} */}
                </Form>
                <Button onClick={() => {

                    const dataUpload = Object.values(form.getFieldValue()).filter(i => !!i);
                    if (!isEmpty(dataUpload)) {
                        Modal.confirm({
                            icon: <ExclamationCircleOutlined />,
                            closable: true,
                            content: <div>
                                <div style={{ fontWeight: 'bold', fontSize: 18 }}>Confirm upload data?</div>
                                <div>{dataUpload.toString()}</div>

                            </div>,
                            onOk() {
                                _handleUpload()
                            },
                            onCancel() {
                                Modal.destroyAll();
                            },
                        });

                    }
                }} type='primary'
                    style={{ position: 'fixed', bottom: 40, right: 20, zIndex: 100 }}>Upload</Button>
            </div>
        </>
    )
};




export default App;

function removeDuplicates(arr) {
    return [...new Set(arr)];
}