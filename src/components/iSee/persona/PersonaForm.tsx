import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Form, Button, Select, Input, Radio, Row, Col, Space, Card, Empty } from 'antd';
import DATA_FILEDS from '@/models/common';
import { Persona } from '@/models/usecase';


export type PersonaType = {
    persona: Persona,
    updatePersona?: any
};


const PersonaForm: React.FC<PersonaType> = (props) => {

    const LEVELS = ['Low', 'Medium', 'High'];
    const [form] = Form.useForm();

    return (
        <Form
            name="basic"
            form={form}
            layout="vertical"
            labelCol={{ span: 0 }}
            // wrapperCol={{ span: 10 }}
            initialValues={props.persona}
            // onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
            onFieldsChange={(_, allFields) => {
                console.log(allFields);
                // form.setFieldsValue({ name: "abcd" })
            }}
            autoComplete="off"
        >
            <Row gutter={20}>
                <Col span={12} className="gutter-row">
                    <Form.Item
                        label="Persona Name"
                        name={'name'}
                        rules={[{ required: false, message: 'Input is required!' }]}
                    >
                        <Input placeholder="E.g. Doctor" />
                    </Form.Item>

                    <Form.Item
                        label="Domain Level"
                        name='domain_level'
                        rules={[{ required: false, message: 'Input is required!' }]}
                    >
                        <Radio.Group defaultValue="Medium">
                            {LEVELS.map((option) => (
                                <Radio.Button key={option} value={option}>
                                    {option}
                                </Radio.Button>
                            ))}
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item
                        label="Knowledge Level"
                        name='knowledge_level'
                        rules={[{ required: false, message: 'Input is required!' }]}
                    >
                        <Radio.Group defaultValue="Medium">
                            {LEVELS.map((option) => (
                                <Radio.Button key={option} value={option}>
                                    {option}
                                </Radio.Button>
                            ))}
                        </Radio.Group>
                    </Form.Item>

                </Col>


            </Row>
        </Form>


    );
};

export default PersonaForm;
