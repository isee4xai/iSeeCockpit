import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, Form, Input, message, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { ProFormText } from '@ant-design/pro-form';
import { history, useModel } from 'umi';
import Footer from '@/components/Footer';
import styles from './index.less';
import { login, registerWithInvite, validate_invite } from '@/services/isee/user';
import { LoginForm } from './LoginForm';
import { InviteForm } from './InviteForm';
const { Title } = Typography;

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
  const queryParameters = new URLSearchParams(window.location.search)
  const invite = queryParameters.get("invite")
  const [inviteState, setInviteState] = useState<API.LoginResult>({});

  console.log(invite)

  useEffect(() => {
    (async () => {
      if (invite) {
        const data = await validate_invite(invite);
        console.log(data)
        setInviteState(data)

      }
    })();
  }, []);


  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();

    if (userInfo) {
      await setInitialState((s) => ({ ...s, currentUser: userInfo }));
    }
  };

  const handleSubmit = async (values: API.LoginParams) => {
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
      setUserLoginState(response);
    } catch (error) {
      const defaultLoginFailureMessage = 'Not Authenticated';
      message.error(defaultLoginFailureMessage);
    }
  };

  const handleSubmitInvite = async (values: API.LoginParams) => {

    try {
      values.inviteKey = invite || "";
      const responseInvite = await registerWithInvite({ ...values, type });
      if (responseInvite.status === 'ok') {
        message.success('Registration Succesful!');
        // Continue and login the user
        await handleSubmit(values)
      } else {
        message.error(responseInvite.status_message)
      }

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
        {!invite &&
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
        }

        {(invite && inviteState.status == "ok") &&
          <InviteForm
            logo={<img alt="logo" src="/isee_icon.png" />}
            title="iSee Cockpit"
            subTitle={' Intelligent Sharing of Explanation Experience by Users for Users'}
            initialValues={{
              autoLogin: true,
            }}
            onFinish={async (values) => {
              await handleSubmitInvite(values as API.LoginParams);
            }}
          >
            <Title level={3}>You are invited to {inviteState.name}</Title>

            {status === 'error' && <LoginMessage content={'Login Failed. ' + status_message} />}
            <>
              <ProFormText
                name="name"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder={'Your Name'}
                rules={[
                  {
                    required: true,
                    message: 'Required',
                  },
                ]}
              />
              <ProFormText
                name="email"
                fieldProps={{
                  size: 'large',
                  prefix: <MailOutlined className={styles.prefixIcon} />,
                }}
                placeholder={'Email'}
                rules={[
                  {
                    required: true,
                    type: 'email',
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
          </InviteForm>
        }

        {(invite && inviteState.status == "error") &&
          <LoginMessage content={'Invite Failed. ' + inviteState.status_message} />
        }

      </div>
      <Footer />
    </div>
  );
};

export default Login;
