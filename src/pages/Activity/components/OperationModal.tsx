import type { FC } from 'react';
import {
  ModalForm,
  ProFormSelect,
  ProFormText,
  ProFormDateTimeRangePicker,
  ProFormDigit,
} from '@ant-design/pro-form';
import styles from '../style.less';
import { Activity as BasicListItemDataType, activityPatternEnumList, projectEnumList } from '@/services/global-api/admin-custom';
import dayjs from 'dayjs';

type OperationModalProps = {
  done: boolean;
  visible: boolean;
  current: Partial<BasicListItemDataType> | undefined;
  onDone: () => void;
  onSubmit: (values: BasicListItemDataType) => Promise<boolean>;
};

const formatDate = (timestamp: number | undefined): string | undefined => {
  if (!timestamp) return undefined
  return dayjs(timestamp * 1000).format('YYYY-MM-DD HH:mm:ss')
}

const OperationModal: FC<OperationModalProps> = (props) => {
  const { done, visible, current, onDone, onSubmit, children } = props;
  if (current) {
    (current as any).range_time = [formatDate(current?.start_time), formatDate(current?.end_time)]
  }
  if (!visible) {
    return null;
  }
  return (
    <ModalForm<BasicListItemDataType>
      visible={visible}
      title={done ? null : `活动${current ? '编辑' : '添加'}`}
      className={styles.standardListForm}
      width={375}
      onFinish={async (values) => {
        values.start_time = dayjs((values as any)?.range_time[0]).unix()
        values.end_time = dayjs((values as any)?.range_time[1]).unix()
        const ok = await onSubmit({ ...current, ...values });
        ok && onDone();
      }}
      initialValues={current}
      submitter={{
        render: (_, dom) => (done ? null : dom),
      }}
      trigger={<>{children}</>}
      modalProps={{
        onCancel: () => onDone(),
        destroyOnClose: true,
        bodyStyle: done ? { padding: '72px 0' } : {},
      }}
    >
      <ProFormText
        rules={[
          {
            required: true,
            message: '必填项',
          },
        ]}
        placeholder="请输入活动名称"
        width="md"
        name="name"
        label='活动名称'
      />
      <ProFormSelect
        rules={[
          {
            required: true,
            message: '必填项',
          },
        ]}
        placeholder="请选择所属项目"
        width="md"
        name="project_id"
        request={projectEnumList}
        label='所属项目'
      />
      <ProFormSelect
        rules={[
          {
            required: true,
            message: '必填项',
          },
        ]}
        placeholder="请选择活动状态"
        options={[{ label: "开启", value: 1 }, { label: "关闭", value: 0 }]}
        width="md"
        name="status"
        label='活动状态'
      />
      <ProFormSelect
        rules={[
          {
            required: true,
            message: '必填项',
          },
        ]}
        // options={[{ label: "仅客户", value: 0 }, { label: "所有人", value: 1 }]}
        request={activityPatternEnumList}
        width="md"
        name="pattern"
        label='模式'
      />
      <ProFormDigit
        rules={[
          {
            required: true,
            message: '必填项',
          },
          {
            pattern: /^[0-9]*$/,
            message: '请填写数字',
          },
        ]}
        placeholder="请输入每人最大【抽奖数】"
        width="md"
        name="max_count"
        label='每人最大抽奖数,-1表示无限制，0表示不可抽奖'
      />
      <ProFormDigit
        rules={[
          {
            required: true,
            message: '必填项',
          },
          {
            pattern: /^[0-9]*$/,
            message: '请填写数字',
          },
        ]}
        placeholder="请输入每人最大【中奖数】"
        width="md"
        name="max_prizes"
        label='每人最大中奖数,-1表示无限制，0表示不可中奖'
      />
      <ProFormDateTimeRangePicker
        rules={[
          {
            required: true,
            message: '必填项',
          },
        ]}
        width="md"
        name="range_time"
        label='活动开放时间'
      />
    </ModalForm>
  );
};

export default OperationModal;
