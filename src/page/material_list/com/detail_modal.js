
import {
  Button, Drawer, Form
} from "antd";
import { get } from "lodash";
import React, { useEffect, useMemo } from "react";

import { CloseOutlined, ReloadOutlined } from "@ant-design/icons";

import styled from "styled-components";

import { RenderForm } from "com/antd_form/render_form";
import { handleErr } from "helper/request/handle_err_request";
import { openNotificationWithIcon } from "helper/request/notification_antd";
import moment from "moment";
// import * as services from '../services';

const ModalForm = ({
  visible,
  jsonFormInput,
  _onClose,
  _onSubmit =() => {}
}) => {
  // state
  const [loading, setLoading] = React.useState(false);
  const [dateKeysObj, setDateKeysObj] = React.useState({})
  // 
  const [form] = Form.useForm();
  // value
  const type = useMemo(() => get(visible, 'type', 'add'), [visible]);
  const dataInit = useMemo(() => {
    const dataInit = get(visible, 'data', {})
    const dateKeysObj = jsonFormInput.reduce((obj, item) => item?.type == "date" ? { ...obj, [item.name]: true } : obj, {})
    setDateKeysObj(dateKeysObj)

    const convertDateKey = dataInit
    Object.keys(dataInit).forEach(item => {
      if (dateKeysObj[item]) {
        convertDateKey[item] = moment(dataInit[item])
      }
    })

    return convertDateKey
  }, [visible]);
  // effect
  useEffect(() => form.resetFields(), [dataInit]);
  // handle

  const _handleSubmitForm = async ({ data = null, type = null } = {}) => {
    const convertDateKey = data
    Object.keys(data).forEach(item => {
      if (data[item] && dateKeysObj[item]) {
        convertDateKey[item] = moment(data[item]).format('YYYY-MM-DDTHH:mm:ss[Z]')
      }
    })
    _onSubmit({ ...dataInit, ...convertDateKey })
    // try {
    //   if (!data || !type) return 0;
    //   setLoading(true);
    //   // if (type === ACT_TYPE.ADD) {
    //   //   // await services.post(data);
    //     // openNotificationWithIcon("success", "Add new successfully !")
    //   // } else if (type === ACT_TYPE.EDIT) {
    //   //   console.log({
    //   //     id: visible.data.id,
    //   //     ...data
    //   //   });
    //   //   _onSubmit(          {
    //   //       id: visible.data.id,
    //   //       ...data
    //   //     })
    //   //   // await services.updateProduct()
    //   // } else if (type === ACT_TYPE.DEL) {
    //   //   console.log('dndd')
    //   //   const confirm = window.confirm("Xác nhận xoá?")
    //   //   if (confirm) {
    //   //     // await services.deleteMany(data);
    //   //     openNotificationWithIcon("success", "Xoá thành công")
    //   //   }
    //   // }
    //   setLoading(false);
    // } catch (error) {
    //   console.log('<err__handleSubmitForm>', error)
    //   setLoading(false);
    //   handleErr(error)
    // }
}
  const onFinish = async (val) => {
    // pre handle submit

    // submit
    _handleSubmitForm({ data: val, type })
  };

  return (
    <Drawer bodyStyle={{ padding: 10 }} title={false}
      placement={'right'} closable={false} onClose={_onClose} visible={visible} width={500}>
      <TitleDetail _onClose={_onClose} _onReset={() => form.resetFields()} />
      <StyledForm onFinish={onFinish} form={form} initialValues={dataInit}
        style={{ padding: '0px 10px' }} layout="vertical" >
        <Form.Item> <HeaderForm loading={loading} type={type} /> </Form.Item>
        <RenderForm jsonFrom={jsonFormInput} type={type} />
      </StyledForm>
    </Drawer>
  )
};

const TitleDetail = React.memo(({ _onReset, _onClose }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15 }}>
      <div></div>
      <div>
        <ReloadOutlined onClick={_onReset} />
        <CloseOutlined style={{ marginLeft: 15 }} onClick={() => _onClose()} />
      </div>
    </div>)
})

const HeaderForm = ({ loading, type }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: 10 }}>
      <span style={{ fontSize: 18, fontWeight: '500' }}>Update</span>
      <div>
        <Button
          loading={loading}
          type="primary"
          style={{
            float: "left",
            borderRadius: 5, marginLeft: 13, marginTop: 6
          }}
          htmlType="submit"
        > Submit  </Button>
      </div>
    </div>
  )
}


const StyledForm = styled(Form)`
  .ant-modal-body {
    padding: 0px 24px 24px 24px;
    background: red;
  }

  .ant-form-item {
    margin-bottom: 4px;
  }
`;


export default ModalForm;