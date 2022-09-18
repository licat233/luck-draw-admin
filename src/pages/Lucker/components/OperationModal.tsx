import { FC, useEffect, useRef, useState } from 'react';
import {
  ModalForm,
  ProFormSelect,
  ProFormDateTimePicker,
  ProFormInstance,
  ProFormText,
  ProFormDigit,
} from '@ant-design/pro-form';
import styles from '../style.less';
import { Activity, ActivityPrize, activityPrizes, LuckerDetails, LuckerPutReq, projectActivity, projectEnumList } from '@/services/global-api/admin-custom';
import { message } from 'antd';
import { DefaultOptionType } from 'antd/lib/select';
import { luckerFormData, ReqStorage } from '../data';
import dayjs from 'dayjs';

type OperationModalProps = {
  done: boolean;
  visible: boolean;
  // current: Partial<Lucker> | undefined;
  details: Partial<LuckerDetails> | undefined;
  onDone: () => void;
  onSubmit: (values: LuckerPutReq) => Promise<boolean>;
};


const OperationModal: FC<OperationModalProps> = (props) => {
  const { done, visible, details, onDone, onSubmit, children } = props;
  if (!visible) {
    return null;
  }

  /**
   * 先选择项目，获取活动
   * 编辑模式：中奖用户暂时不可更改
   */


  const activityOptionsMark = useRef(0);
  const prizeOptionsMark = useRef(0);
  const [projectId, setProjectId] = useState<number | undefined>(details?.project?.id)
  const [activityId, setActivityId] = useState<number | undefined>(details?.activity?.id)

  const [activityOptions, setActivityOptions] = useState<DefaultOptionType[]>()
  const [prizeOptions, setPrizeOptions] = useState<DefaultOptionType[]>()

  const formRef = useRef<ProFormInstance>();

  const initActivityOptionsState = useRef<boolean>(false)
  const initActivityOptions = async () => {
    if (initActivityOptionsState.current) return
    initActivityOptionsState.current = true
    const res = await RequestActivityOptionsList(projectId)
    setActivityOptions(res)
    initActivityOptionsState.current = false
  }

  const initPrizeOptionsState = useRef<boolean>(false)
  const initPrizeOptions = async () => {
    if (initPrizeOptionsState.current) return
    initPrizeOptionsState.current = true
    const res = await RequestPrizeOptionsList(activityId)
    setPrizeOptions(res)
    initPrizeOptionsState.current = false
  }

  useEffect(() => {
    if (typeof activityOptions === "undefined") {
      initActivityOptions()
    }
    if (typeof prizeOptions === "undefined") {
      initPrizeOptions()
    }
  }, [activityOptions, prizeOptions])

  //避免频繁的请求数据，做一个仓储
  // const storage: ReqStorage = {
  //   activity: {},
  //   prize: {},
  // }

  const httpStore = useRef<ReqStorage>({
    activity: {},
    prize: {},
  })

  const RequestActivityOptionsList = async (project_id: number | undefined): Promise<DefaultOptionType[]> => {
    if (typeof project_id === 'undefined') return [];
    if (httpStore.current.activity[project_id]) return httpStore.current.activity[project_id]
    try {
      const res = await projectActivity({ project_id })
      if (res.success && res.data) {
        const list = (res.data as Activity[]).map<DefaultOptionType>(item => {
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
    return []
  }

  const CalculatePercentage = (total: number, num: number): string => (num * 100 / total).toFixed(2) + "%"

  const RequestPrizeOptionsList = async (activity_id: number | undefined): Promise<DefaultOptionType[]> => {
    if (typeof activity_id === 'undefined') return [];
    if (httpStore.current.prize[activity_id]) return httpStore.current.prize[activity_id]
    try {
      const res = await activityPrizes({ activity_id })
      if (res.success && res.data) {
        const totalLuckValue = (res.data as Array<ActivityPrize>).reduce((total, item: ActivityPrize) => {
          return total + item.prizes_pool.luck_value
        }, 0)
        const list = (res.data as Array<ActivityPrize>).map<DefaultOptionType>(item => {
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

  const currentFormData: Partial<luckerFormData> = {
    project_id: details?.project?.id,
    activity_id: details?.activity?.id,
    prize_id: details?.prize?.id,
    prize_grade: details?.prize_grade?.id,
    ...details?.lucker,
  }

  if (currentFormData.luck_date) {
    currentFormData.luck_date = currentFormData.luck_date * 1000
  }

  return (
    <ModalForm<LuckerPutReq>
      visible={visible}
      title={done ? null : `抽奖单${details?.lucker ? '编辑' : '添加'}`}
      className={styles.standardListForm}
      width={375}
      onFinish={async (values) => {
        values.luck_date = dayjs(values.luck_date).unix()
        const params: LuckerPutReq = {
          id: values.id,
          uuid: values.uuid,
          user_id: values.user_id,
          prizes_pool_id: values.prizes_pool_id,
          status: values.status,
          luck_date: values.luck_date,
          ip: values.ip || "",
        }
        const ok = await onSubmit(params);
        ok && onDone();
      }}
      initialValues={currentFormData}
      submitter={{
        render: (_, dom) => (done ? null : dom),
      }}
      trigger={<>{children}</>}
      modalProps={{
        onCancel: () => onDone(),
        destroyOnClose: true,
        bodyStyle: done ? { padding: '72px 0' } : {},
      }}
      formRef={formRef}
      // onValuesChange={(values, putReq)=>{
      //   console.log(values) //适用于实时编辑更新
      // }}
    >
      <ProFormDigit
        name="id"
        hidden={true}
      />
      <ProFormText
        name="uuid"
        hidden={true}
      />
      <ProFormSelect
        rules={[
          {
            required: true,
            message: '必填项',
          },
        ]}
        width="md"
        name="user_id"
        label='中奖用户'
        disabled={true}
        options={[
          {
            label: details?.user?.name,
            value: details?.lucker?.user_id
          },
        ]}
      />
      <ProFormSelect
        rules={[
          {
            required: true,
            message: '必填项',
          },
        ]}
        width="md"
        name="project_id"
        label='中奖项目'
        request={projectEnumList}
        fieldProps={{
          onChange: async (val: number) => {
            activityOptionsMark.current = new Date().valueOf()
            const markNumber = activityOptionsMark.current
            const res = await RequestActivityOptionsList(val)
            if (markNumber === activityOptionsMark.current) { //表示是最新请求
              setProjectId(val) //更新项目id
              setActivityOptions(res) //更新活动选项
              setActivityId(undefined) //重置活动id
              setPrizeOptions(undefined) //重置产品选项
              formRef.current?.setFieldValue("activity_id", undefined)
              formRef.current?.setFieldValue("prizes_pool_id", undefined)
            }
          },
        }}
      />
      <ProFormSelect
        rules={[
          {
            required: true,
            message: '必填项',
          },
        ]}
        width="md"
        name="activity_id"
        label='中奖活动'
        options={activityOptions || []}
        fieldProps={{
          onChange: async (val: number) => {
            prizeOptionsMark.current = new Date().valueOf()
            const markNumber = prizeOptionsMark.current
            const res = await RequestPrizeOptionsList(val)
            if (markNumber === prizeOptionsMark.current) { //表示是最新请求
              setPrizeOptions(res) //更新产品选项
              formRef.current?.setFieldValue("prizes_pool_id", undefined)
            }
          },
        }}
      />
      <ProFormSelect
        rules={[
          {
            required: true,
            message: '必填项',
          },
        ]}
        width="md"
        name="prizes_pool_id"
        label='中奖产品'
        options={prizeOptions || []}
      />
      <ProFormSelect
        rules={[
          {
            required: true,
            message: '必填项',
          },
        ]}
        options={[{ label: "未领", value: 0 }, { label: "已领", value: 1 }, { label: "弃领", value: -1 }]}
        width="md"
        name="status"
        label='抽奖单状态'
      />

      <ProFormDateTimePicker
        rules={[
          {
            required: true,
            message: '必填项',
          },
        ]}
        width="md"
        name="luck_date"
        label="抽奖时间"
      />
      <ProFormText
        rules={[
          {
            pattern: /((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/,
            message: 'ip格式有误',
          },
        ]}
        name="ip"
        width="md"
        label="IP地址"
      />
    </ModalForm>
  );
};

export default OperationModal;
