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
  color: #fff;
`;

export default function HeaderContent() {
  const [visibel, setVisile] = useState(false);
  const { config } = useAppSelector((state) => state.ossConfig);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!localStorage.getItem('ak')) {
      setVisile(true);
    }
    // 只要ak在本地了，表单就会保证都填全了
    if (config.accessKeyId) {
      console.log(config);
      initOssClient(config)
        .then((res) => {
          dispatch(initOss());
          return res;
        })
        .catch((e) => {
          console.error(e.message);
          message.error('初始化失败');
        });
    }
  }, [config, dispatch]);

  return (
    <>
      <Wrap>
        v{window.packageConfig.version}
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
        width="80%"
      >
        <OssConfig hide={() => setVisile(false)} />
      </Modal>
    </>
  );
}
