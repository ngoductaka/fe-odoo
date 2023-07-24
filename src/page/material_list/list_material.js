import React, { useMemo, useState, useEffect } from 'react';
import _ from 'lodash';
import moment from 'moment';
import { Input, InputNumber, Select, Form, Table, Button, Skeleton, notification } from 'antd';
import { apiRPC } from 'helper/request/rpc_proxy';
import { PlusCircleFilled, PlusCircleOutlined } from '@ant-design/icons';
import './App.scss';

const id_nvl = 1; // kho nguyên vât liệu 
const uid = localStorage.getItem('uid');
const product_uom = 12; // đơn vị kg 
const company_id = 1; // company id 


const createItemProd = (ops, index) => {
    return [
        0,
        "virtual_1" + index,
        {
            company_id,
            product_uom,
            "state": "draft",
            "location_id": 4,
            "location_dest_id": 8,
            "partner_id": false,
            "quantity_done": 0,
            "additional": false,
            ...ops
        }
    ]

}

const createItemOrder = (ops) => {
    const scheduled_date = moment().format('YYYY-MM-DD HH:mm:ss');

    return [{
        "is_locked": true,
        "immediate_transfer": true,
        "check_ids": [],
        "priority": "0",
        "partner_id": false,
        "picking_type_id": id_nvl, // ?? 
        // vi tri 
        "scheduled_date": scheduled_date,
        "origin": false,
        "package_level_ids_details": [],
        "package_level_ids": [],
        "move_type": "direct",
        "user_id": uid,
        "note": false,
        // "move_ids_without_package": ops.items,
        ...ops,

    }]
}
const handleCreateOrder = async (ops) => {

    const params = createItemOrder({
        move_ids_without_package: ops
    });
    return apiRPC.call({
        "method": "create",
        "model": "stock.picking",
        params,
    })

}
const columnsRender = ({ prod }) => [
    {
        title: 'Sản phẩm',
        dataIndex: 'product',
        key: 'product',
        render: (text, record) => {
            return (
                <Form.Item name={`provider_${record.key}`}>
                    <Select
                        placeholder="Chọn sản phẩm nhập hàng"
                        showSearch
                        filterOption={(input, option) => (option?.label ?? '').toLocaleLowerCase().includes(input)}
                        options={prod.map((item, index) => ({ value: item.id, label: item.name }))}
                        style={{ width: 300 }}>
                    </Select>
                </Form.Item>
            )
        }
    },
    {
        title: 'Khối lượng',
        dataIndex: 'weight',
        key: 'weight',
        render: (text, record) => {
            return (
                <Form.Item
                    name={`weight_${record.key}`}
                >
                    <InputNumber />
                </Form.Item>
            )
        }
    },
    {
        title: 'Mô tả',
        dataIndex: 'note',
        key: 'note',
        render: (text, record) => {
            return (
                <Form.Item
                    name={`note_${record.key}`}
                >
                    <Input />
                </Form.Item>
            )
        }
    },
];



