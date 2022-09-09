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
import { activityAdd as add, activityDel as del, activityList as list, activityPut as put } from '@/services/global-api/admin-custom';
import { Activity as Item, ActivityAddReq as AddReq, ActivityPutReq as PutReq, ActivityListReq as Params } from "@/services/global-api/adminComponents";
import OperationModal from './components/OperationModal';
import { projectEnumList } from '@/services/global-api/admin-custom';

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

const formatDate = (timestamp: number | undefined): string => {
  if (!timestamp) return "~"
  return dayjs(timestamp * 1000).format('YYYY-MM-DD HH:mm:ss')
}

const ActivityList: React.FC = () => {
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
      title: '名称',
      dataIndex: 'name',
      // tip: 'The activity uuid is the unique key',
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
      title: '所属项目',
      dataIndex: "project_id",
      valueType: 'select',
      request: projectEnumList,
    },
    {
      title: '活动状态',
      dataIndex: 'status',
      valueType: 'switch',
      valueEnum: {
        0: {
          text: '关闭',
          status: 'Default',
        },
        1: {
          text: '开启',
          status: 'Success',
        },
      },
    },
    {
      title: '参与权限',
      dataIndex: 'pattern',
      valueType: 'text',
      valueEnum: {
        0: {
          text: '仅客户',
          status: 'normal',
        },
        1: {
          text: '所有人',
          status: 'normal',
        },
      },
    },
    {
      title: '每人最大抽奖数',
      dataIndex: 'max_count',
      valueType: "digit",
      render: (_, record) => {
        if (record.max_count === -1) {
          return "无限制"
        }
        return record.max_count + ' 次';
      },
    },
    {
      title: '每人最大获奖数',
      dataIndex: 'max_prizes',
      valueType: "digit",
      render: (_, record) => {
        if (record.max_prizes === -1) {
          return "无限制"
        }
        return record.max_prizes + ' 次';
      },
    },
    {
      title: '活动时间',
      valueType: 'dateTimeRange',
      dataIndex: "range_time",
      render: (_, record) => {
        if (!record.start_time || !record.end_time) {
          return "数据异常"
        }
        return formatDate(record.start_time) + " - " + formatDate(record.end_time);
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 80,
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
        content: '确定删除该项目吗？',
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
        headerTitle={'项目列表'}
        actionRef={actionRef}
        rowKey="id"
        // search={false}
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

export default ActivityList;
