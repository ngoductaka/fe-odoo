import { Button, Col, DatePicker, Form, Input, Row } from 'antd';

export default function OrderForm({ form, onFinish }) {
    return (
        <Form form={form} name='basic' layout='vertical' onFinish={onFinish} autoComplete='off'>
            <h3>Order info: </h3>

            <Row gutter={12}>
                <Col span={6}>
                    <Form.Item
                        label='Order No'
                        name='order_code'
                        rules={[
                            {
                                required: true,
                                message: 'Please input "order no"',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Col>

                <Col span={6}>
                    <Form.Item
                        label='From'
                        name='from'
                        rules={[
                            {
                                required: true,
                                message: 'Please input "from"',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Col>

                <Col span={6}>
                    <Form.Item
                        label='To'
                        name='to'
                        rules={[
                            {
                                required: true,
                                message: 'Please input "to"',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={3}>
                    <Form.Item label='Effective date' name='effective_date'>
                        <DatePicker format='DD/MM/YYYY' style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
                <Col span={3}>
                    <Form.Item label='Date' name='date'>
                        <DatePicker format='DD/MM/YYYY' style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={12}>
                <Col span={6}>
                    <Form.Item label='Prepared by' name='prepared_by'>
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item label='Issued by' name='issued_by'>
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item label='Received by' name='received_by'>
                        <Input />
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
}
