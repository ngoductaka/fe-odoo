import React, { useEffect, useMemo, useState } from 'react';

import { GeneralHeader } from 'com/app_layout/general_header';
import {
  DropboxOutlined, FilterOutlined,
  DownOutlined, CheckCircleFilled,
  CloseCircleOutlined, ReloadOutlined, DeleteFilled, ExclamationCircleOutlined, FullscreenOutlined, SearchOutlined, LoadingOutlined, EditFilled, DeleteOutlined, DownloadOutlined
} from '@ant-design/icons'
import {
  Input, Modal, Tabs, Form, Skeleton, Button, Popover, Dropdown, Space,
  Menu, Select, AutoComplete, Checkbox, Tooltip, Pagination, DatePicker, Popconfirm, Drawer
} from 'antd';

import Table, { Column } from 'react-base-table'
import 'react-base-table/styles.css'
import './App.scss'
import _, { clone } from 'lodash';
import { UseGetSize } from 'helper/hook/get_size';
import { Header, Content, InputCus, SelectCus, selectS, AutoCompleteCus } from './styles';
import { openNotificationWithIcon } from 'helper/request/notification_antd';
import { masterDataSelector } from 'app_state/master';
import { useSelector } from 'react-redux';
import { deleteEntry, findAllEntry, updateBoxItem, updateEntry } from './services';
import { masterService } from 'app_state/services';
import StockMap from 'page/stock_layout'
import { apiClient } from 'helper/request/api_client';
import BtnDownload from 'com/BtnDownload';
import moment from 'moment';
import { getItem, insertObj, setItem, upsertOne, delOne } from 'helper/local_storage/storage';
import { KEY_STORE } from 'helper/local_storage/key';
import { ModalEditMul } from './com/edit_muiltiple';
import { mongoObjectId } from 'page/material-in/generate_data';
import Download from 'com/excel/gen_excel';
import { apiClientMongo } from 'helper/request/api_client_v1';
import { handleErr } from 'helper/request/handle_err_request';
import { convert2StringQuery } from 'helper/convert_data/to_string_query';
import { MONGO_SERVER } from '_config/constant';

import ModalFormDetail from './com/detail_modal'
import { BtnTus } from 'com/btn_tutorial';
// import { requestEdit } from './state/table';


const { Search } = Input;

