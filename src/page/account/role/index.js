// import "./App.css";
import { Table } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";
import { TableCustom } from "./helper/styled_component";
import {MONGO_SERVER_1} from '../../../_config/constant';

function Role() {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRecords();
  }, []);
  const columns = [
    {
      title: "Role Name",
      dataIndex: "name",
    },
    {
      title: "Screen Page",
      dataIndex: "page",
      render : val => val.toString()
    },
    {
      title: "Descriptions",
      dataIndex: "descriptions",
    },
  ];

  const fetchRecords = (page) => {
    setLoading(true);
    axios
      .get(`${MONGO_SERVER_1}/role`)
      .then((res) => {
        setDataSource(res.data);
        setLoading(false);
      });
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginLeft:'30px'
      }}
    >
      <TableCustom
        loading={loading}
        columns={columns}
        dataSource={dataSource.data || []}
        scroll={{ y: 'calc(100vh - 190px)' }}
      />
    </div>
  );
}
export default Role;