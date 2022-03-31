import { useEffect, useState } from 'react';
import { List, Layout, Button } from 'antd';
import { Link, Outlet } from 'react-router-dom';
import { handleOss, syncObject } from '../util';
import HeaderContent from './views/HeaderContent';

const { Header, Content } = Layout;

export default function Main({ hasInit }: { hasInit: boolean }) {
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
      <Header>
        <HeaderContent />
      </Header>
      <Content
        style={{
          height: 'calc(100vh - 64px)',
          padding: '20px',
          overflowY: 'auto',
        }}
      >
        <List
          header={<div>项目列表</div>}
          dataSource={projectList}
          renderItem={(item) => (
            <List.Item>
              <Link to={`/${item}`}>{item}</Link>
              <Button
                type="primary"
                onClick={() =>
                  syncObject({
                    deployBucket: item,
                    backupBucket: 'pi-version-backup',
                  })
                }
              >
                同步最新备份
              </Button>
            </List.Item>
          )}
        />
        <Outlet />
      </Content>
    </>
  );
}
