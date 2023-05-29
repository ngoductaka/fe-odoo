import React, { useEffect, useMemo, useState } from 'react';

import { GeneralHeader } from 'com/app_layout/general_header';
import {
  DropboxOutlined, FilterOutlined,
  DeleteOutlined,
  CloseCircleOutlined, ReloadOutlined, DeleteFilled, ExclamationCircleOutlined, FullscreenOutlined, SearchOutlined, LoadingOutlined
} from '@ant-design/icons'
import Table, { Column } from 'react-base-table'
import 'react-base-table/styles.css'
import './App.scss'
import { Button, Input, Popover, Select, AutoComplete, Checkbox, Modal, Tooltip, Skeleton, Pagination, DatePicker } from 'antd';
import _, { clone } from 'lodash';
import { UseGetSize } from 'helper/hook/get_size';
import { Header, Content, InputCus, SelectCus, selectS, AutoCompleteCus } from './styles';
import { openNotificationWithIcon } from 'helper/request/notification_antd';
import { masterDataSelector } from 'app_state/master';
import { useSelector } from 'react-redux';
import { deleteEntry, findAllEntry, updateEntry } from './services';
import { masterService } from 'app_state/services';
import StockMap from 'page/stock_layout'
import { apiClient } from 'helper/request/api_client';
import BtnDownload from 'com/BtnDownload';
import moment from 'moment';
import { getItem, insertObj } from 'helper/local_storage/storage';
import { KEY_STORE } from 'helper/local_storage/key';
import DownloadExcel from 'com/excel/gen_excel';

const { Search } = Input;

