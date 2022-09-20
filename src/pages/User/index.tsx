import { DeleteTwoTone, DownOutlined, EditTwoTone, PlusOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import '@umijs/max';
import { Button, Drawer, Dropdown, Modal, Menu, message } from 'antd';
import React, { useRef, useState } from 'react';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import { userAdd as add, userDel as del, userDetails, userPut as put, usersPoolAdd, usersPoolDel, usersPoolPut } from '@/services/global-api/admin-custom';
import { User as Item, UserAddReq as AddReq, UserPutReq as PutReq, UserListReqParams as Params, UserDetail, BaseResp, User, UserActivity, UsersPoolPutReq, UsersPoolAddReq, UsersPoolDelReq, UsersPool } from "@/services/global-api/adminComponents";
import OperationModal from './components/OperationModal';
import { ActivityDetailInfo } from './data';
import UsersPoolModal from './components/UsersPoolModal';
import MoreActionBtn from '../components/MoreBtn';

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param record
 */

const handleAdd = async (record: AddReq) => {
  const hide = message.loading('正在添加');

  try {
    await add(record);
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败');
    return false;
  }
};

/**
 * @en-US Update node
 * @zh-CN 更新节点
 *
 * @param record
 */

const handleUpdate = async (record: PutReq) => {
  const hide = message.loading('更新中...');
  try {
    await put(record);
    hide();
    message.success('更新成功');
    return true;
  } catch (error) {
    hide();
    message.error('更新失败');
    return false;
  }
};

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param id
 */

const handleRemove = async (id: number) => {
  const hide = message.loading('正在删除...');
  if (typeof id === 'undefined') return true;

  try {
    await del({ id });
    hide();
    message.success('删除成功');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败');
    return false;
  }
};

const UserList: React.FC = () => {
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();

  const [done, setDone] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<Item>();

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */

  const columns: ProColumns<Item>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      valueType: 'digit',
      hideInTable: true,
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: 'UUID',
      dataIndex: 'uuid',
      valueType: 'text',
      hideInTable: true,
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '用户名',
      dataIndex: 'name',
      // tip: 'The user uuid is the unique key',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrent(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '凭证',
      dataIndex: 'passport',
      valueType: 'text',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      valueType: 'text',
    },
    {
      title: '电话',
      dataIndex: 'phone',
      valueType: 'text',
    },
    {
      title: '积分',
      dataIndex: "score",
      valueType: 'digit',
    },
    {
      title: '地址',
      dataIndex: "address",
      valueType: 'text',
    },
    {
      title: '状态',
      dataIndex: 'status',
      // sorter: true,
      // hideInSearch: true,
      valueType: 'text',
      valueEnum: {
        0: {
          text: '未授权',
          status: 'Default',
        },
        1: {
          text: '正常',
          status: 'Success',
        },
        2: {
          text: '已冻结',
          status: 'Error',
        },
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 80,
      render: (_, record) => [
        <MoreActionBtn key="more" current={record}
          onEdit={(item) => { showEditModal(item) }}
          onDel={(id) => { delHandle(id) }}
        />,
      ],
    },
  ];

  const showEditModal = (item: Item) => {
    setVisible(true);
    setCurrent(item);
  };

  const delHandle = (user_id: number) => {
    Modal.confirm({
      title: '删除警告',
      content: '确定删除该用户吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const ok = await handleRemove(user_id)
        //刷新列表
        if (actionRef.current && ok) {
          actionRef.current.reload();
        }
      },
    });
  };

  const handleDone = () => {
    setDone(false);
    setVisible(false);
    setCurrent(undefined);
  };

  const handleSubmit = async (record: Item): Promise<boolean> => {
    const method = record?.id ? 'update' : 'add';
    let ok = false
    if (method === 'update') {
      ok = await handleUpdate(record)
    } else if (method === 'add') {
      ok = await handleAdd(record)
    }
    setDone(ok);
    //刷新列表
    if (actionRef.current && ok) {
      actionRef.current.reload();
    }
    return ok
  };

  //数据缓存
  const usersPoolCache = useRef<Map<number, UserDetail>>(new Map())
  const list = async (req: Params): Promise<BaseResp> => {
    const respData = await userDetails(req)
    const list = respData.data ? respData.data as UserDetail[] : [];
    const res = list.map<User>(item => {
      usersPoolCache.current.set(item.user.id, item);
      return item.user
    })
    respData.data = res
    return respData
  }

  //children render
  const handleUpdateUsersPool = async (req: UsersPoolPutReq) => {
    const hide = message.loading('更新中...');
    try {
      await usersPoolPut(req);
      hide();
      message.success('更新成功');
      return true;
    } catch (error) {
      hide();
      message.error('更新失败');
      return false;
    }
  }

  const handleAddUsersPool = async (req: UsersPoolAddReq) => {
    const hide = message.loading('正在添加');
    try {
      await usersPoolAdd(req);
      hide();
      message.success('添加成功');
      return true;
    } catch (error) {
      hide();
      message.error('添加失败');
      return false;
    }
  }

  const handleDelUsersPool = async (req: UsersPoolDelReq) => {
    const del = async () => {
      const hide = message.loading('正在删除');
      try {
        await usersPoolDel(req);
        hide();
        message.success('删除成功');
        //刷新列表
        actionRef.current?.reload();
        return true;
      } catch (error) {
        hide();
        message.error('删除失败');
        return false;
      }
    }
    Modal.confirm({
      title: '删除警告',
      content: '确定删除该用户参与的活动吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => del(),
    });
  }

  const [usersPoolModelVisible, setUsersPoolModelVisible] = useState<boolean>(false);
  const [usersPoolModelCurrent, setUsersPoolModelCurrent] = useState<ActivityDetailInfo>()
  const [usersPoolModelDone, setUsersPoolModelDone] = useState<boolean>(false)

  const usersPoolModelOnDone = () => {
    setUsersPoolModelDone(false);
    setUsersPoolModelVisible(false);
    setUsersPoolModelCurrent(undefined);
  }

  const usersPoolModelSubmit = async (record: UsersPool): Promise<boolean> => {
    const method = record?.id ? 'update' : 'add';
    let ok: boolean = false
    if (method === 'update') {
      ok = await handleUpdateUsersPool(record)
    } else if (method === 'add') {
      ok = await handleAddUsersPool(record)
    }
    setUsersPoolModelDone(ok);
    //刷新列表
    ok && actionRef.current?.reload();
    return ok
  }

  const showUsersPoolModal = (activityDetailInfo: ActivityDetailInfo) => {
    setUsersPoolModelCurrent(activityDetailInfo)
    setUsersPoolModelVisible(true);
  }

  const showAddUsersPoolModal = (user: User) => {
    const pd: any = { user }
    showUsersPoolModal(pd as unknown as ActivityDetailInfo)
  }

  const expandedRowRender = (user: Item) => {
    if (!usersPoolCache.current.has(user.id)) {
      message.error(`${user.name}参与活动数据丢失！`)
      return <></>
    }
    const cache = usersPoolCache.current.get(user.id)?.user_activities
    const data = cache?.map<ActivityDetailInfo>((item: UserActivity, index: number) => {
      return {
        key: index,

        name: item.activity.name,
        score: item.users_pool.score,  //在某活动中的积分
        status: item.users_pool.status,  //状态
        user: user,  //参与用户信息
        usersPool: item.users_pool,
        activity: item.activity
      }
    });
    return (
      <ProTable
        columns={[
          { title: '活动名称', dataIndex: 'name', key: 'name', valueType: "text" },
          { title: '积分', dataIndex: 'score', key: 'score', valueType: "digit" },
          {
            title: '状态',
            dataIndex: 'status',
            valueType: 'select',
            valueEnum: {
              1: {
                text: '允许',
                status: 'Success',
              },
              0: {
                text: '禁止',
                status: 'Default',
              },
            },
          },
          {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            valueType: 'option',
            render: (_, record: ActivityDetailInfo) => [
              <a href="#!" onClick={(e) => { e.preventDefault(); showUsersPoolModal(record) }} key="updateUsersPool">编辑</a>,
              <a href="#!" hidden={true} onClick={(e) => { e.preventDefault(); handleDelUsersPool({ id: record.usersPool.id }) }} key="delUsersPool">删除</a>
            ],
          },
        ]}
        headerTitle={false}
        search={false}
        options={false}
        dataSource={data}
        pagination={false}
        footer={(_prizeDetails: readonly ActivityDetailInfo[]) => [
          <Button key="addUsersPool" onClick={() => { showAddUsersPoolModal(user); }} type="dashed" icon={<PlusOutlined />} >添加活动</Button>
        ]}
      />
    );
  };

  return (
    <PageContainer>
      <ProTable<Item, Params>
        headerTitle={'用户列表'}
        actionRef={actionRef}
        rowKey="id"
        // search={false}
        // options={{
        //   search: true,
        // }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setVisible(true);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={list}
        columns={columns}
        expandable={{ expandedRowRender }}
      />
      <OperationModal
        done={done}
        visible={visible}
        current={current}
        onDone={handleDone}
        onSubmit={handleSubmit}
      />

      <UsersPoolModal
        done={usersPoolModelDone}
        visible={usersPoolModelVisible}
        onDone={usersPoolModelOnDone}
        onSubmit={usersPoolModelSubmit}
        current={usersPoolModelCurrent}
      />

      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrent(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {current?.name && (
          <ProDescriptions<Item>
            column={2}
            title={current?.name}
            request={async () => ({
              data: current || {},
            })}
            params={{
              id: current?.id,
            }}
            columns={columns as ProDescriptionsItemProps<Item>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default UserList;