const App = () => {
    const [prod, setProd] = useState([])
    const [prodMap, setProdMap] = useState({})
    const [location, setLocation] = useState([])
    const [orderDetail, setOrderDetail] = useState(null)
    const [form] = Form.useForm();

    const [dataSource, setDataSource] = useState([{ key: 1, }]);
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    const columns = useMemo(() => {
        if (_.isEmpty(prod)) return null
        return columnsRender({ prod })
    }, [prod]);

    // ACTION 
    const _handleSave = () => {
        const data = form.getFieldsValue()
        console.log(data);
    }
    const _handleExpandItem = (record) => {
        if (orderDetail) {

        } else {

            createNewOrder();
        }

        if (expandedRowKeys.includes(record.key)) setExpandedRowKeys([])
        else setExpandedRowKeys([record.key])
    };

    const getOrderDetail = (idOrder) => {
        apiRPC.call({
            "method": "read",
            "model": "stock.picking",
            "params": [idOrder]
        }).then(({ data }) => {
            console.log(data, 'order detail ==');
            setOrderDetail(data[0])
        }).catch(() => { })
    }
    const createNewOrder = () => {
        const dataInput = form.getFieldsValue();
        const dataMap = {};
        Object.keys(dataInput).forEach(key => {
            const [field, indexKey] = key.split('_');
            dataMap[indexKey] = dataMap[indexKey] ? {
                ...dataMap[indexKey],
                [field]: dataInput[key]
            } : { [field]: dataInput[key] }
        })
        const dataItemProd = Object.values(dataMap).map((data, index) => {
            return createItemProd({
                "product_id": data.provider,
                "description_picking": data.note,
                "name": prodMap[data.provider]?.name,
                quantity_done: data.weight,
            }, index + Math.floor(Math.random() * 100))
        });


        handleCreateOrder(dataItemProd).then(({ data }) => {
            console.log(data, 'handleCreateOrder==');
            if (data && typeof data === 'number') {
                getOrderDetail(data)
            } else {
                notification.error({
                    message: 'Lỗi',
                    description: JSON.stringify(data),
                })
            }
        }).catch(() => {

        })

    }

    const getDataInitialState = () => {
        apiRPC.call({
            "model": "product.template",
            "method": "web_search_read",
            "params": [
                ["&", ["type", "!=", "service"], "|", ["company_id", "=", false], ["company_id", "=", 1]],
                ["id", "name"]
            ]
        })
            .then(({ data }) => {
                console.log(data, 'dddddd');
                setProd(data.records)
                const map = _.keyBy(data.records, 'id');
                setProdMap(map)
                console.log('map==', map);

            }).catch(() => { })

        apiRPC.call({
            "method": "name_search",
            "model": "stock.location",
            "params": []
        })
            .then(({ data }) => {
                console.log(data, 'location---');
                setLocation(data.records)
            }).catch(() => { })

    }
    // EFFECT

    useEffect(() => {
        getDataInitialState();
    }, []);


    return (
        <div>
            <Form form={form}>
                <div className="h-screen bg-gray-100 p-4">
                    <div className='h-full bg-white p-4 rounded-md'>
                        <div className='flex mt-2 border-b mb-2'>
                            {orderDetail && <div>
                                <h3>Kho Nguyên Vật Liệu: Nhận Hàng: {orderDetail?.display_name}</h3>
                            </div>}
                        </div>
                        {/* <div className='flex justify-center mt-5'>
                            <Form.Item
                                label="Nhà cung cấp"
                                name="provider"
                            >
                                <Select
                                    placeholder="Chọn nhà cung cấp"
                                    showSearch
                                    filterOption={(input, option) => (option?.label ?? '').toLocaleLowerCase().includes(input)}
                                    options={prod.map((item, index) => ({ value: item.id, label: item.name }))}
                                    style={{ width: 300 }}>
                                </Select>
                            </Form.Item>
                            <Button type='primary' onClick={_handleSave}>Save</Button>
                        </div> */}
                        {columns ? <Table
                            pagination={false}
                            dataSource={dataSource} columns={columns}
                            footer={() => <Button onClick={() => { setDataSource([...dataSource, { key: new Date().valueOf() }]); }} style={{ display: 'flex', alignItems: 'center' }} icon={<PlusCircleOutlined />} type='link'>Add more item </Button>}
                            expandedRowKeys={expandedRowKeys}
                            expandable={{
                                expandedRowRender: record => <Package location={location} data={record} form={form} orderDetail={orderDetail} />,
                                expandIcon: ({ expanded, onExpand, record }) =>
                                    expanded ? (
                                        <Button type='primary' onClick={(e) => _handleExpandItem(record, e)} >Close</Button>
                                    ) : (
                                        <Button onClick={(e) => _handleExpandItem(record, e)}>Chỉnh sửa package</Button>
                                    ),
                            }}

                        /> : <Skeleton />}

                    </div>
                </div>
            </Form>
        </div>
    )
};

const Package = ({ data, form, location, orderDetail }) => {
    console.log({ data, form, location, orderDetail })
    const productID = useMemo(() => {
        const dataInput = form.getFieldsValue();
        const dataMap = {};

        Object.keys(dataInput).forEach(key => {
            const [field, indexKey] = key.split('_');
            dataMap[indexKey] = dataMap[indexKey] ? {
                ...dataMap[indexKey],
                [field]: dataInput[key]
            } : { [field]: dataInput[key] }
        });
        const prodId = _.get(dataMap, [data.key, 'provider']);
        console.log(prodId, 'productID===', dataMap, data.key);
        return prodId;

    }, [data, form, location, orderDetail]);

    useEffect(() => {
        console.log({ data, form: form.getFieldsValue(), productID })
    }, [productID]);
    return (
        <div>
            <h1>Package</h1>
        </div>
    )
}


export default App;
