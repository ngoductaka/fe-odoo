import {
    DeleteOutlined, DownloadOutlined, EditFilled, FilterOutlined, PlusOutlined, ReloadOutlined,
    UploadOutlined
} from "@ant-design/icons";
import { Button, Pagination, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import _ from 'lodash';

import { Link, useHistory } from 'react-router-dom';

// local com
import { CardCustom, TableCustom } from "./helper/styled_component";

import AddNewForm from './com/add_new_modal';
import ModalFormDetail from './com/detail_modal';
import DeleteModal from './com/delete_modal';
import FilterForm from './com/filter_modal';

//
import { useTranslation } from "react-i18next";
import { initialStateConfig, reducerConfig, requestFilterForm } from "./state/config";
import { initialStateTable, reducerTable, requestAddNew, requestDel, requestEdit, requestTable } from "./state/table";
import moment from "moment";
import { apiClientMongo } from "helper/request/api_client_v1";
import { UseGetSize } from "helper/hook/get_size";
import { openNotificationWithIcon } from "helper/request/notification_antd";
import { handleErr } from "helper/request/handle_err_request";
import { BtnTus } from "com/btn_tutorial";
import { MONGO_SERVER } from "_config/constant";

const TableFunction = (props) => {
    // state
    const [configState, dispatchConfig] = React.useReducer(reducerConfig, initialStateConfig);
    const [tableState, dispatchTable] = React.useReducer(reducerTable, initialStateTable);
    const { loading, dataTable, pageInfo, filter } = tableState;
    const [selectedRow, setSelectRow] = useState([]);
    // modal
    const [showFilter, setShowFilter] = useState(false);
    const [showAddNew, setShowAddNew] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [showColumn, setShowColumn] = useState(false);
    const [deleteModal, setDeleteModal] = useState({ visible: false, id: [] });
    // effect

    const { t } = useTranslation();

    useEffect(() => {
        _requestDataTable();
        // requestDataColumn(dispatchConfig)
        requestFilterForm(dispatchConfig)
    }, []);

    // change Pagination
    const _handleChangePage = (current, limit) => {
        requestTable(dispatchTable, filter, { current, limit })
    };
    // handle reset 
    const _handleReset = () => _requestDataTable()

    // handle CRUD
    const _requestDataTable = () => requestTable(dispatchTable, filter, pageInfo)
    const _handleFilter = (body) => requestTable(dispatchTable, body, { ...pageInfo, current: 1 })
    const _handleDel = (body) => requestDel(body, () => _requestDataTable())
    const _handleAddNew = (body) => requestAddNew(body, () => _requestDataTable(), () => setShowAddNew(false))
    const _handleUpdate = (body) => requestEdit(body, () => _requestDataTable(), () => setShowDetail(false))

    return (
        <div style={{}}>
            <CardCustom
                title={t(`List order`)}
                extra={<Extra
                    loading={loading}
                    showDel={selectedRow && selectedRow[0]}
                    _onReload={_handleReset}
                    _handleDel={() => _handleDel(selectedRow)}
                    _onFilter={() => setShowFilter(filter)}
                    _onClickAdd={() => setShowAddNew(true)}
                    _onClickColumnShow={() => setShowColumn(true)}
                />}
            >
                <TableCustom
                    dataSource={dataTable}
                    columns={configState.listColumn}
                    loading={loading}
                    scroll={{ y: 'calc(100vh - 90px)' }} pagination={false}
                    rowSelection={{
                        type: 'checkbox',
                        onChange: (selectedRowKeys, selectedRows) => {
                            setSelectRow(selectedRowKeys)
                        }
                    }}
                    expandable={{
                        expandedRowRender: (record, index, indent, expanded) => (
                            <RenderDetailOrder
                                expanded={expanded}
                                record={record}
                                _reload={_handleReset}
                            />
                        ),
                    }}
                    onRow={(r) => ({
                        onClick: () => {
                            const _data = _.clone(r);
                            if (_data.effective_date) {
                                _data.effective_date = moment(_data.effective_date)
                            }
                            if (_data.date) {
                                _data.date = moment(_data.date)
                            }

                            setShowDetail({ data: _data, type: "EDIT" })
                        }
                    })}
                />
                <Pagination
                    showSizeChanger
                    pageSizeOptions={[5, 10, 15, 20, 25, 50, 100]}
                    style={{ marginTop: 10, float: 'right' }}
                    current={pageInfo.current}
                    pageSize={Number(pageInfo.limit || 15)}
                    total={pageInfo.total}
                    showQuickJumper
                    onChange={_handleChangePage}
                />
            </CardCustom>
            {/* modal */}
            <AddNewForm
                visible={showAddNew} jsonFormInput={configState.formAdd}
                _onClose={() => setShowAddNew(false)}
                _onSubmit={_handleAddNew}
            />
            <ModalFormDetail
                visible={showDetail} jsonFormInput={configState.formEdit}
                _onClose={() => setShowDetail(false)}
                _onSubmit={_handleUpdate}
            />
            <FilterForm
                visible={showFilter} jsonFormInput={configState.formFilter}
                _onClose={() => setShowFilter(false)}
                _onSubmit={_handleFilter}
            />
            <DeleteModal
                onCancel={() => setDeleteModal({ ...deleteModal, visible: false })}
                modalData={deleteModal}
                _onSubmit={_handleDel}
            />
        </div>

    );
};

const Extra = ({
    loading = false,
    showDel = false,

    _handleDel = () => { },
    _onClickAdd = () => { },
    _onFilter = () => { },
    _onReload = () => { },
    _onClickColumnShow = () => { },
}) => {

    const { t } = useTranslation();
    const lang = "setting"
    const history = useHistory();


    return (
        <div style={{ display: 'flex', alignItems: 'center', paddingRight: 7, justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flex: 1 }}>
                <div style={{ display: 'flex' }}>
                    <Button href={`${MONGO_SERVER}/order/export`} style={{ borderRadius: 6 }} type="text" icon={<DownloadOutlined />} >Download list order</Button>
                    {!showDel ? null : <Button loading={loading} onClick={_handleDel} className="ro-custom" type="text" icon={<DeleteOutlined />} >{t(`${lang}.del`)}</Button>}
                    <Button loading={loading} onClick={() => _onReload()} className="ro-custom" type="text" icon={<ReloadOutlined />} >Reset</Button>
                    <Button loading={loading} onClick={_onClickAdd} className="ro-custom" type="text" icon={<PlusOutlined />} >Add new</Button>
                    <Button loading={loading} onClick={_onFilter} className="ro-custom" type="text" icon={<FilterOutlined />} >Filter</Button>
                </div>
            </div>
            <BtnTus>
                <h1>Order List Status</h1>
                <div><span style={{fontWeight:'bold'}}>Pending : </span>Item is in queue</div>
                <div><span style={{fontWeight:'bold'}}>Out Stock: </span>Item has been shipped</div>
                <div><span style={{fontWeight:'bold'}}>Confirm received : </span> The manufacturer has received the goods</div>
                <div><span style={{fontWeight:'bold'}}>Confirm in use : </span> The production has received the goods</div>
            </BtnTus>
        </div>
    )
}

export default TableFunction;

const RenderDetailOrder = ({
    expanded,
    record,
    _reload
}) => {
    // state
    const [dataSource, setDataSource] = useState([]);
    const [calculateMaterial, setCalculateMaterial] = useState({});
    const { width, height } = UseGetSize();
    // funtion

    const initData = async (record) => {
        const orderId = record.id;
        const { data } = await apiClientMongo.get(`item-order/${orderId}?populate=material`);
        if (data && !_.isEmpty(data.data)) {
            const calc = {
                total_quantity_required: 0,
                total_quantity_issued: 0,
                total_box_required: 0,
                total_box_issued: 0,
            };
            const dataConvert = data.data.map(i => {
                calc.total_quantity_required = calc?.total_quantity_required + i.quantity_required;
                calc.total_quantity_issued = calc?.total_quantity_issued + i.quantity_issued;
                calc.total_box_required = calc?.total_box_required + _.get(i, 'box_required.length', 0);
                calc.total_box_issued = calc?.total_box_issued + _.get(i, 'box_issued.length', 0);

                return {
                    ...i.material,
                    // 
                    key: i?.material?.id,
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
            setCalculateMaterial(calc)
        }
    }

    // 'pending': 'full-fill',
    // 'full-fill': 'out-stock',
    // 'out-stock': 'confirm-in-use',
    const _handleChangeStt = (stt) => {
        if (stt === 'full-fill') {
            if (
                calculateMaterial?.total_box_required === calculateMaterial?.total_box_issued &&
                calculateMaterial?.total_quantity_required === calculateMaterial?.total_quantity_issued
            ) {
                apiClientMongo.patch('order', {
                    id: record.id,
                    status: 'full-fill'
                }).then(() => {
                    _reload();
                    openNotificationWithIcon('success', 'Update status success!');
                }).catch(err => handleErr(err))
            } else {
                alert(`
                Please pick more box to full fill order!
                total required: ${calculateMaterial?.total_quantity_required} 
                total issued: ${calculateMaterial?.total_quantity_issued}
                `)
            }
        } else if (stt === 'out-stock') {
            const confirm = window.confirm("Set all material out of stock?");
            if (!confirm) return 0;
            apiClientMongo.patch(`order/update-box-status/${record.id}`, { status: 'confirm-out' }).then(() => {
                openNotificationWithIcon('success', 'Update status success!');
                apiClientMongo.patch('order', {
                    id: record.id,
                    status: 'out-stock'
                }).then(() => {
                    _reload();
                }).catch(err => handleErr(err))
            }).catch(err => handleErr(err))
        } else if (stt === 'confirm-received') {
            const confirm = window.confirm("confirm received all material?");
            if (!confirm) return 0;
            apiClientMongo.patch(`order/update-box-status/${record.id}`, { status: 'confirm-received' }).then(() => {
                openNotificationWithIcon('success', 'Update status success!');
                apiClientMongo.patch('order', {
                    id: record.id,
                    status: 'confirm-received'
                }).then(() => {
                    _reload();
                }).catch(err => handleErr(err))
            }).catch(err => handleErr(err))
        } else if (stt === 'confirm-in-use') {
            const confirm = window.confirm("Set all material out of stock?");
            if (!confirm) return 0;
            apiClientMongo.patch(`order/update-box-status/${record.id}`, { status: 'confirm-in-use' }).then(() => {
                openNotificationWithIcon('success', 'Update status success!');
                apiClientMongo.patch('order', {
                    id: record.id,
                    status: 'confirm-in-use'
                }).then(() => {
                    _reload();
                }).catch(err => handleErr(err))
                openNotificationWithIcon('success', 'Update status success!');
            }).catch(err => handleErr(err))
        }
    }
    // efect
    useEffect(() => {
        if (expanded) {
            initData(record)
        }
    }, [expanded, record])
    return (
        <CardCustom style={{ marginTop: 10 }} title={
            <div style={{ display: 'flex', alignItems: 'center' }}>
                Order {record.order_code} detail
                <Tag style={{ marginLeft: 10 }} color="error">Total required: {calculateMaterial?.total_box_required} (box) | {calculateMaterial?.total_quantity_required} (item)</Tag>
                <Tag style={{ marginLeft: 10 }} color="success">Total issued: {calculateMaterial?.total_box_issued} (box) | {calculateMaterial?.total_quantity_issued} (item)</Tag>
            </div>
        } extra={
            <div>
                <ChangeStatus currStt={record.status} onClick={_handleChangeStt} />
                <Link to={`order/${record.id}`}>
                    <Button icon={<EditFilled />}>Edit</Button>
                </Link>
            </div>
        }>
            <TableCustom
                columns={col}
                dataSource={dataSource}
                scroll={{
                    x: width - 80,
                }}
            />
        </CardCustom>
    )
}



export const col = [
    {
        type: 'typing',
        title: 'G.E.No.', key: 'ge_no',
        dataIndex: 'ge_no',
        width: 120,
        fixed: 'left',
    },
    {
        type: 'typing',
        title: 'Qty Required', key: 'quantity_required',
        dataIndex: 'quantity_required',
        width: 120,
        fixed: 'left',
    },
    {
        title: 'Item.Code',
        key: 'itemcode',
        dataIndex: 'itemcode',
        type: 'fixed',
        width: 210,
        fixed: 'left',
    }, {
        // type: 'typing',
        title: 'Qty Issued', key: 'quantity_issued',
        dataIndex: 'quantity_issued',
        width: 120,
        fixed: 'left',
    },{
        // type: 'typing',
        title: 'Qty in factory', key: 'quantity_in_factory',
        dataIndex: 'quantity_in_factory',
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
        render: val => val ? moment(val).format("DD/MM/YYYY") : val,
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
        render: val => val ? moment(val).format("DD/MM/YYYY") : val,
    },
    {
        title: 'Exp. Date',
        key: 'exp_date', dataIndex: 'exp_date',
        type: 'date',
        render: val => val ? moment(val).format("DD/MM/YYYY") : val,
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
    //     width: 109,
    //     title: 'Unit',
    //     key: 'unit', dataIndex: 'unit',
    //     type: 'typing'
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


const mapStt = {
    'pending': 'full-fill',
    'full-fill': 'out-stock',
    'out-stock': 'confirm-received',
    'confirm-received': 'confirm-in-use',
}

const ChangeStatus = ({ currStt, onClick }) => {
    if (mapStt[currStt]) {
        return <Button onClick={() => onClick(mapStt[currStt])}>Change to {mapStt[currStt]}</Button>
    } return null
}