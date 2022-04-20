import { Form, Input, Button, Select, Space } from 'antd';
import {
  useAppSelector,
  selectConfig,
  useAppDispatch,
  mutateConfig,
} from 'renderer/store';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import type { ConfigParams } from '../../type';

const { Item } = Form;
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export default function OssConfig({ hide }: { hide: () => void }) {
  const config = useAppSelector(selectConfig);
  const dispatch = useAppDispatch();
  const onFinish = (values: ConfigParams) => {
    values.deployBucketLists.forEach((item) => {
      item.paths = item.paths
        ? item.paths.map((i) => {
            if (i.endsWith('/')) {
              return i;
            }
            return `${i}/`;
          })
        : [];
    });
    localStorage.setItem('ak', JSON.stringify(values));
    dispatch(mutateConfig(values));
    hide();
  };
  return (
    <div>
      <Form {...layout} initialValues={config} onFinish={onFinish}>
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
        <Item label="待备份bucket">
          <Form.List name="deployBucketLists">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{ display: 'flex', marginBottom: 8 }}
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      name={[name, 'name']}
                      rules={[{ required: true, message: 'bucket名不能为空' }]}
                    >
                      <Input placeholder="bucket名" />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, 'paths']}>
                      <Select
                        style={{ width: '200px' }}
                        mode="tags"
                        placeholder="保存路径"
                      />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add field
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Item>
        <Item {...tailLayout}>
          <Button htmlType="submit">确定</Button>
        </Item>
      </Form>
    </div>
  );
}
