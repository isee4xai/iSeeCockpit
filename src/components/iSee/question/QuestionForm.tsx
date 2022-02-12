import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Form, Button, Select, Input, Switch } from 'antd';
import DATA_FILEDS from '@/models/common';
import { Question } from '@/models/questionnaire';

// const formItemLayout = {
//     labelCol: {
//         xs: { span: 24 },
//         sm: { span: 8 },
//     },
//     wrapperCol: {
//         xs: { span: 24 },
//         sm: { span: 16 },
//     },
// };
// const formItemLayoutWithOutLabel = {
//     wrapperCol: {
//         xs: { span: 24, offset: 0 },
//         sm: { span: 16, offset: 8 },
//     },
// };


export type QuestionType = {
    question: Question
};


const QuestionForm: React.FC<QuestionType> = (props) => {
    const { Option } = Select;
    const [form] = Form.useForm();

    return (
        <Form
            name="basic"
            form={form}
            layout="vertical"
            initialValues={props.question}
            // onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
            onFieldsChange={(_, allFields) => {
                console.log(allFields);
                // form.setFieldsValue({ name: "abcd" })
            }}
            autoComplete="off"
        >
            <Form.Item
                label="Questionnaire Category"
                name="question_category"
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
            {/* <Button
                    // onClick={() => loadQuestions()}
                    icon={<DownloadOutlined />}
                >
                    Load Existing Questions
                </Button> */}

            <Form.Item
                label="Question Text"
                name="question_text"
                tooltip="This is a required field"
                rules={[{ required: true, message: 'Input is required!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Response Type"
                name="question_metric"
                tooltip="This is a required field"
                rules={[{ required: true, message: 'Input is required!' }]}
            >
                <Select>
                    {DATA_FILEDS.QUESTION_METRIC.map((option) => (
                        <Option key={option} value={option}>
                            {option}
                        </Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                shouldUpdate={(prevValues, currentValues) =>
                    prevValues.question_metric !== currentValues.question_metric
                }
                noStyle
            >
                {({ getFieldValue }) =>
                    getFieldValue('question_metric') === 'radio' ||
                        getFieldValue('question_metric') === 'check' ||
                        getFieldValue('question_metric') === 'Likert' ? (
                        <Form.List name="metric_values">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields?.map((field, index) => (
                                        <Form.Item
                                            // {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                                            label={index === 0 ? 'Response Values' : ''}
                                            required={true}
                                            key={field.key}
                                            name={[index, "response_value"]}
                                        >
                                            {/* <Form.Item
                                                validateTrigger={['onChange', 'onBlur']}
                                                rules={[
                                                    {
                                                        required: true,
                                                        whitespace: true,
                                                        message: 'At least two options are required!',
                                                    },
                                                ]}
                                                noStyle
                                            > */}
                                            <Input
                                                placeholder="response value"
                                                style={{ width: '60%' }}
                                            />
                                            {/* </Form.Item> */}
                                            {fields.length > 2 ? (
                                                <Button
                                                    className="dynamic-delete-button"
                                                    // danger={true}
                                                    icon={<MinusCircleOutlined />}
                                                    onClick={() => remove(field.name)}
                                                >
                                                </Button>

                                            ) : null}
                                        </Form.Item>
                                    ))}
                                    <Form.Item
                                    // {...formItemLayoutWithOutLabel}
                                    >
                                        <Button
                                            type="dashed"
                                            onClick={() => add()}
                                            style={{ width: '60%' }}
                                            icon={<PlusOutlined />}
                                        >
                                            Add Response Values
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                    ) : null
                }
            </Form.Item>

            <Form.Item label="Required" name="required" valuePropName="required">
                <Switch />
            </Form.Item>
        </Form >
    );
};

export default QuestionForm;
