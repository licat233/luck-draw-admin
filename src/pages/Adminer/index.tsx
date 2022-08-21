// import { addRule, removeRule, rule, updateRule } from '@/services/ant-design-pro/api';
import { adminerAdd, adminerDel, adminerList, adminerPut } from '@/services/global-api/admin-custom';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import '@umijs/max';
import { Button, Drawer, Dropdown, Modal, Menu, message, Radio, Input } from 'antd';
import React, { useRef, useState } from 'react';
import { useRequest } from 'umi';
// import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import { Adminer, AdminerAddReq, AdminerPutReq, AdminerDelReq } from "@/services/global-api/adminComponents";
import styles from './style.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */

const handleAdd = async (fields: AdminerAddReq) => {
  const hide = message.loading('正在添加');

  try {
    await adminerAdd({ ...fields });
    hide();
    message.success('Added successfully');
    return true;
  } catch (error) {
    hide();
    message.error('Adding failed, please try again!');
    return false;
  }
};
/**
 * @en-US Update node
 * @zh-CN 更新节点
 *
 * @param fields
 */

const handleUpdate = async (fields: AdminerPutReq) => {
  const hide = message.loading('Configuring');

  try {
    await adminerPut({ ...fields });
    hide();
    message.success('Configuration is successful');
    return true;
  } catch (error) {
    hide();
    message.error('Configuration failed, please try again!');
    return false;
  }
};

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRow
 */

const handleRemove = async (id: number) => {
  const hide = message.loading('正在删除');
  if (typeof id === 'undefined') return true;

  try {
    await adminerDel({ id });
    hide();
    message.success('Deleted successfully and will refresh soon');
    return true;
  } catch (error) {
    hide();
    message.error('Delete failed, please try again');
    return false;
  }
};



const AdminerList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */

  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();

  const [done, setDone] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<Adminer>();

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */


  const defaultAvatar = "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png";

  const columns: ProColumns<Adminer>[] = [
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
      title: '管理员名称',
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
      title: '邮箱',
      dataIndex: 'email',
      valueType: 'text',
    },
    // {
    //   title: '服务调用次数',
    //   dataIndex: 'email',
    //   sorter: true,
    //   hideInForm: true,
    //   renderText: (val: string) => `${val}${'万'}`,
    // },
    {
      title: '状态',
      dataIndex: 'status',
      hideInForm: true,
      sorter: true,
      valueEnum: {
        0: {
          text: '关闭',
          status: 'disabled',
        },
        1: {
          text: '正常',
          status: 'normal',
        },
        2: {
          text: '审核中',
          status: 'reviewed',
        },
      },
    },
    {
      title: '超管?',
      dataIndex: 'is_super_admin',
      hideInForm: true,
      sorter: true,
      valueEnum: {
        0: {
          text: '否',
          status: 'disabled',
        },
        1: {
          text: '是',
          status: 'normal',
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
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleUpdateModalVisible(true);
            setCurrent(record);
          }}
        >
          编辑
        </a>,
        <MoreBtn key="more" item={record} />,
      ],
    },
  ];

  const MoreBtn: React.FC<{
    item: Adminer;
  }> = ({ item }) => (
    <Dropdown
      overlay={
        <Menu onClick={({ key }) => editAndDelete(key, item)}>
          <Menu.Item key="edit">编辑</Menu.Item>
          <Menu.Item key="delete">删除</Menu.Item>
        </Menu>
      }
    >
      <a>
        更多 <DownOutlined />
      </a>
    </Dropdown>
  );


  const {
    data: listData,
    loading,
    mutate,
  } = useRequest(() => {
    return adminerList({
      pageSize: 20,
      current: 1,
    });
  });

  const { run: postRun } = useRequest(
    (method, params) => {
      if (method === 'remove') {
        return handleRemove(params);
      }
      if (method === 'update') {
        return handleUpdate(params);
      }
      return handleAdd(params);
    },
    {
      manual: true,
      onSuccess: (result) => {
        mutate(result);
      },
    },
  );

  const showEditModal = (item: Adminer) => {
    setVisible(true);
    setCurrent(item);
  };

  const editAndDelete = (key: string | number, currentItem: Adminer) => {
    if (key === 'edit') showEditModal(currentItem);
    else if (key === 'delete') {
      Modal.confirm({
        title: '删除管理员',
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

  const handleSubmit = (values: Adminer) => {
    setDone(true);
    const method = values?.id ? 'update' : 'add';
    postRun(method, values);
  };

  return (
    <PageContainer>
      <ProTable<Adminer, API.PageParams>
        headerTitle={'管理员列表'}
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalVisible(true);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={adminerList}
        columns={columns}
      // rowSelection={{
      //   onChange: (_, selectedRows) => {
      //     setSelectedRows(selectedRows);
      //   },
      // }}
      />
      <ModalForm
        title={'新建管理员'}
        width="400px"
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={async (value) => {
          const success = await handleAdd(value as Adminer);

          if (success) {
            handleModalVisible(false);

            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: '管理员名称为必填项',
            },
          ]}
          width="md"
          name="name"
        />
        <ProFormTextArea width="md" name="desc" />
      </ModalForm>
      <UpdateForm
        onSubmit={async (value) => {
          const success = await handleUpdate(value);

          if (success) {
            handleUpdateModalVisible(false);
            setCurrent(undefined);

            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalVisible(false);

          if (!showDetail) {
            setCurrent(undefined);
          }
        }}
        updateModalVisible={updateModalVisible}
        values={current}
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
          <ProDescriptions<Adminer>
            column={2}
            title={current?.name}
            request={async () => ({
              data: current || {},
            })}
            params={{
              id: current?.name,
            }}
            columns={columns as ProDescriptionsItemProps<Adminer>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default AdminerList;
