import styled from 'styled-components';
import { SettingTwoTone } from '@ant-design/icons';
import { Modal } from 'antd';
import { useState } from 'react';
import OssConfig from './OssConfig';

const Wrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
`;

export default function HeaderContent() {
  const [visibel, setVisile] = useState(false);
  return (
    <>
      <Wrap>
        <SettingTwoTone
          onClick={() => setVisile(true)}
          style={{
            marginLeft: 'auto',
            fontSize: '20px',
            height: '1em',
            cursor: 'pointer',
          }}
        />
      </Wrap>
      <Modal
        title="配置"
        visible={visibel}
        onCancel={() => setVisile(false)}
        footer={null}
      >
        <OssConfig />
      </Modal>
    </>
  );
}
