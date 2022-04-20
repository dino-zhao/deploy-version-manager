import { useState } from 'react';
import { Button, Drawer, Tag, Space, Popconfirm } from 'antd';
import { ProjectItem } from 'renderer/type';
import ListDrawer from './ListDrawer';

export default function Item({ project }: { project: ProjectItem }) {
  console.log(project);
  const [visible, setVisible] = useState(false);
  return (
    <>
      <Space size="large">
        <Button
          type="link"
          onClick={() => {
            setVisible(true);
          }}
        >
          {project.name}
          {project.path ? (
            <Tag color="cyan" style={{ marginLeft: '10px' }}>
              {project.path}
            </Tag>
          ) : null}
        </Button>
        {project.targetBucket && (
          <Popconfirm
            title="一旦执行会影响目标bucket对应的应用"
            onConfirm={() => {
              console.log('ooo');
            }}
          >
            <Button danger>复制到{project.targetBucket}</Button>
          </Popconfirm>
        )}
      </Space>
      <Drawer
        visible={visible}
        closable={false}
        onClose={() => setVisible(false)}
        title=""
        destroyOnClose
        width="80%"
      >
        <ListDrawer project={project} />
      </Drawer>
    </>
  );
}
