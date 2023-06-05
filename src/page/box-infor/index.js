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
      const { id, barcode } = dataUpload;
      const stringRfid = barcode.trim().split(/\W/).join('');
      const rfidList = removeDuplicates(stringRfid.cordwood(12)).filter(i => i.length === 12)

      const { data } = await axios.post('http://172.174.226.12:3909/map', {
        "location": id.trim(),
        "barCode": rfidList
      });

      openNotificationWithIcon('success', "upload success");
      form.resetFields();
    } catch (err) {
      handleErr(err);
    }
  }
  return (
    <>
    <h1 className='text-center font-bold text-xl'>Scanner input</h1>
      <div style={{ padding: 10 }}>
        <Form form={form} >
          <Form.Item name={'id'} key={'id'} style={{ marginTop: 10, marginBottom: 0 }}>
            <Input.TextArea
             style={{ height: '10vh' }} allowClear autocomplete="off" autoComplete={false}
              placeholder='Location id ex:1-001' />
          </Form.Item>
          <Form.Item name={'barcode'} key={'barcode'} style={{ marginTop: 30, marginBottom: 0 }}>
            <Input.TextArea style={{ height: '30vh' }} allowClear autocomplete="off" autoComplete={false}
              placeholder='List bar code (12 characters) ex: D10400003000' />
          </Form.Item>
        </Form>
        <Button onClick={() => {
          const dataUpload = Object.values(form.getFieldValue()).filter(i => !!i);
          if (!isEmpty(dataUpload)) {
            _handleUpload()
          }
        }} type='primary'
          style={{ position: 'fixed', bottom: 40, right: 20, zIndex: 100 }}>Submit</Button>
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