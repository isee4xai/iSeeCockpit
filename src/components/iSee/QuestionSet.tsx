import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Form, Button, Card, Space, Empty, Popconfirm, Divider } from 'antd';
import Question from '@/components/iSee/Question';

const QuestionSet: React.FC = () => {
  return (
    <Form.List name="fields">
      {(fields, { add, remove }) => {
        return (
          <Card
            size="small"
            title={'Questions'}
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
                          Remove
                        </Button>
                      </Popconfirm>
                    </Space>
                  </Divider>
                  <Question />
                </div>
              ))}
              {fields.length == 0 ? (
                <Form.Item>
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Questions" />
                </Form.Item>
              ) : null}
            </div>
          </Card>
        );
      }}
    </Form.List>
  );
};

export default QuestionSet;
