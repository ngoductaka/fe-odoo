import React from 'react';
import moment from 'moment';
import {
  PlusCircleOutlined, EditOutlined, DeleteOutlined,
} from "@ant-design/icons";

export const ENDPOINT = 'order';
export const TITLE_TABLE = "Danh sách người dùng"
// createdAt
// : 
// "2022-11-05T11:50:02.372Z"
// from
// : 
// "a"
// id
// : 
// "63664dea24d6d96a18e75eb7"
// order_code
// : 
// 5
// status
// : 
// "request"
// to
// : 
// "a"
// updatedAt
// : 
// "2022-11-05T11:50:02.372Z"
export const columnInitTable = [
  {
    title: "createdAt",
    key: "createdAt",
    dataIndex: 'createdAt',
  },
  {
    title: "from",
    key: "from",
    dataIndex: 'from',
  },
  {
    title: 'id',
    key: 'id',
    dataIndex: 'idy'
  },
  {
    title: 'order_code',
    key: 'order_code',
    dataIndex: 'order_codee'
  },
  {
    title: 'status',
    key: 'status',
    dataIndex: 'statuse'
  },
  {
    title: 'to',
    key: 'to',
    dataIndex: 'tos'
  },
  {
    title: 'updatedAt',
    key: 'updatedAt',
    dataIndex: 'updatedAte'
  },
];
export const jsonFormFilterInit = [
  {
    name: "name",
    label: "Tên",
  },
]

export const jsonFormInit = [
  {
    name: "username",
    label: "Mã đăng nhập",
    rules: [{ required: true }],
  },
  {
    name: "name",
    label: "Tên",
    rules: [{ required: true }],
  },
  {
    name: "email",
    label: "email",
    rules: [{ required: true }],
  },
  {
    name: "password",
    label: "Mật khẩu",
    rules: [{ required: true }],
  },
  {
    name: "phone",
    // type: 'number',
    label: "Số điện thoại",
    rules: [{ type: 'number' }]
  },
  {
    name: "role_id",
    label: "Chức năng",
    type: 'select',
    data: [{
      id: '2',

    }],
    rules: [{ required: true }],
  },
  {
    name: "description",
    label: "Mô tả",
    // rules: [{ required: true }],
  },

];

export const ACT_TYPE = {
  "ADD": "ADD",
  "EDIT": "EDIT",
  "DUP": "DUP",
  "DEL": "DEL",
}
export const action = [
  {
    name: ACT_TYPE.EDIT,
    title: "Edit",
    Icon: () => <EditOutlined style={{ fontSize: 25 }} />,
  },
  {
    name: ACT_TYPE.DEL,
    title: "Delete",
    Icon: () => <DeleteOutlined style={{ fontSize: 25 }} />,
  },
  {
    name: ACT_TYPE.DUP,
    title: "Duplicate",
    Icon: () => <PlusCircleOutlined style={{ fontSize: 25 }} />,
  },
]

