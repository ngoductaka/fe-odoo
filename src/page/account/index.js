import React, { useMemo } from 'react';
import { dataMaterial } from 'assets/data/material';
import _, { shuffle } from 'lodash';

import { Button, DatePicker, Input, Table, Tabs } from 'antd';
import { ArrowRightOutlined, ArrowLeftOutlined, ArrowDownOutlined, PrinterOutlined } from '@ant-design/icons';
import { GeneralHeader } from 'com/app_layout/general_header';
import { TableCustom } from 'com/table_temp/helper/styled_component';
import { LOCAL } from '_config/constant';
import moment from 'moment';
import PieChart from './chart/pie';
import LineChart from './chart/line';
import PerChart from './chart/per';
import ColChart from './chart/col';
import ChartDonut from './chart/donut';
import ChartDonut2 from './chart/donut2';
import BtnUpload from 'com/BtnUpload';

const Setting = () => {
    return (
        <div>
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

                <Tabs.TabPane tab={<TabSpan text="Chart" />} key="3">
                    <Report3 />
                </Tabs.TabPane>

            </Tabs>

        </div>
    )
};

const TabSpan = ({ text }) => <span style={{ textTransform: 'capitalize' }}>{text}</span>
export default Setting;

const Report3 = () => {
    return (
        <div>
            <div className='flex'>
                <div className='flex-1 p-20'>
                    <ChartDonut />
                </div>
                <div className='flex-1 p-20'>
                    <ColChart />
                </div>
            </div>
            {/* <div className='flex'>
                <div className='flex-1'>
                    <PerChart />
                </div>
                <div className='flex-1'>
                    <ChartDonut2 />
                </div>
            </div>
            <div className='flex'>
                <div className='flex-1'>
                    <PieChart />
                </div>
                <div className='flex-1'>
                    <LineChart />
                </div>
            </div> */}
        </div>
    )
}

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
                        <a href={`${LOCAL}/download/report1.xlsx`} download><Button className='mr-2 ml-2'> <ArrowDownOutlined /> 다운로드</Button></a>
                        <a href={`${LOCAL}/download/report1.xlsx`} download><Button icon={<PrinterOutlined />}>인쇄기</Button></a>
                        <BtnUpload />
                    </div>
                </div>
                <h5>㈜누구나비나</h5>
                <h6>Lô M, M-1, KCN Quế Võ (Khu vực mở rộng), Phường Nam Sơn, TP. Bắc Ninh, Tỉnh Bắc Ninh</h6>
                <h6>㈜누구나비나: 2301029655 </h6>
                <div className='flex justify-center text-xl font-bold'>판매 제품 수입 및 수출 보고서 (반제품 입/출/재고 보고서)</div>
                <div className='flex justify-center mt-3'>
                    <p>From Date: <DatePicker defaultValue={moment().subtract(1, 'M')} /></p>
                    <div className='w-4' />
                    <p>To Date: <DatePicker defaultValue={moment()} /></p>
                </div>

                <Table
                    columns={columns}
                    dataSource={data}
                    bordered
                    size="middle"
                    pagination={{ pageSize: 30 }}
                    scroll={{
                        x: 'calc(700px + 50%)',
                        y: 'calc(100vh - 550px)',
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
                dataIndex: 'type1',
                key: 'type1',
            },
            {
                title: '숫자',
                dataIndex: 'num1',
                key: 'num1',
            },
            {
                title: '낮',
                dataIndex: 'afternoon1',
                key: 'afternoon1',
            },
        ]
    },
    {
        title: '송장',
        children: [
            {
                title: '시리즈',
                dataIndex: 'type2',
                key: 'type2',
            },
            {
                title: '숫자',
                dataIndex: 'num2',
                key: 'num2',
            },
            {
                title: '낮',
                dataIndex: 'afternoon2',
                key: 'afternoon2',
            },
        ]
    },
    {
        title: '설명하다',
        dataIndex: 'note',
        key: 'note',
    },
    {
        title: 'ERP코드',
        dataIndex: 'ERP',
        key: 'ERP',
    },
    {
        title: '산업화, 재료',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '기간 초 재고',
        dataIndex: 'inventory',
        key: 'inventory',
    },
    {
        title: '기간 동안',
        children: [
            {
                title: '프로덕션에서 가져오기',
                dataIndex: 'num3',
                key: 'num3',
            },
            {
                title: '다른 항목 입력',
                dataIndex: 'num4',
                key: 'num4',
            },
        ]
    },
    {
        title: '기간 내 내보내기',
        children: [
            {
                title: '프로덕션용으로 내보내기',
                dataIndex: 'num5',
                key: 'num5',
            },
            {
                title: '수출 파괴',
                dataIndex: 'num6',
                key: 'num6',
            },
            {
                title: '수출 클레임',
                dataIndex: 'num7',
                key: 'num7',
            },
        ]
    },

    {
        title: '기타 수출',
        dataIndex: 'note2',
        key: 'note2',
    },
];
const data = shuffle(dataMaterial).map((i, index) => {
    const rand = (Math.random() * 100).toFixed(0)
    const rand1 = (Math.random() * 100).toFixed(0)
    const rand2 = (Math.random() * 100).toFixed(0)
    return ({
        'type1': 'SAA-120B-D-' + rand,
        'num1': index + rand1,
        'afternoon1': rand,
        'type2': 'FDA-150G-' + rand1,
        'num2': rand2,
        'afternoon2': rand1,
        'note': '',
        'ERP': i.material,
        'name': i.name,
        'inventory': rand + rand1 + rand2,
        'num3': rand,
        'num4': rand2,
        'num5': rand1,
        'num6': rand + rand1,
        'num7': rand + rand2,
        'note2': '',
    })
})






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
                        <a href={`${LOCAL}/download/report2.xlsx`} download><Button className='mr-2 ml-2'> <ArrowDownOutlined /> 다운로드</Button> </a>
                        <a href={`${LOCAL}/download/report2.xlsx`} download><Button icon={<PrinterOutlined />}>인쇄기</Button> </a>
                        <BtnUpload />
                    </div>
                </div>
                <h5>㈜누구나비나</h5>
                <h6>Lô M, M-1, KCN Quế Võ (Khu vực mở rộng), Phường Nam Sơn, TP. Bắc Ninh, Tỉnh Bắc Ninh</h6>
                <h6>㈜누구나비나: 2301029655 </h6>
                <div className='flex justify-center text-xl font-bold'>판매 제품 수입 및 수출 보고서 (반제품 입/출/재고 보고서)</div>
                <div className='flex justify-center mt-3'>
                    <p>From Date: <DatePicker defaultValue={moment().subtract(1, 'M')} /></p>
                    <div className='w-4' />
                    <p>To Date: <DatePicker defaultValue={moment()} /></p>
                </div>

                <Table
                    columns={columns2}
                    dataSource={data2}
                    bordered
                    pagination={{ pageSize: 30 }}
                    size="middle"
                    scroll={{
                        x: '100vw',
                        y: 'calc(100vh - 450px)',
                    }} />
            </div>
        </div>
    )
}


