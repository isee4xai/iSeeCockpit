/* eslint-disable react/no-array-index-key */
import {
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
  Typography
} from 'antd';
import React, { useEffect, useState } from 'react';

import type { Explainer } from '@/models/explainer';
import { api_create, api_get_all } from '@/services/isee/explainers';
import { template } from 'lodash';

const columns: ColumnsType<Explainer> = [
  {
    title: 'Explainer',
    dataIndex: 'name',
    key: 'name',
    render: text => <a>{text}</a>,
    fixed: 'left',
    width: '8%',
  },
  {
    title: 'Description',
    dataIndex: 'explainer_description',
    key: 'explainer_description',
    render: text => <Typography.Text ellipsis={true}>{text}</Typography.Text>,
  },
  {
    title: 'Explainability Technique',
    dataIndex: 'technique',
    key: 'technique',
  },
  {
    title: 'Dataset Type',
    dataIndex: 'dataset_type',
    key: 'dataset_type',
  },
  {
    title: 'Explanation Type',
    dataIndex: 'explanation_type',
    key: 'explanation_type',
  },
  {
    title: 'Explanation Description',
    dataIndex: 'explanation_description',
    key: 'explanation_description',
    render: text => <Typography.Text ellipsis={true}>{text}</Typography.Text>,
  },
  {
    title: 'Explainer Concurrentness',
    dataIndex: 'concurrentness',
    key: 'concurrentness',
  },
  {
    title: 'Explainer Portability',
    dataIndex: 'portability',
    key: 'portability',
  },
  {
    title: 'Explanation Scope',
    dataIndex: 'scope',
    key: 'scope',
  },
  {
    title: 'Explanation Target',
    dataIndex: 'target',
    key: 'target',
  },
  {
    title: 'Presentation Format',
    dataIndex: 'presentations',
    key: 'presentations',
    render: (_, { presentations }) => (
      <>
        {presentations?.map(temp => {
          return (
            <Tag key={temp}>
              {temp}
            </Tag>
          );
        })}
      </>
    )
  },
  {
    title: 'Computational Complexity',
    dataIndex: 'complexity',
    key: 'complexity',
  },
  {
    title: 'Applicable AI Methods',
    dataIndex: 'ai_method',
    key: 'ai_method',
    render: (_, { ai_methods }) => (
      <>
        {ai_methods?.map(temp => {
          return (
            <Tag key={temp}>
              {temp}
            </Tag>
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
          return (
            <Tag key={temp}>
              {temp}
            </Tag>
          );
        })}
      </>
    )
  },
  {
    title: 'Implementation Framework',
    dataIndex: 'implementation',
    key: 'implementation',
  },
  {
    title: 'Metadata',
    dataIndex: 'metadata',
    key: 'metadata',
    render: text => <code>{text}</code>,
  }
];

const data: Explainer[] = [
  {
    "name": "/Tabular/DicePublic",
    "explainer_description": "This explainer will generate multiple counterfactuals for a given scenario",
    "technique": "DiCE",
    "dataset_type": "univariate",
    "explanation_type": "Feature_Influence_Explanation",
    "explanation_description": "Important features are at the beginning",
    "concurrentness": "post-hoc",
    "scope": "local",
    "portability": "model-agnostic",
    "target": "model",
    "presentations": ["figure"],
    "complexity": "Factorial_time",
    "ai_methods": ["Instance_Based_Learning"],
    "ai_tasks": ["Audio_Processing"],
    "implementation": "tfv2",
    "metadata": "{}"
  },
  {
    "name": "/Tabular/DicePublic",
    "explainer_description": "This explainer will generate multiple counterfactuals for a given scenario",
    "technique": "LIME",
    "dataset_type": "univariate",
    "explanation_type": "Feature_Influence_Explanation",
    "explanation_description": "Important features are at the beginning",
    "concurrentness": "post-hoc",
    "scope": "local",
    "portability": "model-agnostic",
    "target": "model",
    "presentations": ["figure"],
    "complexity": "Factorial_time",
    "ai_methods": ["Instance_Based_Learning"],
    "ai_tasks": ["Audio_Processing"],
    "implementation": "tfv2",
    "metadata": "{}"
  },
  {
    "name": "/Tabular/DicePublic",
    "explainer_description": "This explainer will generate multiple counterfactuals for a given scenario",
    "technique": "DisCERN",
    "dataset_type": "univariate",
    "explanation_type": "Feature_Influence_Explanation",
    "explanation_description": "Important features are at the beginning",
    "concurrentness": "post-hoc",
    "scope": "local",
    "portability": "model-agnostic",
    "target": "model",
    "presentations": ["figure"],
    "complexity": "Factorial_time",
    "ai_methods": ["Instance_Based_Learning"],
    "ai_tasks": ["Audio_Processing"],
    "implementation": "tfv2",
    "metadata": "{}"
  }
];


const Explainers: React.FC = () => {

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [explainers, setExplainers] = useState([]);

  const { TextArea } = Input;


  useEffect(() => {
    (async () => {
      const data = await api_get_all();
      setExplainers(data);
    })();
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  async function get_all() {
    const data = await api_get_all();
    setExplainers(data);
  }

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
      metadata: values.metadata
    };
    create(_obj);
  };

  return (
    <PageContainer>
      <Modal
        title="Create New Explainer"
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
            {/* https://explainers-dev.isee4xai.com/ */}
            <Select>
              <Select.Option value="/Tabular/DicePublic">/Tabular/DicePublic</Select.Option>
              <Select.Option value="/Tabular/Anchors">/Tabular/Anchors</Select.Option>
              <Select.Option value="/Tabular/Anchors">/Tabular/Anchors</Select.Option>
              <Select.Option value="/Images/GradCamTorch">/Images/GradCamTorch</Select.Option>
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
            <Select>
              <Select.Option value="Data-driven">Data-driven</Select.Option>
              <Select.Option value="DiCE">DiCE</Select.Option>
              <Select.Option value="Knowledge_Extraction">Knowledge_Extraction</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Dataset Type"
            name="dataset_type"
            tooltip=""
            rules={[{ required: true, message: 'Input is required!' }]}
          >
            {/* http://www.w3id.org/iSeeOnto/explainer#DatasetType */}
            <Select>
              <Select.Option value="text">text</Select.Option>
              <Select.Option value="time_series">time_series</Select.Option>
              <Select.Option value="univariate">univariate</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Explanation Type"
            name="explanation_type"
            tooltip=""
            rules={[{ required: true, message: 'Input is required!' }]}
          >
            {/* http://linkedu.eu/dedalo/explanationPattern.owl#Explanation */}
            <Select>
              <Select.Option value="Neighbourhood_Explanation">Neighbourhood Explanation</Select.Option>
              <Select.Option value="Feature_Influence_Explanation">Feature Influence Explanation</Select.Option>
              <Select.Option value="Prototype_Explanation">Prototype Explanation</Select.Option>
            </Select>
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
            <Select>
              <Select.Option value="ante-hoc">ante-hoc</Select.Option>
              <Select.Option value="post-hoc">post-hoc</Select.Option>
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
            <Select>
              <Select.Option value="model-agnostic">Model-agnostic</Select.Option>
              <Select.Option value="modelClassSpecific">Model-class specific</Select.Option>
              <Select.Option value="modelSpecific">Model-specific</Select.Option>
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
            <Select>
              <Select.Option value="cohort">cohort</Select.Option>
              <Select.Option value="global">global</Select.Option>
              <Select.Option value="local">local</Select.Option>
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
            <Select>
              <Select.Option value="data">data</Select.Option>
              <Select.Option value="prediction">prediction</Select.Option>
              <Select.Option value="model">model</Select.Option>
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
            <Select>
              <Select.Option value="database_table">database table</Select.Option>
              <Select.Option value="figure">figure</Select.Option>
              <Select.Option value="image">image</Select.Option>
              <Select.Option value="chart">chart</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Computational Complexity"
            name="complexity"
            //http://www.w3id.org/iSeeOnto/explainer#ComputationalComplexity
            tooltip=""
            rules={[{ required: true, message: 'Input is required!' }]}
          >
            {/* http://www.w3id.org/iSeeOnto/explainer#Time_Complexity*/}
            <Select>
              <Select.Option value="Exponential_time">Exponential time</Select.Option>
              <Select.Option value="Factorial_time">Factorial time</Select.Option>
              <Select.Option value="Linearithmic_time">Linearithmic time</Select.Option>
              <Select.Option value="Log-logarithmic_time">Log-logarithmic time</Select.Option>
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
            <Select>
              <Select.Option value="Markov_Process_Model">Markov Process Model</Select.Option>
              <Select.Option value="Instance_Based_Learning">Instance Based Learning</Select.Option>
              <Select.Option value="Dimensionality_Reduction">Dimensionality Reduction</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Applicable AI Tasks"
            name="ai_tasks"
            tooltip=""
            rules={[{ required: true, message: 'Input is required!' }]}
          >
            {/* multi-select */}
            {/* https://purl.org/heals/eo#AITask */}
            <Select>
              <Select.Option value="AnomalyDetection">Anomaly Detection</Select.Option>
              <Select.Option value="Audio_Processing">Audio Processing</Select.Option>
              <Select.Option value="Autonomous_Driving">Autonomous Driving</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Implementation Framework"
            name="implementation"
            tooltip=""
            rules={[{ required: true, message: 'Input is required!' }]}
          >
            {/* Ike to add */}
            <Select>
              <Select.Option value="tfv1">Tensorflow V1</Select.Option>
              <Select.Option value="tfv2">Tensorflow V1</Select.Option>
              <Select.Option value="pytorch">PyTorch</Select.Option>
              <Select.Option value="sklearn">SKLearn</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Metadata"
            name="metadata"
            tooltip="Metadata derived from GitHub"
            rules={[{ required: false }]}
          >
            <TextArea
              autoSize
              defaultValue=''
              allowClear
              size="large"
            />
          </Form.Item>

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
      <Table columns={columns} dataSource={data} scroll={{ x: 2300 }} />
    </PageContainer >
  );
};

export default Explainers;
