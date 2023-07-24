import { LogoutOutlined, DoubleRightOutlined, AppstoreOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { requestLogout } from 'app_state/login';
// component
import { images } from 'helper/static/images';
import { get } from 'lodash';
import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { Breadcrumbs } from './breadcrumbs';
import { Items } from './right_item_bar';
import { Wrapper } from './styled';
import styled from 'styled-components';
import { LeftMenu } from './left_menu';



const App = ({ children, title = '' }) => {
    const [collapsed, onCollapse] = React.useState(true);
    const [showSider, setShowSider] = React.useState(true)
    const [marginContent, setMaginContent] = React.useState(55)
    const dispatch = useDispatch();

    const history = useHistory();
    useEffect(() => {
        const id = localStorage.getItem('odoo_id');
        if (!id) {
            history.push('/login');
        }
        if (window.innerWidth < 416) {
            setShowSider(false)
            setMaginContent(0)
        }
    }, [])
    return (
        <Wrapper>
            <Layout>
                <Layout.Header style={{
                    height: 35, position: 'fixed',
                    background: '#ccc',
                    padding: 0,
                    zIndex: 10,
                    top: 0, left: 0, right: 0,
                    display: 'flex',
                    justifyContent: 'space-between'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div
                            onClick={() => history.push('/')}
                            style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                // width: 40,
                                height: 35,
                            }}>
                            <img src={images.anyone_logo} alt="logo" style={{ height: 25, marginLeft: 1 }} />
                        </div>

                        <div style={{ margin: '1px 10px' }}>
                            <Breadcrumbs />
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', fontSize: '1.2em' }}><b>{title}</b></div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Items />
                    </div>
                </Layout.Header>
                <Layout style={{
                    minHeight: '95vh',
                    background: '#F8F8FC'
                }}>
                    {showSider &&
                        <Layout.Sider
                            collapsedWidth={42}
                            width={170}
                            theme='light'
                            collapsible
                            reverseArrow={false}
                            collapsed={collapsed}
                            trigger={null}
                            onMouseEnter={() => onCollapse(false)}
                            // onCollapse={onCollapse}
                            onMouseLeave={() => onCollapse(true)}
                            style={{
                                overflow: 'hidden',
                                height: 'calc(100vh - 60px)',
                                position: 'fixed',
                                background: '#fff',
                                left: 6,
                                top: 41,
                                width: 40,
                                zIndex: 10,
                                borderRadius: 16,
                                // boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px'
                                boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'
                            }}
                        >
                            <div onClick={() => { onCollapse(!collapsed) }} style={{
                                textAlign: 'center',
                                display: 'flex',
                                alignItems: 'center',
                                padding: "14px 12px",
                            }}>
                                <AppstoreOutlined style={{ fontSize: 18 }} />
                                <span style={{ marginLeft: 20, color: '#111', fontWeight: 'bold' }}>Menu</span>
                            </div>
                            <LeftMenu collapsed={collapsed} />
                            <div onClick={() => {
                                history.push('login');
                                dispatch(requestLogout());
                            }} style={{
                                position: 'absolute', bottom: 5,
                                textAlign: 'center',
                                left: 0, right: 0,
                                display: 'flex',
                                alignItems: 'center',
                                padding: "10px 10px",
                            }}>
                                <LogoutOutlined style={{ color: 'red', fontSize: 20 }} />
                                <span style={{ marginLeft: 20, color: '#111' }}>Logout</span>
                            </div>
                        </Layout.Sider>}
                    <Layout style={{
                        marginLeft: marginContent,
                    }}>

                        <LayoutContent style={{
                            margin: '5px 5px',
                            marginTop: 45,
                            overflowY: 'scroll',
                            borderRadius: 10,
                            height: 'calc(100vh - 35px)',
                            fontSize: 14,
                        }}>
                            {children}
                        </LayoutContent>
                    </Layout>
                </Layout>
            </Layout>
        </Wrapper>
    )
};

const LayoutContent = styled(Layout.Content)`
/* margin: 5px 5px;
margin-top: 40px;
overflow-y: 'scroll';
border-radius: 10px;
height: 'calc(100vh - 35px)';
font-size: 14px; */
&::-webkit-scrollbar {
  width: 1px;
}
 
&::-webkit-scrollbar-track {
  /* box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3); */
}
 
&::-webkit-scrollbar-thumb {
  /* background-color: red; */
  /* outline: 1px solid slategrey; */
}
`


const lang = "route";

export default App;