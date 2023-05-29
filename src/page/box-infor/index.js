import React, { useState } from 'react';
import { Input, Button, Form, List } from 'antd';
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
  const [dataBox, setDataBox] = useState([])
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

      const { data } = await apiClientMongo.post('box-material/details', {
        boxIds: rfidList,
      });

      openNotificationWithIcon('success', "show rfid success")
      setDataBox(data.data)
    } catch (err) {
      handleErr(err);
    }
  }
  return (
    <>
      <GeneralHeader title='Scan box information' />
      <div style={{ padding: 10 }}>
        <Form form={form} >
          <Form.Item name={'rfid'} key={'rfid'} style={{ marginTop: 10, marginBottom: 0 }}>
            <Input.TextArea style={{ height: '20vh' }} allowClear autocomplete="off" autoComplete={false}
              placeholder='List Rfid ' />
          </Form.Item>
        </Form>
        {dataBox && dataBox[0] && <h3>Box information</h3>}
        {
          dataBox.map(item => (
            <div style={{ marginTop: 8, border: '1px solid #ddd', borderRadius: 9, padding: '10px 15px' }}>
              {Object.keys(listKeyMap).map(
                key => <div style={{ display: 'flex' }}>
                  <div style={{ fontWeight: '500', }}>{listKeyMap[key]}:</div>
                  <div>{item[key]}</div>
                </div>
              )}
            </div>
          ))
        }
        <Button onClick={() => {
          const dataUpload = Object.values(form.getFieldValue()).filter(i => !!i);
          if (!isEmpty(dataUpload)) {
            _handleUpload()
          }
        }} type='primary'
          style={{ position: 'fixed', bottom: 40, right: 20, zIndex: 100 }}>Search</Button>
        <Button onClick={() => {
          setDataBox([]);

          form.resetFields();
        }}
          style={{ position: 'fixed', bottom: 40, left: 20, zIndex: 100 }}>Clear</Button>
      </div>
    </>
  )
};




export default App;

function removeDuplicates(arr) {
  return [...new Set(arr)];
}


const listKeyMap = {
  itemcode: "Item.Code",
  ge_no: "GE.NO",
  lot: 'Lot',
  material_name: "Material name",
  stock_in_warehouse: "Stock in warehouse",
}