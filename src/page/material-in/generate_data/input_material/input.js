import React, { useEffect, useMemo, useState } from 'react';

import { GeneralHeader } from 'com/app_layout/general_header';
import {
  DropboxOutlined, FilterOutlined,
  DeleteOutlined,
  CloseCircleOutlined, ReloadOutlined, DeleteFilled, ExclamationCircleOutlined, FullscreenOutlined, SearchOutlined, LoadingOutlined, ConsoleSqlOutlined
} from '@ant-design/icons'
import { mongoObjectId } from 'page/material-in/generate_data';

// import 'react-base-table/styles.css
// import './App.scss'
import { Table, Button, Input, Popover, Select, AutoComplete, Checkbox, Modal, Tooltip, Skeleton, Pagination, DatePicker, Form, Card, InputNumber, Row } from 'antd';
import _, { clone, map } from 'lodash';
import { UseGetSize } from 'helper/hook/get_size';
// import { Header, Content, InputCus, SelectCus, selectS, AutoCompleteCus } from './styles';
import { openNotificationWithIcon } from 'helper/request/notification_antd';
import { masterDataSelector } from 'app_state/master';
import { useSelector } from 'react-redux';
import { createBoxes, createBundles, createMaterial, deleteEntry, findAllEntry, updateEntry } from './services';
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
import TablePreview from './index';
import { apiClientMongo } from 'helper/request/api_client_v1';
import { handleErr } from 'helper/request/handle_err_request';
const { Search } = Input;


const masterDataFake = {
  'PSM0097': {
    itemcode: 'PSM0097',
    material_name: '20 UL Capillary tube (50 EA/PK)',
    product_category: 'HIV',
    sub_category: 'HIV',
    type_name: 'Tube',
  },
  'PSM0098': {
    itemcode: 'PSM0098',
    material_name: 'Inner Box STANDARD Q  For HIV 1/2 Ab (5 test)',
    product_category: 'FIA',
    sub_category: 'HVC',
    type_name: 'Inner',

  }
}

