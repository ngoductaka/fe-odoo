import { Form, Input, InputNumber, Button, Card, Modal, Row, Col, Tag, Select, } from 'antd';
import React, { useEffect, useMemo, useState, } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import { RenderForm } from 'helper/render_form';
import { useSelector } from 'react-redux';
import { masterDataSelector } from 'app_state/master';
import { getItem, insertObj } from 'helper/local_storage/storage';
import { openNotificationWithIcon } from 'helper/request/notification_antd';
import { KEY_STORE } from 'helper/local_storage/key';
import { get } from 'lodash';
import Table from 'page/material-in/generate_data/input_material';


export const ModalEditMul = ({
    data,
    onCancel,
    onOk
}) => {
    const [form] = Form.useForm();
    const [initData, setInitData] = useState({});
    const [filter, setFilter] = useState([]);


    useEffect(() => form.resetFields(), [initData]);

    const [totalAmount, setTotalAmount] = useState();
    const [cartonsBeans, setCartonsBeans] = useState();
    const [previewData, setPreviewData] = useState(null);
    const masterData = useSelector(masterDataSelector);


    const onFinish = (val) => {
        const dataFormFinish = removeEmpty(val);

        const dataUpdate = Object.keys(dataFormFinish).reduce((cal, cur) => {
            const allTYpe = [...listForm1, ...listForm, ...ListForm2];
            const type = allTYpe.find(all => all.name === cur);
            if (type.type === 'date') {
                cal[cur] = moment(dataFormFinish[cur]).unix();
                return cal;

            } else {
                cal[cur] = dataFormFinish[cur];
                return cal;
            }

        }, []);

        const allDataObj = getItem(KEY_STORE.material) || {};
        const allDataArr = Object.values(allDataObj);

        const dataPreview = allDataArr.filter(item => {
            return filter.every(key => {
                console.log('itemitemitem', key, item[key], get(data, ['data', key]))
                return item[key] === get(data, ['data', key])
            })
        })

        const dataConvert = dataPreview.map(item => {
            return {
                ...item,
                ...dataUpdate,
            }
        })
        console.log('dataConvert', dataConvert);
        setPreviewData(dataConvert);

    }
    // effect
    useEffect(() => {
        if (totalAmount && cartonsBeans && !isNaN(totalAmount / cartonsBeans)) {
            form.setFields([
                {
                    name: 'carton_size',
                    value: Math.floor(totalAmount / cartonsBeans),
                    errors: null
                },
            ]);
        }
    }, [totalAmount, cartonsBeans]);

    useEffect(() => {
        if (data && data.data) {
            // setInitData({
            // })
        }
        if (data && data.filter) {
            setFilter(data.filter);
        }
    }, [data]);

    const jsonRequired = React.useMemo(() => {
        return listForm.map(i => {
            return {
                ...i,
                data: masterData[i.name]
            }
        })

    }, [masterData]);
    const jsonForm1 = React.useMemo(() => {
        return listForm1.map(i => {
            return {
                ...i,
                data: masterData[i.name]
            }
        })

    }, [masterData]);

    const jsonOption = React.useMemo(() => {
        return ListForm2.map(i => {
            return {
                ...i,
                data: masterData[i.name]
            }
        })

    }, [masterData]);
    const ListFieldOption = useMemo(() => {
        return [...listForm, ...listForm1, ...ListForm2];
    }, [])
    return (<Modal
        onCancel={onCancel}
        width="100vw"
        footer={null}
        style={{ top: 10 }}
        visible={!!data} title="Edit multiple">
        <div style={{ display: 'flex' }}>
            <div style={{ flex: 2, paddingRight: 20, borderRight: '1px solid #ddd' }}>
                <Form
                    name="basic"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 16 }}
                    onFinish={onFinish}
                    initialValues={initData}
                    // onFinishFailed={onFinishFailed}
                    form={form}
                    autoComplete="off"
                >
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        marginBottom: 20,
                        borderBottom: '1px solid #ddd', padding: '0px 20px'
                    }}>
                        <div style={{ fontSize: 18, fontWeight: '500', }}>
                            {/* <div></div> */}
                            Edit all material have same value:
                            <Select
                                onChange={val => setFilter(val)}
                                value={filter}
                                mode="multiple"
                                allowClear
                                size="small"
                                style={{ width: 400, marginLeft: 8 }}
                            >
                                {ListFieldOption.map(i => <Select.Option value={i.name}>{i.label}</Select.Option>)}
                            </Select>

                        </div>
                        <div style={{ display: 'flex' }}>
                            <Button onClick={() => onCancel()}>Cancel</Button>
                            <Form.Item wrapperCol={{ offset: 4 }}>
                                <Button type="primary" htmlType="submit" style={{ borderRadius: 5 }}>
                                    Preview data
                                </Button>
                            </Form.Item>
                        </div>
                    </div>
                    <Row>
                        <Col span={12} >

                            <RenderForm jsonFrom={jsonRequired} />
                            <Form.Item
                                label="Receivied Qty"
                                onChange={num => setTotalAmount(num.target.value)}
                                name="receivied_qty"
                            // rules={[{ required: true, message: 'Please input Receivied Qty!' }]}
                            >
                                <InputNumber />
                            </Form.Item>
                            <Form.Item
                                label="Cartons/Beans"
                                name="cartons_beans"
                                onChange={num => setCartonsBeans(num.target.value)}
                            // rules={[{ required: true, message: 'Please input Cartons/Beans!' }]}
                            >
                                <InputNumber />
                            </Form.Item>
                            <Form.Item
                                label="Carton Size"
                                name="carton_size"
                            // rules={[{ required: true, message: 'Please input Carton Size!' }]}
                            >
                                <InputNumber />
                            </Form.Item>
                            <RenderForm jsonFrom={jsonForm1} />
                        </Col>

                        <Col span={12} >
                            <RenderForm jsonFrom={jsonOption} />
                        </Col>
                    </Row>
                </Form>

                <Modal footer={null} onCancel={() => setPreviewData(null)}
                    style={{ top: 30, bottom: 30 }}
                    height="90vh" width={"100vw"}
                    visible={!!previewData}>
                    {previewData ? <Table
                        notDownload
                        onCancel={() => {
                            setPreviewData(null);
                            setTimeout(() => {
                                onOk();
                            }, 10)
                        }
                        } input={{ ...previewData }} /> : null}
                </Modal>
            </div>
        </div>
    </Modal >)
}