const App = ({ input, handleSaveAll, handleReload, pageInfo = {}, handleReloadMaterial = () => { } }) => {
  const masterData = useSelector(masterDataSelector);
  // state
  const dataForm = React.useRef({});
  const { width, height } = UseGetSize();
  const [filter, setFilter] = useState({});
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(false)

  const [isRefetch, setIsRefetch] = useState(true)
  const [showStockMap, setShowStockMap] = useState(false)
  const [showFormUpdate, setShowFormUpdate] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [editMul, setEditMul] = useState(null);
  const [duplicateData, setDuplicateData] = useState(null);

  // const _handleUpdate = (body) => requestEdit(body, () => _requestData(), () => setShowFormUpdate(false))

  const [select, setSelect] = useState({});
  // 
  const [dataSource, setDataSource] = useState([]);

  const _handleSelect = (key, val) => {
    setSelect(pre => ({
      ...pre,
      [key]: val,
    }))
  }

  const handleDelete = async (id) => {
    Modal.confirm({
      title: 'Are you sure to delete this task?',
      icon: <ExclamationCircleOutlined />,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      async onOk() {
        try {
          await apiClientMongo.delete(`/box-material`, { id });
          handleReload()
          handleReloadMaterial();
          openNotificationWithIcon('success', "Delete item material success")
        } catch (err) {
          handleErr(err);
        }
      },
      onCancel() { },
    });
  }
  const _handleChangeFile = (key, val) => {
    if (dataForm.current && key) {
      const [id, col] = key.split('**');
      _.set(dataForm.current, [id, col], val)
    }
  };

  const _handleSubmit = async (dataRow) => {
    try {
      const data = _.get(dataForm, ['current', dataRow.id], {}) || {};
      const dataPost = {
        ...dataRow,
        ...data
      };
      insertObj(KEY_STORE.material, {
        [dataPost.ge_no]: dataPost,
      })

      // await updateEntry(dataPost)
      // // await
      // setIsRefetch(true)
      openNotificationWithIcon('success', 'Update success!')
    } catch (error) {
      openNotificationWithIcon('error', error?.message);
    }
  }
  const cellRendererTextInput = React.useCallback(({ cellData, rowData, column }) => {
    return <InputCus
      key={`${rowData.id}_${column.dataKey}_text`}
      defaultValue={cellData}
      onChange={val => {
        _handleChangeFile(`${rowData.id}**${column.dataKey}`, val.target.value)
      }}
    />
  }, []);
  const cellRendererSelect = React.useCallback(({ cellData, rowData, column }) => {
    return <SelectCus
      key={`${rowData.id}_${column.dataKey}_select`}
      style={selectS}
      defaultValue={cellData}
      onChange={val => _handleChangeFile(`${rowData.id}**${column.dataKey}`, val)}
    >
      {_.get(masterData, [column.optionKey], [])
        .map((item) => <Select.Option
          // convert id to string
          value={`${item.name}`}
          key={`${item.name}`}
        >{item.name}</Select.Option>)
      }
    </SelectCus>
  }, [masterData]);

  const _searchItem = (key, val, oldFilter) => {
    const { limit } = pageInfo;
    const oldQuery = oldFilter || filter;
    const newFilter = removeEmpty({
      ...oldQuery,
      [key]: val,
    })
    _getDataWareHouse({
      ...newFilter,
      limit,
      skip: 1,
    });

    setFilter(newFilter)
  }

  const _searchObj = (updateFilter, oldFilter) => {
    const { limit } = pageInfo;
    const oldQuery = oldFilter || filter;
    const newFilter = removeEmpty({
      ...oldQuery,
      ...updateFilter,
    })
    _getDataWareHouse({
      ...newFilter,
      limit,
      skip: 1,
    });

    setFilter(newFilter)
  }

  const RenderDateCell = ({ cellData, rowData, column }) => {
    try {
      let initData = null;
      if (cellData) {
        initData = moment(cellData);
      } else {
        return "N/A"
      }
      return <DatePicker defaultValue={initData} onChange={(val) => {
        console.log('val', val)
        _handleChangeFile(`${rowData.id}**${column.dataKey}`, val)
      }} />
    } catch (err) {
      console.log(err, 'errr', column.dataKey)
      return <DatePicker onChange={(val) => {
        console.log('val', val)
        _handleChangeFile(`${rowData.id}**${column.dataKey}`, val)
      }} />
    }
  }

  //  =================================
  const columns = React.useMemo(() => {
    const normalRow = col.map(item => {
      const { title, dataKey, type, ...rest } = item;
      // handle render 
      const _renderCell = (type) => {
        if (dataKey === 'invoice') {
          return ({ cellData, rowData, column }) => {
            return <div style={{ display: 'flex', alignItems: 'center' }}>
              {cellRendererTextInput({ cellData, rowData, column })}
            </div>
          }
        }
        if (type === 'typing') {
          return cellRendererTextInput
        } else if (type === 'autoComplete') {
          return (props) => <CellRenderAutoComplete
            cellData={props.cellData} rowData={props.rowData} column={props.column}
            _handleChangeFile={_handleChangeFile} setShowStockMap={setShowStockMap}
            locations={locations}
          />
        } else if (type === 'fixed') {
          return cellRendererSelect;
        } else if (type === 'date') {
          return RenderDateCell;
        } else {
          return ({ cellData }) => <span>{cellData}</span>
        }
      }

      const _renderHeader = item => {
        if (item.dataKey === 'receiving_date') {
          return ({ column }) => (<div key={column.dataKey} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'
          }}>
            <span>{title}</span>
            <Popover title={null} content={
              <DatePicker.RangePicker onChange={(rangeDate) => {
                _searchObj({
                  receiving_date_from: rangeDate[0],
                  receiving_date_to: rangeDate[1],
                }, column?.filter)
              }} />
            } trigger="click">
              <FilterOutlined />
            </Popover>
          </div>);
          // return Range
        }
        return ({ column }) => (<div key={column.dataKey} style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'
        }}>
          <span>{title}</span>
          <Popover title={null} content={<HeaderSearch
            dataKey={column.dataKey}
            dataOptions={_.get(masterData, [column.optionKey], []).map(i => ({ value: _.get(i, 'name', '') }))}
            type={type}
            _searchItem={(key, val) => _searchItem(key, val, column?.filter)} />
          } trigger="click">
            <FilterOutlined />
          </Popover>
        </div>)
      }
      return {
        key: dataKey, title, dataKey, width: 120, resizable: true, sortable: false,
        filter,
        cellRenderer: _renderCell(type),
        headerRenderer: _renderHeader(item),
        ...rest
      }
    })
    return [
      // {
      //   key: 'id', title: 'G.E.No.', dataKey: 'ge_no', width: 130, resizable: true, sortable: true,
      //   frozen: Column.FrozenDirection.LEFT,
      //   cellRenderer: ({ cellData, rowData }) => {
      //     return <div style={{ display: 'flex' }}>
      //       <div style={{ marginLeft: 3 }}>{cellData}</div></div>
      //   }
      // },
      ...normalRow,
    ]
  }, [cellRendererSelect, dataSource, masterData, filter]);

  const _getDataWareHouse = async (filter) => {
    try {

      setDataSource(input);
      // setLoading(false)
    } catch (err) {
      handleErr(err)
    }
  }
  const handleAddKeySelect = (oldList, newItem) => {
    const newList = oldList.filter(i => i !== newItem)
    if (newList.length === oldList.length) {
      return oldList.concat(newItem);
    } else {
      return newList;
    }
  }

  const selectRow = {
    key: '__selection__', width: 40, align: Column.Alignment.CENTER, frozen: Column.FrozenDirection.LEFT,
    cellRenderer: ({ rowData, column }) => {
      const { selectedRowKeys } = column;
      return (<Checkbox
        checked={selectedRowKeys === 'all' ? true :
          selectedRowKeys.includes(rowData.id)}
        onChange={e => setSelectedRowKeys(handleAddKeySelect(selectedRowKeys, rowData.id))} />)
    },
    selectedRowKeys: selectedRowKeys,
    headerRenderer: ({ rowData, column }) => {
      const { selectedRowKeys } = column;
      const onChange = () => {
        if (!_.isEmpty(selectedRowKeys)) {
          setSelectedRowKeys([])
        } else {
          setSelectedRowKeys(dataSource.map(i => i.id))
        }
      }
      return (
        <Checkbox checked={selectedRowKeys.length === dataSource.length} onChange={onChange} />
      )
    }
  };

  const _openHandleEditMul = (dataRow) => {
    setEditMul(dataRow);
  }
  //   const _handleDownload = (filterData,rowData) => {
  //     console.log("Trang",rowData);
  //     const queryString = convert2StringQuery(filterData);
  //     // return 1;
  //     // BASE_URL.DOWNLOAD
  //     const link = document.createElement('a');
  //     // box-material/export?material=63a18506df72639352f871cd
  //     link.href = `${MONGO_SERVER}/box-material/export?material=63a18506df72639352f871cd&${queryString}?${moment().valueOf()}`;
  //     console.log(link.href)
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  // }

  const _handleDuplicate = (dataRow, dataSource) => {
    // console.log("Dataaaaaa",dataRow);
    Modal.confirm(
      {
        title: 'Duplicate data?',
        content: 'This action will duplicate material please make sure you update both item and save data',
        icon: <ExclamationCircleOutlined />,
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        closable: true,
        async onOk() {
          try {
            const countOldBox = Math.floor(dataRow.stock_in_warehouse / 2)
            const oldBox = {
              ...dataRow,
              stock_in_warehouse: +countOldBox,
            }
            const id = mongoObjectId();
            const newBoxData = {
              ...dataRow,
              stock_in_warehouse: Number(dataRow.stock_in_warehouse) - Number(countOldBox),
              index_item: dataRow.index_item + '#',

              _id: id,
              id: id,
            }
            await apiClientMongo.patch(`/box-material`, oldBox);
            await apiClientMongo.post(`/box-material`, [newBoxData]);
            const { data: dataBox } = await apiClientMongo.get(`/box-material/details/${id}`)
            console.log('dataBox', dataBox);
            Modal.success({
              title: 'Separate the package success please download data for new box',
              icon: <CheckCircleFilled />,
              content: <div><Download data={[dataBox]} element={
                <Button type='primary' onClick={() => {
                  if (handleReload) handleReload()
                  Modal.destroyAll()
                }}>
                  Download Data new box
                </Button>
              } /></div>,
              footer: null,
            })

          } catch (error) {
            openNotificationWithIcon('error', error?.message);
          }
        },
      })

  }

  const _handleUpdate = async (rowData) => {
    try {
      await updateBoxItem(rowData)
      handleReload();
      handleReloadMaterial();
      openNotificationWithIcon('success', 'Update successfully!')
    } catch (error) {
      openNotificationWithIcon('error', error?.message);
    }
  }
  const columnsCal = [
    // selectRow,
    ...columns,
    {
      key: 'action', width: 100, align: Column.Alignment.CENTER, frozen: Column.FrozenDirection.RIGHT,
      dataSource,
      cellRenderer: ({ rowData }) => {
        if (rowData.isDuplicate) return <Download data={[rowData]} element={
          <div onClick={() => delete rowData.isDuplicate} style={{ background: 'red', borderRadius: 5, fontWeight: 'bold', color: '#fff' }}>
            Download Data
          </div>
        } />
        return (
          <Dropdown
            trigger={'click'}
            overlay={
              <div style={{ border: '1px solid #ccc', borderRadius: 5 }}>
                {rowData.rfid_code}
                <Menu>
                  {/* <Menu.Item onClick={() => { }}>Delete</Menu.Item> */}
                  {/* <Menu.Item onClick={() => _openHandleEditMul(rowData)}>Edit multiple</Menu.Item> */}
                  {/* <Popconfirm onConfirm={() => _handleDelete(rowData)} title="It will remove detail material box？" okText="Yes" cancelText="No">
                    <DeleteOutlined style={{ color: 'red', marginLeft:'10px' }} />
                  </Popconfirm> */}

                  <Menu.Item>
                    <Button style={{ borderRadius: 5, width: "100%" }} type='primary' onClick={() => _handleDuplicate(rowData, dataSource)}>Duplicate Data Row</Button>
                  </Menu.Item>
                  <Menu.Item>
                    <Button style={{ borderRadius: 5, width: "100%" }} onClick={() => setShowFormUpdate({ data: rowData })}>Update Row</Button>
                  </Menu.Item>
                  <Menu.Item>
                    <Button style={{ borderRadius: 5, width: "100%" }} type='primary' danger onClick={() => handleDelete(rowData.id)}>Delete Row</Button>
                  </Menu.Item>
                </Menu>


              </div>
            }>
            <Button type="link" style={{ borderRadius: 5 }}>
              Action <DownOutlined />
            </Button>
          </Dropdown>

          // <Button type='primary' onClick={() => _handleSubmit(rowData)}>Action </Button>
        )
      },
      headerRenderer: () => "Action"
    }
  ]
  const handleChooseLocation = (value) => {
    // dataSource.map(item => {
    //   if (item.id == showStockMap.id && value) {
    //     item.location = value.name;
    //     document.getElementById(`location-id-${item.id}-location`).value = value.name;
    //     _handleChangeFile(`${item.id}**location`, value.name);
    //   }
    //   return item;
    // })
    setDataSource([...dataSource]);
    setShowStockMap(false)
    handleReload()
  }
  // filter 

  // ==== pagination
  const _handlePageChange = (page) => {
    handleReload({ ...pageInfo, page })
  }
  // =============== useEffect ======== ======================


  useEffect(() => {
    let limit = 15;
    if (height) {
      limit = Math.floor(((height - 120) / 50))
    }
    _getDataWareHouse({ ...pageInfo, limit });
    masterService
      .findAllLocation()
      .then((res) => {
        const data = res.data?.data
        const locations = Object
          .keys(data)
          .reduce((total, currentValue) => [...total, ...data[currentValue]], [])
          .filter((item) => item.status !== 'unavailable')
          .map(item => ({ value: item.name }));

        setLocations(locations)
      })
      .catch(error => setLocations([]))
      .finally(() => setLoading(false))

  }, []);

  const _removeSelectedItem = () => {
    try {
      const listMaterial = getItem(KEY_STORE.material);
      const listItemOut = {};

      const newData = Object.keys(listMaterial).reduce((cal, cur) => {
        if (selectedRowKeys.includes(cur)) {
          listItemOut[cur] = listMaterial[cur];
          return cal
        }
        return {
          ...cal,
          [cur]: listMaterial[cur],
        }
      }, {});
      setItem(KEY_STORE.material, newData);
      // setItem(KEY_STORE.out_stock_material, newData);
      _getDataWareHouse();
      openNotificationWithIcon("success", "Delete materials success!");
    } catch (err) {
      openNotificationWithIcon('error', "Have some errors here")
    }
  }

  const _handleSaveAll = async () => {
    try {
      const dataUpdate = _.get(dataForm, ['current'], []) || [];
      handleSaveAll(dataUpdate)
    } catch (error) {
      openNotificationWithIcon('error', error?.message);
    }
  }

  const count = useMemo(() => {
    if (!_.isEmpty(dataSource) && !_.isEmpty(selectedRowKeys)) {
      const data = dataSource.filter(i => selectedRowKeys.includes(i.id));
      const total = data.reduce((cal, cur) => cal + (+cur.receivied_qty), 0)
      return {
        total,
        box_count: data.length
      }

    }

  }, [selectedRowKeys, dataSource])

  return (
    <div>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        padding: 10, alignItems: 'center'
      }}>
        <div>
          <h3>List material box:</h3>
          {/* {count?.total ? <Button onClick={() => setStockOut(true)}>
            Set {count?.box_count} (box) {count?.total} (item) in Order (stock out)
          </Button> : null} */}
        </div>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div>
            { }
          </div>
          {/* <Dropdown
            trigger={'click'}
            overlay={
              <div style={{ border: '1px solid #ccc', borderRadius: 5 }}>
                <Menu>
                  <Menu.Item
                    onClick={() => {
                      Modal.confirm({
                        closable: true,
                        title: 'Confirm delete ?',
                        icon: <ExclamationCircleOutlined />,
                        onOk: _removeSelectedItem
                      });

                    }}
                  >Delete selected item</Menu.Item>
                </Menu>
              </div>
            }>
            <Button style={{ borderRadius: 5 }}>
              <Space>
                Action for {selectedRowKeys.length} Item selected
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown> */}
          {input?.[0]
            && <Button
              href={`${MONGO_SERVER}/box-material/export?material=${input[0]?.material}`}
              icon={<DownloadOutlined />}
              style={{ borderRadius: 5, marginLeft: 8 }}
              type="primary"
            >
              Download material box
            </Button>
          }
          <Button type='primary' style={{ borderRadius: 5, marginLeft: 8 }} onClick={_handleSaveAll}>Save Data</Button>
        </div>
      </div>
      <Content>
        {_.get(dataSource, [0]) ?
          <Table fixed style={{ margin: 'auto' }} key={'2'} width={width - 54} height={height - 170} data={dataSource} columns={columnsCal} /> :
          <Table fixed style={{ margin: 'auto' }} key={'1'} width={width - 54} height={height - 170} columns={columnsCal} data={[]}
            emptyRenderer={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
              <DropboxOutlined style={{ fontSize: 60, margin: '30px 0px 10px 0px', color: '#999' }} />
              <div>No data</div>
            </div>}
          />}
      </Content>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 15, zIndex: 10, padding: '0px 10px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {/* <BtnDownload text={'Download Excel file'} params={filter} url="master/export" /> */}
          {Object.keys(filter).map(i => {
            return (
              <div onClick={() => _searchItem(i, '')} style={{
                margin: '0px 5px', display: 'flex', alignItems: 'center', position: 'relative',
                borderRadius: 5, border: '1px solid: #ddd', background: '#eee', padding: '1px 9px'
              }}>
                <span style={{ textTransform: 'capitalize' }}>
                  {i} = {filter[i]}
                </span>
                <CloseCircleOutlined onClick={() => _searchItem(i, '')} style={{ marginLeft: 5, color: 'red' }} />
              </div>)
          })}
        </div>

        <Pagination
          current={+pageInfo.current} onChange={_handlePageChange}
          pageSize={+pageInfo.limit}
          total={+pageInfo.total || 10} />
      </div>
      {loading ? <div style={{
        position: 'fixed', top: 60, left: 0, right: 0, bottom: 50,
        background: 'rgba(0,0,0,0.1)',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        flexDirection: 'column'
      }}>
        <div>
          <LoadingOutlined style={{ fontSize: '10vh', height: '10vh', marginBottom: 10 }} />
        </div>
        loading...
      </div> : null
      }

      {/* modal */}
      <Modal
        width="100%"
        style={{ top: 36 }}
        title={"Select location for " + _.get(showStockMap, 'ge_no', '')}
        visible={!!showStockMap}
        footer={false}
        onCancel={() => setShowStockMap(false)}
      >
        <div style={{ height: "82vh", overflow: 'scroll' }}>
          <StockMap show={new Date()} handleClickCell={handleChooseLocation} />
        </div>
      </Modal>
      <ModalFormDetail
        visible={showFormUpdate}
        // jsonFormInput={formEdit}
        jsonFormInput={transformFormEdit(masterData)}
        _onClose={() => setShowFormUpdate(false)}
        _onSubmit={_handleUpdate}
      />

      <ModalEditMul data={editMul}
        onOk={() => {
          _getDataWareHouse();
          setEditMul(null);
          window.location.reload()
        }}
        onCancel={() => setEditMul(null)} />


      <BtnTus>
        <h4>Warehouse status</h4>
        <div><span style={{ fontWeight: 'bold' }}>Material in : </span> Delivered</div>
        <div><span style={{ fontWeight: 'bold' }}>Located : </span> Stored</div>
        <div><span style={{ fontWeight: 'bold' }}>In order request : </span> Being in 1 order</div>
        <div><span style={{ fontWeight: 'bold' }}>Material picked : </span> Pickup</div>
        <div><span style={{ fontWeight: 'bold' }}>Confirm out :</span> Exported</div>
        <div><span style={{ fontWeight: 'bold' }}>Confirm received : </span> The manufacturer has received the goods</div>
        <div><span style={{ fontWeight: 'bold' }}>Confirm in use : </span> The production has received the goods</div>
      </BtnTus>
    </div>
  )
}

