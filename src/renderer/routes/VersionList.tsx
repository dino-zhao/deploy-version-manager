import { useState, useEffect, useCallback } from 'react';
import { List, Button, Drawer } from 'antd';
import moment from 'moment';
import { handleOss } from '../util';

export default function VersionList({ project }: { project: string }) {
  function getTimeString(str: string) {
    return str.replace(/\//g, '').replace(project, '');
  }

  const [list, setList] = useState<string[]>([]);

  function sortList(arr: string[]) {
    const cur = arr.filter((item) => {
      return moment(getTimeString(item)).isValid();
    });
    return cur;
  }
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
      setList(sortList(data.prefixes ?? []));
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
      <Drawer
        visible={visible}
        closable={false}
        onClose={() => setVisible(false)}
        title=""
        width={800}
      >
        <VersionList project={project} />
      </Drawer>
    </>
  );
}
