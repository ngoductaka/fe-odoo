import React from 'react';
import moment from 'moment';
import {
  PlusCircleOutlined, EditOutlined, DeleteOutlined,
} from "@ant-design/icons";

export const ENDPOINT = 'master';
export const TITLE_TABLE = "Danh sách người dùng"

export const columnInitTable = [
  {
    title: "itemcode",
    key: "itemcode",
    dataIndex: 'itemcode',
  },
  {
    title: "product_category",
    key: "product_category",
    dataIndex: 'product_category',
  },
  {
    title: 'sub_category',
    key: 'sub_category',
    dataIndex: 'sub_category'
  },
  {
    title: 'type_name',
    key: 'type_name',
    dataIndex: 'type_name'
  },
  {
    title: 'material_name',
    key: 'material_name',
    dataIndex: 'material_name'
  },
  {
    title: 'artwork_status',
    key: 'artwork_status',
    dataIndex: 'artwork_status'
  },
  {
    title: 'supplier_name',
    key: 'supplier_name',
    dataIndex: 'supplier_name'
  },
  {
    title: 'unit_type',
    key: 'unit_type',
    dataIndex: 'unit_type'
  },
  {
    title: 'qc_status',
    key: 'qc_status',
    dataIndex: 'qc_status'
  },
  {
    title: 'remarks',
    key: 'remarks',
    dataIndex: 'remarks'
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