export default App;
// 
export const col = [
  {
    title: 'Item.Code',
    dataKey: 'itemcode',
    // type: 'typing',
    width: 120,
    frozen: Column.FrozenDirection.LEFT,
    url: 'itemcode',
  },
  {
    title: 'Product Category',
    dataKey: 'product_category',
    width: 180,
    type: 'fixed',
    url: 'product',
    optionKey: 'product_category',
  },
  {
    title: 'Sub Category',
    // dataKey: 'category',
    dataKey: 'sub_category',
    type: 'fixed',
    url: 'category',
    optionKey: 'sub_category',
  },
  {
    title: 'Type',
    // dataKey: 'Type',
    dataKey: 'type_name',
    type: 'fixed',
    url: 'type',
    optionKey: 'type_name',
  },
  {
    title: 'Material Name Warehouse',
    // dataKey: 'Material',
    dataKey: 'material_name',
    width: 200,
    type: 'fixed',
    url: 'material',
    optionKey: 'material_name',
  },
  {
    title: 'Receiving Date',
    dataKey: 'receiving_date',
    type: 'date',
    width: 130,
  },
  {
    title: 'Invoice No.',
    dataKey: 'invoice',
    type: 'typing'
  },
  {
    title: 'Lot.No.',
    dataKey: 'lot',
    type: 'typing'
  },
  {
    title: 'Artwork No.',
    dataKey: 'artwork',
    type: 'typing'
  },
  {
    title: 'Lic. No.',
    dataKey: 'lic',
    type: 'typing'
  },
  {
    title: 'Artwork Status',
    width: 140,
    dataKey: 'artwork_status',
    type: 'typing'
  },
  {
    title: 'Mfg. Date',
    dataKey: 'mfg_date',
    type: 'date',
    width: 130,
  },
  {
    title: 'Exp. Date',
    dataKey: 'exp_date',
    type: 'date',
    width: 130,
  },
  {
    title: 'Supplier Name',
    width: 130,
    dataKey: 'supplier_name',
    type: 'typing'
  },
  {
    title: 'Price',
    dataKey: 'price',
    type: 'typing'
  },
  {
    title: 'Receivied Qty',
    width: 120,
    dataKey: 'receivied_qty',
    type: 'typing'
  },
  {
    title: ' Opening Stock',
    width: 120,
    dataKey: 'opening_stock',
    type: 'typing'
  },
  // {
  //   title: 'Unit',
  //   dataKey: 'unit',
  //   type: 'typing'
  // },
  {
    title: 'Carton Size',
    dataKey: 'carton_size',
    type: 'typing'
  },
  {
    title: 'Cartons/Beans',
    dataKey: 'cartons_beans',
    type: 'typing'
  },
  {
    title: 'Unit Type',
    dataKey: 'unit_type',
    type: 'typing'
  },
  {
    title: 'QC Status',
    dataKey: 'qc_status',
    width: 100,
    type: 'fixed',
    sortable: false,
    url: 'status',
    optionKey: 'status',
  },
  {
    title: 'QC.Passed No.',
    dataKey: 'qc_passed',
    width: 130,
    type: 'typing'
  },
  {
    title: 'Sampled By QC',
    dataKey: 'sampled_by_qc',
    width: 130,
    type: 'typing'
  },
  {
    title: ' Stock in Warehouse',
    dataKey: 'stock_in_warehouse',
    width: 160,
    type: 'typing'
  },
  // {
  //   title: 'Total Amount',
  //   dataKey: 'total',
  //   type: 'typing',
  //   width: 160
  // },
  {
    title: 'Remarks',
    dataKey: 'remarks',
    type: 'typing'
  },
  {
    title: 'Temperature',
    dataKey: 'temperature',
    type: 'typing'
  },
  {
    title: 'Location',
    dataKey: 'location',
    type: 'autoComplete',
    width: 130
  },
  {
    title: 'Warehouse status',
    dataKey: 'warehouse_status',
    width: 130
  },
  {
    title: 'index_item',
    dataKey: 'index_item',
    // type: 'autoComplete',
    width: 130
  },
]

