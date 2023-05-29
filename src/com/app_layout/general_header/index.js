import { HomeOutlined, LogoutOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Drawer, Menu, Tooltip, Input } from 'antd';
import { requestLogout } from 'app_state/login';
import { get, uniqBy } from 'lodash';
import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useRouteMatch } from 'react-router-dom';
import { UseRouter } from 'rootRouter';
import styled from 'styled-components';
import { Items } from './right_item_bar';
import { images } from 'helper/static/images';

export const GeneralHeader = ({ title = '', Com }) => {
    const dispatch = useDispatch();
    const { url } = useRouteMatch();
    const [isOpenModal, setIsOpenModal] = useState(false);
    const history = useHistory();
    const route = UseRouter()

    return (
        <>
            <DrawerStyled
                title='App Menu'
                placement='left'
                onClose={() => setIsOpenModal(false)}
                visible={isOpenModal}
                key='left'
            >
                <Menu defaultSelectedKeys={[url]}>
                    {route.map((item) => {
                        if (item.hidden) return null;
                        return (
                            <Menu.Item key={item.path} style={{ textTransform: 'capitalize' }}>
                                <Link to={item.path}>{item.name}</Link>
                            </Menu.Item>
                        )
                    })}
                </Menu>
            </DrawerStyled>

            <Container>
                <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    {/* <Button
                        style={{ marginRight: 10 }}
                        onClick={() => setIsOpenModal(true)}
                        icon={<MenuUnfoldOutlined />}
                        size='middle'
                        type='link'
                    /> */}
                    <img  onClick={() => setIsOpenModal(true)} src={images.anyone_logo} />
                    {/* <span style={{ fontSize: '2.5vh', fontWeight: '400' }}>{title}</span> */}
                </div>
                <div style={{ flex: 1.5 }}>
                    {/* {Com} */}
                    <Input.Search placeholder="일이삼사오" />
                </div>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                    <Items />
                    <Tooltip title='logout' placement='bottomLeft'>
                        <Button
                            onClick={() => {
                                dispatch(requestLogout());
                                history.push('/login');
                            }}
                            // shape='circle'
                            style={{ float: 'right' }}
                            icon={<LogoutOutlined style={{ fontSize: 20 }} />}
                            type='link'
                            danger
                            size='small'
                        />
                    </Tooltip>
                </div>
            </Container>
        </>
    );
};

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 8px 8px;
    margin-bottom: 12px;
    border-bottom: 1px solid #eee;
`;

const DrawerStyled = styled(Drawer)`
    & .ant-drawer-body {
        padding: unset;
    }
`;
