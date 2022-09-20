import { DeleteTwoTone, DownOutlined, EditTwoTone, PlusOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import '@umijs/max';
import { Button, Drawer, Dropdown, Modal, Menu, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import { activityPrizes, luckerDel as del,luckerAdd as add, luckerDetails as list, luckerPut as put, prizeGradeEnumList, projectActivity, projectEnumList } from '@/services/global-api/admin-custom';
import { LuckerDetails, LuckerPutReq as PutReq, LuckerAddReq as AddReq, Lucker, User, Prize, Activity, Project, LuckerDetailsReq as Params, ActivityPrize, Enum } from "@/services/global-api/adminComponents";
import OperationModal from './components/OperationModal';
import dayjs from 'dayjs';
import { ReqStorage } from './data';
import { ProFormInstance } from '@ant-design/pro-form';

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

const lucker_status_enum = {
  "0": {
    text: '未领',
    status: 'Processing',
  },
  "1": {
    text: '已领',
    status: 'Success',
  },
  "-1": {
    text: '弃领',
    status: 'Default',
  },
}

// type LuckerInfo = {
//   user_name: string //中奖人名称
//   prize_name: string //奖品名称
//   prize_grade_name: string //奖品级别
//   activity_name: string //活动名称
//   project_name: string //项目名称
//   luck_date: number //中奖时间
//   lucker_status: number //状态
//   lucker_ip: string //ip
//   lucker: Lucker
// }



const LuckerList: React.FC = () => {
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();

  const [done, setDone] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  // const [current, setCurrent] = useState<LuckerDetails>();
  const [currentDetails, setCurrentDetails] = useState<LuckerDetails>();
  const [currentDesc, setCurrentDesc] = useState<User | Prize | Activity | Project>();
  const [currentColumns, setCurrentColumns] = useState<ProColumns<LuckerDetails>[] | ProColumns<User>[] | ProColumns<Prize>[] | ProColumns<Activity>[] | ProColumns<Project>[]>();

  const [prizeGradeEnum, setPrizeGradeEnum] = useState<Enum[]>()
  const [projectEnum, setProjectEnum] = useState<Enum[]>()
  const prizeGradeEnumListStatus = useRef<boolean>(false)
  const projectEnumListStatus = useRef<boolean>(false)
  useEffect(() => {
    if (!prizeGradeEnum && !prizeGradeEnumListStatus.current) {
      prizeGradeEnumListStatus.current = true
      prizeGradeEnumList().then((result: Enum[]) => {
        setPrizeGradeEnum(result)
      })
    }
    if (!projectEnum && !projectEnumListStatus.current) {
      projectEnumListStatus.current = true
      projectEnumList().then((result: Enum[]) => {
        setProjectEnum(result)
      })
    }
  })

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */

  let activityOptionsMark = useRef(0);
  let prizeOptionsMark = useRef(0);
  const [activityOptions, setActivityOptions] = useState<Enum[]>()
  const [prizeOptions, setPrizeOptions] = useState<Enum[]>()

  const formRef = useRef<ProFormInstance>();

  const httpStore = useRef<ReqStorage>({
    activity: {},
    prize: {},
  })

  const RequestActivityOptionsList = async (project_id: number | undefined): Promise<Enum[]> => {
    if (typeof project_id === 'undefined') return [];
    if (httpStore.current.activity[project_id]) return httpStore.current.activity[project_id]
    try {
      const res = await projectActivity({ project_id })
      if (res.success && res.data) {
        const list = (res.data as Activity[]).map<Enum>(item => {
          return {
            label: item.name,
            value: item.id
          }
        })
        httpStore.current.activity[project_id] = list
        return list
      }
    } catch (error: any) {
      message.error(error.message)
    }
    httpStore.current.activity[project_id] = []
    return []
  }

  const RequestPrizeOptionsList = async (activity_id: number | undefined): Promise<Enum[]> => {
    if (typeof activity_id === 'undefined') return [];
    if (httpStore.current.prize[activity_id]) return httpStore.current.prize[activity_id]
    try {
      const res = await activityPrizes({ activity_id })
      if (res.success && res.data) {
        const totalLuckValue = (res.data as Array<ActivityPrize>).reduce((total, item: ActivityPrize) => {
          return total + item.prizes_pool.luck_value
        }, 0)
        const list = (res.data as Array<ActivityPrize>).map<Enum>(item => {
          return {
            label: `${item.prize.name}【${item.prize_grade.name}】-概率${CalculatePercentage(totalLuckValue, item.prizes_pool.luck_value)}`,
            value: item.prizes_pool.id
          }
        })
        httpStore.current.prize[activity_id] = list
        return list
      }
    } catch (error: any) {
      message.error(error.message)
    }
    httpStore.current.prize[activity_id] = []
    return []
  }

  const [activityIndex, setActivityIndex] = useState<"activity_name" | "activity_id">("activity_name")
  const [activityType, setActivityType] = useState<"text" | "select">("text")

  const [prizeIndex, setPrizeIndex] = useState<"prize_name" | "prize_id">("prize_name")
  const [prizeType, setPrizeType] = useState<"text" | "select">("text")

  const columns: ProColumns<LuckerDetails>[] = [
    {
      title: '用户名',
      dataIndex: "user_name",
      key: "user_name",
      valueType: 'text',
      render: (_, record) => {
        return (
          <a
            href="#!"
            onClick={() => {
              setCurrentDesc(record.user)
              setCurrentColumns(userColumns)
              setShowDetail(true);
            }}
          >
            {record.user.name}
          </a>
        );
      }
    },
    {
      title: '项目',
      dataIndex: "project_id",
      key: "project_id",
      valueType: 'select',
      render: (_, record) => {
        return (
          <a
            href="#!"
            onClick={() => {
              setCurrentDesc(record.project)
              setCurrentColumns(projectColumns)
              setShowDetail(true);
            }}
          >
            {record.project.name}
          </a>
        );
      },
      fieldProps: {
        options: projectEnum || [],
        onChange: async (val: number|undefined) => {
          if (Object.prototype.toString.call(val) !== '[object Number]') {
            formRef.current?.setFieldValue("activity_id", undefined)
            formRef.current?.setFieldValue("prize_id", undefined)
            setActivityIndex("activity_name")
            setActivityType("text")
            setPrizeIndex("prize_name")
            setPrizeType("text")
            return
          }
          activityOptionsMark.current = new Date().valueOf()
          const markNumber = activityOptionsMark.current
          const res = await RequestActivityOptionsList(val)
          if (markNumber === activityOptionsMark.current) { //表示是最新请求
            setActivityOptions(res) //更新活动选项
            setPrizeOptions(undefined) //重置产品选项
            formRef.current?.setFieldValue("activity_id", undefined)
            formRef.current?.setFieldValue("prize_id", undefined)
            setActivityIndex("activity_id")
            setActivityType("select")
            setPrizeIndex("prize_name")
            setPrizeType("text")
            // console.log(formRef.current?.getFieldValue("activity_id"))
          }
        },
      },
    },
    {
      title: '活动',
      dataIndex: activityIndex,
      valueType:  activityType,
      // request: activityEnumListRequest,
      render: (_, record) => {
        return (
          <a
            href="#!"
            onClick={() => {
              setCurrentDesc(record.activity)
              setCurrentColumns(activityColumns)
              setShowDetail(true);
            }}
          >
            {record.activity.name}
          </a>
        );
      },
      fieldProps: {
        options: activityOptions || [],
        onChange: async (val: number|undefined) => {
          if (Object.prototype.toString.call(val)!== '[object Number]') {
            formRef.current?.setFieldValue("prize_id", undefined) //重置产品选项
            setPrizeIndex("prize_name")
            setPrizeType("text")
            return
          }
          prizeOptionsMark.current = new Date().valueOf()
          const markNumber = prizeOptionsMark.current
          const res = await RequestPrizeOptionsList(val)
          if (markNumber === prizeOptionsMark.current) { //表示是最新请求
            setPrizeOptions(res) //更新产品选项
            formRef.current?.setFieldValue("prize_id", undefined) //重置产品选项
            setPrizeIndex("prize_id")
            setPrizeType("select")
          }
        },
      }
    },
    {
      title: '奖品',
      dataIndex: prizeIndex,
      valueType:  prizeType,
      fieldProps: {
        options: prizeOptions || [],
      },
      render: (_, record) => {
        return (
          <a
            href="#!"
            onClick={() => {
              setCurrentDesc(record.prize)
              setCurrentColumns(prizeColumns)
              setShowDetail(true);
            }}
          >
            {record.prize.name}
          </a>
        );
      }
    },
    {
      title: '等级',
      dataIndex: "prize_grade_id",
      valueType: 'select',
      render: (_, record) => {
        return record.prize_grade.name
      },
      fieldProps: {
        options: prizeGradeEnum || [],
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      sorter: true,
      valueType: 'select',
      valueEnum: lucker_status_enum,
      render: (_, record) => {
        return lucker_status_enum[record.lucker.status + ""].text;
      },
    },
    {
      title: '抽奖时间',
      dataIndex: 'luck_date',
      valueType: 'date',
      render: (_, record) => {
        return formatDate(record.lucker.luck_date);
      },
    },
    {
      title: 'IP',
      dataIndex: "ip",
      valueType: 'text',
      render: (_, record) => {
        return record.lucker.ip;
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 80,
      render: (_, record) => [
        <MoreBtn key="more" item={record.lucker} details={record} />,
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

  const userColumns: ProColumns<User>[] = [
    {
      title: 'Id',
      dataIndex: 'id',
      valueType: 'digit',
    },
    {
      title: 'UUID',
      dataIndex: 'uuid',
      valueType: 'text',
    },
    {
      title: '名称',
      dataIndex: 'name',
      valueType: 'text',
    },
    {
      title: '账号',
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
      title: '地址',
      dataIndex: 'address',
      valueType: 'text',
    },
    {
      title: '积分',
      dataIndex: 'score',
      valueType: 'digit',
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
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
    }
  ];

  const prizeColumns: ProColumns<Prize>[] = [
    {
      title: 'Id',
      dataIndex: 'id',
      valueType: 'digit',
    },
    {
      title: 'UUID',
      dataIndex: 'uuid',
      valueType: 'text',
    },
    {
      title: '名称',
      dataIndex: 'name',
      valueType: 'text',
    },
    {
      title: '图片',
      dataIndex: 'image',
      valueType: 'image',
    },
    {
      title: '价格',
      dataIndex: 'price',
      valueType: 'money',
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        0: {
          text: '无货',
          status: 'Default',
        },
        1: {
          text: '有货',
          status: 'Success',
        },
      },
    }
  ]

  const activityColumns: ProColumns<Activity>[] = [
    {
      title: 'Id',
      dataIndex: 'id',
      valueType: 'digit',
    },
    {
      title: 'UUID',
      dataIndex: 'uuid',
      valueType: 'text',
    },
    {
      title: '名称',
      dataIndex: 'name',
      valueType: 'text',
    },
    {
      title: '所属项目',
      dataIndex: "project_id",
      valueType: 'select',
      request: projectEnumList,
    },
    {
      title: '状态',
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
      title: '参与权限',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        0: {
          text: '客户',
          status: 'Default',
        },
        1: {
          text: '所有人',
          status: 'Success',
        },
      },
    },
    {
      title: '每人最大抽奖数',
      dataIndex: 'max_count',
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
      render: (_, record) => {
        if (record.max_prizes === -1) {
          return "无限制"
        }
        return record.max_prizes + ' 次';
      },
    },
    {
      title: '开始时间',
      dataIndex: 'start_time',
      valueType: 'dateTime',
      fieldProps: {
        format: 'DD.MM.YYYY HH:mm:ss',
      },
    },
    {
      title: '结束时间',
      dataIndex: 'end_time',
      valueType: 'dateTime',
      fieldProps: {
        format: 'DD.MM.YYYY HH:mm:ss',
      },
    },
  ]

  const projectColumns: ProColumns<Project>[] = [
    {
      title: 'Id',
      dataIndex: 'id',
      valueType: 'digit',
    },
    {
      title: 'UUID',
      dataIndex: 'uuid',
      valueType: 'text',
    },
    {
      title: '名称',
      dataIndex: 'name',
      valueType: 'text',
    },
    {
      title: '状态',
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
  ]

  const renderDescription = function <Type extends Record<string, any>>(entity: Type, cloumn: ProColumns<LuckerDetails>[] | ProColumns<User>[] | ProColumns<Prize>[] | ProColumns<Activity>[] | ProColumns<Project>[] | undefined): JSX.Element {
    return (
      <ProDescriptions<Type>
        column={2}
        title={entity?.name}
        request={async () => ({
          data: entity || {},
        })}
        params={{
          id: entity?.id,
        }}
        columns={cloumn as ProDescriptionsItemProps<Type>[]}
      />
    )
  }

  const MoreBtn: React.FC<{
    item: Lucker;
    details: LuckerDetails;
  }> = ({ item, details }) => (
    <Dropdown
      overlay={
        <Menu
          onClick={({ key }) => editAndDelete(key, item, details)}
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

  const showEditModal = (item: Lucker, details: LuckerDetails) => {
    setVisible(true);
    // setCurrent(details);
    setCurrentDetails(details);
  };

  const editAndDelete = (key: string | number, currentItem: Lucker, details: LuckerDetails) => {
    if (key === 'edit') {
      showEditModal(currentItem, details);
    }
    else if (key === 'delete') {
      Modal.confirm({
        title: '删除警告',
        content: '确定删除该奖品吗？',
        okText: '确认',
        cancelText: '取消',
        onOk: async () => {
          const ok = await handleRemove(currentItem.id)
          //刷新列表
          if (actionRef.current && ok) {
            actionRef.current.reload();
          }
        },
      });
    }
  };

  const handleDone = () => {
    setDone(false);
    setVisible(false);
    // setCurrent(undefined);
    setCurrentDetails(undefined);
  };

  const handleSubmit = async (record: PutReq): Promise<boolean> => {
    const method = record.id ? 'update' : 'add';
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

  return (
    <PageContainer>
      <ProTable<LuckerDetails, Params>
        headerTitle={'奖品列表'}
        actionRef={actionRef}
        rowKey={(record) => {
          return record.lucker.id
        }}
        search={{

        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            hidden={true}
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
        formRef={formRef}
        onReset={() => {
          setActivityOptions(undefined)
          setPrizeOptions(undefined)
          setActivityIndex("activity_name")
          setActivityType("text")
          setPrizeIndex("prize_name")
          setPrizeType("text")
        }}
      />
      <OperationModal
        done={done}
        visible={visible}
        // current={current}
        details={currentDetails}
        onDone={handleDone}
        onSubmit={handleSubmit}
      />

      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          // setCurrent(undefined);
          setShowDetail(false);
          // setCurrentDetails(undefined);
          setCurrentDesc(undefined);
        }}
        closable={false}
      >
        {currentDesc && currentColumns && renderDescription(currentDesc, currentColumns)}
      </Drawer>
    </PageContainer>
  );
};

//需要显示详情信息的字段：用户，奖品，活动，项目

export default LuckerList;

function CalculatePercentage(totalLuckValue: number, luck_value: number): string {
  return (luck_value * 100 / totalLuckValue).toFixed(2) + "%"
}

