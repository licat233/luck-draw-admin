import { putPassword } from '@/services/global-api/admin-custom';
import type { PutPasswordReq } from '@/services/global-api/adminComponents';
import { mathCaptcha } from '@/services/global-api/captcha-custom';
import { CaptchaInfo, CaptchaReq } from '@/services/global-api/captchaComponents';
import { SafetyCertificateOutlined } from '@ant-design/icons';
import {
    ProFormText,
} from '@ant-design/pro-components';
import { DrawerForm, ProFormDigit, ProFormItem } from '@ant-design/pro-form';
import { message } from 'antd';
import { FC, useState } from 'react';
import styles from '../style.less';

type PutPasswordModalProps = {
    visible: boolean;
    onDone: () => void;
}

const PutPasswordModal: FC<PutPasswordModalProps> = (props) => {
    const { visible, onDone } = props
    const [imgCaptcha, setImgCaptcha] = useState<CaptchaInfo>()
    const [done, setDone] = useState<boolean>(false)

    const getCaptchaImage = async () => {
        if (done) return;
        try {
            const captchaParams: CaptchaReq = {
                height: 40,
                width: 150,
                BgColor: {
                    R: 254,
                    G: 254,
                    B: 254,
                    A: 254,
                },
            };
            const result = await mathCaptcha(captchaParams);
            setImgCaptcha((result as API.BaseResp).data as CaptchaInfo);
        } catch (error) {
            message.error('获取验证码失败！');
        }
    };

    const onDoneHandle = () => {
        setDone(true)
        onDone()
    }

    const onSubmit = async (req: PutPasswordReq): Promise<boolean> => {
        try {
            const { success } = await putPassword(req)
            if (success) {
                message.success("修改成功")
            }
            return success
        } catch (error) {
            message.error("修改失败")
        }
        return false
    }

    const onVisibleChange = () => {
        getCaptchaImage();
    }
    return (
        <DrawerForm<PutPasswordReq>
            visible={visible}
            title="修改密码"
            autoFocusFirstInput
            drawerProps={{
                destroyOnClose: true,
                onClose: () => onDoneHandle(),
            }}
            onVisibleChange={onVisibleChange}
            width={375}
            onFinish={async (values) => {
                if (!imgCaptcha?.captcha_id) {
                    message.error("not found captcha");
                    return false
                }
                const req = {
                    old_password: values.old_password,
                    new_password: values.new_password,
                    captcha_id: imgCaptcha.captcha_id,
                    solution: values.solution + "",
                }
                const ok = await onSubmit(req)
                if (!ok) {
                    getCaptchaImage();
                    throw new Error()
                }
                return ok;
            }}
        >
            <ProFormText
                rules={[
                    {
                        required: true,
                        message: '原密码为必填项',
                    },
                    {
                        pattern: /^.{6,34}$/,
                        message: '原密码长度有误',
                    },
                ]}
                placeholder="请输入原密码"
                width="md"
                name="old_password"
                label="原密码"
                hidden={false}
            />
            <ProFormText
                rules={[
                    {
                        required: true,
                        message: '新密码为必填项',
                    },
                    {
                        pattern: /^.{6,34}$/,
                        message: '新密码长度有误',
                    },
                ]}
                placeholder="请输入新密码"
                width="md"
                name="new_password"
                label="新密码"
                hidden={false}
            />
            <ProFormItem>
                <ProFormDigit
                    rules={[
                        {
                            required: true,
                            message: '请输入验证码！',
                        },
                        {
                            pattern: /^-?\d{1,4}$/,
                            message: '验证码格式错误！',
                        },
                    ]}
                    key="account_solution"
                    name="solution"
                    fieldProps={{
                        size: 'large',
                        prefix: <SafetyCertificateOutlined className={styles.prefixIcon} />,
                    }}
                    width="sm"
                    placeholder="验证码"

                />
                <div className={styles.captchaimg} key="account_captchaImag" onClick={getCaptchaImage}>
                    <img src={imgCaptcha?.base64_image || ''} />
                </div>
            </ProFormItem>
        </DrawerForm>
    );
};

export default PutPasswordModal;