const App = ({ input, onCancel = () => { }, notDownload, onOk }) => {
  const masterData = useSelector(masterDataSelector);
  // state
  const dataForm = React.useRef({});
  const { width, height } = UseGetSize();
  const [filter, setFilter] = useState({});
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(false)

  const [isRefetch, setIsRefetch] = useState(true)
  const [showStockMap, setShowStockMap] = useState(false)

  const [select, setSelect] = useState({});
  // 
  const [dataSource, setDataSource] = useState();

  useEffect(() => {
    setDataSource(Object.values(input))
  }, [input])
  const [pageInfo, setPageInfo] = useState({
    limit: 15,
    skip: 1,
  });

  const _handleSelect = (key, val) => {
    setSelect(pre => ({
      ...pre,
      [key]: val,
    }))
  }

  const handleDelete = async (itemDel, dataSource) => {
    const _oldData = _.keyBy(dataSource, 'id');
    const _keyDel = itemDel.id;
    // return 0;
    Modal.confirm({
      title: 'Confirm delete?',
      icon: <ExclamationCircleOutlined />,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      async onOk() {
        try {
          const newData = clone(_oldData);
          delete newData[_keyDel];
          setDataSource(Object.values(newData));
        } catch (error) {
          openNotificationWithIcon('error', error?.message);
        }
      },
    });

  }
  const _handleChangeFile = (key, val) => {
    if (dataForm.current && key) {
      const [id, col] = key.split('**');
      _.set(dataForm.current, [id, col], val)
    }
  };

  const _handleSubmit = async () => {
    try {
      const dataUpdate = _.get(dataForm, ['current'], []) || [];
      const dataInput = _.keyBy(dataSource, 'id');
      Object.keys(dataInput).map((key) => {
        if (dataInput[key]) {
          dataInput[key] = {
            ...dataInput[key],
            ...dataUpdate[key],
          }
        }
      });
      // insertObj(KEY_STORE.material, dataInput);
      onOk(dataInput)
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
      }
      return <DatePicker defaultValue={initData} onChange={(val) => {
        _handleChangeFile(`${rowData.id}**${column.dataKey}`, moment(val).valueOf() / 1000)
      }} />
    } catch (err) {
      return <DatePicker onChange={(val) => {
        _handleChangeFile(`${rowData.id}**${column.dataKey}`, moment(val).valueOf() / 1000)
      }} />
    }
  }

  const RenderExpireDateCell = ({ cellData, rowData, column }) => {
    try {
      let initData = null;
      if (cellData) {
        initData = moment(cellData * 1000);
      } else {
        initData = moment(0)
      }

      return <DatePicker
        format={(value) => value == 0 ? "N/A" : value.format("YYYY-MM-DD")}
        defaultValue={initData}

        onChange={(val) => {
          _handleChangeFile(`${rowData.id}**${column.dataKey}`, moment(val).valueOf() / 1000)
        }} />
    } catch (err) {
      return <DatePicker format={(value) => `t2: ${value}`} onChange={(val) => {
        _handleChangeFile(`${rowData.id}**${column.dataKey}`, moment(val).valueOf() / 1000)
      }} />
    }
  }

  //  =================================
  const columns = React.useMemo(() => {
    const normalRow = col.map(item => {
      const { title, dataKey, type, ...rest } = item;
      // handle render 
      const _renderCell = (type) => {
        if (dataKey === 'warehouse_status') {
          return ({ rowData, cellData }) => <Select
            defaultValue={cellData}
            onChange={val => _handleChangeFile(`${rowData.id}**${'warehouse_status'}`, val)}
            style={{ width: 130 }}>
            <Select.Option value={'in_stock'} >In Stock</Select.Option>
            <Select.Option value={'out_stock'}>Out Stock</Select.Option>
          </Select >
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
        } else if (type === 'date-exp') {
          return RenderExpireDateCell;
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
      {
        key: 'id', title: 'G.E.No.', dataKey: 'ge_no', width: 120, resizable: true, sortable: true,
        frozen: Column.FrozenDirection.LEFT,
      },
      ...normalRow,
    ]
  }, [cellRendererSelect, dataSource, masterData, filter]);

  const _getDataWareHouse = async (filter) => {
    try {
      const data = {
        data: Object.values(getItem(KEY_STORE.material) || {} || []),
        page_info: {

        }
      }
      setPageInfo({
        ...pageInfo,
        ...(data.page_info || {}),
      })

      setLoading(false)
    } catch (err) {
      setLoading(false)

      openNotificationWithIcon('error', _.get(err, 'message', "Fetch data fail!"))
    }
  }

  const columnsCal = [
    ...columns,
    // {
    //   key: 'action', width: 100, align: Column.Alignment.CENTER, frozen: Column.FrozenDirection.RIGHT,
    //   // 
    //   dataSource,
    //   cellRenderer: ({ rowData }) => {
    //     return (<div>
    //       <Button
    //         onClick={() => handleDelete(rowData, dataSource)}
    //         type='link' icon={<DeleteOutlined style={{ color: 'red' }} />}
    //       ></Button>
    //     </div>)
    //   }
    // }
  ]
  const handleChooseLocation = (value) => {
    dataSource.map(item => {
      if (item.id == showStockMap.id && value) {
        item.location = value.name;
        document.getElementById(`location-id-${item.id}-location`).value = value.name;
        _handleChangeFile(`${item.id}**location`, value.name);
      }
      return item;
    })
    // setDataSource([...dataSource]);
    setShowStockMap(false)
  }
  // filter 

  // ==== pagination
  const _handlePageChange = (page) => {
    const { limit } = pageInfo;
    _getDataWareHouse({
      ...filter,
      limit,
      skip: page,
    })
  }
  // =============== useEffect ======== ======================


  useEffect(() => {
    let limit = 15;
    if (height) {
      limit = Math.floor(((height - 120) / 50))
    }
    _getDataWareHouse({ ...pageInfo, limit });


    setLoading(true)

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

  return (
    <div style={{ height: height - 200 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3> Preview material cartons generate:</h3>
        {
          notDownload ?
            <Button onClick={_handleSubmit} style={{ marginLeft: 10 }} type='primary'>Generate Data</Button> :
            <DownloadExcel data={dataSource} element={<Button onClick={_handleSubmit} style={{ marginLeft: 10 }} type='primary'>Generate Data and Download file</Button>} />
        }
      </div>
      <Content>
        <div style={{ marginTop: 30 }}>
          <Table fixed style={{ margin: 'auto' }} key={'2'} width={width - 100} height={height - 260} data={dataSource} columns={columnsCal} />
        </div>
      </Content>
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
    type: 'fixed',
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
    title: 'Index Item',
    dataKey: 'index_item',
  },
  // {
  //   title: 'Location',
  //   dataKey: 'location',
  //   type: 'autoComplete',
  //   width: 130
  // },
]

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