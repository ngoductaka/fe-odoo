import styled from 'styled-components';
import { Tabs } from 'antd';

import { GeneralHeader } from 'com/app_layout/general_header';
import MasterData from './master_data';
import MasterTable from './master_table';
import AreaTable from './area_table';
import GenData from './generate_data/input_material/input';

const App = () => {
    return (
        <div>
            <GeneralHeader title='Material Input' />
            <div style={{ padding: '0px 15px' }}>
                <Tabs defaultActiveKey="0" size="small">
                    <Tabs.TabPane
                        key={`0`}
                        tab={'Generate Material Input'}
                    >
                        <GenData />
                    </Tabs.TabPane>
                    <Tabs.TabPane
                        key={`1`}
                        tab={'Master Data'}
                    >
                        <Tabs>
                            <Tabs.TabPane
                                key={`1.2`}
                                tab={'Master Table'}
                            >
                                <MasterTable />
                            </Tabs.TabPane>
                            <Tabs.TabPane
                                key={`1.1`}
                                tab={'Master Options'}
                            >
                                <MasterData />
                            </Tabs.TabPane>
                        </Tabs>
                    </Tabs.TabPane>
                    <Tabs.TabPane
                        key={`2`}
                        tab={'Area'}
                    >
                        <AreaTable />
                    </Tabs.TabPane>
                </Tabs>
            </div>
        </div>
    );
};

export default App;

export const Header = styled.div`
    height: 50px;
    width: 100%;
    background: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 10px;
    border-bottom: 1px solid #ddd;
    .search {
        display: flex;
        align-items: center;
        width: 40vw;
    }
`;
