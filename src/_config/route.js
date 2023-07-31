import {
    DesktopOutlined,
    HomeOutlined,
    BarChartOutlined,
    SettingOutlined,
    TeamOutlined,
    UserOutlined,
    ProfileOutlined,
    MonitorOutlined,
    InfoCircleOutlined,
    GroupOutlined,
    FundProjectionScreenOutlined,
    SendOutlined,
    BellOutlined,
    SnippetsOutlined,
    DownOutlined,
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
const listOutStock = loadable(() => import('page/out-stock-list'));
const order = loadable(() => import('page/order/list-order'));
const Home = loadable(() => import('page/home'));
const WorkList = loadable(() => import('page/work_list'));

export const ROUTES = {
    // unAuth
    LOGIN: 'login',
    // auth
    HOME: '',

    ADMIN: 'material-in',
    INPUT: 'warehouse-input',
    ORDER: '물류 센터',
    OUT_STOCK: 'out-stock',
    LAYOUT: 'layout',

    STATISTIC: 'statistic',
    MACHINE_ANALYTIC: 'machine-analytic',
    PRODUCT_STATISTIC: 'statistics',
    SETTING: 'setting',
    REPORT: '구성',
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
        path: `/${ROUTES.HOME}`,
        Com: Home,
        exact: true,
        Icon: <HomeOutlined />,
        name: 'Nhập Kho',
    },
    {
        path: `/${ROUTES.INPUT}`,
        Com: MaterialList,
        exact: true,
        Icon: <DownOutlined />,
        name: 'Nhập Kho',
    },
    {
        path: `/${ROUTES.LAYOUT}`,
        Com: WarehouseLayout,
        exact: true,
        Icon: <GroupOutlined />,
        name: 'Layout',
    },
    {
        path: `/${ROUTES.TV_LINK}`,
        Com: WorkList,
        exact: true,
        Icon: <GroupOutlined />,
        name: 'Lệnh sản xuất',
    },
    // {
    //     Com: MaterialList,
    //     name: 'Nhập Kho',
    //     exact: true,
    //     Icon: <ProfileOutlined />,
    //     path: `/${ROUTES.INPUT}`,
    // },
    // {
    //     Com: AllApp,
    //     name: '물류 센터',
    //     exact: true,
    //     Icon: <MonitorOutlined />,
    //     path: `/${ROUTES.ORDER}`,
    // },
    // {
    //     path: `/${ROUTES.LAYOUT}`,
    //     Com: WarehouseLayout,
    //     Icon: <GroupOutlined />,
    //     exact: true,
    //     name: '보고서',
    // },
    // {
    //     path: `/${ROUTES.REPORT}`,
    //     Com: Account,
    //     Icon: <BarChartOutlined />,
    //     exact: true,
    //     name: '구성',
    // },
];

export const MAP_ROLE = {
    2: [
        {
            Com: Home,
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
        {
            path: `/${ROUTES.BoxInfor}`,
            Com: BoxInfor,
            exact: true,
            name: 'Scan',
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
