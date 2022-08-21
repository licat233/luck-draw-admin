import Footer from '@/components/Footer';
import { login, loginByEmail, loginEmailCaptcha } from '@/services/global-api/admin-custom';
import { LoginReq, LoginByEmailReq } from '@/services/global-api/adminComponents';
import { CaptchaInfo, CaptchaReq, EmailCaptchaResp } from '@/services/global-api/captchaComponents';
import { mathCaptcha } from '@/services/global-api/captcha-custom';
import {
  LockOutlined,
  MailOutlined,
  UserOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import { history, useModel } from '@umijs/max';
import { Alert, message, Tabs, Input, Modal } from 'antd';
import React, { useState, useEffect } from 'react';
import styles from './index.less';
import { useForm } from 'antd/lib/form/Form';

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );
};

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<Record<string, string | boolean>>({ status: false, type: 'account' });
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');
  const [imgCaptcha, setImgCaptcha] = useState<CaptchaInfo>({ captcha_id: "", base64_image: "" });
  const [emailCaptchaInfo, setEmailCaptchaInfo] = useState<EmailCaptchaResp>({ captcha_id: "", expires_at: 0 });
  const [form] = useForm()
  const [emailCaptchaInputState, setEmailCaptchaInputState] = useState(true)

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();

    if (userInfo) {
      await setInitialState((s) => ({ ...s, currentUser: userInfo }));
    }
  };

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

  const getCaptchaImage = async () => {
    if (userLoginState.status) return;
    try {
      const result = await mathCaptcha(captchaParams);
      setImgCaptcha((result as API.BaseResp).data as CaptchaInfo);
    } catch (error) {
      message.error('获取验证码失败！');
    }
  };

  useEffect(() => {
    if (imgCaptcha.base64_image === "") {
      getCaptchaImage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imgCaptcha.base64_image]);

  const handleSubmit = async (values: Record<string, any>) => {
    try {
      let resp: unknown;
      if (type === 'account') {
        // 登录
        resp = await login({ ...values as LoginReq });
      } else if (type === 'email') {
        // 登录
        const req: LoginByEmailReq = {
          email: values['email'],
          captcha_id: values['captcha_id'],
          solution: values['email_solution'],
          autoLogin: values['autoLogin']
        }
        resp = await loginByEmail({ ...req });
      } else {
        throw new Error('Invalid login type');
      }
      const msg = resp as API.BaseResp;

      if (msg.success) {
        //保存token
        if (msg.data) {
          const jwtToken = JSON.stringify(msg.data as API.JwtToken)
          localStorage.setItem("jwtToken", jwtToken)
        }

        await fetchUserInfo();
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');
        return;
      }
      // console.log(msg); // 如果失败去设置用户错误信息
      setUserLoginState({ status: msg.success, type: type });
    } catch (error) {
      getCaptchaImage();
    }
  };

  const ForgetPasswordHandler = () => {
    Modal.info({
      title: '忘记密码？',
      content: (
        <div>
          <p>请联系管理员</p>
          <p>联系邮箱：licat233@gmail.com</p>
        </div>
      ),
      onOk() { },
    });
  };

  const { status, type: loginType } = userLoginState;
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <LoginForm
          form={form}
          logo={<img alt="logo" src="/logo.png" />}
          title="Luck Draw"
          subTitle={'Luck Draw 后台管理系统'}
          initialValues={{
            autoLogin: true,
            passport: 'licat',
            password: 'licat233',
            email: "1697470538@qq.com",
          }}
          actions={[]}
          onFinish={async (values) => {
            const captcha_id = type === "account" ? imgCaptcha.captcha_id : emailCaptchaInfo.captcha_id
            await handleSubmit({ ...values, captcha_id });
          }}
        >
          <Tabs activeKey={type} onChange={setType}>
            <Tabs.TabPane key="account" tab={'账户密码登录'} />
            <Tabs.TabPane key="email" tab={'邮箱登录'} />
          </Tabs>
          {status === 'error' && loginType === 'account' && (
            <LoginMessage content={'错误的用户名和密码'} />
          )}
          {type === 'account' && (
            <>
              <ProFormText
                name="passport"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder={'用户名: admin or user'}
                rules={[
                  {
                    required: true,
                    message: '用户名是必填项！',
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder={'密码: ant.design'}
                rules={[
                  {
                    required: true,
                    message: '密码是必填项！',
                  },
                ]}
              />
              <Input.Group compact className={styles.captchagrounp}>
                <div className={styles.captchainput}>
                  <ProFormText
                    key="account_solution"
                    name="solution"
                    fieldProps={{
                      size: 'large',
                      prefix: <SafetyCertificateOutlined className={styles.prefixIcon} />,
                    }}
                    allowClear={true}
                    width="xs"
                    placeholder="验证码"
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
                  />
                </div>
                <div className={styles.captchaimg} key="account_captchaImag" onClick={getCaptchaImage}>
                  <img src={imgCaptcha?.base64_image || ''} />
                </div>
              </Input.Group>
            </>
          )}

          {status === 'error' && loginType === 'email' && <LoginMessage content="验证码错误" />}
          {type === 'email' && (
            <>
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: <MailOutlined className={styles.prefixIcon} />,
                }}
                name="email"
                placeholder={'请输入邮箱地址！'}
                rules={[
                  {
                    required: true,
                    message: '邮箱地址是必填项！',
                  },
                  {
                    pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
                    message: '不合法的邮箱地址！',
                  },
                ]}
              />
              <Input.Group compact className={styles.captchagrounp}>
                <div className={styles.captchainput}>
                  <ProFormText
                    key="email_solution"
                    name="solution"
                    fieldProps={{
                      size: 'large',
                      prefix: <SafetyCertificateOutlined className={styles.prefixIcon} />,
                    }}
                    allowClear={true}
                    width="xs"
                    placeholder="验证码"
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
                  />
                </div>
                <div className={styles.captchaimg} key="email_captchaImag" onClick={getCaptchaImage}>
                  <img src={imgCaptcha?.base64_image || ''} />
                </div>
              </Input.Group>
              <ProFormCaptcha
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                captchaProps={{
                  size: 'large',
                }}
                disabled={emailCaptchaInputState}
                placeholder={'请输入验证码！'}
                captchaTextRender={(timing, count) => {
                  if (timing) {
                    return `${count} ${'秒后重新获取'}`;
                  }

                  return '获取验证码';
                }}

                allowClear={true}
                name="email_solution"
                rules={[
                  {
                    required: true,
                    message: '验证码是必填项！',
                  },
                ]}
                onGetCaptcha={async () => {
                  const email = form.getFieldValue("email")
                  const solution = form.getFieldValue("solution")
                  if (!email) {
                    message.warn("请输入登录邮箱")
                    return
                  }

                  try {
                    const result = await loginEmailCaptcha({
                      email,
                      captcha_id: imgCaptcha.captcha_id,
                      solution
                    });
                    setEmailCaptchaInfo(result.data as EmailCaptchaResp)
                    message.success(`验证码已发送到邮箱:${email}`)
                    setEmailCaptchaInputState(false)
                  } catch (error: any) {
                    getCaptchaImage();
                    throw error
                  }
                }}
              />
            </>
          )}
          <div
            style={{
              marginBottom: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              自动登录
            </ProFormCheckbox>
            <a
              style={{
                float: 'right',
              }}
              onClick={ForgetPasswordHandler}
            >
              忘记密码 ?
            </a>
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
