import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Form, Button, Select, Input, Card, Space, Empty, Popconfirm } from 'antd';

const QuestionResponseField: React.FC = () => {
    return (
        <Form.List name="metric_values">
            {(fields, { add, remove }) => {
                return (
                    <Card
                        size="small"
                        title={'Response Values'}
                        extra={
                            <Button
                                className="dynamic-delete-button"
                                // danger={true}
                                size="small"
                                onClick={() => add()}
                                icon={<PlusOutlined />}
                            >
                                Add Response
                            </Button>
                        }
                    >
                        <div>
                            {fields.map((field, index) => (
                                <div key={field.key}>
                                    <Space
                                        key={field.key}
                                        style={{ display: 'flex', marginBottom: 2 }}
                                        align="baseline"
                                    >
                                        <Form.Item
                                            // label="Assesment Value"
                                            name={[index, 'val']}
                                            rules={[{ required: false, message: 'Input is required!' }]}
                                        >
                                            <Input placeholder="Assesment Value" />
                                        </Form.Item>

                                        <Popconfirm
                                            title={'Are you sure to delete?'}
                                            onConfirm={() => remove(field.name)}
                                            // onCancel={cancel}
                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            <Button
                                                danger={true}
                                                className="dynamic-delete-button"
                                                icon={<MinusCircleOutlined />}
                                            />
                                        </Popconfirm>
                                    </Space>
                                </div>
                            ))}
                            {fields.length == 0 ? (
                                <Form.Item>
                                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Assessments" />
                                </Form.Item>
                            ) : null}
                        </div>
                    </Card>
                );
            }}
        </Form.List>
    );
};

export default QuestionResponseField;
