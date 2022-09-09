import { FC } from 'react';
import {
  ModalForm,
  ProFormSelect,
  ProFormText,
  ProFormDigit,
} from '@ant-design/pro-form';
import styles from '../style.less';
import { User as BasicListItemDataType } from '@/services/global-api/admin-custom';

type OperationModalProps = {
  done: boolean;
  visible: boolean;
  current: Partial<BasicListItemDataType> | undefined;
  onDone: () => void;
  onSubmit: (values: BasicListItemDataType) => Promise<boolean>;
};

const OperationModal: FC<OperationModalProps> = (props) => {
  const { done, visible, current, onDone, onSubmit, children } = props;
  if (!visible) {
    return null;
  }

  return (
    <ModalForm<BasicListItemDataType>
      visible={visible}
      title={done ? null : `奖品${current ? '编辑' : '添加'}`}
      className={styles.standardListForm}
      width={375}
      onFinish={async (values) => {
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
          {
            pattern: /^.{2,10}$/,
            message: '长度在2-10之间',
          },
        ]}
        placeholder="请输入用户名"
        width="md"
        name="name"
        label='用户名'
      />
      <ProFormText
        rules={[
          {
            required: true,
            message: '必填项',
          },
        ]}
        placeholder="请输入凭证"
        width="md"
        name="passport"
        label='凭证'
      />
      <ProFormText
        rules={[
          {
            pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
            message: '不合法的邮箱地址！',
          },
        ]}
        placeholder="请输入邮箱"
        width="md"
        name="email"
        label="邮箱"
      />
      <ProFormText
        rules={[
          {
            required: true,
            message: '必填项',
          },
        ]}
        placeholder="请输入电话号码"
        width="md"
        name="phone"
        label="电话"
      />
      <ProFormDigit
        rules={[
          {
            required: true,
            message: '必填项',
          },
        ]}
        width="md"
        name="score"
        label='积分'
      />
      <ProFormText
        rules={[
          {
            required: true,
            message: '必填项',
          },
        ]}
        placeholder="请输入收货地址"
        width="md"
        name="address"
        label='收货地址'
      />
      <ProFormSelect
        placeholder="请选择账户状态"
        options={[{ label: "未授权", value: 0 }, { label: "正常", value: 1 }, { label: "已冻结", value: 2 }]}
        width="md"
        name="status"
        label="状态"
      />
    </ModalForm>
  );
};

export default OperationModal;
