import type { Persona, PersonaDetails } from '@/models/persona';
import TOOL_TIPS from '@/models/tooltips';
import { api_persona_details } from '@/services/isee/usecases';
import { SaveOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, message, Radio, Row, Select } from 'antd';
import { useEffect, useState } from 'react';

export type PersonaType = {
  usecaseId: string;
  persona: Persona;
  updatePersona?: any;
  changed?: any;
  ontoValues?: API.OntoParams
};

const { Option } = Select;
const PersonaDetailsForm: React.FC<PersonaType> = (props) => {

  const [detailsForm] = Form.useForm();

  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    detailsForm.setFieldsValue(props.persona.details);
  }, []);

  async function saveDetails() {
    const updateDetails: PersonaDetails = detailsForm.getFieldsValue();
    console.log(props.usecaseId);

    await api_persona_details(props.usecaseId, props.persona._id, updateDetails);

    console.log('Updating Settings');
    message.success('Succesfully saved persona ' + updateDetails.name + ' details');
    setIsChanged(false);
  }

  return (
    <Card
      title="Details"
      type="inner"
      extra={
        <Button
          type="primary"
          key={'panel-detailbtn-' + props.persona._id}
          // onClick={savePersonaDetails}
          onClick={saveDetails}
          disabled={!isChanged}
          htmlType="button"
          icon={<SaveOutlined />}
        >
          Save Details
        </Button>
      }
    >
      <Form
        name="basic"
        form={detailsForm}
        layout="vertical"
        labelCol={{ span: 0 }}
        // wrapperCol={{ span: 10 }}
        initialValues={props.persona}
        // onFinish={onFinish}
        // onFinishFailed={onFinishFailed}
        onFieldsChange={() => {
          setIsChanged(true);
        }}
        autoComplete="off"
      >
        <Row gutter={20}>
          <Col span={8} className="gutter-row">
            <Form.Item
              label="Persona Name"
              tooltip={TOOL_TIPS.persona_name}
              name={'name'}
              rules={[{ required: false, message: 'Input is required!' }]}
            >
              <Input placeholder="E.g. Doctor" />
            </Form.Item>
          </Col>

          <Col span={8} className="gutter-row">
            <Form.Item
              label="Domain Knowledge Level"
              name="domain_knowledge_level"
              tooltip={TOOL_TIPS.persona_domain_knowledge_level}
              rules={[{ required: false, message: 'Input is required!' }]}
            >
              <Select placeholder="Select Knowledge Level">
                {props.ontoValues?.KNOWLEDGE_LEVEL.map((option) => (
                  <Option key={option.key} value={option.key}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={8} className="gutter-row">
            <Form.Item
              label="AI Knowledge Level"
              name="ai_knowledge_level"
              tooltip={TOOL_TIPS.persona_ai_knowledge_level}
              rules={[{ required: false, message: 'Input is required!' }]}
            >
              <Select placeholder="Select Knowledge Level">
                {props.ontoValues?.KNOWLEDGE_LEVEL.map((option) => (
                  <Option key={option.key} value={option.key}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default PersonaDetailsForm;
