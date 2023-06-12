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
import { UseRouter } from 'rootRouter';



export const LeftMenu = React.memo(({ collapsed }) => {

    const { t } = useTranslation();
    const history = useHistory();
    let { path } = useRouteMatch();
    // let { pathname } = useLocation();
    const { userrole } = useSelector(state => state.app)
    const route = UseRouter()
    const selectedKeys = React.useMemo(() => {
        const listKey = route.map(m => `${m.path}`);
        return listKey.find(i => i === path) || listKey[0]
    }, [path]);


    const items = useMemo(() => {
        const menu = []
        route.map(route => {
            menu.push({
                key: route.path,
                icon: route.Icon,
                label: route.name,
            })
        })
        return menu
    }, [])
    console.log('itemsddd', items);
    const _handleClick = (item) => {
        history.push(item.key)
    }
    return (
        // <Menu
        //     defaultSelectedKeys={['/']}
        //     mode="inline"
        //     inlineCollapsed={collapsed}
        //     items={items}
        //     style={{margin: 0}}
        //     onClick={_handleClick}
        // />
        <Menu
            // theme="dark"
            mode="inline"
        // selectedKeys={selectedKeys}
        >
            {
                route.map(route => {
                    return !route.hidden ?
                        <Menu.Item
                            onClick={() => history.push(`${route.path}`)}
                            key={`${route.path}`}
                            icon={route.Icon}
                        >
                            {/* {t(`${lang}.${route.name}`)} */}
                            {route.name}
                        </Menu.Item> :
                        null
                })
            }
        </Menu>

    )
})
