import React, { useEffect, useMemo, useState } from 'react';

import { GeneralHeader } from 'com/app_layout/general_header';
import QRCode from "react-qr-code";

import {
  DropboxOutlined, FilterOutlined,
  DownOutlined,
  CloseCircleOutlined, ReloadOutlined, DeleteFilled, ExclamationCircleOutlined, FullscreenOutlined, SearchOutlined, LoadingOutlined
} from '@ant-design/icons'
import {
  Input, Modal, Tabs, Form, Skeleton, Button, Popover, Dropdown, Space,
  Menu, Select, AutoComplete, Checkbox, Tooltip, Pagination, DatePicker, Table
} from 'antd';

import _ from 'lodash';
import { UseGetSize } from 'helper/hook/get_size';
import { Header, Content, InputCus, SelectCus, selectS, AutoCompleteCus } from './styles';
import { openNotificationWithIcon } from 'helper/request/notification_antd';
import { masterDataSelector } from 'app_state/master';
import { useSelector } from 'react-redux';
import { deleteEntry, findAllEntry, findAllOrder, updateEntry } from './services';
import { masterService } from 'app_state/services';
import StockMap from 'page/stock_layout'
import { apiClient } from 'helper/request/api_client';
import BtnDownload from 'com/BtnDownload';
import moment from 'moment';
import { getItem, insertObj, setItem } from 'helper/local_storage/storage';
import { KEY_STORE } from 'helper/local_storage/key';



import { CardCustom } from 'page/material_list/com/Item';
import TablePreview from 'page/material_list/list_box_out';
import axios from 'axios';
import { REAL_SER } from '_config/constant';

const { Search } = Input;

const App = () => {
  const [order, setOrder] = useState({})
  useEffect(() => {
    // const data = getItem(KEY_STORE.out_stock_material)
    // if (data) {
    //   setOrder(data);
    // }

    findAllOrder()
      .then(({ data }) => setOrder(data))
      .catch(err => console.error(err))
  }, [])
  console.log('orderorderorderorder', order);
  return (
    <div style={{ padding: '0px 10px' }}>
      <GeneralHeader title='List Material Out Stock' />
      <div>
        <Tabs>
          {_.isEmpty(order) ? null : Object.keys(order).map(orderName => {
            return (
              <Tabs.TabPane
                key={orderName}
                tab={orderName}
              >
                <Order data={order[orderName]} />

              </Tabs.TabPane>
            )
          })}
        </Tabs>
      </div>
    </div>
  )
}

export default App;
const HOST = `${REAL_SER}/order-list`;

const Order = ({ data }) => {
  const [dataSource, setDataSource] = useState([]);

  const getDataOrderApi = async () => {
    try {
      const { data } = await axios.get(`${HOST}`)
      return data.data;
    } catch (err) {
      return []
    }
  }

  const _requestData = async () => {
    try {
      const listLostData = [];
      const listLostName = Object.keys(data);

      const orderReal = await getDataOrderApi();


      const realLot = {};

      const listBoxMap = {

      }

      orderReal.map((lotReal) => {

        console.log('listLostName', listLostName, 'lotReal.order', lotReal.order);

        if (listLostName.includes(lotReal.order)) {
          realLot[lotReal.order] = [
            ...(realLot[lotReal.order] || []),
            ...lotReal.list_box
          ]
        }
      });

      console.log('realLot', realLot)



      listLostName.map(lotName => {
        const ListBox = data[lotName];
        const aBox = ListBox[0];

        const count = ListBox.reduce((cal, cur) => cal + (+cur.receivied_qty), 0);

        ListBox.map(i => {
          listBoxMap[i.id] = i
        })
        const dataLotSave = {
          lotName: lotName,
          itemcode: aBox.itemcode,
          material_name: aBox.material_name,
          count,
          list_box: ListBox,
        }
        listLostData.push(dataLotSave)
      })

      // ===========end 
      const dataConvert = _.groupBy(listLostData, 'itemcode')

      const dataRow = Object.keys(dataConvert).map(i => {
        const dataItem = dataConvert[i];
        const Name = _.get(dataItem, [0, 'material_name']);
        const count = dataItem.reduce((cal, cur) => cal + (+cur.count), 0)
        const lostRealConvert = {

        }
        Object.keys(realLot).map(lot => {
          const DatalOt = realLot[lot]
          if (DatalOt) {
            lostRealConvert[lot] = {
              count_box: DatalOt.length,
              count: DatalOt.reduce((cal, cur) => {
                console.log(listBoxMap, cur, 'dmdmdmdmd')
                return cal + Number(_.get(listBoxMap, [cur, 'stock_in_warehouse'], 0))
              }, 0)
            }

          }
        })
        return {
          itemcode: i,
          material_name: Name,
          count,
          list_lot: dataItem,
          real_count: lostRealConvert
        }
      })
      setDataSource(dataRow);
    } catch (err) {
      console.log('errr', err)
    }
  }

  useEffect(() => {
    _requestData();
  }, [data])
  return (
    <div>
      <Table
        dataSource={dataSource}
        expandable={{
          expandedRowRender: (record) => (
            <div>
              <CardCustom >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h3>List material wait to out warehouse:</h3>
                </div>
                {
                  _.get(record, 'list_lot', []).map(lot => {
                    return (<div>
                      <p>{lot.lotName}</p>
                      <TablePreview input={lot.list_box} onOk={() => { }} notDownload />
                    </div>)
                  })
                }
                {/* <div>
                  <TablePreview input={record} onOk={() => {}} notDownload />
                </div> */}
              </CardCustom>
            </div>
          ),
        }}
        columns={[
          {
            title: 'Material Name',
            dataIndex: 'material_name',
            key: 'material_name',
          },
          {
            title: 'Item Code',
            dataIndex: 'itemcode',
            key: 'itemcode',
          },
          {
            title: 'Lot Name',
            dataIndex: 'lotName',
            key: 'lotName',
            render: (val, row) => {
              return (
                <div>
                  {
                    _.get(row, 'list_lot', []).map(lot => {
                      return (
                        <Popover title={`Lot.No: ${lot.lotName}`} trigger={'click'} content={<div>
                          <QRCode
                            size={256}
                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                            value={lot.lotName}
                            viewBox={`0 0 256 256`}
                          />

                        </div>}>

                          <div key={lot.lotName}>
                            {lot.lotName} :
                            {lot.count}
                          </div>

                        </Popover>
                      )

                    })
                  }

                </div>
              )
            }
          },
          {
            title: 'Quantity selected',
            dataIndex: 'count',
            key: 'count',
          },
          {
            title: 'Quantity picked',
            dataIndex: 'real_count',
            key: 'real_count',
            render: (val) => {
              console.log('real_count', val)
              return (
                <div>
                  {Object.keys(val).map((lot) => {
                    const data = val[lot];
                    return <div>
                      {lot}: {data.count_box}(box) {data.count} (item)
                    </div>
                  })}
                </div>
              )
            }
          },
          {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
          },
        ]} />
    </div>
  )
}
