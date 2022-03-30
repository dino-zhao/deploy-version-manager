import { Form, Input, Button, Select } from 'antd';
import type { ConfigParams } from '../../type';

const { Item } = Form;
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};
const ak = JSON.parse(localStorage.getItem('ak') ?? '{}');
const initialValues: ConfigParams = {
  deployBucketLists: ['pi-admin-web1', 'pi-console-web1', 'pi-admin-web-dev'],
  region: 'oss-cn-hangzhou',
  accessKeyId: ak.accessKeyId ?? '',
  accessKeySecret: ak.accessKeySecret ?? '',
  backupBucket: 'pi-version-backup',
};
export default function OssConfig() {
  const onFinish = (values: ConfigParams) => {
    localStorage.setItem('ak', JSON.stringify(values));
  };
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Form {...layout} initialValues={initialValues} onFinish={onFinish}>
        <Item name="region" label="region" rules={[{ required: true }]}>
          <Input placeholder="请输入region" />
        </Item>
        <Item
          name="accessKeyId"
          label="accessKeyId"
          rules={[{ required: true }]}
        >
          <Input placeholder="请输入accessKeyId" />
        </Item>
        <Item
          name="accessKeySecret"
          label="accessKeySecret"
          rules={[{ required: true }]}
        >
          <Input placeholder="请输入accessKeySecret" />
        </Item>
        <Item
          label="备份bucket"
          name="backupBucket"
          rules={[{ required: true }]}
        >
          <Input placeholder="请输入备份bucket" />
        </Item>
        <Item
          label="待备份bucket"
          name="deployBucketLists"
          rules={[{ required: true }]}
        >
          <Select mode="tags" placeholder="请输入待备份bucket" />
        </Item>
        <Item {...tailLayout}>
          <Button htmlType="submit">确定</Button>
        </Item>
      </Form>
    </div>
  );
}
