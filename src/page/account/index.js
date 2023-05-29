import React from 'react';
import loadable from "helper/router/loadable";
import { GeneralHeader } from 'com/app_layout/general_header';
import { Tabs } from 'antd';
const Acc = loadable(() => import('./account_table'));
const Role = loadable(() => import('./role'));
const Setting = () => {
    return (
        <div>
            <GeneralHeader title='User list​' />
            {/* <Acc /> */}
        
            <Tabs
                tabBarStyle={{
                    background: '#fafafa'
                }}
                tabPosition={'top'} size="middle" type="card">
                <Tabs.TabPane tab={<TabSpan text="Account" />} key="1">
                    <Acc />
                </Tabs.TabPane>
                <Tabs.TabPane tab={<TabSpan text="Role"/>} key="2">
                    <Role />
                </Tabs.TabPane>
               
            </Tabs>

        </div>
    )
};

const TabSpan = ({ text }) => <span style={{ textTransform: 'capitalize' }}>{text}</span>
export default Setting;