export const mongoObjectId = function () {
    var timestamp = (new Date().getTime() / 1000 | 0).toString(16);
    return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function () {
        return (Math.random() * 16 | 0).toString(16);
    }).toLowerCase();
};

const listForm = [
    {
        name: 'ge_no',
        label: 'G.E.NO.',
        // rules: [{ required: true, message: 'Please input G.E.NO!' }],
        disabled: true
    },
    {
        name: "itemcode",
        label: "Item code",
        // rules: [{ required: true, message: 'Please input Item code!' }],
        // type: 'select',
        valKey: 'name',
        disabled: true,
        // data: []
    },
    {
        name: 'material_name',
        label: 'Material name',
        // rules: [{ required: true, message: 'Please input Material name!' }],
        type: 'select',
        valKey: 'name',
        data: []
    },

]
const listForm1 = [

    {
        name: 'product_category',
        label: 'Product Category',
        type: 'select',
        valKey: 'name',
        data: [],
    },
    {
        label: 'Sub Category',
        name: 'sub_category',
        type: 'select',
        valKey: 'name',
        data: [],
    },
    {
        label: 'Type',
        name: 'type_name',
        type: 'select',
        valKey: 'name',
        data: [],
    },
    {
        label: 'Receiving Date',
        name: 'receiving_date',
        type: 'date',
    },
    {
        label: 'Invoice No.',
        name: 'invoice',
    },
    {
        label: 'Lot.No.',
        name: 'lot',
    },
    {
        label: 'Artwork No.',
        name: 'artwork',
    },
    {
        label: 'Lic. No.',
        name: 'lic',
    },
]
const ListForm2 = [
    {
        label: 'Artwork Status',
        name: 'artwork_status',
    },
    {
        label: 'Mfg. Date',
        name: 'mfg_date',
        type: 'date'
    },
    {
        label: 'Exp. Date',
        name: 'exp_date',
        type: 'date'
    },
    {
        label: 'Supplier Name',
        name: 'supplier_name',
    },
    {
        label: 'Price',
        name: 'price',
    },
    {
        label: ' Opening Stock',
        name: 'opening_stock',
    },
    // {
    //     label: 'Unit',
    //     name: 'unit',
    // },
    {
        label: 'Unit Type',
        name: 'unit_type',
    },
    {
        label: 'QC Status',
        name: 'qc_status',
        type: 'select'
    },
    {
        label: 'QC.Passed No.',
        name: 'qc_passed',
    },

    {
        label: 'Sampled By QC',
        name: 'sampled_by_qc',
    },
    {
        label: ' Stock in Warehouse',
        name: 'stock_in_warehouse',
    },
    {
        label: 'Remarks',
        name: 'remarks',
    },
    {
        label: 'Temperature',
        name: 'temperature',
    },
    {
        label: 'Store Status',
        name: 'warehouse_status',
    },
];


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