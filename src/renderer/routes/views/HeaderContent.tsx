import styled from 'styled-components';
import { SettingTwoTone } from '@ant-design/icons';
import { message, Modal } from 'antd';
import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch, initOss } from 'renderer/store';
import { initOssClient } from 'renderer/util';
import OssConfig from './OssConfig';

const Wrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
`;

export default function HeaderContent() {
  const [visibel, setVisile] = useState(false);
  const { config } = useAppSelector((state) => state.ossConfig);
  const dispatch = useAppDispatch();
  if (!localStorage.getItem('ak')) {
    setVisile(true);
  }
  useEffect(() => {
    if (config.accessKeyId) {
      initOssClient(config)
        .then((res) => {
          dispatch(initOss());
          return res;
        })
        .catch(() => {
          message.error('初始化失败');
        });
    }
  }, [config, dispatch]);

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
        <OssConfig hide={() => setVisile(false)} />
      </Modal>
    </>
  );
}
