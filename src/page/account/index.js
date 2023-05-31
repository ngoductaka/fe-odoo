import React, { useMemo } from 'react';
import { Button, Input, Table, Tabs } from 'antd';
import { ArrowRightOutlined, ArrowLeftOutlined, ArrowDownOutlined, PrinterOutlined } from '@ant-design/icons';
import { GeneralHeader } from 'com/app_layout/general_header';
import { TableCustom } from 'com/table_temp/helper/styled_component';

const Setting = () => {
    return (
        <div>
            <GeneralHeader title='User list​' />
            <Tabs
                tabBarStyle={{
                    background: '#fafafa'
                }}
                tabPosition={'top'} size="middle" type="card">
                <Tabs.TabPane tab={<TabSpan text="Report" />} key="1">
                    <Report1 />
                </Tabs.TabPane>
                <Tabs.TabPane tab={<TabSpan text="Diary Report" />} key="2">
                    <Report2 />

                </Tabs.TabPane>

            </Tabs>

        </div>
    )
};

const TabSpan = ({ text }) => <span style={{ textTransform: 'capitalize' }}>{text}</span>
export default Setting;


const Report1 = () => {
    return (
        <div>
            <div className='h-full bg-white p-4 rounded-md'>
                <div className=' mb-4 flex justify-between' >
                    <div className='flex justify-between flex-1'>
                        <h5>제품</h5>
                        <Input.Search style={{ width: 600 }} />
                        <div />
                    </div>
                    <div>
                        <Button style={{ background: '#3A5BB8', color: '#fff' }}> 데이터를 얻다</Button>
                        <Button className='mr-2 ml-2'> <ArrowDownOutlined /> 다운로드</Button>
                        <Button icon={<PrinterOutlined />}>인쇄기</Button>
                    </div>
                </div>
                <h5>㈜누구나비나</h5>
                <h6>Lô M, M-1, KCN Quế Võ (Khu vực mở rộng), Phường Nam Sơn, TP. Bắc Ninh, Tỉnh Bắc Ninh</h6>
                <h6>㈜누구나비나: 2301029655 </h6>
                <div className='flex justify-center'>판매 제품 수입 및 수출 보고서 (반제품 입/출/재고 보고서)</div>
                <div className='flex justify-center'>
                    <p>Từ ngày: 01/05/2023</p>
                    <div className='w-4' />
                    <p>Đến ngày: 31/05/2023</p>
                </div>

                <Table
                    columns={columns}
                    dataSource={data}
                    bordered
                    size="middle"
                    scroll={{
                        x: 'calc(700px + 50%)',
                        y: 240,
                    }} />
            </div>
        </div>
    )
}


const columns = [
    {
        title: '문서',
        children: [
            {
                title: '유형',
                dataIndex: 'age',
                key: 'age',
            },
            {
                title: '숫자',
                dataIndex: 'age',
                key: 'age',
            },
            {
                title: '낮',
                dataIndex: 'age',
                key: 'age',
            },
        ]
    },
    {
        title: '송장',
        children: [
            {
                title: '시리즈',
                dataIndex: 'age',
                key: 'age',
            },
            {
                title: '숫자',
                dataIndex: 'age',
                key: 'age',
            },
            {
                title: '낮',
                dataIndex: 'age',
                key: 'age',
            },
        ]
    },
    {
        title: '설명하다',
        dataIndex: 'age',
        key: 'age',
    },
    {
        title: 'ERP코드',
        dataIndex: 'age',
        key: 'age',
    },
    {
        title: '산업화, 재료',
        dataIndex: 'age',
        key: 'age',
    },
    {
        title: '기간 초 재고',
        dataIndex: 'age',
        key: 'age',
    },
    {
        title: '기간 동안',
        children: [
            {
                title: '프로덕션에서 가져오기',
                dataIndex: 'age',
                key: 'age',
            },
            {
                title: '다른 항목 입력',
                dataIndex: 'age',
                key: 'age',
            },
        ]
    },
    {
        title: '기간 내 내보내기',
        children: [
            {
                title: '프로덕션용으로 내보내기',
                dataIndex: 'age',
                key: 'age',
            },
            {
                title: '수출 파괴',
                dataIndex: 'age',
                key: 'age',
            },
            {
                title: '수출 클레임',
                dataIndex: 'age',
                key: 'age',
            },
        ]
    },

    {
        title: '기타 수출',
        dataIndex: 'age',
        key: 'age',
    },
];
const data = [];
for (let i = 0; i < 100; i++) {
    data.push({
        key: i,
        name: 'John Brown',
        age: i + 1,
        street: 'Lake Park',
        building: 'C',
        number: 2035,
        companyAddress: 'Lake Street 42',
        companyName: 'SoftLake Co',
        gender: 'M',
    });
}




const Report2 = () => {
    return (
        <div>
            <div className='h-full bg-white p-4 rounded-md'>
                <div className=' mb-4 flex justify-between' >
                    <div className='flex justify-between flex-1'>
                        <h5>제품</h5>
                        <Input.Search style={{ width: 600 }} />
                        <div />
                    </div>
                    <div>
                        <Button style={{ background: '#3A5BB8', color: '#fff' }}> 데이터를 얻다</Button>
                        <Button className='mr-2 ml-2'> <ArrowDownOutlined /> 다운로드</Button>
                        <Button icon={<PrinterOutlined />}>인쇄기</Button>
                    </div>
                </div>
                <h5>㈜누구나비나</h5>
                <h6>Lô M, M-1, KCN Quế Võ (Khu vực mở rộng), Phường Nam Sơn, TP. Bắc Ninh, Tỉnh Bắc Ninh</h6>
                <h6>㈜누구나비나: 2301029655 </h6>
                <div className='flex justify-center'>판매 제품 수입 및 수출 보고서 (반제품 입/출/재고 보고서)</div>
                <div className='flex justify-center'>
                    <p>Từ ngày: 01/05/2023</p>
                    <div className='w-4' />
                    <p>Đến ngày: 31/05/2023</p>
                </div>

                <Table
                    columns={columns2}
                    dataSource={data2}
                    bordered
                    size="middle"
                    scroll={{
                        x: '100vw',
                        y: 240,
                    }} />
            </div>
        </div>
    )
}


const columns2 = [
    {
        title: '제조일자',

        dataIndex: 'age',
        key: 'age',

    },
    {
        title: '위치',

        dataIndex: 'age',
        key: 'age',

    },
    {
        title: '구분',
        dataIndex: 'age',
        key: 'age',
    },
    {
        title: 'ERP code',
        dataIndex: 'age',
        key: 'age',
    },
    {
        title: '품명',
        dataIndex: 'age',
        key: 'age',
    },
    {
        title: 'RD code',
        dataIndex: 'age',
        key: 'age',
    },
    {
        title: '특이사항',
        dataIndex: 'age',
        key: 'age',
    },
    {
        title: 'lot no.',
        dataIndex: 'age',
        key: 'age',
    },
    {
        title: '출고',
        dataIndex: 'age',
        key: 'age',
    },
    {
        title: 'Note',
        dataIndex: 'age',
        key: 'age',
    },

];
const data2 = [];
for (let i = 0; i < 100; i++) {
    data2.push({
        key: i,
        name: 'John Brown',
        age: i + 1,
        street: 'Lake Park',
        building: 'C',
        number: 2035,
        companyAddress: 'Lake Street 42',
        companyName: 'SoftLake Co',
        gender: 'M',
    });
}

