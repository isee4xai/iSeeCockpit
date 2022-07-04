import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, Form, Input, message } from 'antd';
import React, { useState } from 'react';
import { ProFormText } from '@ant-design/pro-form';
import { history, useModel } from 'umi';
import Footer from '@/components/Footer';
import styles from './index.less';
import { login } from '@/services/isee/user';
import { LoginForm } from './LoginForm';

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  const [type] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();

    if (userInfo) {
      await setInitialState((s) => ({ ...s, currentUser: userInfo }));
    }
  };

  const handleSubmit = async (values: API.LoginParams) => {
    // console.log(values);
    try {

      const response = await login({ ...values, type });
      // console.log(response)
      if (response.status === 'ok') {
        console.log("ok state here")

        const defaultLoginSuccessMessage = 'Login Succesful!';
        message.success(defaultLoginSuccessMessage);
        await fetchUserInfo();

        if (!history) return;
        const { query } = history.location;
        const { redirect } = query as {
          redirect: string;
        };
        history.push(redirect || '/');
        return;
      }
      console.log("im here")
      setUserLoginState(response);
    } catch (error) {
      const defaultLoginFailureMessage = 'Not Authenticated';
      message.error(defaultLoginFailureMessage);
    }
  };

  const { status, status_message } = userLoginState;
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <br />
        <br />
        <LoginForm
          logo={<img alt="logo" src="/isee_icon.png" />}
          title="iSee Cockpit"
          subTitle={' Intelligent Sharing of Explanation Experience by Users for Users'}
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            await handleSubmit(values as API.LoginParams);
          }}
        >
          {status === 'error' && <LoginMessage content={'Login Failed. ' + status_message} />}
          <>
            <ProFormText
              name="email"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined className={styles.prefixIcon} />,
              }}
              placeholder={'Email'}
              rules={[
                {
                  required: true,
                  message: 'Required',
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={styles.prefixIcon} />,
              }}
              placeholder={'Password'}
              rules={[
                {
                  required: true,
                  message: 'Required',
                },
              ]}
            />
          </>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
