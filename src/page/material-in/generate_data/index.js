import { Form, Input, InputNumber, Button, Card, Modal, Row, Col } from 'antd';
import React, { useEffect, useState, } from 'react';
import DownloadExcel from 'com/excel/gen_excel';
import moment from 'moment';
import Table from './input_material';
import { RenderForm } from 'helper/render_form';
import { useSelector } from 'react-redux';
import { masterDataSelector } from 'app_state/master';
import { insertObj } from 'helper/local_storage/storage';
import { openNotificationWithIcon } from 'helper/request/notification_antd';
import { KEY_STORE } from 'helper/local_storage/key';
const App = () => {
    const [form] = Form.useForm();

    const [totalAmount, setTotalAmount] = useState();
    const [cartonsBeans, setCartonsBeans] = useState();
    const [previewData, setPreviewData] = useState(null);
    const masterData = useSelector(masterDataSelector);


    const onFinish = (val) => {
        const listKey = [...listForm, ...ListForm2, ...listForm1];
        const dataBody = {};

        listKey.map(item => {
            if (item.type === 'date' && val[item.name]) {
                dataBody[item.name] = moment(val[item.name]).unix();
            } else if (item.type === 'number') {
                dataBody[item.name] = +val[item.name];
            } else {
                dataBody[item.name] = val[item.name]
            }
        });

        const { receivied_qty,
            cartons_beans,
            carton_size, } = val;

        const newItem = new Array(val.cartons_beans).fill(null).reduce((cal, cur) => {
            const id = mongoObjectId()
            return {
                ...(cal || {}),
                [id]: {
                    id,
                    rfid: id,
                    receivied_qty,
                    cartons_beans,
                    carton_size,
                    ...dataBody,
                }
            }
        }, {});
        console.log('newItem', newItem)

        setPreviewData(newItem)

    }

    const onConfirmSave = (newItem) => {
        insertObj(KEY_STORE.material, newItem);
        openNotificationWithIcon("success", "Generate success")
    }

    const _handleUpdateData = (data) => {
        console.log(data, 'asdfadsfasf')
    }
    // effect
    useEffect(() => {
        if (totalAmount) {
            form.setFields([
                {
                    name: 'stock_in_warehouse',
                    value: totalAmount + '',
                    errors: null
                },
            ]);
        }
    }, [totalAmount]);

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


    return <Card style={{ borderRadius: 10 }}>
        <div style={{ display: 'flex' }}>
            <div style={{ flex: 2, paddingRight: 20, borderRight: '1px solid #ddd' }}>
                <Form
                    name="basic"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    // onFinishFailed={onFinishFailed}
                    form={form}
                    autoComplete="off"
                >
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        marginBottom: 20,
                        borderBottom: '1px solid #ddd', padding: '0px 20px'
                    }}>
                        <div style={{ fontSize: 18, fontWeight: '500' }}>Form data input</div>
                        <Form.Item wrapperCol={{ offset: 4 }}>
                            <Button type="primary" htmlType="submit" style={{ borderRadius: 5 }}>
                                Preview data
                            </Button>
                        </Form.Item>
                    </div>
                    <Row>
                        <Col span={12} >

                            <RenderForm jsonFrom={jsonRequired} />
                            <Form.Item
                                label="Receivied Qty"
                                onChange={num => setTotalAmount(num.target.value)}
                                name="receivied_qty"
                                rules={[{ required: true, message: 'Please input Receivied Qty!' }]}
                            >
                                <InputNumber />
                            </Form.Item>
                            <Form.Item
                                label="Cartons/Beans"
                                name="cartons_beans"
                                onChange={num => setCartonsBeans(num.target.value)}
                                rules={[{ required: true, message: 'Please input Cartons/Beans!' }]}
                            >
                                <InputNumber />
                            </Form.Item>
                            <Form.Item
                                label="Carton Size"
                                name="carton_size"
                                rules={[{ required: true, message: 'Please input Carton Size!' }]}
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
            </div>
        </div>
        <Modal footer={null} onCancel={() => setPreviewData(null)}
            style={{ top: 30, bottom: 30 }}
            height="90vh" width={"100vw"}
            visible={!!previewData}>
            {previewData ? <Table onCancel={() => setPreviewData(null)} input={{ ...previewData }} /> : null}
        </Modal>
    </Card >
}
export default App;


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
        rules: [{ required: true, message: 'Please input G.E.NO!' }],
    },
    {
        name: "itemcode",
        label: "Item code",
        rules: [{ required: true, message: 'Please input Item code!' }],
        // type: 'select',
        valKey: 'name',
        // data: []
    },
    {
        name: 'material_name',
        label: 'Material name',
        rules: [{ required: true, message: 'Please input Material name!' }],
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