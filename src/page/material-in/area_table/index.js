import React, { useState, useEffect } from "react";
import {
    Pagination, Input, Button, Upload, Checkbox,
    Image, Popover, List
} from "antd";
import {
    PlusOutlined, DeleteOutlined, FilterOutlined, ReloadOutlined,
    UploadOutlined, EyeOutlined
} from "@ant-design/icons";

import { Route, Switch, useRouteMatch, Link, useHistory, useLocation } from 'react-router-dom';
import { MapRole } from '_config/constant';

// local com
import { CardCustom, TableCustom } from "./helper/styled_component";

import AddNewForm from './com/add_new_modal';
import ModalFormDetail from './com/detail_modal';
import FilterForm from './com/filter_modal';
import ColumnForm from './com/column_modal';
import DeleteModal from './com/delete_modal';
//
import {
    reducerTable, initialStateTable, requestTable,
    requestAddNew, requestEdit, requestDel, set_filter
} from "./state/table";
import {
    requestFormData, reducerConfig, initialStateConfig,
    requestUpdateColumn, requestDataColumn
} from "./state/config";
import { openNotificationWithIcon } from "helper/request/notification_antd";
import { useTranslation } from "react-i18next";
import { ROUTES } from "_config/route";

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
        // requestFormData(dispatchConfig)
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
                title={t(`Management area in warehouse`)}
                extra={<Extra
                    loading={loading}
                    showDel={selectedRow && selectedRow[0]}
                    _onReload={_handleReset}
                    _handleDel={selectedRow.length > 0 ? () => setDeleteModal({ visible: true, id: selectedRow }) : () => { }}
                    _onFilter={() => setShowFilter(filter)}
                    _onClickAdd={() => setShowAddNew(true)}
                    _onClickColumnShow={() => setShowColumn(true)}
                />}
            >
                <TableCustom
                    dataSource={dataTable}
                    columns={configState.listColumn}
                    loading={loading}
                    scroll={{ y: 'calc(100vh - 200px)' }} pagination={false}
                    rowSelection={{
                        type: 'checkbox',
                        onChange: (selectedRowKeys, selectedRows) => {
                            setSelectRow(selectedRowKeys)
                        }
                    }}
                    onRow={(r) => ({ onClick: () => setShowDetail({ data: r, type: "EDIT" }) })}
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
                    {!showDel ? null : <Button loading={loading} onClick={_handleDel} className="ro-custom" type="text" icon={<DeleteOutlined />} >{t(`${lang}.del`)}</Button>}
                    <Button loading={loading} onClick={() => _onReload()} className="ro-custom" type="text" icon={<ReloadOutlined />} >{t(`${lang}.reset`)}</Button>
                    <Button loading={loading} onClick={_onClickAdd} className="ro-custom" type="text" icon={<PlusOutlined />} >{t(`${lang}.add`)}</Button>
                    <Button loading={loading} onClick={_onFilter} className="ro-custom" type="text" icon={<FilterOutlined />} >{t(`${lang}.filter`)}</Button>
                    <Button loading={loading} onClick={() => { history.push(ROUTES.LAYOUT) }} className="ro-custom" type="text" icon={<EyeOutlined />} >{t(`View layer`)}</Button>
                    {/* <Button loading={loading} onClick={_onClickColumnShow} className="ro-custom" type="text" icon={<UnorderedListOutlined />} >{t(`${lang}.show`)}</Button> */}
                </div>
            </div>
        </div>
    )
}

export default TableFunction;