import { useState } from 'react';
import { Button, Drawer } from 'antd';
import { ProjectItem } from 'renderer/type';
import ListDrawer from './ListDrawer';

export default function Item({ project }: { project: ProjectItem }) {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <Button
        type="link"
        onClick={() => {
          setVisible(true);
        }}
      >
        {project.name}/{project.path}
      </Button>
      <Drawer
        visible={visible}
        closable={false}
        onClose={() => setVisible(false)}
        title=""
        destroyOnClose
        width="80%"
      >
        <ListDrawer project={project.name} />
      </Drawer>
    </>
  );
}
