import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { List, Button } from 'antd';
import { handleOss } from '../util';

export default function ProjectVersionList() {
  const { project } = useParams();
  const [list, setList] = useState([]);
  useEffect(() => {
    async function handle() {
      const data = await handleOss('list', {
        prefix: `${project}/`,
        delimiter: '/',
        'max-keys': 1000,
      });
      setList(data.prefixes);
    }

    handle();
  }, [project]);
  return (
    <>
      <Button>同步</Button>
      <List
        header={<div>已备份版本</div>}
        dataSource={list}
        renderItem={(item) => <List.Item>{item}</List.Item>}
      />
    </>
  );
}