const columns2 = [
    {
        title: '제조일자',

        dataIndex: 'date',
        key: 'date',

    },
    {
        title: '위치',

        dataIndex: 'location',
        key: 'location',

    },
    {
        title: '구분',
        dataIndex: 'phancong',
        key: 'phancong',
    },
    {
        title: 'ERP code',
        dataIndex: 'ERP',
        key: 'ERP',
    },
    {
        title: '품명',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'RD code',
        dataIndex: 'bar',
        key: 'bar',
    },
    {
        title: '특이사항',
        dataIndex: 'num1',
        key: 'num1',
    },
    {
        title: 'lot no.',
        dataIndex: 'num2',
        key: 'num2',
    },
    {
        title: '출고',
        dataIndex: 'num3',
        key: 'num3',
    },
    {
        title: 'Note',
        dataIndex: 'note',
        key: 'note',
    },

];
const data2 = shuffle(dataMaterial).map((i, index) => {
    const rand = (Math.random() * 100).toFixed(0)
    const rand1 = (Math.random() * 100).toFixed(0)
    const rand2 = (Math.random() * 100).toFixed(0)
    return ({
        date: '2002년 6월 5일',
        'location': '지역 A-0' + rand,
        'phancong': 'TBA045957' + rand2,
        'ERP': i.material,
        'name': i.name,
        'bar': i.id,
        'num1': rand,
        'num2': 'lot-RD07-D-0' + rand1,
        'num3': rand2,
        'note': '',
    })
})

