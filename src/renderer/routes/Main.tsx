import { useEffect, useState } from 'react';
import { List, Layout, Button } from 'antd';
import { Link, Outlet } from 'react-router-dom';
import { handleOss, syncObject, listFiles } from '../util';
import HeaderContent from './views/HeaderContent';

const { Header, Footer, Content } = Layout;

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
          height: 'calc(100vh - 134px)',
          padding: '20px',
          overflow: 'scroll',
        }}
      >
        <div>
          <Button
            onClick={async () => {
              console.log(await listFiles({}));
            }}
          >
            测试list
          </Button>
        </div>
        <List
          header={<div>待备份列表</div>}
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
      <Footer>Footer</Footer>
    </>
  );
}
