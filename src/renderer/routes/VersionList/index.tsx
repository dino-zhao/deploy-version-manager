import { useState } from 'react';
import { Button, Drawer } from 'antd';
import ListDrawer from './ListDrawer';

export default function Item({ project }: { project: string }) {
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
        width="80%"
      >
        <ListDrawer project={project} />
      </Drawer>
    </>
  );
}
