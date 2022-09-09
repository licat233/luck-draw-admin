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
import dayjs from 'dayjs';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import { adminerAdd as add , adminerDel as del, adminerList as list, adminerPut as put} from '@/services/global-api/admin-custom';
import { Adminer as Item, AdminerAddReq as AddReq, AdminerPutReq as PutReq, AdminerListReqParams as Params} from "@/services/global-api/adminComponents";
import OperationModal from './components/OperationModal';

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


const AdminerList: React.FC = () => {
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();

  const [done, setDone] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<Item>();

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */

  const defaultAvatar = "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png";

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
      title: '头像',
      dataIndex: 'avatar',
      valueType: "avatar",
      width: 50,
      hideInSearch: true,
      renderText: (_, record) => {
        return record.avatar || defaultAvatar;
      }
    },
    {
      title: '名称',
      dataIndex: 'name',
      // tip: 'The adminer uuid is the unique key',
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
      title: '账号',
      dataIndex: 'passport',
      valueType: 'text',
    },
    {
      title: '密码',
      dataIndex: 'password',
      valueType: 'password',
      hideInTable: true,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      valueType: 'text',
    },
    {
      title: '状态',
      dataIndex: 'status',
      sorter: true,
      valueEnum: {
        0: {
          text: '关闭',
          status: 'Default',
        },
        1: {
          text: '正常',
          status: 'Success',
        },
        2: {
          text: '审核中',
          status: 'Error',
        },
      },
    },
    {
      title: '超管?',
      dataIndex: 'is_super_admin',
      sorter: true,
      valueEnum: {
        0: {
          text: '否',
          status: 'Nomarl',
        },
        1: {
          text: '是',
          status: 'Nomarl',
        },
      },
    },
    {
      title: '登录次数',
      dataIndex: 'login_count',
      sorter: true,
      hideInForm: true,
    },
    {
      title: '上次登录时间',
      sorter: true,
      dataIndex: 'last_login',
      valueType: 'dateTime',
      hideInForm: true,
      render: (_, record) => {
        if (!record.last_login) {
          return "数据异常"
        }
        return dayjs(record.last_login * 1000).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <MoreBtn key="more" item={record} />,
      ],
    },
  ];

  const operationList = (): ItemType[] => {
    return [
      {
        key: 'edit',
        itemIcon: <EditTwoTone twoToneColor='#245cfc'></EditTwoTone>,
        label: '编辑'
      },
      {
        key: 'delete',
        itemIcon: <DeleteTwoTone twoToneColor='#ce2e3f'></DeleteTwoTone>,
        danger: true,
        label: '删除',
      },
    ]
  }

  const MoreBtn: React.FC<{
    item: Item;
  }> = ({ item }) => (
    <Dropdown
      overlay={
        <Menu
          onClick={({ key }) => editAndDelete(key, item)}
          items={operationList()}
        >
        </Menu>
      }
    >
      <a href="#!" onClick={(e) => {e.preventDefault()}}>
        操作 <DownOutlined />
      </a>
    </Dropdown>
  );

  const showEditModal = (item: Item) => {
    setVisible(true);
    setCurrent(item);
  };

  const editAndDelete = (key: string | number, currentItem: Item) => {
    if (key === 'edit') {
      showEditModal(currentItem);
    }
    else if (key === 'delete') {
      Modal.confirm({
        title: '删除警告',
        content: '确定删除该管理员吗？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => handleRemove(currentItem.id),
      });
    }
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
    } if (method === 'add') {
      ok = await handleAdd(record)
    }
    setDone(ok);
    //刷新列表
    if (actionRef.current && ok) {
      actionRef.current.reload();
    }
    return ok
  };

  return (
    <PageContainer>
      <ProTable<Item, Params>
        headerTitle={'管理员列表'}
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
        dateFormatter="number"
      />
      <OperationModal
        done={done}
        visible={visible}
        current={current}
        onDone={handleDone}
        onSubmit={handleSubmit}
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
              id: current?.name,
            }}
            columns={columns as ProDescriptionsItemProps<Item>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default AdminerList;
