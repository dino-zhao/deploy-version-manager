import { useState, useEffect, useCallback } from 'react';
import { List, Button, message, Popconfirm } from 'antd';
import moment from 'moment';
import { handleOss, deleteObjectWithinBackupBucket } from '../../util';

export default function ListDrawer({ project }: { project: string }) {
  const [listLoading, setListLoading] = useState(false);
  const getTimeString = useCallback(
    (str: string) => {
      return str.replace(/\//g, '').replace(project, '');
    },
    [project]
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
          prefix: `${project}/`,
          delimiter: '/',
          'max-keys': 1000,
        },
      ],
    });
    setListLoading(false);
    setList(sortList(data.prefixes ?? []));
  }, [project, sortList]);

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
            <span>{getTimeString(item)}</span>
            <Popconfirm
              title="确定删除当前版本吗?"
              onConfirm={async () => {
                try {
                  await await deleteObjectWithinBackupBucket({ path: item });
                  message.success('删除成功');
                  await getVersionList();
                } catch (error) {
                  message.error('操作失败');
                }
              }}
            >
              <Button style={{ marginLeft: 'auto' }}>删除当前版本</Button>
            </Popconfirm>
          </List.Item>
        )}
      />
    </>
  );
}
