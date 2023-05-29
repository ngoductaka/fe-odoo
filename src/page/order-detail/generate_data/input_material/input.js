import React, { useEffect, useMemo, useState } from 'react';

import { GeneralHeader } from 'com/app_layout/general_header';
import {
  DropboxOutlined, FilterOutlined,
  DeleteOutlined, LeftCircleOutlined,
  CloseCircleOutlined, ReloadOutlined, DeleteFilled, ExclamationCircleOutlined, FullscreenOutlined, SearchOutlined, LoadingOutlined, DownloadOutlined
} from '@ant-design/icons'
import { mongoObjectId } from 'page/material-in/generate_data';
import QRCode from "react-qr-code";

// import 'react-base-table/styles.css
// import './App.scss'
import {
  Table, Button, Input, Popover,
  Select, AutoComplete, Checkbox, Modal, Tooltip, Skeleton, Pagination,
  DatePicker, Form, Card, InputNumber, Row, Popconfirm
} from 'antd';
import _, { clone } from 'lodash';
import { UseGetSize } from 'helper/hook/get_size';
// import { Header, Content, InputCus, SelectCus, selectS, AutoCompleteCus } from './styles';
import { openNotificationWithIcon } from 'helper/request/notification_antd';
import { masterDataSelector } from 'app_state/master';
import { useSelector } from 'react-redux';
import { createBundles, deleteEntry, findAllEntry, updateEntry } from './services';
import { masterService } from 'app_state/services';
import StockMap from 'page/stock_layout'
import { apiClient } from 'helper/request/api_client';
import BtnDownload from 'com/BtnDownload';
import moment from 'moment';
import { getItem, insertArr, insertObj, setItem } from 'helper/local_storage/storage';
import { KEY_STORE } from 'helper/local_storage/key';
import DownloadExcel from 'com/excel/gen_excel';
import styled from 'styled-components'
import { CardCustom } from './com/Item';
import TablePreview from './list_box';
import { apiClientMongo } from 'helper/request/api_client_v1';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { Link } from 'react-router-dom';
import { BtnTus } from 'com/btn_tutorial';
import { handleErr } from 'helper/request/handle_err_request';
import { MONGO_SERVER } from '_config/constant';
const { Search } = Input;

