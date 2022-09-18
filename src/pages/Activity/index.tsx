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
import { activityAdd as add, activityDel as del, activityDetails, activityPut as put, prizesPoolAdd, prizesPoolDel, prizesPoolPut, activityPatternEnumList } from '@/services/global-api/admin-custom';
import { Activity as Item, ActivityAddReq as AddReq, ActivityPutReq as PutReq, ActivityListReq as Params, ActivityPrize, Activity, ActivityDetail, BaseResp, PrizesPool, PrizesPoolPutReq, PrizesPoolAddReq, PrizesPoolDelReq } from "@/services/global-api/adminComponents";
import OperationModal from './components/OperationModal';
import { projectEnumList } from '@/services/global-api/admin-custom';
import { PrizeDetailInfo } from './data';
import PrizesPoolModal from './components/PrizesPoolModel';

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
  if (typeof id === 'undefined') return true;
  const hide = message.loading('正在删除...');
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
      valueType: 'select',
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
      title: '模式',
      dataIndex: 'pattern',
      valueType: 'select',
      request: activityPatternEnumList,
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
      <a href="#!" onClick={(e) => { e.preventDefault() }}>
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

  /** 当前缓存策略存在的问题: 
   * ①当分页较多时，会缓存全部分页内的数据，造成较大的内存开销，解决方案：每次调用list函数时，应该clear当前户缓存
   * ②应当使用Map结构存储
   * ③命名不够清晰，推荐：prizesPoolCache
   */
  const prizesPoolCache = useRef<Map<number, ActivityDetail>>(new Map())
  const list = async (req: Params): Promise<BaseResp> => {
    prizesPoolCache.current.clear();
    const respData = await activityDetails(req)
    const list = respData.data ? respData.data as ActivityDetail[] : [];
    const res = list.map<Activity>(item => {
      prizesPoolCache.current.set(item.activity.id, item);
      return item.activity
    })
    respData.data = res
    return respData
  }

  //children 
  const [prizesPoolModelVisible, setPrizesPoolModelVisible] = useState<boolean>(false);
  const [prizesPoolModelCurrent, setPrizesPoolModelCurrent] = useState<PrizeDetailInfo>()
  const [prizesPoolModelDone, setPrizesPoolModelDone] = useState<boolean>(false)

  const prizesPoolModelOnDone = () => {
    setPrizesPoolModelDone(false);
    setPrizesPoolModelVisible(false);
    setPrizesPoolModelCurrent(undefined);
  }

  const handleUpdatePrizesPool = async (req: PrizesPoolPutReq) => {
    const hide = message.loading('更新中...');
    try {
      await prizesPoolPut(req);
      hide();
      message.success('更新成功');
      return true;
    } catch (error) {
      hide();
      message.error('更新失败');
      return false;
    }
  }

  const handleAddPrizesPool = async (req: PrizesPoolAddReq) => {
    const hide = message.loading('正在添加');
    try {
      await prizesPoolAdd(req);
      hide();
      message.success('添加成功');
      return true;
    } catch (error) {
      hide();
      message.error('添加失败');
      return false;
    }
  }

  const handleDelPrizesPool = async (req: PrizesPoolDelReq) => {
    const del = async () => {
      const hide = message.loading('正在删除');
      try {
        await prizesPoolDel(req);
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
      content: '确定删除该活动的奖品吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => del(),
    });
  }

  const prizesPoolModelSubmit = async (record: PrizesPool): Promise<boolean> => {
    const method = record?.id ? 'update' : 'add';
    let ok: boolean = false
    if (method === 'update') {
      ok = await handleUpdatePrizesPool(record)
    } else if (method === 'add') {
      ok = await handleAddPrizesPool(record)
    }
    setPrizesPoolModelDone(ok);
    //刷新列表
    ok && actionRef.current?.reload();
    return ok
  }

  const showPrizesPoolModal = (prizeinfo: PrizeDetailInfo | undefined) => {
    setPrizesPoolModelCurrent(prizeinfo)
    setPrizesPoolModelVisible(true);
  };

  const showAddPrizesPoolModal = (activity: Activity) => {
    const pd: any = { activity }
    showPrizesPoolModal(pd as unknown as PrizeDetailInfo)
  }


  const expandedRowRender = (activity: Item) => {
    if (!prizesPoolCache.current.has(activity.id)) {
      message.error(`${activity.name}活动奖品数据丢失！`)
      return <></>
    }
    const cache = prizesPoolCache.current.get(activity.id)?.activity_prizes
    const data = cache?.map<PrizeDetailInfo>((item: ActivityPrize, index: number) => {
      return {
        index: index,
        id: item.prizes_pool.id,
        uuid: item.prizes_pool.uuid,
        key: index,
        name: item.prize.name,
        image: item.prize.image,
        price: item.prize.price,
        grade: item.prize_grade.name,
        total: item.prizes_pool.total,
        status: item.prizes_pool.status,
        remainder: item.prizes_pool.remainder,
        prizesPool: item.prizes_pool,
        activity: activity
      }
    });
    return (
      <ProTable
        columns={[
          { title: '奖品名称', dataIndex: 'name', key: 'name', valueType: 'text' },
          { title: '图片', dataIndex: 'image', key: 'image', valueType: 'image' },
          { title: '价格', dataIndex: 'price', key: 'price', valueType: 'digit' },
          { title: '等级', dataIndex: 'grade', key: 'grade', valueType: 'text' },
          { title: '数量', dataIndex: 'total', key: 'total', valueType: 'digit' },
          { title: '剩余', dataIndex: 'remainder', key: 'remainder', valueType: 'digit' },
          {
            title: '状态',
            dataIndex: 'status',
            valueType: 'select',
            valueEnum: {
              1: {
                text: '启用',
                status: 'Success',
              },
              0: {
                text: '禁用',
                status: 'Default',
              },
            },
          },
          {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            valueType: 'option',
            render: (_, record: PrizeDetailInfo) => [
              <a href="#!" onClick={(e) => { e.preventDefault(); showPrizesPoolModal(record) }} key="updatePrizesPool">编辑</a>,
              <a href="#!" onClick={(e) => { e.preventDefault(); handleDelPrizesPool({ id: record.prizesPool.id }) }} key="delPrizesPool">删除</a>
            ],
          },
        ]}
        // actionRef={prizesPoolRef}
        rowKey="key"
        headerTitle={false}
        search={false}
        options={false}
        dataSource={data}
        pagination={false}
        footer={(_prizeDetails: readonly PrizeDetailInfo[]) => [
          <Button key="addPrizesPool" onClick={() => { showAddPrizesPoolModal(activity); }} type="dashed" icon={<PlusOutlined />} >添加奖品</Button>
        ]}
      />
    );
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
        expandable={{ expandedRowRender }}
      />
      <OperationModal
        done={done}
        visible={visible}
        current={current}
        onDone={handleDone}
        onSubmit={handleSubmit}
      />

      <PrizesPoolModal
        done={prizesPoolModelDone}
        visible={prizesPoolModelVisible}
        onDone={prizesPoolModelOnDone}
        onSubmit={prizesPoolModelSubmit}
        current={prizesPoolModelCurrent}
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

export default ActivityList;
