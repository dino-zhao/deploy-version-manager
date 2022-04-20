import { useState } from 'react';
import { Button, Drawer, Tag, Space, Popconfirm, message } from 'antd';
import { ProjectItem } from 'renderer/type';
import { fullCopy } from 'renderer/util';
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
            title={`一旦执行会影响${project.targetBucket}对应的应用`}
            onConfirm={async () => {
              try {
                await fullCopy({
                  from: {
                    bucketName: project.name,
                    path: project.path,
                  },
                  to: {
                    bucketName: project.targetBucket!,
                    path: project.path,
                  },
                });
                message.success('操作成功');
              } catch (error) {
                message.error('操作失败');
              }
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
