import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Upload } from 'antd';
import readXlsxFile from 'read-excel-file'

const BtnUpload = ({ handleFile }) => (
  <Upload
    fileList={[]}
    beforeUpload={(file) => {
      console.log(file)
      readXlsxFile(file).then((rows) => {
        handleFile(rows)
      })
    }}>
    <Button icon={<UploadOutlined />}>Upload</Button>
  </Upload>
);
export default BtnUpload;