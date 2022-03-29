import { useEffect, useState } from 'react';
import { List, Layout, Button } from 'antd';
import { Link, Outlet } from 'react-router-dom';
import { handleOss, copyFolderInSameBucket } from '../util';

const { Header, Footer, Content } = Layout;
async function syncObject() {
  const data = await handleOss({
    method: 'copy',
    args: ['pi-admin-web-dev/bbb/a.txt', 'pi-admin-web-dev/aaa/b.txt'],
  });
  console.log(data);
}

export default function ProjectList({ hasInit }: { hasInit: boolean }) {
  const [projectList, setList] = useState([]);
  useEffect(() => {
    async function handle() {
      if (hasInit) {
        const data = await handleOss({
          method: 'list',
          args: [
            {
              prefix: '',
              delimiter: '/',
              'max-keys': 1000,
            },
          ],
        });
        setList(data.prefixes.map((item: string) => item.slice(0, -1)));
      }
    }

    handle();
  }, [hasInit]);
  return (
    <>
      <Header>Header</Header>
      <Content style={{ height: 'calc(100vh - 134px)', padding: '20px' }}>
        <Button onClick={() => copyFolderInSameBucket()}> 测试</Button>
        <List
          header={<div>待备份列表</div>}
          dataSource={projectList}
          renderItem={(item) => (
            <List.Item>
              <Link to={`/${item}`}>{item}</Link>
              <Button type="primary" onClick={() => syncObject()}>
                查看信息
              </Button>
            </List.Item>
          )}
        />
        <Outlet />
      </Content>
      <Footer>Footer</Footer>
    </>
  );
}