const formEdit = [

  {
    label: 'Item.Code',
    name: 'itemcode',
    disabled: true,
  },
  {
    label: 'Warehouse status',
    name: 'warehouse_status',
    type: 'select',
  },
  {
    label: 'QC Status',
    name: 'qc_status',
    type: 'select'
  },
  {
    label: ' Stock in Warehouse',
    name: 'stock_in_warehouse',
    type: 'number'
  },
  {
    label: 'Product Category',
    name: 'product_category',
    type: 'select',
    disabled: true,
  },
  {
    label: 'Sub Category',
    name: 'sub_category',
    type: 'select',
    disabled: true,
  },
  {
    label: 'Type',
    name: 'type_name',
    type: 'select',
    disabled: true,
  },
  {
    label: 'Material Name Warehouse',
    name: 'material_name',
    // type: 'select',
    disabled: true,
  },
  {
    label: 'Receiving Date',
    name: 'receiving_date',
    type: 'date',
    disabled: true,
  },
  {
    label: 'Invoice No.',
    name: 'invoice',
    // type: 'typing'
    disabled: true,
  },
  {
    label: 'Lot.No.',
    name: 'lot',
    // type: 'typing'
    disabled: true,
  },
  {
    label: 'Artwork No.',
    name: 'artwork',
    // type: 'typing'
    disabled: true,
  },
  {
    label: 'Lic. No.',
    name: 'lic',
    // type: 'typing'
    disabled: true,
  },
  {
    label: 'Artwork Status',
    name: 'artwork_status',
    // type: 'typing'
    disabled: true,
  },
  {
    label: 'Mfg. Date',
    name: 'mfg_date',
    type: 'date',
    disabled: true,
  },
  {
    label: 'Exp. Date',
    name: 'exp_date',
    type: 'date',
    disabled: true,
  },
  {
    label: 'Supplier Name',
    name: 'supplier_name',
    // type: 'typing'
    disabled: true,
  },
  {
    label: 'Price',
    name: 'price',
    // type: 'typing'
    disabled: true,
  },
  {
    label: 'Receivied Qty',
    name: 'receivied_qty',
    // type: 'typing'
    disabled: true,
  },
  {
    label: ' Opening Stock',
    name: 'opening_stock',
    // type: 'typing'
    disabled: true,
  },
  {
    label: 'Carton Size',
    name: 'carton_size',
    // type: 'typing'
    disabled: true,
  },
  {
    label: 'Cartons/Beans',
    name: 'cartons_beans',
    // type: 'typing'
    disabled: true,
  },
  {
    label: 'Unit Type',
    name: 'unit_type',
    // type: 'typing'
    disabled: true,
  },

  {
    label: 'QC.Passed No.',
    name: 'qc_passed',
    // type: 'typing'
    disabled: true,
  },
  {
    label: 'Sampled By QC',
    name: 'sampled_by_qc',
    // type: 'typing'
    disabled: true,
  },
  {
    label: 'Remarks',
    name: 'remarks',
    // type: 'typing'
    disabled: true,
  },
  {
    label: 'Temperature',
    name: 'temperature',
    // type: 'typing'
    disabled: true,
  },
  {
    label: 'Location',
    name: 'location',
    // type: 'autoComplete',
    disabled: true,
  },
]

