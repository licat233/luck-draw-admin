import { FC, useState } from 'react';
import {
  ModalForm,
  ProFormItem,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
} from '@ant-design/pro-form';
import styles from '../style.less';
import { Adminer as BasicListItemDataType, uploadAvatar } from '@/services/global-api/admin-custom';
import Upload, { RcFile, UploadChangeParam, UploadFile, UploadProps } from 'antd/lib/upload';
import { message } from 'antd';
import { UploadRequestOption } from 'rc-upload/lib/interface';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

type OperationModalProps = {
  done: boolean;
  visible: boolean;
  current: Partial<BasicListItemDataType> | undefined;
  onDone: () => void;
  onSubmit: (values: BasicListItemDataType) => Promise<boolean>;
};

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

const OperationModal: FC<OperationModalProps> = (props) => {
  const { done, visible, current, onDone, onSubmit, children } = props;
  if (!visible) {
    return null;
  }

  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>(current?.avatar || "");

  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as RcFile, url => {
        setLoading(false);
        setAvatarUrl(url);
      });
    }
  };

  const handleUpload = async (options: UploadRequestOption<any>) => {
    const file = options.file
    const formData = new FormData();
    formData.append('file', file);
    try {
      const resp = await uploadAvatar({
        type: "options",
        data: formData,
        requestType: 'form',
      })
      if (resp.success) {
        const url = resp.data as string || ""
        setAvatarUrl(url)
        return
      }
      throw new Error(resp.errorMessage || "上传失败")
    } catch (error: any) {
      message.error(error.message)
      setAvatarUrl("")
    }
  }

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );


  return (
    <ModalForm<BasicListItemDataType>
      visible={visible}
      title={done ? null : `管理员${current ? '编辑' : '添加'}`}
      className={styles.standardListForm}
      width={375}
      onFinish={async (values) => {
        values.is_super_admin = values.is_super_admin ? 1 : 0;
        const ok = await onSubmit({ ...current, ...values, avatar: avatarUrl });
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
      <ProFormItem label="头像" name="avatar" valueType="image"
        rules={[
          {
            required: true,
            message: '必填项',
          },
        ]}>
        <Upload
          accept='.jpg,.png,.jpeg'
          name="avatar"
          listType="picture-card"
          showUploadList={false}
          action="/v1/api/admin/uploadAvatar"
          beforeUpload={beforeUpload}
          onChange={handleChange}
          customRequest={handleUpload}
          fileList={[]}
          maxCount={1}
        >
          {avatarUrl ? <img src={avatarUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
        </Upload>
      </ProFormItem>

      <ProFormText
        rules={[
          {
            required: true,
            message: '管理员名称为必填项',
          },
          {
            pattern: /^.{2,10}$/,
            message: '长度在2-10之间',
          },
        ]}
        placeholder="请输入管理员名称"
        width="md"
        name="name"
        label="管理员名称"
      />
      <ProFormText
        rules={[
          {
            required: true,
            message: '账号为必填项',
          },
          {
            pattern: /^[A-Za-z0-9]{3,20}$/,
            message: '用户名由3-20位数字或者字母组成',
          },
        ]}
        placeholder="请输入账号"
        width="md"
        name="passport"
        label="账号"
      />
      <ProFormText.Password
        rules={[
          {
            required: !current || false,
            message: '密码为必填项',
          },
          {
            pattern: /^.{6,34}$/,
            message: '密码长度有误',
          },
        ]}
        placeholder="请输入密码"
        width="md"
        name="password"
        label="密码"
      />
      <ProFormText
        rules={[
          {
            required: true,
            message: '邮箱为必填项',
          },
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
      <ProFormSelect
        placeholder="请选择账户状态"
        options={[{ label: "关闭", value: 0 }, { label: "开启", value: 1 }]}
        width="md"
        name="status"
        label="状态"
      />
      <ProFormSwitch
        placeholder="请选择"
        // options={[{ label: "否", value: 0 }, { label: "是", value: 1 }]}
        width="md"
        name="is_super_admin"
        label="是否为超级管理员"
      />
    </ModalForm>
  );
};

export default OperationModal;
