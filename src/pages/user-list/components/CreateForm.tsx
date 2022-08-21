import React from 'react';
import type { MutableRefObject } from 'react';
import { message } from 'antd';
import {
  ModalForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import type { User } from '../data';
import { addUser } from '../service';
import type { ActionType } from '@ant-design/pro-table';
import type { SelectProps } from 'antd';

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
const handleAdd = async (fields: User) => {
  const hide = message.loading('正在添加');

  try {
    await addUser({ ...fields });
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
  const { showCreateModal, setShowCreateModal, tableRef, roleSelect, companySelect } = props;

  return (
    <ModalForm
      title="新建用户"
      width="400px"
      visible={showCreateModal}
      onVisibleChange={setShowCreateModal}
      onFinish={async (value) => {
        const success = await handleAdd(value as User);
        if (success) {
          setShowCreateModal(false);
          if (tableRef.current) {
            tableRef.current.reload();
          }
        }
      }}
    >
      {/* <ProFormUploadDragger name="avatar" action="upload.do" /> */}
      <ProFormText
        rules={[
          {
            required: true,
            message: '真实姓名为必填项',
          },
        ]}
        placeholder="请输入真实姓名"
        width="md"
        name="real_name"
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
      <ProFormText
        rules={[
          {
            required: true,
            message: '手机号为必填项',
          },
        ]}
        placeholder="请输入手机号"
        width="md"
        name="mobile"
      />
      <ProFormSelect
        placeholder="请选择性别"
        options={[{ label: "男", value: 0 }, { label: "女", value: 1 }]}
        width="md"
        name="gender"
      />
      <ProFormSelect
        placeholder="请选择角色"
        options={roleSelect}
        width="md"
        name="role_id"
      />
      <ProFormSelect
        placeholder="请选择公司"
        options={companySelect}
        width="md"
        name="company_id"
      />
      <ProFormSelect
        placeholder="请选择账户状态"
        options={[{label:"关闭",value: 0},{label:"开启",value:1}]}
        width="md"
        name="status"
      />
      <ProFormText placeholder="请输入QQ号" width="md" name="qq" />
      <ProFormText placeholder="请输入微信号" width="md" name="wechat" />
      <ProFormTextArea placeholder="个人说明" width="md" name="description" />
    </ModalForm>
  );
};

export default CreateForm;
