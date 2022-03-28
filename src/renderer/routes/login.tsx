import { Form, Input, Button, Layout } from 'antd';

const { Content } = Layout;
const { Item } = Form;
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

interface LoginParams {
  region?: string;
  accessKeyId?: string;
  accessKeySecret?: string;
}

const initialValues: LoginParams = {};
export default function Login() {
  const onFinish = (values: LoginParams) => {
    localStorage.setItem('ak', JSON.stringify(values));
  };
  return (
    <Layout>
      <Content>
        <Form
          {...layout}
          initialValues={initialValues}
          style={{ width: '600px', marginTop: '50px' }}
          onFinish={onFinish}
        >
          <Item name="region" label="region" rules={[{ required: true }]}>
            <Input />
          </Item>
          <Item
            name="accessKeyId"
            label="accessKeyId"
            rules={[{ required: true }]}
          >
            <Input />
          </Item>
          <Item
            name="accessKeySecret"
            label="accessKeySecret"
            rules={[{ required: true }]}
          >
            <Input />
          </Item>
          <Item {...tailLayout}>
            <Button htmlType="submit">确定</Button>
          </Item>
        </Form>
      </Content>
    </Layout>
  );
}
