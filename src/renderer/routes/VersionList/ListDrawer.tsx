import { useState, useEffect, useCallback, useMemo } from 'react';
import { List, Button, message, Popconfirm, Space } from 'antd';
import moment from 'moment';
import { useAppSelector, selectConfig } from 'renderer/store';
import { ProjectItem } from 'renderer/type';
import { handleOss, deleteObject, applySpecificVersion } from '../../util';

export default function ListDrawer({ project }: { project: ProjectItem }) {
  const prefix = useMemo(() => {
    return `${project.name}/${project.path ?? ''}`;
  }, [project]);
  const { backupBucket } = useAppSelector(selectConfig);

  const [listLoading, setListLoading] = useState(false);
  const getTimeString = useCallback(
    (str: string) => {
      return str.replace(prefix, '').slice(0, -1);
    },
    [prefix]
  );
  const [list, setList] = useState<string[]>([]);
  const sortList = useCallback(
    (arr: string[]) => {
      const cur = arr.filter((item) => {
        return moment(getTimeString(item)).isValid();
      });
      cur.sort((a, b) => {
        return moment(getTimeString(a)).isAfter(moment(getTimeString(b)))
          ? -1
          : 1;
      });
      return cur;
    },
    [getTimeString]
  );

  const getVersionList = useCallback(async () => {
    setListLoading(true);
    const data = await handleOss({
      method: 'list',
      args: [
        {
          prefix,
          delimiter: '/',
          'max-keys': 1000,
        },
      ],
    });
    setListLoading(false);
    setList(sortList(data.prefixes ?? []));
  }, [prefix, sortList]);

  useEffect(() => {
    getVersionList();
  }, [getVersionList]);

  return (
    <>
      <List
        header={<div>已备份版本</div>}
        dataSource={list}
        loading={listLoading}
        renderItem={(item) => (
          <List.Item>
            <span>{item}</span>
            <Space style={{ marginLeft: 'auto' }}>
              <Popconfirm
                title="确定应用该版本么，会直接影响对应环境应用？"
                onConfirm={async () => {
                  try {
                    message.success(
                      await applySpecificVersion({
                        version: item,
                        backupBucket,
                      })
                    );
                  } catch (error) {
                    message.error('操作失败');
                  }
                }}
              >
                <Button danger onClick={() => console.log(item)}>
                  应用该版本
                </Button>
              </Popconfirm>
              <Popconfirm
                title="确定删除当前版本吗?"
                onConfirm={async () => {
                  try {
                    console.log(item);
                    await deleteObject({
                      bucketName: backupBucket,
                      path: item,
                    });
                    message.success('删除成功');
                    await getVersionList();
                  } catch (error) {
                    message.error('操作失败');
                  }
                }}
              >
                <Button>删除当前版本</Button>
              </Popconfirm>
            </Space>
          </List.Item>
        )}
      />
    </>
  );
}
