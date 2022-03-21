import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Form, Button, Select, Input, Switch, Radio, Row, Col } from 'antd';
import DATA_FILEDS from '@/models/common';
import { Question } from '@/models/questionnaire';
import QuestionResponseField from './QuestionResponseField';


export type QuestionType = {
    question: Question,
    changeQuestion: any
};


const QuestionForm: React.FC<QuestionType> = (props) => {
    const { Option } = Select;
    const [form] = Form.useForm();

    return (
        <Form
            name="basic"
            form={form}
            key={"formidq-" + props.question.id}
            layout="vertical"
            initialValues={props.question}
            // onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
            onFieldsChange={(_, allFields) => {
                let updates_q = form.getFieldsValue();
                updates_q.id = props.question.id;
                console.log(allFields);
                props.changeQuestion(updates_q)
            }}
            autoComplete="off"
        >
            <Row gutter={24}>
                <Col span={24}>
                    <Form.Item
                        label="Question Text"
                        name="text"
                        tooltip="This is a required field"
                        rules={[{ required: true, message: 'Input is required!' }]}
                    >
                        <Input />
                    </Form.Item>

                </Col>
                <Col span={8}>
                    <Form.Item
                        label="Questionnaire Category"
                        name="category"
                        tooltip="This is a required field"
                        rules={[{ required: true, message: 'Input is required!' }]}
                    >
                        <Select
                        >
                            {DATA_FILEDS.QUESTION_CATEGORY.map((option) => (
                                <Option key={option} value={option}>
                                    {option}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Required" name="required" valuePropName="required">
                        <Switch checked={props.question.required} />
                    </Form.Item>
                </Col>
                <Col span={16}>
                    <Form.Item
                        label="Response Type"
                        name="metric"
                        tooltip="This is a required field"
                        rules={[{ required: true, message: 'Input is required!' }]}
                    >
                        <Radio.Group defaultValue={DATA_FILEDS.QUESTION_METRIC[0]} buttonStyle="solid">
                            {DATA_FILEDS.QUESTION_METRIC.map((option) => (
                                <Radio.Button value={option}>{option}</Radio.Button>
                            ))}
                        </Radio.Group>

                        {/* </Select> */}
                    </Form.Item>


                    <Form.Item
                        shouldUpdate={(prevValues, currentValues) =>
                            prevValues.metric !== currentValues.metric
                        }
                        noStyle
                    >
                        {({ getFieldValue }) =>
                            getFieldValue('metric') === 'Radio' ||
                                getFieldValue('metric') === 'Checkbox' ||
                                getFieldValue('metric') === 'Likert' ? (
                                <QuestionResponseField></QuestionResponseField>
                            ) : null
                        }
                    </Form.Item>
                </Col>

            </Row>


            {/* <Button
                    // onClick={() => loadQuestions()}
                    icon={<DownloadOutlined />}
                >
                    Load Existing Questions
                </Button> */}






        </Form >
    );
};

export default QuestionForm;