const transformFormEdit = (selectData = {}) =>
  formEdit.map(item => {
    if (item.type == 'select') {
      const data = _.get(selectData, [item.name], [])

      return {
        ...item,
        data: data.map(item => ({ id: item.name, name: item.name }))
      }
    }

    return item
  })

const CellRenderAutoComplete = React.memo(({ cellData, rowData, column, locations, _handleChangeFile, setShowStockMap }) => {
  const [text, setText] = useState('')
  useEffect(() => {
    if (cellData) setText(cellData)
  }, [cellData])

  const fieldKey = `${rowData.id}**${column.dataKey}`
  return (
    <>
      <AutoCompleteCus
        id={`location-id-${rowData.id}-${column.dataKey}`}
        key={`${rowData.id}_${column.dataKey}_auto_complete`}
        defaultValue={cellData}
        style={{ width: 200 }}
        onChange={val => {
          _handleChangeFile(fieldKey, val)
          setText(val)
        }}
        value={text}
        options={locations}
        filterOption={(inputValue, option) =>
          option?.value?.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
        }
      />
      <div style={{ marginLeft: 6 }} />
      <Tooltip title='Show map layout' placement='bottomRight'>
        <Button
          onClick={() => {
            setShowStockMap(rowData)
          }}
          shape='circle'
          icon={<FullscreenOutlined />}
          type='primary'
          size='small'
        />
      </Tooltip>
    </>
  )
});


