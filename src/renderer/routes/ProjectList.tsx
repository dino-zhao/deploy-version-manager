import { useEffect, useState } from 'react';
import { List, Layout } from 'antd';
import { Link, Outlet } from 'react-router-dom';
import { handleOss } from '../util';

const { Header, Footer, Content } = Layout;
export default function ProjectList({ hasInit }: { hasInit: boolean }) {
  const [projectList, setList] = useState([]);
  useEffect(() => {
    async function handle() {
      if (hasInit) {
        const data = await handleOss('list', {
          prefix: '',
          delimiter: '/',
          'max-keys': 1000,
        });
        setList(data.prefixes);
      }
    }

    handle();
  }, [hasInit]);
  return (
    <>
      <Header>Header</Header>
      <Content style={{ height: 'calc(100vh - 134px)' }}>
        <List
          header={<div>待备份列表</div>}
          dataSource={projectList}
          renderItem={(item) => (
            <Link to={`/${item}`}>
              <List.Item>{item}</List.Item>
            </Link>
          )}
        />
        <Outlet />
      </Content>
      <Footer>Footer</Footer>
    </>
  );
}
