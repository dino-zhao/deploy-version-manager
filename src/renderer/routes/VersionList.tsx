import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { List, Button } from 'antd';
import { handleOss } from '../util';

export default function VersionList() {
  const { project } = useParams();
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
  return (
    <Button
      type="link"
      onClick={() => {
        console.log(project);
      }}
    >
      {project}
    </Button>
  );
}
