import { createContext, ReactNode, useContext } from 'react';
import type { ConfigParams } from '../type';
// https://hmh.engineering/using-react-contextapi-usereducer-as-a-replacement-of-redux-as-a-state-management-architecture-336452b2930e
const initState: ConfigParams = {
  deployBucketLists: ['pi-admin-web1', 'pi-console-web1', 'pi-admin-web-dev'],
  region: 'oss-cn-hangzhou',
  accessKeyId: '',
  accessKeySecret: '',
  backupBucket: 'pi-version-backup',
};

const Store = createContext(initState);
Store.displayName = 'Store';
export function StoreProvider({ children }: { children: ReactNode }) {
  return <Store.Provider value={initState}>{children}</Store.Provider>;
}
export const useStore = () => useContext(Store);
