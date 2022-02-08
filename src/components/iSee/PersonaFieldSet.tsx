import { MinusCircleOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import { Form, Divider, Button, Select, Input, Radio } from 'antd';
import PersonaIntent from '@/components/iSee/PersonaIntentFieldSet';

export type AssessmentType = {
  intents: string[];
};

const PersonaField: React.FC<AssessmentType> = (props) => {
  const LEVELS = ['Low', 'Medium', 'High'];
  return (
    <Form.List name="fields">
      {(fields, { add, remove }) => {
        console.log(fields);
        return (
          <div>
            {fields.map((field, index) => (
              <div key={field.key}>
                <Divider>
                  Persona {index + 1}
                  &nbsp;
                  <Button
                    className="dynamic-delete-button"
                    danger={true}
                    onClick={() => remove(field.name)}
                    icon={<MinusCircleOutlined />}
                  >
                    Remove
                  </Button>
                </Divider>

                <Form.Item
                  label="Persona Name"
                  name={[index, 'pesona_name']}
                  rules={[{ required: false, message: 'Input is required!' }]}
                >
                  <Input placeholder="E.g. Doctor" />
                </Form.Item>

                <Form.Item
                  label="Domain Level"
                  name={[index, 'domain_level']}
                  rules={[{ required: false, message: 'Input is required!' }]}
                >
                  <Radio.Group defaultValue="Medium">
                    {LEVELS.map((option) => (
                      <Radio key={option} value={option}>
                        {option}
                      </Radio>
                    ))}
                  </Radio.Group>
                </Form.Item>

                <Form.Item
                  label="Knowledge Level"
                  name={[index, 'knowledge_level']}
                  rules={[{ required: false, message: 'Input is required!' }]}
                >
                  <Radio.Group defaultValue="Medium">
                    {LEVELS.map((option) => (
                      <Radio key={option} value={option}>
                        {option}
                      </Radio>
                    ))}
                  </Radio.Group>
                </Form.Item>

                <Form.Item
                  label="Intent"
                  name={[index, 'assesment_type']}
                  rules={[{ required: false, message: 'Input is required!' }]}
                >
                  <Select>
                    {props.intents.map((option: any) => (
                      <Select.Option key={option} value={option}>
                        {option}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <PersonaIntent />

                {/* {fields.length >= 1 ? (
                                    <Button
                                        className="dynamic-delete-button"
                                        danger={true}
                                        onClick={() => remove(field.name)}
                                        icon={<MinusCircleOutlined />}
                                    >
                                        Remove Persona {index + 1}
                                    </Button>
                                ) : null} */}
              </div>
            ))}
            <Divider />
            <Form.Item>
              <Button type="primary" onClick={() => add()} style={{ width: '100%' }}>
                <PlusOutlined /> Add New Persona <UserOutlined />
              </Button>
            </Form.Item>
          </div>
        );
      }}
    </Form.List>
  );
};

export default PersonaField;
