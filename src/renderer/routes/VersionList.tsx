import { useState, useEffect, useCallback } from 'react';
import { List, Button, Drawer, message, Popconfirm } from 'antd';
import moment from 'moment';
import { handleOss, deleteObjectWithinBackupBucket } from '../util';

export default function VersionList({ project }: { project: string }) {
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
              title="Are you sure to delete this task?"
              onConfirm={async () => {
                try {
                  await await deleteObjectWithinBackupBucket(item);
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
        destroyOnClose
        width={800}
      >
        <VersionList project={project} />
      </Drawer>
    </>
  );
}
