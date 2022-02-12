import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, InputNumber, Modal, Button, Avatar, Typography } from 'antd';
import { SmileOutlined, UserOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

interface UserType {
    name: string;
    age: string;
}

interface ModalFormProps {
    visible: boolean;
    onCancel: () => void;
}

// reset form fields when modal is form, closed
const useResetFormOnCloseModal = ({ form, visible }: { form: FormInstance; visible: boolean }) => {
    const prevVisibleRef = useRef<boolean>();
    useEffect(() => {
        prevVisibleRef.current = visible;
    }, [visible]);
    const prevVisible = prevVisibleRef.current;

    useEffect(() => {
        if (!visible && prevVisible) {
            form.resetFields();
        }
    }, [visible]);
};

const PersonaModal: React.FC<ModalFormProps> = ({ visible, onCancel }) => {
    const [form] = Form.useForm();

    useResetFormOnCloseModal({
        form,
        visible,
    });

    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <Modal
            title="Create new Usecase"
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
                // wrapperCol={{ span: 8 }}
                initialValues={{ remember: true }}
                // onFinish={onFinish}
                // onFinishFailed={onFinishFailed}
                // onFieldsChange={(_, allFields) => {
                //   console.log(allFields);
                // }}
                autoComplete="off"
            >


                <Form.Item
                    label="Name of the Persona"
                    name="name"
                    rules={[{ required: true, message: 'Input is required!' }]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>

    );
};

export default PersonaModal;
