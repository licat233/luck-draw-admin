import React from 'react';
import type { MutableRefObject } from 'react';
import { message } from 'antd';
import {
  ModalForm,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-form';
import type { ActionType } from '@ant-design/pro-table';
import type { SelectProps } from 'antd';
import { Adminer, adminerAdd } from '@/services/global-api/admin-custom';
import { ProFormUploadDragger } from '@ant-design/pro-components';

type CreateFormProps = {
  showCreateModal: boolean;
  setShowCreateModal: (arg0: boolean) => void;
  tableRef: MutableRefObject<ActionType | undefined>;
  roleSelect: SelectProps<any>['options'];
  setRoleSelect: (arg0: SelectProps<any>['options']) => void;
  companySelect: SelectProps<any>['options'];
  setCompanySelect: (arg0: SelectProps<any>['options']) => void;
};

/**
 * 添加节点
 *
 * @param fields
 */
const handleAdd = async (fields: Adminer) => {
  const hide = message.loading('正在添加');

  try {
    await adminerAdd({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { showCreateModal, setShowCreateModal, tableRef } = props;

  return (
    <ModalForm
      title="新建管理员"
      width="400px"
      visible={showCreateModal}
      onVisibleChange={setShowCreateModal}
      onFinish={async (value) => {
        const success = await handleAdd(value as Adminer);
        if (success) {
          setShowCreateModal(false);
          if (tableRef.current) {
            tableRef.current.reload();
          }
        }
      }}
    >
      <ProFormUploadDragger
        name="avatar"
        action="upload.do"
        value={[{ uid: '-1', name: 'default_avatar.png', status: 'done', url: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png' }]}
      />
      <ProFormText
        rules={[
          {
            required: true,
            message: '管理员名称为必填项',
          },
        ]}
        placeholder="请输入管理员名称"
        width="md"
        name="name"
      />
      <ProFormText
        rules={[
          {
            required: true,
            message: '账号为必填项',
          },
        ]}
        placeholder="请输入账号"
        width="md"
        name="passport"
      />
      <ProFormText
        rules={[
          {
            required: true,
            message: '密码为必填项',
          },
        ]}
        placeholder="请输入密码"
        width="md"
        name="password"
      />
      <ProFormText
        rules={[
          {
            required: true,
            message: '邮箱为必填项',
          },
        ]}
        placeholder="请输入邮箱"
        width="md"
        name="email"
      />
      <ProFormSelect
        placeholder="请选择账户状态"
        options={[{ label: "关闭", value: 0 }, { label: "开启", value: 1 }]}
        width="md"
        name="status"
      />
      <ProFormSelect
        placeholder="是否为超级管理员"
        options={[{ label: "否", value: 0 }, { label: "是", value: 1 }]}
        width="md"
        name="is_super_admin"
      />
    </ModalForm>
  );
};

export default CreateForm;
