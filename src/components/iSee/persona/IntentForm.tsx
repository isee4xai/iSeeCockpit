import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Form, Button, Select, Input, Radio, Row, Col, Space, Card, Empty } from 'antd';
import DATA_FILEDS from '@/models/common';
import { Persona } from '@/models/usecase';


export type PersonaType = {
    persona: Persona,
    updatePersona?: any
};


const IntentForm: React.FC<PersonaType> = (props) => {

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
                        label="Intent"
                        name="assesment_type"
                        rules={[{ required: false, message: 'Input is required!' }]}
                    >
                        <Select>
                            {DATA_FILEDS.IntentType.map((option: any) => (
                                <Select.Option key={option} value={option}>
                                    {option}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>

                <Col span={12} className="gutter-row">
                    <Form.List name="intent_questions">
                        {(fields, { add, remove }) => {
                            return (
                                <Card
                                    size="small"
                                    title={'Intent Questions'}
                                    extra={
                                        <Button
                                            className="dynamic-delete-button"
                                            // danger={true}
                                            // color='primary'
                                            size="small"
                                            onClick={() => add()}
                                            icon={<PlusOutlined />}
                                        >
                                            Add
                                        </Button>
                                    }
                                >
                                    <div>
                                        {fields.map((field, index) => (
                                            <div key={field.key}>
                                                <Space
                                                    key={field.key}
                                                    style={{ display: 'block', marginBottom: 2 }}
                                                    align="baseline"
                                                >
                                                    <Form.Item
                                                        name={[index, 'assesment_type']}
                                                        rules={[{ required: false, message: 'Input is required!' }]}
                                                    >
                                                        <Input.Group compact>
                                                            <Input
                                                                style={{ width: 'calc(100% - 70px)' }}
                                                                placeholder="E.g. how accurate is this event outcome"
                                                            />
                                                            <Button
                                                                className="dynamic-delete-button"
                                                                onClick={() => remove(field.name)}
                                                                danger={true}
                                                                icon={<MinusCircleOutlined />}
                                                            />
                                                        </Input.Group>
                                                    </Form.Item>
                                                </Space>
                                            </div>
                                        ))}
                                        {fields.length == 0 ? (
                                            <Form.Item>
                                                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Intent Questions" />
                                            </Form.Item>
                                        ) : null}
                                    </div>
                                </Card>
                            );
                        }}
                    </Form.List>
                </Col>
            </Row>
        </Form>


    );
};

export default IntentForm;