const requiredData = [
  'itemcode', 'ge_no', 'lot', 'quantity_required',
  'cartons_bin', 'receivied_qty', 'carton_size',
]
const App = () => {
  const masterData = useSelector(masterDataSelector);
  // state
  const dataForm = React.useRef({});
  const [form] = Form.useForm();

  const { width, height } = UseGetSize();

  const [dataSource, setDataSource] = useState([]);

  const [dataRenderDetail, setDataDetail] = useState({});

  const [listItemCode, setListItemCode] = useState({});

  useEffect(() => {
    apiClientMongo.get('/material/get-all')
      .then(({ data }) => {
        setListItemCode(_.groupBy(data, 'itemcode'))
      })
  }, [])


  const params = useParams()
  const initData = async () => {
    const orderId = params.order_id;
    const { data } = await apiClientMongo.get(`item-order/${orderId}?populate=material`);
    if (data && !_.isEmpty(data.data)) {
      const dataConvert = data.data.map(i => {
        return {
          ...i.material,
          key: i?.material?.id,
          // item code
          quantity_required: i.quantity_required,
          quantity_issued: i.quantity_issued,
          quantity_in_factory: i.quantity_in_factory,
          materialId: i?.material?.id,
          orderItemId: i.id,
          box_required: i.box_required,
          box_issued: i.box_issued,
          orderId: i.order,

        }
      });
      // console.log('dataConvertdataConvertdataConvert', dataConvert);
      setDataSource(dataConvert);
    } else {
      setDataSource([])
    }
  }
  // dnd
  const _handleChangeItemCode = (dataRow, newVal) => {

    if (!newVal) {
      form.setFields([])
      return 0;
    }
    const [id, itemcode] = newVal.split('**');
    if (dataSource.find(i => i.materialId === id)) {
      openNotificationWithIcon("error", "Can not select same material with same Lot.No");
      form.setFields([])
      return 0;
    }

    const listData = listItemCode[itemcode];
    const _dataFounded = listData.find(i => i.id === id);

    const _data = _.pick(_dataFounded, col.map(i => i.dataIndex))

    if (_data) {
      const dataUpdate = {
        ...dataRow,
        materialId: _dataFounded.id,
      }

      const dataUpdateForm = col.map(item => {
        const key = item.dataIndex;

        dataUpdate[key] = _data[key];
        if (item.type == 'date') {
          return {
            name: `${key}**${dataRow.id}`,
            value: _data[key] && moment(_data[key]),
          }
        }

        return {
          name: `${key}**${dataRow.id}`,
          value: _data[key],
        }

      })

      form.setFields(dataUpdateForm)

      dataSource.find((item, index) => {
        if (item.id === dataRow.id) {
          dataSource[index] = dataUpdate;
          return true;
        }
      })
      setDataSource([...dataSource])
    }
  }

  const _handleChangeReciciedQTY = (dataRow, totalReceived) => {
    const id = dataRow.id;

    const cartons_beans = form.getFieldValue(`cartons_beans**${id}`);

    if (totalReceived && cartons_beans && !isNaN(+(totalReceived || 0) / +(cartons_beans || 0))) {
      const size = +totalReceived / +cartons_beans
      form.setFields([{
        name: `carton_size**${id}`,
        value: Math.ceil(size),
      }
      ])
    }
    form.setFields([{
      name: `stock_in_warehouse**${id}`,
      value: Math.ceil(totalReceived),
    }]);


  }
  const _handleChangeBin = (dataRow, cartons_beans) => {
    const id = dataRow.id;

    const totalReceived = form.getFieldValue(`receivied_qty**${id}`);

    if (totalReceived && cartons_beans && !isNaN(+(totalReceived || 0) / +(cartons_beans || 0))) {
      const size = +totalReceived / +cartons_beans
      form.setFields([{
        name: `carton_size**${id}`,
        value: Math.ceil(size),
      }
      ])
    }
  }

  const columns = useMemo(() => {
    return col.map((i) => {
      const { type, dataIndex } = i;
      if (dataIndex === 'itemcode') {
        i.render = (text, record, index) => {
          if (_.isEmpty(listItemCode)) return null;
          return (
            <Form.Item style={{ margin: 0, padding: 0 }} name={`${dataIndex}**${record.id}`} label={null}>
              <Select
                showSearch
                onChange={val => {
                  _handleChangeItemCode(record, val)
                  setExpandedRowKeys([]);
                }}
                defaultValue={text}
                style={{ minWidth: 300, width: '100%' }}>

                {Object.keys(listItemCode).map(i => <Select.OptGroup key={i} label={i}>
                  {listItemCode[i].map(item => <Select.Option key={item.id} value={`${item.id}**${i}`}>
                    QC no: {item.qc_passed}
                    - lot: {item.lot}
                    </Select.Option>)}
                </Select.OptGroup>)}
              </Select>
            </Form.Item>
          )
        }
      } else if (dataIndex === 'action') {
        i.render = (text, record, index) => {
          return (
            <Popconfirm placement="left" title="Confirm delete order item?"  onConfirm={() => {
              apiClientMongo.delete('item-order', { itemOrderIds: record.orderItemId })
                .then(() => {
                  openNotificationWithIcon('success', 'Delete success!')
                  initData();
                })
                .catch(err => handleErr(err))
            }}>
              <DeleteOutlined style={{ marginLeft: 10, color: 'red' }} />
            </Popconfirm>
          )
        }
      }
      else if (dataIndex === 'receivied_qty') {
        i.render = (text, record, index) => {
          return (
            <Form.Item style={{ margin: 0, padding: 0 }} name={`${dataIndex}**${record.id}`} label={null}>
              <InputNumber
                defaultValue={text}
                onChange={e => {
                  _handleChangeReciciedQTY(record, e)
                  setExpandedRowKeys([]);
                }} />
            </Form.Item>
          )
        }
      }
      else if (dataIndex === 'cartons_beans') {
        i.render = (text, record, index) => {
          return (
            <Form.Item style={{ margin: 0, padding: 0 }} name={`${dataIndex}**${record.id}`} label={null}>
              <InputNumber
                defaultValue={text}
                onChange={e => {
                  _handleChangeBin(record, e)
                  setExpandedRowKeys([]);
                }} />
            </Form.Item>
          )
        }
      }
      else if (type === 'typing') {
        i.render = (text, record, index) => {
          return (
            <Form.Item style={{ margin: 0, padding: 0 }} name={`${dataIndex}**${record.id}`} label={null}>
              <Input
                defaultValue={text} onChange={() => {
                  setExpandedRowKeys([]);
                }} />
            </Form.Item>
          )
        }
      }
      else if (type === 'fixed') {
        i.render = (text, record, index) => {
          return (
            <Form.Item style={{ margin: 0, padding: 0 }} name={`${dataIndex}**${record.id}`} label={null}>
              <Select
                defaultValue={text} onChange={() => {
                  setExpandedRowKeys([]);
                }}
                style={{ minWidth: 100, width: '100%' }}>
                {_.get(masterData, [dataIndex], [])
                  .map((item) => <Select.Option
                    value={`${item.name}`}
                    key={`${item.name}`}
                  >{item.name}</Select.Option>)
                }
              </Select>
            </Form.Item>
          )
        }

      } else if (type === 'date') {
        i.render = (text, record, index) => {
          return (
            <Form.Item
              defaultValue={text ? moment(text) : null}
              style={{ margin: 0, padding: 0 }} name={`${dataIndex}**${record.id}`} label={null}>
              <DatePicker onChange={() => {
                setExpandedRowKeys([]);
              }} />
            </Form.Item>
          )
        }
      }


      return i;
    })
  }, [dataSource, masterData, listItemCode])

  const syncData = (record) => {
    const err = {};
    const id = record.id;
    const currentData = {
      ...record,
    }
    col.map((colItem) => {
      const currVal = form.getFieldValue(`${colItem.dataIndex}**${id}`);
      if (currVal) {
        currentData[colItem.dataIndex] = currVal;
      }
    })

    const dataRowIndex = dataSource.findIndex(r => r.id === id);
    dataSource[dataRowIndex] = currentData;
    col.map(({ dataIndex: key }) => {
      if (requiredData.includes(key) && !currentData[key]) {
        err[key] = `${key} is required`
      }
    })
    setDataSource([...dataSource]);
    return err;
  }
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const _handleExpandItem = (rowData, e) => {
    const err = syncData(rowData);
    if (!_.isEmpty(err)) {
      Object.values(err).map(i => {
        openNotificationWithIcon('error', i)
      })
      return 0;
    }
    const filtered = expandedRowKeys.filter(i => i.id === rowData.id);

    if (filtered.length === expandedRowKeys.length) {
      setExpandedRowKeys([...expandedRowKeys, rowData.id])
    } else {
      setExpandedRowKeys(filtered);
    }
  }
  useEffect(() => {
    initData()
  }, [])

  const _handleSaveAll = () => {
    const listConvert = dataSource.map(i => syncData(i));
    console.log(dataSource, 'listConvert', listConvert);
  }
  return (
    <div style={{ padding: '0px 10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '15px 0px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link to='/order'><LeftCircleOutlined style={{ marginRight: 8, fontSize: 20 }} /></Link>
          <h3 style={{ marginBottom: 0 }}>Select material for order</h3>
        </div>
        <div style={{ display: 'flex', }}>
          <Button
            style={{ marginRight: 6 }}
            type='primary' onClick={() => {
            const id = mongoObjectId();
            setDataSource([
              ...dataSource,
              {
                id,
                key: id
              }
            ])
          }}>Add new Item Code</Button>
          <Button onClick={() => {
           initData()
          }}>Reload</Button>
        </div>
      </div>
      <Form form={form}>
        <TableCustom
          columns={columns}
          dataSource={dataSource}
          scroll={{
            x: width,
          }}
          expandable={{
            columnWidth: 100,
            columnTitle: 'preview',
            expandedRowRender: (record, index, indent, expanded) => <RenderDetail
              expanded={expanded} data={record}
              _handleSave={val => { }}
            />,
            // onExpand: _handleExpand,
            expandIcon: ({ expanded, onExpand, record }) =>
              expanded ? (
                <Button type='primary' onClick={e => _handleExpandItem(record, e)} >Close</Button>
              ) : (
                <Button onClick={e => _handleExpandItem(record, e)} >Preview</Button>
              )
          }}
          expandedRowKeys={expandedRowKeys}

        />
      </Form>
      <BtnTus>
        <h1>Order detail</h1>
        {/* <div><span style={{fontWeight:'bold'}}>Material in : </span> Delivered</div>
        <div><span style={{fontWeight:'bold'}}>Located : </span> Stored</div>
        <div><span style={{fontWeight:'bold'}}>In order request : </span> Being in 1 order</div>
        <div><span style={{fontWeight:'bold'}}>Material picked : </span> Pickup</div>
        <div><span style={{fontWeight:'bold'}}>Confirm out :</span> Exported</div>
        <div><span style={{fontWeight:'bold'}}>Confirm received : </span> The manufacturer has received the goods</div>
        <div><span style={{fontWeight:'bold'}}>Confirm in use : </span> The production has received the goods</div> */}
      </BtnTus>
    </div>)
}

export default App;

export const col = [
  {
    title: 'Item.Code',
    key: 'itemcode',
    dataIndex: 'itemcode',
    type: 'fixed',
    width: 310,
    fixed: 'left',
  },
  {
    type: 'typing',
    title: 'Qty Required',
    key: 'quantity_required',
    dataIndex: 'quantity_required',
    width: 120,
    fixed: 'left',
  },
  {
    title: 'Qty Issued',
    key: 'quantity_issued',
    dataIndex: 'quantity_issued',
    width: 110,
    fixed: 'left',
  },{
    // type: 'typing',
    title: 'Qty in factory', key: 'quantity_in_factory',
    dataIndex: 'quantity_in_factory',
    width: 120,
    fixed: 'left',
},
  {
    // type: 'typing',
    title: 'G.E.No.', key: 'ge_no',
    dataIndex: 'ge_no',
    width: 120,
    fixed: 'left',
  },
  {
    width: 200,
    title: 'Lot.No.',
    key: 'lot', dataIndex: 'lot',
    type: 'typing'
  },
  {
    title: ' Stock in Warehouse',
    key: 'stock_in_warehouse', dataIndex: 'stock_in_warehouse',
    width: 189,
    // type: 'typing'
  },
  {
    title: ' Opening Stock',
    width: 129,
    key: 'opening_stock', dataIndex: 'opening_stock',
    type: 'typing'
  },
  {
    width: 150,
    title: 'Invoice No.',
    key: 'invoice', dataIndex: 'invoice',
    type: 'typing'
  },
  {
    title: 'Product Category',
    key: 'product_category', dataIndex: 'product_category',
    width: 180,
    type: 'fixed',
    url: 'product',
    optionKey: 'product_category',
  },
  {
    title: 'Sub Category',
    // key: 'category',dataIndex: 'category',
    key: 'sub_category', dataIndex: 'sub_category',
    width: 180,
    type: 'fixed',
    url: 'category',
    optionKey: 'sub_category',
  },
  {
    title: 'Type',
    // key: 'Type',dataIndex: 'Type',
    key: 'type_name', dataIndex: 'type_name',
    type: 'fixed',
    width: 120,
    url: 'type',
    optionKey: 'type_name',
  },
  {
    title: 'Material Name Warehouse',
    // key: 'Material',dataIndex: 'Material',
    key: 'material_name', dataIndex: 'material_name',
    width: 250,
    // type: 'fixed',
    url: 'material',
    optionKey: 'material_name',
  },
  {
    title: 'Receiving Date',
    key: 'receiving_date', dataIndex: 'receiving_date',
    type: 'date',
    width: 140,
  },
  {
    width: 120,
    title: 'Artwork No.',
    key: 'artwork', dataIndex: 'artwork',
    type: 'typing'
  },
  {
    title: 'Lic. No.',
    key: 'lic', dataIndex: 'lic',
    width: 100,
    type: 'typing'
  },
  {
    title: 'Artwork Status',
    width: 140,
    key: 'artwork_status', dataIndex: 'artwork_status',
    type: 'typing'
  },
  {
    title: 'Mfg. Date',
    key: 'mfg_date', dataIndex: 'mfg_date',
    type: 'date',
    width: 139,
  },
  {
    title: 'Exp. Date',
    key: 'exp_date', dataIndex: 'exp_date',
    type: 'date',
    width: 139,
  },
  {
    title: 'Supplier Name',
    width: 139,
    key: 'supplier_name', dataIndex: 'supplier_name',
    type: 'typing'
  },
  {
    width: 109,
    title: 'Price',
    key: 'price', dataIndex: 'price',
    type: 'typing'
  },
  {
    title: 'Receivied Qty',
    width: 129,
    key: 'receivied_qty', dataIndex: 'receivied_qty',
    type: 'typing'
  },
  // {
  //   width: 109,
  //   title: 'Unit',
  //   key: 'unit', dataIndex: 'unit',
  //   type: 'typing'
  // },
  {
    width: 129,
    title: 'Cartons/Beans',
    key: 'cartons_beans', dataIndex: 'cartons_beans',
    type: 'typing'
  },
  {
    width: 109,
    title: 'Carton Size',
    key: 'carton_size', dataIndex: 'carton_size',
    type: 'typing'
  },
  {
    width: 109,
    title: 'Unit Type',
    key: 'unit_type', dataIndex: 'unit_type',
    type: 'typing'
  },
  {
    title: 'QC Status',
    key: 'qc_status', dataIndex: 'qc_status',
    width: 140,
    type: 'fixed',
    sortable: false,
    url: 'status',
    optionKey: 'status',
  },
  {
    title: 'QC.Passed No.',
    key: 'qc_passed', dataIndex: 'qc_passed',
    width: 150,
    type: 'typing'
  },
  {
    title: 'Sampled By QC',
    key: 'sampled_by_qc', dataIndex: 'sampled_by_qc',
    width: 139,
    type: 'typing'
  },
  {
    width: 169,
    title: 'Remarks',
    key: 'remarks', dataIndex: 'remarks',
    type: 'typing'
  },
  {
    width: 130,
    title: 'Temperature',
    key: 'temperature', dataIndex: 'temperature',
    type: 'typing'
  },
  {
    width: 50,
    title: '',
    key: 'action', dataIndex: 'action',
    fixed: 'right',
  },
]



export const TableCustom = styled(Table)`
    td.ant-table-cell {
    padding: 10px;
    }
`;



const RenderDetail = ({ data, _handleSave, expanded }) => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const queries = {
    materialId: data?.materialId,
    orderItemId: data?.orderItemId
  }
  const _requestData = async (dataRecord) => {
    try {
      setLoading(true);
      const { data } = await apiClientMongo.get(`box-material/order-item`, queries);
      const _data = data.sort((a, b) => {
        const [countA] = a.index_item.split('/')
        const [countB] = b.index_item.split('/')
        return countA - countB;
      })
      setDataSource(_data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      openNotificationWithIcon('error', "fetch data list box fail!")
    }
  }

  useEffect(() => {
    if (!expanded) return () => { };
    _requestData(data);

  }, [data, expanded])
  const [showDownload, setShowDownload] = useState(null);
  const _handleSubmit = (data) => {
    insertArr(KEY_STORE.item_code_list, [data]);
    setShowDownload(data)
  }

  const _handleOke = (listDataUpdate) => {
    const dataConvert = Object.values(listDataUpdate);
    const count = dataConvert.reduce((cal, cur) => cal + (+cur.receivied_qty), 0);
    const oldData = getItem(KEY_STORE.item_code_list) || [];
    const checkExit = oldData.find(i => (i.itemcode == data.itemcode && i.ge_no == data.ge_no));
    if (checkExit) {
      openNotificationWithIcon("error", `Please check you data item code ${data.itemcode}  and G.E.NO ${data.ge_no} already exit`);
      return 0;
    }

    if (count !== data) {
      Modal.confirm({
        title: 'Total Receivied Qty was update do you want to update and save ?',
        icon: <ExclamationCircleOutlined />,
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        async onOk() {
          _handleSubmit({
            ...data,
            receivied_qty: count,
            list_box: dataConvert
          })
        },
      })
    } else {
      _handleSubmit({
        ...data,
        receivied_qty: count,
        list_box: dataConvert
      })
    }

  }

  const _handleSaveAllBox = async (dataUpdate) => {
    try {
      await _handleSave(dataUpdate)
      _requestData(data)
      openNotificationWithIcon("success", `Update success`);

    } catch (err) {
      openNotificationWithIcon("error", `Update errors`);
    }
  }

  return (
    <CardCustom >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h3>List material in warehouse:</h3>
        <Button style={{ borderRadius: 5, marginRight:6, }} href={`${MONGO_SERVER}/box-material/order-item/export?materialId=${data?.materialId}&orderItemId=${data?.orderItemId}`} type="primary" icon={<DownloadOutlined />} >Download list item order</Button>
      </div>
      <div>
        {loading ? <Skeleton /> : <TablePreview
          queries={queries}
          input={dataSource}
          materialRequired={data}
          handleSaveAll={_handleSaveAllBox} />}
      </div>
      <Modal visible={!!showDownload} footer={null}>
        <h2>Material {_.get(showDownload, 'itemcode', '')} saved</h2>
        <h3>Please download file to print RFID code and continue</h3>
        <DownloadExcel data={_.get(showDownload, 'list_box', [])} element={<Button onClick={() => {
          setShowDownload(null)
        }} style={{}} type='primary'>Download file data RFID</Button>} />
      </Modal>

    </CardCustom>
  )

}