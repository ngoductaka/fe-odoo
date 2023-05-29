import { Button, Form } from 'antd';
import { GeneralHeader } from 'com/app_layout/general_header';
import { openNotificationWithIcon } from 'helper/request/notification_antd';
import moment from 'moment';
import { useState } from 'react';
import OrderForm from './com/order-form';
import OrderItemInput from './input_material/input';
import { createOrder } from './services';

const App = () => {
    const [form] = Form.useForm();
    const [dataSource, setDataSource] = useState([]);

    const onFinish = async (data) => {
        if (data.effective_date) {
            data.effective_date = moment.utc(data.effective_date).toISOString();
        }
        if (data.date) {
            data.date = moment.utc(data.date).toISOString();
        }

        try {
            await createOrder({ orderItems: dataSource, ...data });

            setTimeout(() => {
                window.location.reload();
            }, 500);
        } catch (err) {
            openNotificationWithIcon('error', err?.response?.data?.message || `Update errors`);
        }
    };

    return (
        <>
            <GeneralHeader title='Create order' />

            <div style={{ padding: '0px 15px' }}>
                <OrderForm form={form} onFinish={onFinish} />
                <OrderItemInput dataSource={dataSource} setDataSource={setDataSource} />

                <Button
                    type='primary'
                    disabled={!dataSource.find((item) => item.list_box)}
                    onClick={() => form.submit()}
                >
                    Submit
                </Button>
            </div>
        </>
    );
};

export default App;
