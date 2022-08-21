import { Button, message, Drawer } from 'antd';
import type { SelectProps } from 'antd';
import React, { useState, useRef, useEffect, createContext } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType, ColumnsState } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import { user, updateUser, removeUser } from './service';
import type { User, UserListParams } from './data';
import { getCompanyList, getRoleList } from '@/services/global-api/api';
import { useRequest } from 'umi';
import CreateForm from './components/CreateForm';

/**
 * 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: FormValueType, currentRow?: User) => {
  const hide = message.loading('正在配置');

  try {
    await updateUser({
      ...currentRow,
      ...fields,
    });
    hide();
    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};
/**
 * 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows: User[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;

  try {
    await removeUser({
      uid: selectedRows.map((row) => row.Uid),
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

export const RoleShareContext = createContext<Record<string, API.UserRole[] | API.Company[]>>({});

const UserList: React.FC = () => {
  /** 新建窗口的弹窗 */
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<User>();
  // const [searchKeyword, setSearchKeyword] = useState<UserListParams>({});
  const [selectedRowsState, setSelectedRows] = useState<User[]>([]);
  const [columnsStateMap, setColumnsStateMap] = useState<Record<string, ColumnsState>>({
    UserUpdateTime: {
      show: false,
    },
    UserCreateTime: {
      show: false,
    },
    UserDescription: {
      show: false,
    },
    UserQq: {
      show: false,
    },
    UserWechat: {
      show: false,
    },
  });

  const { data: roleData } = useRequest(getRoleList);
  const roleList = roleData as API.UserRole[];
  const { data: companyData } = useRequest(getCompanyList);
  const companyList = companyData as API.Company[];

  const [roleEnum, setRoleEnum] = useState<API.ProTableEnum>();
  const [companyEnum, setCompanyEnum] = useState<API.ProTableEnum>();
  const [roleSelect, setRoleSelect] = useState<SelectProps<any>['options']>();
  const [companySelect, setCompanySelect] = useState<SelectProps<any>['options']>();

  const generateRoleEnum = () => {
    const res: API.ProTableEnum = {};
    if (Array.isArray(roleList))
      roleList.forEach((role) => {
        res[role.Rid] = {
          text: role.RoleName,
        };
      });
    return res;
  };

  const generateCompanyEnum = () => {
    const res: API.ProTableEnum = {};
    if (Array.isArray(companyList))
      companyList.forEach((company) => {
        res[company.Cid] = {
          text: company.CompanyName,
        };
      });
    return res;
  };

  const generateRoleSelect = () => {
    const res: SelectProps<any>['options'] = [];
    if (Array.isArray(roleList))
      roleList.forEach((role) => {
        res.push({ label: role.RoleName, value: role.Rid });
      });
    return res;
  };

  const generateCompanySelect = () => {
    const res: SelectProps<any>['options'] = [];
    if (Array.isArray(companyList))
      companyList.forEach((company) => {
        res.push({ label: company.CompanyName, value: company.Cid });
      });
    return res;
  };

  useEffect(() => {
    if (roleList) {
      setRoleEnum(generateRoleEnum());
      setRoleSelect(generateRoleSelect());
    }

    if (companyList) {
      setCompanyEnum(generateCompanyEnum());
      setCompanySelect(generateCompanySelect());
    }

  }, [roleList, companyList]);

  const columns: ProColumns<User>[] = [
    {
      title: '头像',
      dataIndex: 'UserAvatar',
      valueType: 'avatar',
      width: 50,
      hideInSearch: true,
      renderText: (_, record) =>
        record.UserAvatar
          ? record.UserAvatar
          : 'https://img.tukuppt.com/ad_preview/00/09/06/hyVORwxNGY.jpg',
    },
    {
      title: '用户名',
      dataIndex: 'UserRealName',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '账号',
      dataIndex: 'Passport',
      valueType: 'text',
    },
    {
      title: '性别',
      dataIndex: 'UserGender',
      width: 50,
      valueEnum: {
        0: {
          text: '男',
        },
        1: {
          text: '女',
        },
      },
    },
    {
      title: '角色',
      dataIndex: 'UserRoleId',
      // valueType: 'text',
      valueEnum: roleEnum,
    },
    {
      title: '公司',
      dataIndex: 'UserCompanyId',
      // valueType: 'text',
      valueEnum: companyEnum,
    },
    {
      title: '邮箱',
      dataIndex: 'UserEmail',
      valueType: 'text',
    },
    {
      title: '电话',
      dataIndex: 'UserMobile',
      valueType: 'text',
    },
    {
      title: 'QQ',
      dataIndex: 'UserQq',
      valueType: 'text',
    },
    {
      title: '微信',
      dataIndex: 'UserWechat',
      valueType: 'text',
    },
    {
      title: '状态',
      dataIndex: 'UserStatus',
      hideInSearch: true,
      valueEnum: {
        0: {
          text: '关闭',
          status: 'Default',
        },
        1: {
          text: '运行中',
          status: 'Processing',
        },
        2: {
          text: '已上线',
          status: 'Success',
        },
        3: {
          text: '异常',
          status: 'Error',
        },
      },
    },
    {
      title: '登录次数',
      dataIndex: 'UserLoginCount',
      valueType: 'text',
      sorter: true,
      width: 60,
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '上次登录时间',
      sorter: true,
      dataIndex: 'LastLoginTime',
      hideInSearch: true,
      valueType: 'dateTime',
      renderText: (_, record) => (record.LastLoginTime.Valid ? record.LastLoginTime.Time : ''),
    },
    {
      title: '描述',
      hideInSearch: true,
      dataIndex: 'UserDescription',
      valueType: 'textarea',
    },
    {
      title: '更新时间',
      sorter: true,
      dataIndex: 'UserUpdateTime',
      valueType: 'dateTime',
      // hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '创建时间',
      sorter: true,
      dataIndex: 'UserCreateTime',
      valueType: 'dateTime',
      // hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleUpdateModalVisible(true);
            setCurrentRow(record);
          }}
        >
          配置
        </a>,
      ],
    },
  ];

  const scrollSet = {
    scrollToFirstRowOnChange: false,
    x: 'max-content',
    y: 'max-content',
  };

  return (
    <PageContainer>
      <ProTable<User, UserListParams>
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="Uid"
        search={{
          labelWidth: 'auto',
        }}
        scroll={scrollSet}
        toolbar={{
          // search: {
          //   onSearch: (value: string) => {
          //     const p: UserListParams = {}
          //     if (value.length !== 0) {
          //       p.keyword = value
          //     }
          //     setSearchKeyword(p)
          //   },
          // },
          actions: [
            <Button
              key="primary"
              type="primary"
              onClick={() => {
                setShowCreateModal(true);
              }}
            >
              新建
            </Button>,
          ],
        }}
        // params={searchKeyword}
        beforeSearchSubmit={(params) => {
          return params;
        }}
        postData={(data) => {
          if (data === null) {
            return [];
          }
          if (!Array.isArray(data)) {
            return [data];
          }
          return data;
        }}
        request={user}
        options={{
          search: false,
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
        columnsState={{
          value: columnsStateMap,
          onChange: setColumnsStateMap,
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>{' '}
              项 &nbsp;&nbsp;
              <span>
                登录数总计 {selectedRowsState.reduce((pre, item) => pre + item.UserLoginCount!, 0)}{' '}
                次
              </span>
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量删除
          </Button>
          <Button type="primary">批量审批</Button>
        </FooterToolbar>
      )}

      <CreateForm
        showCreateModal={showCreateModal}
        setShowCreateModal={setShowCreateModal}
        tableRef={actionRef}
        roleSelect={roleSelect}
        setRoleSelect={setRoleSelect}
        companySelect={companySelect}
        setCompanySelect={setCompanySelect}
      />

      <UpdateForm
        onSubmit={async (value) => {
          const success = await handleUpdate(value, currentRow);

          if (success) {
            handleUpdateModalVisible(false);
            setCurrentRow(undefined);

            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalVisible(false);
          setCurrentRow(undefined);
        }}
        updateModalVisible={updateModalVisible}
        values={currentRow || {}}
      />

      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >

        {currentRow?.UserRealName && (
          <ProDescriptions<User>
            column={2}
            title={currentRow?.UserRealName}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.UserRealName,
            }}
            columns={columns as ProDescriptionsItemProps<User>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default UserList;
