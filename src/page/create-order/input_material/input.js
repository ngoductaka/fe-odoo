import React, { useEffect, useMemo, useState } from 'react';

import { DeleteOutlined } from '@ant-design/icons';
import { mongoObjectId } from 'page/material-in/generate_data';

import { Button, DatePicker, Form, Input, InputNumber, Select, Table } from 'antd';
import { masterDataSelector } from 'app_state/master';
import { UseGetSize } from 'helper/hook/get_size';
import { openNotificationWithIcon } from 'helper/request/notification_antd';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import RenderDetail from './com/render-detail';

const requiredData = ['itemcode', 'quantity', 'lot'];
const App = ({ dataSource, setDataSource }) => {
    const masterData = useSelector(masterDataSelector);
    // state
    const [form] = Form.useForm();
    const { width, height } = UseGetSize();

    const _handleChangeItemCode = (dataRow, newVal) => {
        // if (masterDataFake[newVal]) {
        //     const rest = masterDataFake[newVal];
        //     const dataUpdate = {
        //         ...dataRow,
        //     };
        //     const dataUpdateForm = Object.keys(rest).map((key) => {
        //         dataUpdate[key] = rest[key];
        //         return {
        //             name: `${key}**${dataRow.id}`,
        //             value: rest[key],
        //         };
        //     });
        //     form.setFields(dataUpdateForm);
        //     dataSource.find((item, index) => {
        //         if (item.id === dataRow.id) {
        //             dataSource[index] = dataUpdate;
        //             return true;
        //         }
        //     });
        //     setDataSource([...dataSource]);
        // } else {
        // }
    };

    const _handleChangeReciciedQTY = (dataRow, totalReceived) => {
        const id = dataRow.id;

        const cartons_beans = form.getFieldValue(`cartons_beans**${id}`);

        if (
            totalReceived &&
            cartons_beans &&
            !isNaN(+(totalReceived || 0) / +(cartons_beans || 0))
        ) {
            const size = +totalReceived / +cartons_beans;
            form.setFields([
                {
                    name: `carton_size**${id}`,
                    value: Math.ceil(size),
                },
            ]);
        }
        form.setFields([
            {
                name: `stock_in_warehouse**${id}`,
                value: Math.ceil(totalReceived),
            },
        ]);
    };
    const _handleChangeBin = (dataRow, cartons_beans) => {
        const id = dataRow.id;

        const totalReceived = form.getFieldValue(`receivied_qty**${id}`);

        if (
            totalReceived &&
            cartons_beans &&
            !isNaN(+(totalReceived || 0) / +(cartons_beans || 0))
        ) {
            const size = +totalReceived / +cartons_beans;
            form.setFields([
                {
                    name: `carton_size**${id}`,
                    value: Math.ceil(size),
                },
            ]);
        }
    };

    const columns = useMemo(() => {
        return col.map((i) => {
            const { type, dataIndex } = i;
            if (dataIndex === 'itemcode') {
                i.render = (text, record, index) => {
                    return (
                        <Form.Item
                            style={{ margin: 0, padding: 0 }}
                            name={`${dataIndex}**${record.id}`}
                            label={null}
                        >
                            <Input
                                onChange={(e) => {
                                    console.log(e.target.value);
                                    _handleChangeItemCode(record, e.target.value);
                                    setExpandedRowKeys([]);
                                }}
                            />
                        </Form.Item>
                    );
                };
            } else if (dataIndex === 'action') {
                i.render = (text, record, index) => {
                    return (
                        <DeleteOutlined
                            style={{ marginLeft: 10, color: 'red' }}
                            onClick={() => {
                                setDataSource(dataSource.filter((i) => i.id !== record.id));
                            }}
                        />
                    );
                };
            } else if (dataIndex === 'receivied_qty') {
                i.render = (text, record, index) => {
                    return (
                        <Form.Item
                            style={{ margin: 0, padding: 0 }}
                            name={`${dataIndex}**${record.id}`}
                            label={null}
                        >
                            <InputNumber
                                onChange={(e) => {
                                    _handleChangeReciciedQTY(record, e);
                                    setExpandedRowKeys([]);
                                }}
                            />
                        </Form.Item>
                    );
                };
            } else if (dataIndex === 'cartons_beans') {
                i.render = (text, record, index) => {
                    return (
                        <Form.Item
                            style={{ margin: 0, padding: 0 }}
                            name={`${dataIndex}**${record.id}`}
                            label={null}
                        >
                            <InputNumber
                                onChange={(e) => {
                                    _handleChangeBin(record, e);
                                    setExpandedRowKeys([]);
                                }}
                            />
                        </Form.Item>
                    );
                };
            } else if (dataIndex === 'opening_stock') {
                i.render = (text, record, index) => {
                    return (
                        <Form.Item
                            style={{ margin: 0, padding: 0 }}
                            name={`${dataIndex}**${record.id}`}
                            label={null}
                        >
                            <InputNumber
                                onChange={(e) => {
                                    setExpandedRowKeys([]);
                                }}
                            />
                        </Form.Item>
                    );
                };
            } else if (type === 'typing') {
                i.render = (text, record, index) => {
                    return (
                        <Form.Item
                            style={{ margin: 0, padding: 0 }}
                            name={`${dataIndex}**${record.id}`}
                            label={null}
                        >
                            <Input
                                onChange={() => {
                                    setExpandedRowKeys([]);
                                }}
                            />
                        </Form.Item>
                    );
                };
            } else if (type === 'fixed') {
                i.render = (text, record, index) => {
                    return (
                        <Form.Item
                            style={{ margin: 0, padding: 0 }}
                            name={`${dataIndex}**${record.id}`}
                            label={null}
                        >
                            <Select
                                onChange={() => {
                                    setExpandedRowKeys([]);
                                }}
                                style={{ minWidth: 100, width: '100%' }}
                            >
                                {_.get(masterData, [dataIndex], []).map((item) => (
                                    <Select.Option value={`${item.name}`} key={`${item.name}`}>
                                        {item.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    );
                };
            } else if (type === 'date') {
                i.render = (text, record, index) => {
                    return (
                        <Form.Item
                            style={{ margin: 0, padding: 0 }}
                            name={`${dataIndex}**${record.id}`}
                            label={null}
                        >
                            <DatePicker
                                onChange={() => {
                                    setExpandedRowKeys([]);
                                }}
                            />
                        </Form.Item>
                    );
                };
            }

            return i;
        });
    }, [dataSource, masterData]);

    const syncData = (record) => {
        const err = {};
        const id = record.id;
        const currentData = {
            ...record,
        };
        col.map((colItem) => {
            const currVal = form.getFieldValue(`${colItem.dataIndex}**${id}`);
            if (currVal) {
                currentData[colItem.dataIndex] = currVal;
            }
        });

        const dataRowIndex = dataSource.findIndex((r) => r.id === id);
        dataSource[dataRowIndex] = currentData;
        col.map(({ dataIndex: key }) => {
            if (requiredData.includes(key) && !currentData[key]) {
                err[key] = `${key} is required`;
            }
        });
        setDataSource([...dataSource]);
        return err;
    };
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    const _handleExpandItem = (rowData, e) => {
        const err = syncData(rowData);
        if (!_.isEmpty(err)) {
            Object.values(err).map((i) => {
                openNotificationWithIcon('error', i);
            });
            return 0;
        }
        const filtered = expandedRowKeys.filter((i) => i.id === rowData.id);
        if (filtered.length === expandedRowKeys.length) {
            setExpandedRowKeys([...expandedRowKeys, rowData.id]);
        } else {
            setExpandedRowKeys(filtered);
        }
    };

    useEffect(() => {
        const id = mongoObjectId();
        setDataSource([
            {
                id,
                key: id,
            },
        ]);
    }, []);

    const handleSavePreview = (listBox, id) => {
        setDataSource((prevState) =>
            prevState.map((item) =>
                item.id === id
                    ? {
                          ...item,
                          list_box: listBox,
                          quantity_issued: listBox?.reduce(
                              (total, item) => total + item.stock_in_warehouse,
                              0
                          ),
                          box: listBox.length,
                      }
                    : item
            )
        );
    };

    const _handleSaveAll = () => {
        const listConvert = dataSource.map((i) => syncData(i));
        console.log(dataSource, 'listConvert', listConvert);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '15px 0px' }}>
                <h3>Select item code: </h3>
                <div style={{ display: 'flex', gap: 12 }}>
                    <Button
                        onClick={() => {
                            const id = mongoObjectId();
                            setDataSource([
                                ...dataSource,
                                {
                                    id,
                                    key: id,
                                },
                            ]);
                        }}
                    >
                        Add new Item Code
                    </Button>
                    {/* <Button type='primary' onClick={_handleSaveAll}>
                        Save All
                    </Button> */}
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
                        expandedRowRender: (record) => (
                            <RenderDetail
                                handleSavePreview={(listBox) =>
                                    handleSavePreview(listBox, record.id)
                                }
                                onOk={() => {
                                    setDataSource(dataSource.filter((i) => i.id !== record.id));
                                }}
                                data={record}
                            />
                        ),
                        // onExpand: _handleExpand,
                        expandIcon: ({ expanded, onExpand, record }) =>
                            expanded ? (
                                <Button
                                    type='primary'
                                    onClick={(e) => _handleExpandItem(record, e)}
                                >
                                    Close
                                </Button>
                            ) : (
                                <Button onClick={(e) => _handleExpandItem(record, e)}>
                                    Preview
                                </Button>
                            ),
                    }}
                    expandedRowKeys={expandedRowKeys}
                />
            </Form>
        </div>
    );
};

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
        title: 'Quantity issued',
        key: 'quantity',
        dataIndex: 'quantity',
        width: 120,
        fixed: 'left',
    },
    {
        width: 160,
        title: 'Lot.No.',
        key: 'lot',
        dataIndex: 'lot',
        type: 'typing',
        fixed: 'left',
    },
    {
        type: 'typing',
        title: 'G.E.No.',
        key: 'ge_no',
        dataIndex: 'ge_no',
        width: 120,
        // fixed: 'left',
    },
    {
        title: 'Product Category',
        key: 'product_category',
        dataIndex: 'product_category',
        width: 180,
        type: 'fixed',
        url: 'product',
        optionKey: 'product_category',
    },
    {
        title: 'Sub Category',
        // key: 'category',dataIndex: 'category',
        key: 'sub_category',
        dataIndex: 'sub_category',
        width: 180,
        type: 'fixed',
        url: 'category',
        optionKey: 'sub_category',
    },
    {
        title: 'Type',
        // key: 'Type',dataIndex: 'Type',
        key: 'type_name',
        dataIndex: 'type_name',
        type: 'fixed',
        width: 120,
        url: 'type',
        optionKey: 'type_name',
    },
    {
        title: 'Material Name Warehouse',
        // key: 'Material',dataIndex: 'Material',
        key: 'material_name',
        dataIndex: 'material_name',
        width: 250,
        type: 'fixed',
        url: 'material',
        optionKey: 'material_name',
    },
    {
        title: 'Receiving Date',
        key: 'receiving_date',
        dataIndex: 'receiving_date',
        type: 'date',
        width: 140,
    },
    {
        width: 150,
        title: 'Invoice No.',
        key: 'invoice',
        dataIndex: 'invoice',
        type: 'typing',
    },
    {
        width: 120,
        title: 'Artwork No.',
        key: 'artwork',
        dataIndex: 'artwork',
        type: 'typing',
    },
    {
        title: 'Lic. No.',
        key: 'lic',
        dataIndex: 'lic',
        width: 100,
        type: 'typing',
    },
    {
        title: 'Artwork Status',
        width: 140,
        key: 'artwork_status',
        dataIndex: 'artwork_status',
        type: 'typing',
    },
    {
        title: 'Mfg. Date',
        key: 'mfg_date',
        dataIndex: 'mfg_date',
        type: 'date',
        width: 139,
    },
    {
        title: 'Exp. Date',
        key: 'exp_date',
        dataIndex: 'exp_date',
        type: 'date',
        width: 139,
    },
    {
        title: 'Supplier Name',
        width: 139,
        key: 'supplier_name',
        dataIndex: 'supplier_name',
        type: 'typing',
    },
    {
        width: 109,
        title: 'Price',
        key: 'price',
        dataIndex: 'price',
        type: 'typing',
    },
    {
        title: 'Receivied Qty',
        width: 129,
        key: 'receivied_qty',
        dataIndex: 'receivied_qty',
        type: 'typing',
    },
    {
        title: ' Opening Stock',
        width: 129,
        key: 'opening_stock',
        dataIndex: 'opening_stock',
        type: 'typing',
    },
    // {
    //     width: 109,
    //     title: 'Unit',
    //     key: 'unit',
    //     dataIndex: 'unit',
    //     type: 'typing',
    // },
    {
        width: 129,
        title: 'Cartons/Beans',
        key: 'cartons_beans',
        dataIndex: 'cartons_beans',
        type: 'typing',
    },
    {
        width: 109,
        title: 'Carton Size',
        key: 'carton_size',
        dataIndex: 'carton_size',
        type: 'typing',
    },
    {
        width: 109,
        title: 'Unit Type',
        key: 'unit_type',
        dataIndex: 'unit_type',
        type: 'typing',
    },
    {
        title: 'QC Status',
        key: 'qc_status',
        dataIndex: 'qc_status',
        width: 140,
        type: 'fixed',
        sortable: false,
        url: 'status',
        optionKey: 'status',
    },
    {
        title: 'QC.Passed No.',
        key: 'qc_passed',
        dataIndex: 'qc_passed',
        width: 150,
        type: 'typing',
    },
    {
        title: 'Sampled By QC',
        key: 'sampled_by_qc',
        dataIndex: 'sampled_by_qc',
        width: 139,
        type: 'typing',
    },
    {
        title: ' Stock in Warehouse',
        key: 'stock_in_warehouse',
        dataIndex: 'stock_in_warehouse',
        width: 160,
        type: 'typing',
    },
    {
        width: 169,
        title: 'Remarks',
        key: 'remarks',
        dataIndex: 'remarks',
        type: 'typing',
    },
    {
        width: 130,
        title: 'Temperature',
        key: 'temperature',
        dataIndex: 'temperature',
        type: 'typing',
    },
    {
        width: 50,
        title: '',
        key: 'action',
        dataIndex: 'action',
        fixed: 'right',
    },
];

export const TableCustom = styled(Table)`
    td.ant-table-cell {
        padding: 10px;
    }
`;
