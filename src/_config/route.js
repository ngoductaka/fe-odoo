import {
    DesktopOutlined,
    HomeOutlined,
    BarChartOutlined,
    SettingOutlined,
    TeamOutlined,
    UserOutlined,
    MonitorOutlined,
    InfoCircleOutlined,
    FundProjectionScreenOutlined,
    SendOutlined,
    BellOutlined,
    SnippetsOutlined,
} from '@ant-design/icons';

import loadable from '../helper/router/loadable';

// COMPONENT
// public
const Login = loadable(() => import('../page/login'));
// private
// const MaterialList = loadable(() => import('page/list_material'))
const MaterialList = loadable(() => import('page/material_list/list_material'));

const OutStock = loadable(() => import('page/confirm-out-stock'));
const BackToWh = loadable(() => import('page/back-to-wh'));
const BoxInfor = loadable(() => import('page/box-infor'));
const AboutUs = loadable(() => import('page/about_us'));
const AllApp = loadable(() => import('page/list-steps'));

const MaterialIn = loadable(() => import('page/material-in'));
const Stock = loadable(() => import('page/stock'));
const Account = loadable(() => import('page/account'));
const Profile = loadable(() => import('page/profile'));

const WarehouseLayout = loadable(() => import('page/stock_layout'));
const RfidMaterial = loadable(() => import('page/material-rfid'));
const ConfirmInFactory = loadable(() => import('page/rfid-confirm-in-factory'));
const listOutStock = loadable(() => import('page/out-stock-list'));
const createOrder = loadable(() => import('page/create-order'));
const order = loadable(() => import('page/order/list-order'));
const orderDetail = loadable(() => import('page/order-detail'));

export const ROUTES = {
    // unAuth
    LOGIN: 'login',
    // auth
    HOME: 'order',

    ADMIN: 'material-in',
    INPUT: 'input',
    ORDER: '',
    OUT_STOCK: 'out-stock',
    LAYOUT: 'warehouse-layout',

    STATISTIC: 'statistic',
    MACHINE_ANALYTIC: 'machine-analytic',
    PRODUCT_STATISTIC: 'statistics',
    SETTING: 'setting',
    REPORT: 'report',
    PROFILE: 'profile',
    listOut: 'list-stock-out',
    createOrder: 'create-order',
    ABOUT_US: 'about-us',
    TV_LINK: 'tv-link',
    SEND_EMAIL: 'send-email',
    AREA: 'tv-link/area',
    MACHINE: 'tv-link/machine',
    OPERATE: 'tv-link/operate',
    POWER: 'tv-link/power',
    change_mold_realtime: 'change-mold-realtime',
    STOCK: 'stock',
    RFID_MATE: 'out',
    RFID_IN_FACTORY: 'in',
    BackToWh: 'back',
    BoxInfor: 'box',
};

export const private_route = [

    {
        path: `/${ROUTES.ORDER}`,
        Com: order,
        exact: true,
        name: '제품',
    },
    {
        Com: MaterialList,
        name: '일하다',
        exact: true,
        Icon: <HomeOutlined />,
        path: `/${ROUTES.INPUT}`,
    },
    {
        Com: AllApp,
        name: '물류 센터',
        exact: true,
        Icon: <HomeOutlined />,
        path: `/${ROUTES.HOME}`,
    },
    // {
    //     path: `/${ROUTES.ADMIN}`,
    //     Com: MaterialIn,
    //     exact: true,
    //     name: 'Material Input',
    // },
    {
        path: `/${ROUTES.LAYOUT}`,
        Com: WarehouseLayout,
        exact: true,
        name: '보고서',
    },
    // {
    //     path: `/${ROUTES.STOCK}`,
    //     Com: Stock,
    //     exact: true,
    //     name: 'stock',
    //     hidden: true,
    // },
    {
        path: `/${ROUTES.REPORT}`,
        Com: Account,
        exact: true,
        name: '구성',
    },
];

export const MAP_ROLE = {
    2: [
        {
            Com: AllApp,
            name: 'All process',
            exact: true,
            Icon: <HomeOutlined />,
            path: `/${ROUTES.HOME}`,
        },
        {
            path: `/${ROUTES.ADMIN}`,
            Com: MaterialIn,
            exact: true,
            name: 'Material Input',
        },
        {
            Com: MaterialList,
            name: 'Material IN List',
            exact: true,
            Icon: <HomeOutlined />,
            path: `/${ROUTES.INPUT}`,
        },
        {
            Com: OutStock,
            name: 'Out stock',
            exact: true,
            Icon: <HomeOutlined />,
            path: `/${ROUTES.OUT_STOCK}`,
        },
        {
            path: `/${ROUTES.LAYOUT}`,
            Com: WarehouseLayout,
            exact: true,
            name: 'Stock layout',
        },
        {
            path: `/${ROUTES.STOCK}`,
            Com: Stock,
            exact: true,
            name: 'stock',
            hidden: true,
        },
        {
            path: `/${ROUTES.PROFILE}`,
            Com: Profile,
            exact: true,
            name: 'profile',
            hidden: true,
        },
        {
            path: `/${ROUTES.listOut}`,
            Com: listOutStock,
            exact: true,
            name: 'Material_out',
        },
        {
            path: `/${ROUTES.RFID_MATE}`,
            Com: RfidMaterial,
            exact: true,
            name: 'material-rfid',
            // hidden: true,
        },
    ],
};

export const public_route = [
    {
        path: `/${ROUTES.LOGIN}`,
        Com: Login,
    },
    {
        path: `/${ROUTES.BoxInfor}`,
        Com: BoxInfor,
        exact: true,
        name: 'Scan',
        // hidden: true,
    },
];
