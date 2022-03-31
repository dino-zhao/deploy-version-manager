import styled from 'styled-components';
import { SettingTwoTone } from '@ant-design/icons';
import { Modal } from 'antd';
import { useState } from 'react';
import {
  useAppSelector,
  selectIsInit,
  useAppDispatch,
  initOss,
} from 'renderer/store';
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
  const isInit = useAppSelector(selectIsInit);
  const dispatch = useAppDispatch();
  const localAk = localStorage.getItem('ak');
  if (!localAk) {
    setVisile(true);
  } else if (!isInit) {
    initOssClient(JSON.parse(localAk))
      .then((res) => {
        dispatch(initOss());
        return res;
      })
      .catch((err) => console.log(err));
  }
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