const requiredData = [
  'itemcode', 'ge_no', 'lot',
  'cartons_bin', 'receivied_qty', 'carton_size',
]
const App = () => {
  const masterData = useSelector(masterDataSelector);
  // state
  const dataForm = React.useRef({});
  const [form] = Form.useForm();

  const { width, height } = UseGetSize();

  const [dataSource, setDataSource] = useState([]);

  const [listItemCode, setListItemCode] = useState({});

  useEffect(() => {
    apiClientMongo.get('/master/all-item')
      .then(({ data }) => {
        // console.log(_.keyBy(data, 'itemcode'), 'ddd00')
        setListItemCode(_.keyBy(data, 'itemcode'))
      })

  }, [])




  const _handleChangeItemCode = (dataRow, newVal) => {

    if (listItemCode[newVal]) {
      const rest = listItemCode[newVal];
      const dataUpdate = {
        ...dataRow,
      }

      const _data = _.pick(rest, [
        'itemcode',
        'material_name',
        'product_category',
        'sub_category',
        'type_name',
        'artwork_status',
        'unit_type',
        'supplier_name',
        // 'remarks',
        // 'ge_no',
        // 'invoice',
        // 'lot',
        // 'receivied_qty',
        // 'qc_status',
        // 'price',
        // 'receiving_date',
        // 'artwork',
        // 'mfg_date',
        // 'exp_date',
        // 'opening_stock',
        // 'carton_size',
        // 'cartons_beans',
        // 'qc_passed',
        // 'sampled_by_qc',
        // 'stock_in_warehouse',
        'temperature',
      ]);

      // use moment to format date fields
      const dateFields = ['receiving_date', 'mfg_date', 'exp_date',]
      dateFields.forEach(item => {
        if (_data[item]) {
          _data[item] = moment(_data[item])
        } else {
          delete _data[item]
        }
      })

      const dataUpdateForm = Object.keys(_data).map(key => {
        dataUpdate[key] = _data[key];

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

    } else {

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

  const _handleChangesampled_by_qc = (dataRow, sampled_by_qcVal) => {
    const sampled_by_qc = sampled_by_qcVal || 0;
    const id = dataRow.id;

    const totalReceived = form.getFieldValue(`receivied_qty**${id}`);
    const rest = totalReceived - sampled_by_qc;
    if (rest) {
      form.setFields([
        {
          name: `stock_in_warehouse**${id}`,
          value: Math.ceil(rest),
        }, {
          name: `sampled_by_qc**${id}`,
          value: sampled_by_qc,
        }
      ]);
    }
    // form.setFields([{
    //   name: `sampled_by_qc**${id}`,
    //   value: sampled_by_qc,
    // }]);


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
  // const valueDate = new Date()
  const dateFormat = 'YYYY/MM/DD';
  const columns = useMemo(() => {
    return col.map((i) => {
      const { type, dataIndex } = i;
      if (dataIndex === 'itemcode') {
        i.render = (text, record, index) => {
          if (_.isEmpty(listItemCode)) return <LoadingOutlined />
          return (


            <Form.Item style={{ margin: 0, padding: 0 }} name={`${dataIndex}**${record.id}`} label={null}>
              <AutoComplete
                style={{ minWidth: 100, width: '100%' }}
                options={Object.keys(listItemCode).map(i => ({ value: i }))}
                placeholder="Search for item code"
                filterOption={(inputValue, option) =>
                  option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                }
                onSelect={val => {
                  _handleChangeItemCode(record, val)
                  setExpandedRowKeys([]);
                }}
                onChange={val => {
                  setExpandedRowKeys([]);
                }}
              />
            </Form.Item>
          )
        }
      } else if (dataIndex === 'action') {
        i.render = (text, record, index) => {
          return (<DeleteOutlined style={{ marginLeft: 10, color: 'red' }} onClick={() => {
            setDataSource(dataSource.filter(i => i.id !== record.id))
          }} />)
        }
      }
      else if (dataIndex === 'receivied_qty') {
        i.render = (text, record, index) => {
          return (
            <Form.Item style={{ margin: 0, padding: 0 }} name={`${dataIndex}**${record.id}`} label={null}>
              <InputNumber onChange={e => {
                _handleChangeReciciedQTY(record, e)
                setExpandedRowKeys([]);
              }} />
            </Form.Item>
          )
        }
      }
      else if (dataIndex === 'opening_stock') {
        i.render = (text, record, index) => {
          return (
            <Form.Item style={{ margin: 0, padding: 0 }} name={`${dataIndex}**${record.id}`} label={null}>
              <InputNumber onChange={e => {
                setExpandedRowKeys([]);
              }} />
            </Form.Item>
          )
        }
      }
      else if (dataIndex === 'sampled_by_qc') {
        i.render = (text, record, index) => {
          return (
            <Form.Item style={{ margin: 0, padding: 0 }} name={`${dataIndex}**${record.id}`} label={null}>
              <InputNumber onChange={e => {
                _handleChangesampled_by_qc(record, e)
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
              <InputNumber onChange={e => {
                _handleChangeBin(record, e)
                setExpandedRowKeys([]);
              }} />
            </Form.Item>
          )
        }
      }
      // else if (dataIndex === 'temperature') {
      //   i.render = (text, record, index) => {
      //     return (
      //       <div style={{ display: 'flex' }}>
      //         <Form.Item style={{ margin: 0, padding: 0 }} name={`${dataIndex}**${record.id}`} label={null}>
      //           <InputNumber style={{ width: "70px" }} onChange={() => {
      //             setExpandedRowKeys([]);
      //           }} />
      //         </Form.Item>

      //         <Form.Item style={{ margin: 0, padding: 0 }} name={`${dataIndex}**${record.id}**type`} label={null}>
      //           <Select onChange={() => {
      //             setExpandedRowKeys([]);
      //           }}
      //             style={{ minWidth: 70, width: '50%' }}>
      //             {
      //               [{ name: '℃' }, { name: '°F' }].map((item) => <Select.Option
      //                 value={`${item.name}`}
      //                 key={`${item.name}`}
      //               >{item.name}</Select.Option>)
      //             }

      //           </Select>
      //         </Form.Item>
      //       </div>
      //     )
      //   }
      // }
      else if (type === 'typing') {
        i.render = (text, record, index) => {
          return (
            <Form.Item style={{ margin: 0, padding: 0 }} name={`${dataIndex}**${record.id}`} label={null}>
              <Input onChange={() => {

                setExpandedRowKeys([]);
              }} />
            </Form.Item>
          )
        }
      }
      else if (type === 'fixed') {
        let dataSelect = _.get(masterData, [dataIndex], [])
        i.render = (text, record, index) => {
          return (

            <Form.Item style={{ margin: 0, padding: 0 }} name={`${dataIndex}**${record.id}`} label={null}>
              {/* <Select onChange={() => {
                setExpandedRowKeys([]);
              }}
                style={{ minWidth: 100, width: '100%' }}>
                {
                  dataSelect.map((item) => <Select.Option
                    value={`${item.name}`}
                    key={`${item.name}`}
                  >{item.name}</Select.Option>)
                }
              </Select> */}

              <AutoComplete
                style={{ minWidth: 100, width: '100%' }}
                options={dataSelect.map(i => ({ value: i.name }))}
                placeholder="Typing for search"
                filterOption={(inputValue, option) =>
                  option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                }
                onSelect={val => {
                  setExpandedRowKeys([]);
                }}
                onChange={val => {
                  setExpandedRowKeys([]);
                }}
              />
            </Form.Item>
          )
        }

      } else if (type === 'date') {
        i.render = (text, record, index) => {
          return (
            <Form.Item style={{ margin: 0, padding: 0 }} name={`${dataIndex}**${record.id}`} label={null}>
              <DatePicker
                onChange={() => {
                  setExpandedRowKeys([]);
                }}

              />
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

      // if (currVal) {
      currentData[colItem.dataIndex] = currVal;
      // }
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
    const filtered = expandedRowKeys.filter(i => i.id === rowData.id)
    if (filtered.length === expandedRowKeys.length) {
      setExpandedRowKeys([...expandedRowKeys, rowData.id])
    } else {
      setExpandedRowKeys(filtered);
    }
  }

  useEffect(() => {
    const id = mongoObjectId();
    setDataSource([
      {
        id,
        key: id
      }
    ])
  }, [])

  const _handleSaveAll = () => {
    const listConvert = dataSource.map(i => syncData(i));
    console.log(dataSource, 'listConvert', listConvert);
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '15px 0px' }}>
        <h3>Generate data input</h3>
        <div style={{ display: 'flex', }}>
          <Button onClick={() => {
            const id = mongoObjectId();
            setDataSource([
              ...dataSource,
              {
                id,
                key: id
              }
            ])
          }}>Add new Item Code</Button>
          {/* <Button type='primary' onClick={_handleSaveAll}>Save All</Button> */}
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
            expandedRowRender: record => <RenderDetail data={record} onOk={() => {
              setDataSource(dataSource.filter(i => i.id !== record.id))
            }} />,
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
    </div>)
}

console.log(moment.unix('43899').format('YYYY-MM-DDTHH:mm:ss[Z]'));

export default App;

export const col = [

  {
    title: 'Item.Code',
    key: 'itemcode',
    dataIndex: 'itemcode',
    type: 'fixed',
    width: 130,
    fixed: 'left',
  },
  {
    type: 'typing',
    title: 'G.E.No.', key: 'ge_no',
    dataIndex: 'ge_no',
    width: 120,
    fixed: 'left',
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
    width: 140,
    url: 'type',
    optionKey: 'type_name',
  },
  {
    title: 'Material Name Warehouse',
    // key: 'Material',dataIndex: 'Material',
    key: 'material_name', dataIndex: 'material_name',
    width: 250,
    type: 'fixed',
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
    width: 150,
    title: 'Invoice No.',
    key: 'invoice', dataIndex: 'invoice',
    type: 'typing'
  },
  {
    width: 200,
    title: <span>Lot.No. <span style={{ color: 'red' }}>*</span></span>,
    key: 'lot', dataIndex: 'lot',
    type: 'typing'
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
    width: 260,
    key: 'supplier_name', dataIndex: 'supplier_name',
    type: 'fixed'
  },
  {
    width: 109,
    title: 'Price',
    key: 'price', dataIndex: 'price',
    type: 'typing'
  },
  {
    title: <span>Receivied Qty <span style={{ color: 'red' }}>*</span></span>,
    width: 132,
    key: 'receivied_qty', dataIndex: 'receivied_qty',
    type: 'typing'
  },
  {
    title: ' Opening Stock',
    width: 129,
    key: 'opening_stock', dataIndex: 'opening_stock',
    type: 'typing'
  },
  // {
  //   width: 109,
  //   title: 'Unit',
  //   key: 'unit', dataIndex: 'unit',
  //   type: 'typing'
  // },
  {
    width: 140,
    title: <span>Cartons/Beans <span style={{ color: 'red' }}>*</span></span>,
    key: 'cartons_beans', dataIndex: 'cartons_beans',
    type: 'typing'
  },
  {
    width: 117,
    title: <span>Carton Size <span style={{ color: 'red' }}>*</span></span>,
    key: 'carton_size', dataIndex: 'carton_size',
    type: 'typing'
  },
  {
    width: 109,
    title: 'Unit Type',
    key: 'unit_type', dataIndex: 'unit_type',
    type: 'fixed',
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
    title: ' Stock in Warehouse',
    key: 'stock_in_warehouse', dataIndex: 'stock_in_warehouse',
    width: 165,
    type: 'typing'
  },
  {
    width: 169,
    title: 'Remarks',
    key: 'remarks', dataIndex: 'remarks',
    type: 'typing'
  },
  {
    width: 160,
    title: 'Temperature',
    key: 'temperature', dataIndex: 'temperature',
    type: 'typing'
    // type: 'degree'
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



const RenderDetail = ({ data, onOk }) => {
  console.log('data', data);
  const [dataSource, setDataSource] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    const dataBody = {};

    col.map(item => {
      // if (item.dataIndex === 'receivied_qty') {
      //   dataBody[item.dataIndex] = +data.carton_size;
      // }
      // else 
      if (item.type === 'date' && data[item.dataIndex]) {
        dataBody[item.dataIndex] = moment(data[item.dataIndex]).format();
      } else if (item.type === 'number') {
        dataBody[item.dataIndex] = +data[item.dataIndex];
      } else {
        dataBody[item.dataIndex] = data[item.dataIndex]
      }
    });
    let leftItemCount = dataBody.receivied_qty;
    let stock_in_warehouse_Count = dataBody.stock_in_warehouse;
    // const numberOfBox = data.cartons_beans;
    const numberOfBox = Math.floor(data.cartons_beans);
    const newItem = new Array(numberOfBox)
      .fill(null)
      .reduce((cal, cur, index) => {
        const id = mongoObjectId()

        const receivied_qty = Math.min(leftItemCount, dataBody.carton_size);
        const stock_in_warehouse = Math.min(stock_in_warehouse_Count, dataBody.carton_size);

        leftItemCount = leftItemCount - receivied_qty;
        stock_in_warehouse_Count = stock_in_warehouse_Count - stock_in_warehouse;

        return {
          ...(cal || {}),
          [id]: {
            id,
            rfid: id,
            ...dataBody,
            receivied_qty,
            stock_in_warehouse,
            sampled_by_qc: index === numberOfBox - 1 ? dataBody.sampled_by_qc : 0,
            index_item: `${index + 1}/${numberOfBox}`
          }
        }
      }, {});
    setDataSource(newItem)

  }, [data])
  const [showDownload, setShowDownload] = useState(null);
  const _handleSubmit = async (material, listBox) => {
    try {
      setLoading(true);
      // const dataResult = await apiClientMongo.post('/material/bundle', data);
      // console.log('dataResult', dataResult)
      // insertArr(KEY_STORE.item_code_list, [data]);
      await createMaterial(material)
      const list = _.chunk(listBox, 100)
      for (const box100 of list) {
        await createBoxes(box100)
      }
      const { data } = await apiClientMongo.get(`box-material/material/${material.id}`, { limit: 10000 })
      setShowDownload(data.data)
      setLoading(false)
    } catch (err) {
      setLoading(false)

      console.log('ddddd', err)
    }
  }

  const _handleOke = (listDataUpdate) => {
    const dataConvert = Object.values(listDataUpdate)?.map(item => ({ ...item, material: data.id }));
    const count = dataConvert.reduce((cal, cur) => cal + (+cur.receivied_qty), 0);
    //FIXME: call api check ge_no, itemcode
    const oldData = getItem(KEY_STORE.item_code_list) || [];
    const checkExit = oldData.find(i => i.itemcode === data.itemcode && i.ge_no === data.ge_no);
    if (checkExit) {
      openNotificationWithIcon("error", `Please check you data item code ${data.itemcode}  and G.E.NO ${data.ge_no} exited`);
      return 0;
    }

    if (count !== data.receivied_qty) {
      Modal.confirm({
        title: `Total Receivied Qty was update do you want to update and save ? ${count} - ${data.receivied_qty}`,
        icon: <ExclamationCircleOutlined />,
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        async onOk() {
          _handleSubmit(
            {
              ...data,
              receivied_qty: count,
              stock_in_warehouse: count,
            },
            dataConvert
          )
            .catch(err => handleErr(err))
        },
      })
    } else {
      _handleSubmit(data, dataConvert)
        .catch(err => handleErr(err))
    }

  }

  return (
    <CardCustom loading={loading} >
      <div>
        <TablePreview input={dataSource} onOk={_handleOke} notDownload />
      </div>
      <Modal visible={!!showDownload} footer={null}>
        <h2>Material saved</h2>
        <h3>Please download file to print RFID code and continue</h3>
        <DownloadExcel data={showDownload} element={<Button onClick={() => {
          setShowDownload(null);
          onOk()
        }} style={{}} type='primary'>Download file data RFID</Button>} />
      </Modal>

    </CardCustom>
  )

}