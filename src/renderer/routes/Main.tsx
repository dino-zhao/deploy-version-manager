import { useEffect, useState } from 'react';
import { List, Layout, Button, message } from 'antd';
import { Outlet } from 'react-router-dom';
import { useAppSelector } from 'renderer/store';
import { handleOss, syncObject } from '../util';
import HeaderContent from './views/HeaderContent';
import Item from './VersionList';

const { Header, Content } = Layout;
interface LoadingParams {
  [str: string]: boolean;
}

export default function Main() {
  const [projectList, setList] = useState<string[]>([]);
  const { isInit, config } = useAppSelector((state) => state.ossConfig);
  const [loadingState, setLoading] = useState<LoadingParams>({});
  useEffect(() => {
    const obj: LoadingParams = {};
    projectList.forEach((item) => {
      obj[item] = false;
    });
    setLoading(obj);
  }, [projectList]);
  useEffect(() => {
    async function handle() {
      if (isInit) {
        try {
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
          const arr = data.prefixes
            .map((item: string) => item.slice(0, -1))
            .filter((item: string) =>
              config.deployBucketLists.map((i) => i.name).includes(item)
            )
            .map((item: string) => {
              const cur = config.deployBucketLists.find(
                (i) => i.name === item
              )!;
              if (cur?.paths.length > 0) {
                return cur?.paths.map((path) => `${item}/${path}`);
              }
              return item;
            });
          setList(arr.flat());
        } catch (error) {
          // 这里通常处理ak错误
          if (typeof error === 'object') {
            message.error(error?.toString());
          }
        }
      }
    }

    handle();
  }, [isInit, config]);
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
              <Item project={item} />
              <Button
                loading={loadingState[item]}
                type="primary"
                onClick={async () => {
                  setLoading((state) => ({ ...state, [item]: true }));
                  message.info(
                    await syncObject({
                      deployBucket: item,
                      backupBucket: 'pi-version-backup',
                    })
                  );
                  setLoading((state) => ({ ...state, [item]: false }));
                }}
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
