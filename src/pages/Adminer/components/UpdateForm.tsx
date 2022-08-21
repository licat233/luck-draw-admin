import React from 'react';
import { Modal } from 'antd';
import {
  ProFormSelect,
  ProFormText,
  StepsForm,
} from '@ant-design/pro-form';
import { Adminer, AdminerPutReq } from '@/services/global-api/admin-custom';
import { ProFormUploadDragger } from '@ant-design/pro-components';

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: AdminerPutReq) => void;
  onSubmit: (values: AdminerPutReq) => Promise<void>
  updateModalVisible: boolean;
  values: Adminer | undefined;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {

  // const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
  //   setFileList(newFileList);
  // };

  // const onPreview = async (file: UploadFile) => {
  //   let src = file.url as string;
  //   if (!src) {
  //     src = await new Promise(resolve => {
  //       const reader = new FileReader();
  //       reader.readAsDataURL(file.originFileObj as RcFile);
  //       reader.onload = () => resolve(reader.result as string);
  //     });
  //   }
  //   const image = new Image();
  //   image.src = src;
  //   const imgWindow = window.open(src);
  //   imgWindow?.document.write(image.outerHTML);
  // };


  return (
    <StepsForm
      stepsProps={{
        size: 'small',
      }}
      stepsFormRender={(dom, submitter) => {
        return (
          <Modal
            width={640}
            bodyStyle={{
              padding: '32px 40px 48px',
            }}
            destroyOnClose
            title="管理员配置"
            visible={props.updateModalVisible}
            footer={submitter}
            onCancel={() => {
              props.onCancel();
            }}
          >
            {dom}
          </Modal>
        );
      }}
      onFinish={props.onSubmit}
    >
      <StepsForm.StepForm
        initialValues={{
          ...props.values
        }}
        title="基本信息"
      >
        {/* <ImgCrop rotate>
          <Upload
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            listType="picture-card"
            fileList={fileList}
            onChange={onChange}
            onPreview={onPreview}
          >
            {fileList.length < 5 && '+ Upload'}
          </Upload>
        </ImgCrop> */}

        {/* <ProFormUploadDragger
          name="avatar"
          action="upload.do"
          value={[{ uid: props?.values?.uuid || "-1", name: `avatar_${props?.values?.uuid || -1}.png`, status: 'done', url: props?.values?.avatar }]}
        /> */}
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
      </StepsForm.StepForm>
    </StepsForm>
  );
};

export default UpdateForm;