const HeaderSearch = ({ type, _searchItem, dataOptions, dataKey }) => {
  const [value, setValue] = useState('');
  const [options, setOptions] = useState(dataOptions);

  const onChange = val => {
    try {
      if (!_.isEmpty(dataOptions)) {
        setOptions(dataOptions.filter(i => i?.value?.toLowerCase().includes(val?.toLowerCase())));
      }
    } catch (err) {
      console.log('dddd', err)
    }
    setValue(val);
  }

  if (type === 'fixed') {
    return (
      <div>
        <AutoComplete
          allowClear
          options={options}
          style={{ width: 200 }}
          onSelect={val => _searchItem(dataKey, val)}
          onChange={onChange}

          placeholder="Type to search"
        />
        <Button onClick={() => _searchItem(dataKey, value)} icon={<SearchOutlined />} />
      </div>
    )
  }

  return (
    <Search
      allowClear
      style={{ width: 200 }}
      // onPressEnter={e => console.log(';;;', e)}
      onSearch={val => _searchItem(dataKey, val)}
      placeholder="Type to search"
    />
  )
}


const removeEmpty = (obj, filterVal = [null, undefined, '']) => {
  try {
    return Object.keys(obj).reduce((cal, cur) => {
      const isEmpty = filterVal.some(i => i === obj[cur]);
      if (!isEmpty) {
        cal[cur] = obj[cur];
      }
      return cal;
    }, {});
  } catch (err) {
    return obj;
  }
};