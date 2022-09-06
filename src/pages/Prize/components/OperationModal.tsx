import { FC, useState } from 'react';
import {
  ModalForm,
  ProFormSelect,
  ProFormText,
  ProFormDigit,
} from '@ant-design/pro-form';
import styles from '../style.less';
import { Prize as BasicListItemDataType, uploadImg } from '@/services/global-api/admin-custom';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { message, UploadProps, UploadFile, Upload } from 'antd';
import { RcFile, UploadChangeParam } from 'antd/lib/upload';
import { UploadRequestOption } from 'rc-upload/lib/interface';

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
  const [imageUrl, setImageUrl] = useState<string>(current?.image || "");

  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as RcFile, url => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const handleUpload = async (options: UploadRequestOption<any>) => {
    const file = options.file
    const formData = new FormData();
    formData.append('file', file);
    try {
      const resp = await uploadImg({
        type: "options",
        data: formData,
        requestType: 'form',
      })
      if (resp.success) {
        const url = resp.data as string || ""
        setImageUrl(url)
        return
      }
      throw new Error(resp.errorMessage || "上传失败")
    } catch (error: any) {
      message.error(error.message)
      setImageUrl("")
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
        ]}
        placeholder="请输入奖品名称"
        width="md"
        name="name"
        label='奖品名称'
      />
      <Upload
        accept='.jpg,.png,.jpeg'
        name="image"
        listType="picture-card"
        showUploadList={false}
        action="/v1/api/admin/uploadImg"
        beforeUpload={beforeUpload}
        onChange={handleChange}
        customRequest={handleUpload}
      >
        {imageUrl ? <img src={imageUrl} alt="image" style={{ width: '100%' }} /> : uploadButton}
      </Upload>
      <ProFormDigit
        rules={[
          {
            required: true,
            message: '必填项',
          },
        ]}
        placeholder="请输入奖品价格"
        width="md"
        name="price"
        label='奖品价格'
      />
      <ProFormSelect
        rules={[
          {
            required: true,
            message: '必填项',
          },
        ]}
        placeholder="请选择奖品状态"
        options={[{ label: "关闭", value: 0 }, { label: "开启", value: 1 }]}
        width="md"
        name="status"
        label='奖品状态'
      />
    </ModalForm>
  );
};

export default OperationModal;
