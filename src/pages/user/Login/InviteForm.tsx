import ProForm, { ProFormProps, ProFormText } from '@ant-design/pro-form';
import { Button, ConfigProvider, Result, Typography } from 'antd';
import React, { useContext, useMemo } from 'react';
import './login.less';
import { LockOutlined, MailOutlined, SmileOutlined, UserOutlined } from '@ant-design/icons';
const { Title } = Typography;
import styles from './index.less';


export type InviteFormProps<T> = {
    message: React.ReactNode | false;
    title: React.ReactNode | false;
    subTitle: React.ReactNode | false;
    actions: React.ReactNode;
    logo?: React.ReactNode;
    children?: React.ReactNode | React.ReactNode[];
    contentStyle?: React.CSSProperties;
} & ProFormProps<T>;

function InviteForm<T = Record<string, any>>(props: Partial<InviteFormProps<T>>) {
    const { logo, message, contentStyle, title, subTitle, actions, children, ...proFormProps } =
        props;

    const submitter =
        proFormProps.submitter === false
            ? false
            : ({
                searchConfig: {
                    submitText: "Register and Join",
                },
                ...proFormProps.submitter,
                submitButtonProps: {
                    size: 'large',
                    style: {
                        width: '100%',
                    },
                    ...proFormProps.submitter?.submitButtonProps,
                },
                render: (_, dom) => {
                    const inviteButton = dom.pop();
                    if (typeof (proFormProps?.submitter as any)?.render === 'function') {
                        return (proFormProps?.submitter as any)?.render?.(_, dom);
                    }
                    return inviteButton;
                },
            } as ProFormProps['submitter']);

    const context = useContext(ConfigProvider.ConfigContext);
    const baseClassName = context.getPrefixCls('pro-form-login');
    const getCls = (className: string) => `${baseClassName}-${className}`;

    const logoDom = useMemo(() => {
        if (!logo) return null;
        if (typeof logo === 'string') {
            return <img src={logo} />;
        }
        return logo;
    }, [logo]);

    return (
        <div className={getCls('container')}>
            <div className={getCls('top')}>
                {title || logoDom ? (
                    <div className={getCls('header')}>
                        {logoDom ? <span className={getCls('logo')}>{logoDom}</span> : null}
                        {title ? <span className={getCls('title')}>{title}</span> : null}
                    </div>
                ) : null}
                {subTitle ? <div className={getCls('desc')}>{subTitle}</div> : null}
            </div>

            <div
                className={getCls('main')}
                style={{
                    width: 328,
                    ...contentStyle,
                }}
            >
                <ProForm isKeyPressSubmit {...proFormProps} submitter={submitter}>
                    {message}
                    {children}
                </ProForm>
                {actions ? <div className={getCls('other')}>{actions}</div> : null}
            </div>
        </div>
    );
}
export { InviteForm };