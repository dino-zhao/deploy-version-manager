import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { ConfigParams } from 'renderer/type';

interface ConfigState {
  config: ConfigParams;
  isInit: boolean;
}

const initialState: ConfigState = {
  config: {
    deployBucketLists: ['pi-admin-web1', 'pi-console-web1', 'pi-admin-web-dev'],
    region: 'oss-cn-hangzhou',
    accessKeyId: '',
    accessKeySecret: '',
    backupBucket: 'pi-version-backup',
  },
  isInit: false,
};
const ossConfigSlice = createSlice({
  name: 'ossConfig',
  initialState,
  reducers: {
    mutateConfig: (state, action: PayloadAction<ConfigParams>) => {
      state.config = action.payload;
    },
    initOss: (state) => {
      state.isInit = true;
    },
  },
});

export const store = configureStore({
  reducer: {
    ossConfig: ossConfigSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const selectConfig = (state: RootState) => state.ossConfig.config;
export const selectIsInit = (state: RootState) => state.ossConfig.isInit;
export const { mutateConfig, initOss } = ossConfigSlice.actions;
