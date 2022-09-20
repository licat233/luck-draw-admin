import { LogoutOutlined, SafetyOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { history, useModel } from '@umijs/max';
import { Avatar, Menu, message, Spin } from 'antd';
import type { ItemType } from 'antd/lib/menu/hooks/useItems';
import { stringify } from 'querystring';
import type { MenuInfo } from 'rc-menu/lib/interface';
import React, { useCallback, useState } from 'react';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import { Adminer, adminerPut, AdminerPutReq, logout, putCurrent, PutCurrentReq } from '@/services/global-api/admin-custom';
import OperationModal from './components/OperationModal';
import PutPasswordModal from './components/PasswordModal';

export type GlobalHeaderRightProps = {
  menu?: boolean;
};

/**
 * 退出登录，并且将当前的 url 保存
 */
const loginOut = async () => {
  try {
    const resp = await logout();
    if (!resp.success) {
      if (resp.errorCode !== 401) {
        message.error(resp.errorMessage)
        return
      }
    }
  } catch (error) {
    if ((error as any)?.response?.status !== 401) {
      return
    }
  }

  localStorage.removeItem("jwtToken")
  const { search, pathname } = window.location;
  const urlParams = new URL(window.location.href).searchParams;
  /** 此方法会跳转到 redirect 参数所在的位置 */
  const redirect = urlParams.get('redirect');
  // Note: There may be security issues, please note
  if (window.location.pathname !== '/user/login' && !redirect) {
    history.replace({
      pathname: '/user/login',
      search: stringify({
        redirect: pathname + search,
      }),
    });
  }
};


const handleUpdate = async (req: PutCurrentReq) => {
  const hide = message.loading('更新中...');
  try {
    await putCurrent(req);
    hide();
    message.success('更新成功');
    return true;
  } catch (error) {
    hide();
    message.error('更新失败');
    return false;
  }
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu }) => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      await setInitialState((s) => ({
        ...s,
        currentUser: userInfo,
      }));
    }
  };

  const [pwdModalVisible, setPwdModalVisible] = useState(false)

  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const { key } = event;
      switch (key) {
        case 'logout':
          setInitialState((s) => ({ ...s, currentUser: undefined }));
          loginOut();
          return;
        case 'settings':
          setVisible(true);
          return;
        case 'putpassword':
          setPwdModalVisible(true);
          return;
      }
      // history.push(`/account/${key}`);
    },
    [setInitialState],
  );

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  if (!currentUser || !currentUser.name) {
    return loading;
  }

  const menuItems: ItemType[] = [
    ...(menu
      ? [
        {
          key: 'settings',
          icon: <SettingOutlined />,
          label: '账户设置',
        },
        {
          key: 'putpassword',
          icon: <SafetyOutlined />,
          label: '更改密码',
        },
        {
          type: 'divider' as const,
        },
      ]
      : []),
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick} items={menuItems} />
  );

  const [done, setDone] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);

  const onSubmit = async (req: PutCurrentReq): Promise<boolean> => {
    const ok = await handleUpdate(req)
    setDone(ok)
    if (ok) {
      fetchUserInfo()
    }
    return ok
  }

  const onDone = () => {
    setDone(false);
    setVisible(false);
  }

  const pwdModalOnDone = () => {
    setPwdModalVisible(false);
  }

  return (
    <>
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar size="small" className={styles.avatar} src={currentUser.avatar} alt="avatar" />
          <span className={`${styles.name} anticon`}>{currentUser.name}</span>
        </span>
      </HeaderDropdown>
      <OperationModal
        done={done}
        visible={visible}
        current={currentUser}
        onDone={onDone}
        onSubmit={onSubmit} />
      <PutPasswordModal visible={pwdModalVisible} onDone={pwdModalOnDone} />
    </>
  );
};

export default AvatarDropdown;
