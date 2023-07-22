// export const host = process.env.REACT_APP_ENV === 'dev' ? 'https://cedobackend.rosoee.com' : `https://cedobackend.rosoee.com`;

// const host = 'https://cedobackend.rosoee.com';
// const ProxyServer = 'https://demobackend.rosoee.com:5090/';
// const AccountServer = 'http://13.229.103.205:5111'

// const host_v2 = `https://app.rosoee.com:5500`
const serverIP = process.env.REACT_APP_ENV === 'dev' ? `http://172.174.244.95:5000`: `http://${window.location.host.split(':')[0]}:5000`;
export const REAL_SER = process.env.REACT_APP_ENV === 'dev' ? `http://172.174.244.95:3909`: `http://${window.location.host.split(':')[0]}:3909`;
export const ENDPOINT = {
    BASE: `${serverIP}`,
    LOGIN: `${serverIP}`,
    REFRESH_TOKEN: `${serverIP}`,
}


export const MONGO_SERVER = 'https://india.rosoee.com:3201/v1'
export const MONGO_SERVER_1 = 'http://20.115.75.139:3200/v1'
export const LOCAL = `http://${window.location.host.split(':')[0]}:3909`;
// export const MONGO_SERVER = 'http://localhost:3200/v1'


// odoo
export const RPC_PROXY = `http://${window.location.host.split(':')[0]}:3002`;
export const ODOO_URL = 'cuulong.rostek.space'
export const ODOO_PORT = 443

export const MAP_TITLE = {
    'warehouse-input': "Nhập Kho"
};

export const map_color = {
    'bad': '#F60020',
    'good': '#21983F',
    'medium': '#FEAD09',
    0: '#aaa', // khong tin hieu
    1: '#21983F', // run
    2: '#FEAD09', // idle
    3: '#F60020', // loi
    4: '#082b42', // off
}

const COLOR = {
    mainColor: '#1890ff',

}

export const MapRole = {
    1: "admin",
    2: 'manager',
    3: 'employee'
}

export const ROLE = {
    SUPER_ADMIN: 1,
    AGENT: 2,
    ADMIN: 3,
    MANAGER: 4,
    EMPLOYEE: 5,
}