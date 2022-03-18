import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Form, Button, Select, Input, Card, Space, Empty, Popconfirm } from 'antd';

export type AssessmentType = {
  types: string[];
};

const AssetmentField: React.FC<AssessmentType> = (props) => {
  return (
    <Form.List name="assessments">
      {(fields, { add, remove }) => {
        return (
          <Card
            size="small"
            title={'Assessments'}
            extra={
              <Button
                className="dynamic-delete-button"
                // danger={true}
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
                    style={{ display: 'flex', marginBottom: 2 }}
                    align="baseline"
                  >
                    <Form.Item
                      name={[index, 'assesment_type']}
                      rules={[{ required: false, message: 'Input is required!' }]}
                    >
                      <Select style={{ width: 150 }} placeholder="Assesment Type">
                        {props.types.map((option: any) => (
                          <Select.Option key={option} value={option}>
                            {option}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      // label="Assesment Value"
                      name={[index, 'assesment_val']}
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

export default AssetmentField;
