import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Form, Button, Input } from 'antd';

const PersonaIntent: React.FC = () => {
  return (
    <Form.List name="fields">
      {(fields, { add, remove }) => {
        return (
          <div>
            {fields.map((field, index) => (
              <div key={field.key}>
                <Form.Item
                  label={'Intent Question ' + (index + 1)}
                  name={[index, 'intent_question']}
                  rules={[{ required: false, message: 'Input is required!' }]}
                >
                  <Input.Group compact>
                    <Input
                      style={{ width: 'calc(100% - 50px)' }}
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
              </div>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} style={{ width: '50%' }}>
                <PlusOutlined /> Add Intent Question
              </Button>
            </Form.Item>
          </div>
        );
      }}
    </Form.List>
  );
};

export default PersonaIntent;
