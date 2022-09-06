import { FC, useEffect, useRef, useState } from 'react';
import {
  ModalForm,
  ProFormSelect,
  ProFormDateTimePicker,
  ProFormInstance,
} from '@ant-design/pro-form';
import styles from '../style.less';
import { Activity, activityPrizes, Lucker, LuckerAddReq, LuckerDetails, LuckerPutReq, Prize, projectActivity, projectEnumList } from '@/services/global-api/admin-custom';
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
  onSubmit: (values: LuckerPutReq & LuckerAddReq) => Promise<boolean>;
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


  let activityOptionsMark = useRef(0);
  let prizeOptionsMark = useRef(0);
  const [projectId, setProjectId] = useState<number | undefined>(details?.project?.id)
  const [activityId, setActivityId] = useState<number | undefined>(details?.activity?.id)

  const [activityOptions, setActivityOptions] = useState<DefaultOptionType[]>()
  const [prizeOptions, setPrizeOptions] = useState<DefaultOptionType[]>()

  const formRef = useRef<ProFormInstance>();

  const initActivityOptions = async () => {
    const res = await RequestActivityOptionsList(projectId)
    setActivityOptions(res)
  }

  const initPrizeOptions = async () => {
    const res = await RequestPrizeOptionsList(activityId)
    setPrizeOptions(res)
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
    httpStore.current.activity[project_id] = []
    return []
  }

  const RequestPrizeOptionsList = async (activity_id: number | undefined): Promise<DefaultOptionType[]> => {
    if (typeof activity_id === 'undefined') return [];
    if (httpStore.current.prize[activity_id]) return httpStore.current.prize[activity_id]
    try {
      const res = await activityPrizes({ activity_id })
      if (res.success && res.data) {
        const list = (res.data as Prize[]).map<DefaultOptionType>(item => {
          return {
            label: item.name,
            value: item.id
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
    <ModalForm<LuckerAddReq & LuckerPutReq>
      visible={visible}
      title={done ? null : `抽奖单${details?.lucker ? '编辑' : '添加'}`}
      className={styles.standardListForm}
      width={375}
      onFinish={async (values) => {
        values.luck_date = dayjs(values.luck_date).unix()
        const ok = await onSubmit({ ...details?.lucker, ...values });
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
    >
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
              formRef.current?.setFieldValue("prize_id", undefined)
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
              formRef.current?.setFieldValue("prize_id", undefined)
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
        name="prize_id"
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
    </ModalForm>
  );
};

export default OperationModal;
