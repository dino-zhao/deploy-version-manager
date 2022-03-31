import { useState, useEffect } from 'react';
import { List, Button, Modal } from 'antd';
import { handleOss } from '../util';

export default function VersionList({ project }: { project: string }) {
  const [list, setList] = useState([]);
  useEffect(() => {
    async function handle() {
      const data = await handleOss({
        method: 'list',
        args: [
          {
            prefix: `${project}/`,
            delimiter: '/',
            'max-keys': 1000,
          },
        ],
      });
      setList(data.prefixes ?? []);
    }

    handle();
  }, [project]);

  return (
    <>
      <List
        header={<div>已备份版本</div>}
        dataSource={list}
        renderItem={(item) => <List.Item>{item}</List.Item>}
      />
    </>
  );
}

export function Item({ project }: { project: string }) {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <Button
        type="link"
        onClick={() => {
          setVisible(true);
        }}
      >
        {project}
      </Button>
      <Modal
        visible={visible}
        onCancel={() => setVisible(false)}
        title="已备份版本"
      >
        <VersionList project={project} />
      </Modal>
    </>
  );
}
