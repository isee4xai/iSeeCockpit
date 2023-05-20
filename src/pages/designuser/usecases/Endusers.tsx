import type { Usecase } from '@/models/usecase';
import {
    api_create_enduser_invite,
    api_get,
    api_get_invites,
} from '@/services/isee/usecases';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
    Button,
    Card,
    Checkbox,
    Form,
    Input,
    message,
    PageHeader,
    Result,
    Table,
    Tag,
    Switch
} from 'antd';
import React, { useEffect, useState } from 'react';
import Text from 'antd/lib/typography/Text';
import { CheckOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';

export type Params = {
    match: {
        params: {
            id: string;
        };
    };
};

const EndUsers: React.FC<Params> = (props) => {
    const [pageStatus, setPageStatus] = useState('');
    message.config({
        top: 400,
    });
    const usecaseId = props.match.params.id;
    const [form] = Form.useForm();
    const [usecase, setUsecase] = useState<Usecase>({ _id: '0', name: '', published: false });
    const [invites, setInvites] = useState([]);
    useEffect(() => {
        (async () => {
            const res_usecase = await api_get(usecaseId);
            setUsecase(res_usecase);
            if (!res_usecase) {
                setPageStatus('404');
            } else {
                const res_usecase_invites = await api_get_invites(usecaseId);
                setInvites(res_usecase_invites)
                setPageStatus('200');
            }
        })();
    }, [props.match.params.id]);


    async function onFinish(values: any) {
        await api_create_enduser_invite(usecaseId, values);
        const res_usecase_invites = await api_get_invites(usecaseId);
        setInvites(res_usecase_invites);
        form.resetFields();
    }
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Share URL',
            dataIndex: 'key',
            key: 'key',
            render: (record: string) => {
                return (
                    <div>
                        <code>{window.location.host + "/invite/"
                            + record}</code>
                    </div>
                );
            },
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (record: string) => {
                return (
                    <div>
                        <p>{moment(record).locale('en_us').fromNow()}</p>
                    </div>
                );
            },
        },
        {
            title: 'Published',
            dataIndex: 'published',
            key: 'published',
            render: (_: any, row: any) =>
            (<Switch
                checked={row.published}
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
            />
            )
        },
    ];

    return (
        <>
            {pageStatus == '404' && (
                <Result
                    status="404"
                    title="404"
                    subTitle="Sorry, we couldn't find the Usecase"
                    extra={
                        <Button type="primary" onClick={() => (window.location.pathname = '/')}>
                            Back Home
                        </Button>
                    }
                />
            )}
            {pageStatus == '200' && (
                <PageHeaderWrapper>
                    <PageHeader
                        key="head2"
                        ghost={false}
                        title={usecase.name}
                        subTitle={
                            usecase.published ? (
                                <><Text code>v{usecase.version}</Text> <Tag color="green">Published</Tag></>
                            ) : (
                                <Tag color="red">Unpublished</Tag>
                            )
                        }
                    />
                    <Card>
                        <Form
                            name="basic"
                            style={{ maxWidth: 600 }}
                            form={form}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                            layout='inline'
                        >
                            <Form.Item
                                label="Invitation Name"
                                name="name"

                                rules={[{ required: true, message: 'Please input an Invite Name!' }]}
                            >
                                <Input placeholder='May Group Study' />
                            </Form.Item>

                            <Form.Item >
                                <Button type="primary" htmlType="submit">
                                    <PlusOutlined></PlusOutlined>Create Invite Link
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                    <Card>

                        <Table dataSource={invites} columns={columns} />

                    </Card>
                </PageHeaderWrapper>
            )}
        </>
    );
};

export default EndUsers;
