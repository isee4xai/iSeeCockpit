import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Form, Button, Space, Card, Empty, Divider, Popconfirm, Col, Row } from 'antd';
import { Questionnaire } from '@/models/questionnaire';
import QuestionForm from './QuestionForm';

export type QuestionnaireType = {
    questionnaire: Questionnaire
};

const QuestionnaireForm: React.FC<QuestionnaireType> = (props) => {
    const [form] = Form.useForm();

    return (
        <Form
            name="basic"
            form={form}
            layout="vertical"
            labelCol={{ span: 0 }}
            initialValues={props.questionnaire}
            onFieldsChange={(_, allFields) => {
                console.log(allFields);
            }}
            autoComplete="off"
        >
            <Row gutter={20}>
                <Col span={3}></Col>
                <Col span={18}>
                    <Form.List name="questions">
                        {(fields, { add, remove }) => {
                            return (
                                <Card
                                    size="small"
                                    title={'Evaluation Questions'}
                                    extra={
                                        <Button
                                            className="dynamic-delete-button"
                                            // danger={true}
                                            size="small"
                                            onClick={() => add()}
                                            icon={<PlusOutlined />}
                                            name='addQuestionButton'
                                        >
                                            Add
                                        </Button>
                                    }
                                >
                                    <div>
                                        {fields?.map((field, index) => (
                                            <div key={field.key}>
                                                <Divider>
                                                    <Space>
                                                        Question {index + 1}
                                                        <Popconfirm
                                                            title={'Are you sure to delete?'}
                                                            onConfirm={() => remove(field.name)}
                                                            // onCancel={cancel}
                                                            okText="Yes"
                                                            cancelText="No"
                                                        >
                                                            <Button
                                                                className="dynamic-delete-button"
                                                                danger={true}
                                                                icon={<MinusCircleOutlined />}
                                                            >
                                                            </Button>
                                                        </Popconfirm>
                                                    </Space>
                                                </Divider>
                                                <Form.Item
                                                    name={[index, 'question']}
                                                >
                                                    <QuestionForm question={props.questionnaire.questions ? props.questionnaire.questions[index] : {}} />
                                                </Form.Item>
                                            </div>
                                        ))}
                                        {fields.length == 0 ? (
                                            <Form.Item >
                                                <Empty
                                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                                    description="No Questions" />
                                            </Form.Item>
                                        ) : null}
                                    </div>
                                </Card>
                            );
                        }}
                    </Form.List>
                </Col>
                <Col span={3}></Col>
            </Row>
        </Form >
    );
};

export default QuestionnaireForm;
