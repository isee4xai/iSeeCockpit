import type { Company } from '@/models/company';
import {
    api_admin_add_user_company,
    api_admin_edit_user_company,
    api_admin_get_company,
    api_admin_pass_user_company,
    api_admin_update_company,
} from '@/services/isee/admin';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
    Button,
    Card,
    Form,
    Input,
    message,
    PageHeader,
    Result,
    Table,
    Tag,
    Switch,
    Row,
    Col,
    Badge,
    notification,
    Modal,
    Select,
    Divider
} from 'antd';
import React, { useEffect, useState } from 'react';
import { CheckOutlined, CloseOutlined, LeftOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import moment from 'moment';

export type Params = {
    match: {
        params: {
            id: string;
        };
    };
};

const CompanyManage: React.FC<Params> = (props) => {
    const [pageStatus, setPageStatus] = useState('');
    message.config({
        top: 400,
    });
    const companyId = props.match.params.id;

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);

    const [companyDetails] = Form.useForm();
    const [companyUser] = Form.useForm();
    const [companyUserEdit] = Form.useForm();
    const [companyUserEditPass] = Form.useForm();


    const [company, setCompany] = useState<Company>({ _id: '0', name: '', active: false });

    const [usecases, setUsecases] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        (async () => {
            const res_usecase = await api_admin_get_company(companyId);
            setCompany(res_usecase.company);
            setUsecases(res_usecase.usecases);
            setUsers(res_usecase.users);

            if (!res_usecase) {
                setPageStatus('404');
            } else {
                setPageStatus('200');
            }
        })();
    }, [props.match.params.id]);


    async function onFinish(values: any) {
        await api_admin_add_user_company(companyId, values);

        const res_usecase = await api_admin_get_company(companyId);
        handleOk();

        setCompany(res_usecase.company);
        setUsecases(res_usecase.usecases);
        setUsers(res_usecase.users);

        companyUser.resetFields();
        notification.success({
            message: 'User Created!',
            description:
                'Now, you can share the details with them!',
        })
    }

    async function onFinishEdit(values: any) {
        await api_admin_edit_user_company(companyId, values);

        const res_usecase = await api_admin_get_company(companyId);

        setCompany(res_usecase.company);
        setUsecases(res_usecase.usecases);
        setUsers(res_usecase.users);

        notification.success({
            message: 'User Saved!',
            description:
                'Now, you can share the details with them!',
        })
    }

    async function onFinishEditPass(values: any) {
        await api_admin_pass_user_company(companyId, values);

        const res_usecase = await api_admin_get_company(companyId);

        setCompany(res_usecase.company);
        setUsecases(res_usecase.usecases);
        setUsers(res_usecase.users);

        notification.success({
            message: 'Password Updated!'
        })
    }


    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Goal',
            dataIndex: 'goal',
            key: 'goal',
        },
        {
            title: 'Status',
            dataIndex: 'published',
            key: 'published',
            render: (record: string) => {
                return (
                    record ? (
                        <><Tag color="green">Published</Tag></>
                    ) : (
                        <Tag color="red">Unpublished</Tag>
                    )
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
                        <p>{moment(record).locale('en_us').format('LLL')}</p>
                    </div>
                );
            },
        },

    ];

    const columnsUsers = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Type',
            dataIndex: 'access',
            key: 'access',
            filters: [
                {
                    text: 'Design User',
                    value: 'design_user',
                },
                {
                    text: 'End User',
                    value: 'end_user',
                },
            ],
            filterSearch: true,
            onFilter: (value: any, record: any) => record.access == value,
            render: (record: string) => {
                return (
                    record == "end_user" ? (
                        <><Tag color="purple">End User</Tag></>
                    ) : (
                        <Tag color="blue">Design User</Tag>
                    )
                );
            },
        },
        {
            title: 'Status',
            dataIndex: 'isDeleted',
            key: 'isDeleted',
            render: (record: string) => {
                return (
                    record ? (
                        <><Tag color="red">DISABLED</Tag></>
                    ) : (
                        <Tag color="green">ACTIVE</Tag>
                    )
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
                        <p>{moment(record).locale('en_us').format('LLL')}</p>
                    </div>
                );
            },
        },
        {
            title: '',
            dataIndex: '',
            key: 'x',
            render: (record: string) => {
                return (
                    <Button ghost type="primary" onClick={() => showEditModal(record)}>
                        Edit
                    </Button>
                )
            }
        },

    ];

    async function saveDetails() {
        const updateDetails: Company = companyDetails.getFieldsValue();
        await api_admin_update_company(companyId, updateDetails);
        console.log('Updating Settings', updateDetails);
        message.success('Succesfully saved company ' + updateDetails.name + ' details');
    }


    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleEditCancel = () => {
        setIsEditModalVisible(false);
    };

    const showEditModal = (user: any) => {
        companyUserEdit.setFieldsValue(user);
        companyUserEditPass.setFieldsValue(user);
        setIsEditModalVisible(true);
    };

    return (
        <>
            {pageStatus == '404' && (
                <Result
                    status="404"
                    title="404"
                    subTitle="Sorry, we couldn't find the Company"
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
                        title={
                            <>
                                <Button type='link' href={'/admin/companies'}>
                                    <LeftOutlined />Back
                                </Button>{company.name}
                            </>
                        }
                        subTitle={
                            company.active ? (
                                <><Tag color="green">ACTIVE</Tag></>
                            ) : (
                                <Tag color="red">DISABLED</Tag>
                            )
                        }
                    />
                    <Card
                        title="Details"
                        type="inner"
                    >
                        <Form
                            name="basic"
                            form={companyDetails}
                            labelCol={{ span: 0 }}
                            initialValues={company}
                            autoComplete="off"
                        >
                            <Row gutter={20}>
                                <Col span={24} className="gutter-row">
                                    <Form.Item
                                        label="Company Name"
                                        name={'name'}
                                        rules={[{ required: false, message: 'Input is required!' }]}
                                    >
                                        <Input placeholder="Name" />
                                    </Form.Item>
                                </Col>

                                <Col span={24} className="gutter-row">
                                    <Form.Item
                                        label="Company Type"
                                        name={'type'}
                                        rules={[{ required: false, message: 'Input is required!' }]}
                                    >
                                        <Input placeholder="Type" />
                                    </Form.Item>
                                </Col>

                                <Col span={24} className="gutter-row">
                                    <Form.Item
                                        label="Company Active"
                                        name={'active'}
                                        valuePropName="checked"
                                        rules={[{ required: false, message: 'Input is required!' }]}
                                    >
                                        <Switch
                                            checkedChildren={<CheckOutlined />}
                                            unCheckedChildren={<CloseOutlined />}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                        <Button
                            type="primary"
                            onClick={saveDetails}
                            htmlType="button"
                            icon={<SaveOutlined />}
                        >
                            Save Company Details
                        </Button>
                    </Card>

                    <Card
                        title={<>Company Usecases <Badge size="default" count={usecases.length}></Badge></>}
                    >
                        {usecases.length > 0 &&
                            <Table dataSource={usecases} columns={columns} />
                        }
                        {usecases.length == 0 &&
                            <i>No Usecases Yet</i>
                        }
                    </Card>

                    <Card
                        title={<>Company Users <Badge size="default" count={users.length}></Badge></>}
                        extra={[
                            <Button key={'create-btn'} type="primary" onClick={showModal} style={{ width: '100%' }}>
                                <PlusOutlined /> Add New User
                            </Button>,
                        ]}
                    >
                        {users.length > 0 &&
                            <Table dataSource={users} columns={columnsUsers} />
                        }
                        {users.length == 0 &&
                            <i>No Users Yet</i>
                        }
                    </Card>

                    <Modal
                        title="Add New User"
                        visible={isModalVisible}
                        onCancel={handleCancel}
                        footer={[
                            <Button key="back" onClick={handleCancel}>
                                Cancel
                            </Button>,
                            <Button form="create" key="submit" htmlType="submit" type="primary">
                                Create
                            </Button>,
                        ]}
                    >
                        <Form
                            id="create"
                            name="create"
                            layout="vertical"
                            labelCol={{ span: 0 }}
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                            form={companyUser}
                            autoComplete="off"
                        >
                            <Form.Item
                                label="Name"
                                name="name"
                                rules={[{ required: true, message: 'Input is required!' }]}
                            >
                                <Input placeholder="John Doe" />
                            </Form.Item>

                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[{ required: true, message: 'Input is required!' }]}
                            >
                                <Input placeholder="User Email" type='email' />
                            </Form.Item>

                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[{ required: true, message: 'Input is required!' }]}
                            >
                                <Input placeholder="Password" type='password' />
                            </Form.Item>

                            <Form.Item
                                label="Access Type"
                                name="access"
                                initialValue={"design_user"}
                                rules={[{ required: true, message: 'Input is required!' }]}
                            >
                                <Select>
                                    <Select.Option value="design_user">Design User</Select.Option>
                                    <Select.Option value="end_user">End User</Select.Option>
                                </Select>
                            </Form.Item>
                        </Form>
                    </Modal>

                    <Modal
                        title="Edit User"
                        visible={isEditModalVisible}
                        onCancel={handleEditCancel}
                        footer={[
                            <Button key="back" onClick={handleEditCancel}>
                                Cancel
                            </Button>,
                        ]}
                    >
                        <Form
                            id="update"
                            name="update"
                            layout="vertical"
                            labelCol={{ span: 0 }}
                            initialValues={{ remember: true }}
                            onFinish={onFinishEdit}
                            form={companyUserEdit}
                            autoComplete="off"
                        >
                            <Form.Item
                                label="Unique ID"
                                name="_id"
                            >
                                <Input disabled placeholder="John Doe" />
                            </Form.Item>
                            <Form.Item
                                label="Name"
                                name="name"
                                rules={[{ required: true, message: 'Input is required!' }]}
                            >
                                <Input placeholder="John Doe" />
                            </Form.Item>

                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[{ required: true, message: 'Input is required!' }]}
                            >
                                <Input placeholder="User Email" type='email' />
                            </Form.Item>

                            <Form.Item
                                label="Access Type"
                                name="access"
                                initialValue={"design_user"}
                                rules={[{ required: true, message: 'Input is required!' }]}
                            >
                                <Select>
                                    <Select.Option value="design_user">Design User</Select.Option>
                                    <Select.Option value="end_user">End User</Select.Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label="Disable User?"
                                name={'isDeleted'}
                                valuePropName="checked"
                                rules={[{ required: false, message: 'Input is required!' }]}
                            >
                                <Switch
                                    checkedChildren={<CheckOutlined />}
                                    unCheckedChildren={<CloseOutlined />}
                                />
                            </Form.Item>

                            <Button form="update" key="submit" htmlType="submit" type="primary">
                                Update User Profile
                            </Button>
                        </Form>
                        <Divider></Divider>
                        <Form
                            id="pass"
                            name="pass"
                            layout="vertical"
                            labelCol={{ span: 0 }}
                            initialValues={{ remember: true }}
                            onFinish={onFinishEditPass}
                            form={companyUserEditPass}
                            autoComplete="off"
                        >
                            <Form.Item
                                label="Unique ID"
                                name="_id"
                                hidden
                            >
                                <Input disabled />
                            </Form.Item>

                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[{ required: true, message: 'Input is required!' }]}
                            >
                                <Input placeholder="Password" type='password' />
                            </Form.Item>

                            <Button form="pass" key="submit" htmlType="submit" type="primary" danger>
                                Update Password
                            </Button>
                        </Form>

                    </Modal>

                </PageHeaderWrapper>
            )}
        </>
    );
};

export default CompanyManage;
