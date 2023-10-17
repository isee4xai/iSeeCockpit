/* eslint-disable react/no-array-index-key */
import {
  CheckOutlined,
  CloseOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  PageHeader,
  Select,
  Tag,
  Table,
  Typography,
  Cascader,
  Switch
} from 'antd';
import React, { useEffect, useState } from 'react';

import type { Explainer } from '@/models/explainer';
import { api_create, api_get_all, api_get_explainers_lib, api_get_explainers_lib_single } from '@/services/isee/explainers';
import { get_explainer_fields, get_explainer_fields_flat } from '@/services/isee/ontology';


const Explainers: React.FC = () => {

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [explainers, setExplainers] = useState<Explainer[]>([]);

  const [ontoValues, setOntoValues] = useState<API.OntoExplainerParams>();
  const [ontoValuesFlat, setOntoValuesFlat] = useState([]);
  const [explainersLib, setExplainersLib] = useState([])

  const [form] = Form.useForm();


  const columns: ColumnsType<Explainer> = [
    {
      title: 'Explainer',
      dataIndex: 'name',
      key: 'name',
      render: text => <a>{text}</a>,
      fixed: 'left',
      width: '7%',

    },
    {
      title: 'Description',
      dataIndex: 'explainer_description',
      key: 'explainer_description',
      width: 500,
      render: text => <Typography.Text ellipsis={false}>{text}</Typography.Text>,
    },
    {
      title: 'Explainability Technique',
      dataIndex: 'technique',
      key: 'technique',
      render: text => <>{ontoValuesFlat["ExplainabilityTechnique"][text]}</>
      //   render: text =>
      //     <Cascader fieldNames={{ label: 'label', value: 'key', children: 'children' }}
      //       options={ontoValues?.ExplainabilityTechnique.children}
      //       value={text}
      //       placeholder="Pick or Search Explainability Technique"
      //       changeOnSelect />

    },
    {
      title: 'Dataset Type',
      dataIndex: 'dataset_type',
      key: 'dataset_type',
      render: text => <>{ontoValuesFlat["DatasetType"][text]}</>
    },
    {
      title: 'Explanation Type',
      dataIndex: 'explanation_type',
      key: 'explanation_type',
      render: text => <>{ontoValuesFlat["Explanation"][text]}</>
    },
    {
      title: 'Explanation Description',
      dataIndex: 'explanation_description',
      key: 'explanation_description',
      width: 400,
      // render: text => <Typography.Text ellipsis={false}>{text}</Typography.Text>,
      render: text => <Typography.Text ellipsis={false}>{text}</Typography.Text>,
    },
    {
      title: 'Explainer Concurrentness',
      dataIndex: 'concurrentness',
      key: 'concurrentness',
      render: text => <>{ontoValuesFlat["Concurrentness"][text]}</>
    },
    {
      title: 'Explainer Portability',
      dataIndex: 'portability',
      key: 'portability',
      render: text => <>{ontoValuesFlat["Portability"][text]}</>
    },
    {
      title: 'Explanation Scope',
      dataIndex: 'scope',
      key: 'scope',
      render: text => <>{ontoValuesFlat["Scope"][text]}</>
    },
    {
      title: 'Explanation Target',
      dataIndex: 'target',
      key: 'target',
      render: text => <>{ontoValuesFlat["Target"][text]}</>
    },
    {
      title: 'Presentation Format',
      dataIndex: 'presentations',
      key: 'presentations',
      render: (_, { presentations }) => (
        <>
          {presentations?.map(temp => {
            return (<>
              <li key={temp} >
                - {ontoValuesFlat["InformationContentEntity"][temp]}
              </li>
            </>
            );
          })}
        </>
      )
    },
    {
      title: 'Computational Complexity',
      dataIndex: 'computational_complexity',
      key: 'computational_complexity',
      render: text => <>{ontoValuesFlat["ComputationalComplexity"][text]}</>
    },
    {
      title: 'Applicable AI Methods',
      dataIndex: 'ai_methods',
      key: 'ai_methods',
      width: '6%',
      render: (_, { ai_methods }) => (
        <>
          {ai_methods?.map(temp => {
            return (<>
              <li key={temp} >
                - {ontoValuesFlat["AIMethod"][temp]}
              </li>
            </>
            );
          })}
        </>
      )
    },
    {
      title: 'Applicable AI Tasks',
      dataIndex: 'ai_tasks',
      key: 'ai_tasks',
      render: (_, { ai_tasks }) => (
        <>
          {ai_tasks?.map(temp => {
            return (<>
              <li key={temp} >
                - {ontoValuesFlat["AITask"][temp]}
              </li>
            </>
            );
          })}
        </>
      )
    },
    {
      title: 'Implementation Framework',
      dataIndex: 'implementation',
      key: 'implementation',
      render: (_, { implementation }) => (
        <>
          {implementation?.map(temp => {
            return (<>
              <li key={temp} >
                - {ontoValuesFlat["Implementation_Framework"][temp]}
              </li>
            </>
            );
          })}
        </>
      )
    },
    {
      title: 'Needs Training Data',
      dataIndex: 'needs_training_data',
      key: 'needs_training_data',
      render: text => <code>{text}</code>
    },
    {
      title: 'Model Access Type',
      dataIndex: 'model_access',
      key: 'model_access',
      render: text => <code>{ontoValuesFlat["ModelAccess"][text]}</code>
    },
    // {
    //   title: 'Metadata',
    //   dataIndex: 'metadata',
    //   key: 'metadata',
    //   render: text => <code>{text}</code>,
    // }
  ];


  const { TextArea } = Input;

  useEffect(() => {
    (async () => {
      message.config({
        top: 400,
      });
      const hide = message.loading(
        'Please wait.. Retrieving explainers from iSee Ontology...',
        0,
      );

      const fields = await get_explainer_fields()
      const fields_flat = await get_explainer_fields_flat()
      setOntoValues(fields)
      setOntoValuesFlat(fields_flat)
      console.log("onto vals: ", fields)
      console.log("onto vals: ", fields_flat)

      const data = await api_get_all();
      console.log(data)
      setExplainers(data);
      hide();

    })();
  }, []);

  const showModal = () => {

    api_get_explainers_lib()
      .then((response) => {
        if (response) {
          setExplainersLib(response)
        }
      })
      .catch((error) => {
        console.log("explainers-error: User Domains", error);
        message.error("Error Reading Ontology - E500");
      });

    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  async function get_all() {
    message.config({
      top: 400,
    });
    const hide = message.loading(
      'Retrieving explainers from iSee Ontology...',
      0,
    );
    const data = await api_get_all();
    setExplainers(data);
    hide();
  }

  async function changeExplainer(selected: any) {

    api_get_explainers_lib_single(selected)
      .then((response) => {
        form.setFieldsValue({
          explainer_description: response._method_description,
          metadata: JSON.stringify(response.meta, null, 4)
        });
      })
      .catch((error) => {
        console.log("explainers-error: User Domains", error);
        message.error("Error Reading Ontology - E500");
      });
  };



  const filterCascader = (inputValue: string, path: API.OntoOption[]) =>
    path.some(
      (option) => (option.label as string).toLowerCase().indexOf(inputValue.toLowerCase()) > -1,
    );


  async function create(explainer: Explainer) {
    console.log('Create Explainer:', JSON.stringify(explainer));
    handleOk();
    await api_create(explainer);
    get_all();
    message.success('Succesfully Added Explainer');
  }

  const onFinish = (values: any) => {
    const _obj: Explainer = {
      name: values.name,
      explainer_description: values.explainer_description,
      technique: values.technique,
      dataset_type: values.dataset_type,
      explanation_type: values.explanation_type,
      explanation_description: values.explanation_description,
      concurrentness: values.concurrentness,
      scope: values.scope,
      portability: values.portability,
      target: values.target,
      presentations: values.presentations,
      complexity: values.complexity,
      ai_methods: values.ai_methods,
      ai_tasks: values.ai_tasks,
      implementation: values.implementation,
      metadata: values.metadata,
      needs_training_data: values.needs_training_data ?? false,
      model_access: values.model_access
    };
    create(_obj);
  };

  return (
    <PageContainer>
      <Modal
        title="Add New Explainer"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button form="create" key="submit" htmlType="submit" type="primary">
            Create
          </Button>,
        ]}
      >
        <Form
          id="create"
          name="create"
          form={form}
          layout="vertical"
          labelCol={{ span: 0 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >

          <Form.Item
            label="Explainer"
            name="name"
            tooltip=""
            rules={[{ required: true, message: 'Input is required!' }]}
          >
            <Select placeholder="Select Explainer" onChange={changeExplainer}>
              {explainersLib.map((option) => (
                <Select.Option key={option} value={option}>
                  {option}
                </Select.Option>
              ))}
            </Select>

          </Form.Item>

          <Form.Item
            label="Explainer Description"
            name="explainer_description"
            tooltip=""
            rules={[{ required: true, message: 'Input is required!' }]}
          >
            <Input />

          </Form.Item>

          <Form.Item
            label="Explainability Technique"
            name="technique"
            tooltip=""
            rules={[{ required: true, message: 'Input is required!' }]}
          >
            {/* http://www.w3id.org/iSeeOnto/explainer#ExplainabilityTechnique */}
            <Cascader fieldNames={{ label: 'label', value: 'key', children: 'children' }}
              options={ontoValues?.ExplainabilityTechnique.children}
              showSearch={{ filterCascader }}
              placeholder="Pick or Search Explainability Technique"
              changeOnSelect />
          </Form.Item>

          <Form.Item
            label="Dataset Type"
            name="dataset_type"
            tooltip=""
            rules={[{ required: true, message: 'Input is required!' }]}
          >
            {/* http://www.w3id.org/iSeeOnto/explainer#DatasetType */}

            <Select placeholder="Dataset Type">
              {ontoValues?.DatasetType.map((option) => (
                <Select.Option key={option.key} value={option.key}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>

          </Form.Item>

          <Form.Item
            label="Explanation Type"
            name="explanation_type"
            tooltip=""
            rules={[{ required: true, message: 'Input is required!' }]}
          >
            {/* http://linkedu.eu/dedalo/explanationPattern.owl#Explanation */}
            <Cascader fieldNames={{ label: 'label', value: 'key', children: 'children' }}
              options={ontoValues?.Explanation.children}
              showSearch={{ filterCascader }}
              placeholder="Pick or Search Explainability Type"
              changeOnSelect />
          </Form.Item>

          <Form.Item
            label="Explanation Description"
            name="explanation_description"
            tooltip=""
            rules={[{ required: true, message: 'Input is required!' }]}
          >
            <Input />

          </Form.Item>

          <Form.Item
            label="Explainer Concurrentness"
            name="concurrentness"
            // http://www.w3id.org/iSeeOnto/explainer#ExplainerConcurrentness
            tooltip=""
            rules={[{ required: true, message: 'Input is required!' }]}
          >
            {/* http://www.w3id.org/iSeeOnto/explainer#ExplainerConcurrentness*/}

            <Select placeholder="Explainer Concurrentness">
              {ontoValues?.Concurrentness.map((option) => (
                <Select.Option key={option.key} value={option.key}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>

          </Form.Item>

          <Form.Item
            label="Explainer Portability"
            name="portability"
            // http://www.w3id.org/iSeeOnto/explainer#Portability
            tooltip=""
            rules={[{ required: true, message: 'Input is required!' }]}
          >
            {/* http://www.w3id.org/iSeeOnto/explainer#Portability */}
            <Select placeholder="Explainer Portability">
              {ontoValues?.Portability.map((option) => (
                <Select.Option key={option.key} value={option.key}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Explanation Scope"
            name="scope"
            // http://www.w3id.org/iSeeOnto/explainer#ExplanationScope
            tooltip=""
            rules={[{ required: true, message: 'Input is required!' }]}
          >
            {/* http://www.w3id.org/iSeeOnto/explainer#ExplanationScope*/}
            <Select placeholder="Explanation Scope">
              {ontoValues?.Scope.map((option) => (
                <Select.Option key={option.key} value={option.key}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Explanation Target"
            name="target"
            // http://www.w3id.org/iSeeOnto/explainer#ExplanationTarget
            tooltip=""
            rules={[{ required: true, message: 'Input is required!' }]}
          >
            {/* http://www.w3id.org/iSeeOnto/explainer#ExplanationTarget*/}
            <Select placeholder="Explanation Target">
              {ontoValues?.Target.map((option) => (
                <Select.Option key={option.key} value={option.key}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Presentation format"
            name="presentations"
            tooltip=""
            rules={[{ required: true, message: 'Input is required!' }]}
          >
            {/* multi-select */}
            {/* http://semanticscience.org/resource/SIO_000015*/}
            <Cascader fieldNames={{ label: 'label', value: 'key', children: 'children' }}
              options={ontoValues?.InformationContentEntity.children}
              showSearch={{ filterCascader }}
              placeholder="Pick or Search Presentation Formats"
              multiple
              changeOnSelect />
          </Form.Item>

          <Form.Item
            label="Computational Complexity"
            name="complexity"
            //http://www.w3id.org/iSeeOnto/explainer#ComputationalComplexity
            tooltip=""
            rules={[{ required: true, message: 'Input is required!' }]}
          >
            {/* http://www.w3id.org/iSeeOnto/explainer#Time_Complexity*/}

            <Select placeholder="Computational Complexity">
              {ontoValues?.ComputationalComplexity.map((option) => (
                <Select.Option key={option.key} value={option.key}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>

          </Form.Item>

          <Form.Item
            label="Applicable AI Methods"
            name="ai_methods"
            tooltip=""
            rules={[{ required: true, message: 'Input is required!' }]}
          >
            {/* multi-select */}
            {/* https://purl.org/heals/eo#ArtificialIntelligenceMethod*/}
            <Cascader fieldNames={{ label: 'label', value: 'key', children: 'children' }}
              options={ontoValues?.AIMethod.children}
              showSearch={{ filterCascader }}
              placeholder="Pick or Search AI Methods"
              multiple
              changeOnSelect />
          </Form.Item>

          <Form.Item
            label="Applicable AI Tasks"
            name="ai_tasks"
            tooltip=""
            rules={[{ required: true, message: 'Input is required!' }]}
          >
            {/* multi-select */}
            {/* https://purl.org/heals/eo#AITask */}
            <Cascader fieldNames={{ label: 'label', value: 'key', children: 'children' }}
              options={ontoValues?.AITask.children}
              showSearch={{ filterCascader }}
              placeholder="Pick or Search AI Tasks"
              multiple
              changeOnSelect />
          </Form.Item>

          <Form.Item
            label="Implementation Framework"
            name="implementation"
            tooltip=""
            rules={[{ required: true, message: 'Input is required!' }]}
          >
            <Select placeholder="Implementation Framework" mode="multiple">
              {ontoValues?.Implementation_Framework.map((option) => (
                <Select.Option key={option.key} value={option.key}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Model Access"
            name="model_access"
            tooltip="How will we be able to access the model?"
            rules={[{ required: true, message: 'Input is required!' }]}
          >
            <Select placeholder="Model Access">
              {ontoValues?.ModelAccess.map((option) => (
                <Select.Option key={option.key} value={option.key}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Needs Training Data"
            name="needs_training_data"
            tooltip="Does the XAI method require background samples to train on?"
          >
            <Switch
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}
            />
          </Form.Item>


          {/* <Form.Item
            label="Metadata"
            name="metadata"
            tooltip="Metadata derived from GitHub"
            rules={[{ required: false }]}
          >
            <TextArea
              autoSize
              defaultValue=''
              size="large"
              disabled
            />
          </Form.Item> */}

        </Form>


      </Modal>

      <PageHeader
        ghost={false}
        key="head1"
        // onBack={() => window.history.back()}
        title="Explainer Library"
        subTitle="Displaying all explainers"
        extra={[
          <Button key={'create-btn'} type="primary" onClick={showModal} style={{ width: '100%' }}>
            <PlusOutlined /> Add New
          </Button>,
        ]}
      />
      {/* <Card> */}
      {/* <Row gutter={20}> */}
      <Table columns={columns} dataSource={explainers} scroll={{ x: 3000 }}

        expandable={{
          expandedRowRender: (record) => <p>Metadata:<br></br><code>{record.metadata}</code></p>,
          rowExpandable: (record) => record.name !== 'Not Expandable',
        }}
      />
    </PageContainer >
  );
};

export default Explainers;
