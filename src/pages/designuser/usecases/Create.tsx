import AssetmentField from '@/components/iSee/AssetmentFieldSet';
import PersonaTabs from '@/components/iSee/persona/PersonaTabs';
import TOOL_TIPS from '@/models/tooltips';
import type { Persona } from '@/models/persona';
import type { Usecase, UsecaseModel, UsecaseSettings } from '@/models/usecase';
import { get_usecase_fields } from '@/services/isee/ontology';
import {
  api_create_persona,
  api_delete,
  api_get,
  api_get_casestructure,
  api_get_model_instance_count,
  api_get_model_prediction,
  api_get_model_random_instance,
  api_model_upload,
  api_publish,
  api_update_settings,
} from '@/services/isee/usecases';
import {
  CheckOutlined,
  CloseOutlined,
  CodeOutlined,
  CopyOutlined,
  DeleteOutlined,
  DownloadOutlined,
  ExperimentOutlined,
  FileTextOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  SaveOutlined,
  SettingOutlined,
  ThunderboltOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  Alert,
  Button,
  Card,
  Cascader,
  Checkbox,
  Col,
  Collapse,
  Divider,
  Form,
  Input,
  message,
  Modal,
  notification,
  PageHeader,
  Popconfirm,
  Popover,
  Radio,
  Result,
  Row,
  Select,
  Space,
  Switch,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import React, { useEffect, useState } from 'react';
import { api_get_all } from '@/services/isee/explainers';

import Papa from "papaparse";
const { Text } = Typography;
import CollapsePanel from 'antd/lib/collapse/CollapsePanel';

const { Option } = Select;

const sample_personas: Persona[] = [];

export type Params = {
  match: {
    params: {
      id: string;
    };
  };
};

const Create: React.FC<Params> = (props) => {
  const [personas, setPersonas] = useState(sample_personas);
  const [pageStatus, setPageStatus] = useState('');
  // const { id } = useParams();

  message.config({
    top: 400,
  });
  const usecaseId = props.match.params.id;

  const [settings, setSettings] = useState<UsecaseSettings>();
  const [isSettingChanged, SetIsSettingChanged] = useState(false);

  const [model, setModel] = useState<UsecaseModel>();
  const [isModelChanged, setIsModelChanged] = useState(false);
  const [modelData, setModelData] = useState(false);
  const [modelSource, setModelSource] = useState(false);
  const [modelUploaded, setModelUploaded] = useState<boolean>(false);

  const [settingsForm] = Form.useForm();
  const [modelForm] = Form.useForm();

  const [ontoValues, setOntoValues] = useState<API.OntoParams>();
  const [usecase, setUsecase] = useState<Usecase>({ _id: '0', name: '', published: false });

  useEffect(() => {
    (async () => {
      const res_usecase = await api_get(props.match.params.id);
      console.log('RUNNING FIRST QUERY');
      console.log(res_usecase);

      const onto_params = await get_usecase_fields();
      setOntoValues(onto_params);

      setUsecase(res_usecase);
      if (!res_usecase) {
        setPageStatus('404');
      } else {
        setPageStatus('200');
        settingsForm.setFieldsValue(res_usecase.settings);
        modelForm.setFieldsValue(res_usecase.model);
        setSettings(res_usecase.settings);
        setModel(res_usecase.model);
        setPersonas(res_usecase.personas);
      }
    })();
  }, [props.match.params.id, settingsForm]);

  const [ontoExplainers, setOntoExplainers] = useState({});

  useEffect(() => {
    (async () => {
      // Get all explainers - To Show meta information
      const explainers = await api_get_all();
      let filterExplainers = {}

      explainers.forEach((e: { name: string; explainer_description: string; explanation_description: string; }) => {
        filterExplainers[e.name] = { explainer_description: e.explainer_description, explanation_description: e.explanation_description }
      });
      setOntoExplainers(filterExplainers);
      console.log("Explainers - Loaded")
    })();

  }, []);


  const handleModelUpload = () => {
    setModelUploaded(true);
  }

  const handleDatasetUpload = () => {

  }

  // New Persona Popup Functions
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  async function onFinishPersona(values: any) {
    const new_persona: Persona = {
      _id: 'persona-' + Math.floor(Math.random() * 100000) + 1,
      completed: false,
      details: {
        name: values.name,
        domain_knowledge_level: null,
        ai_knowledge_level: null,
      },
      intents: [],
    };

    console.log('Success Create Persona:', new_persona);
    const added_persona = await api_create_persona(usecase._id, new_persona);
    if (added_persona) {
      new_persona._id = added_persona._id;
      setPersonas([...personas, new_persona]);
      handleOk();
      message.success('Succesfully Added Persona');
    } else {
      message.error('Error Adding Persona');
    }
  }

  async function saveSettings() {
    const updateSettings: UsecaseSettings = settingsForm.getFieldsValue();

    if (
      updateSettings.ai_task != ''
      // TODO: MORE VALIDAATIONS LATER
    ) {
      updateSettings.completed = true;
    } else {
      updateSettings.completed = false;
    }

    setSettings(updateSettings);

    const test = await api_update_settings(usecase._id, {
      ...usecase,
      settings: { ...updateSettings },
    });
    console.log('Success Update Settings:', test);
    message.success('Succesfully saved AI Model Settings');
    SetIsSettingChanged(false);
  }

  async function saveModel() {
    const updateModel: UsecaseModel = modelForm.getFieldsValue();

    updateModel.source_file = modelSource;
    updateModel.dataset_file = modelData;
    updateModel.completed = model?.completed;
    const loading = message.loading('Uploading model and data file. Please wait...', 0);
    const apicall = await api_model_upload(usecase._id, {
      ...usecase,
      model: { ...updateModel },
    });

    loading();

    if (
      updateModel.mode != '' &&
      updateModel.backend != ''
      // TODO: MORE VALIDAATIONS LATER
    ) {
      updateModel.completed = true;
    } else {
      updateModel.completed = false;
    }

    setModel(updateModel);

    // console.log('Success Update updateModel:', test);
    // message.success('Succesfully saved AI Model');
    notification.success({
      message: 'Succesfully saved AI Model and Dataset',
      placement: 'top',
      duration: 3,
    });
    setIsModelChanged(false);
  }

  const filterCascader = (inputValue: string, path: API.OntoOption[]) =>
    path.some(
      (option) => (option.label as string).toLowerCase().indexOf(inputValue.toLowerCase()) > -1,
    );

  const genExtra = () => (
    <Space size="middle">
      <Button
        type="primary"
        onClick={() => saveSettings()}
        disabled={!isSettingChanged}
        htmlType="button"
        className="r-10"
        icon={<SaveOutlined />}
      >
        Save AI Model Settings
      </Button>

      {(!settings?.completed && <Tag color="red">Pending</Tag>) ||
        (settings?.completed && <Tag color="green">Completed</Tag>)}
    </Space>
  );
  const genExtraUpload = () => (
    <Space size="middle">
      <Button
        type="primary"
        onClick={() => saveModel()}
        disabled={!isModelChanged}
        htmlType="button"
        className="r-10"
        icon={<SaveOutlined />}
      >
        Upload AI Model
      </Button>
      {(!model?.completed && <Tag color="red">Pending</Tag>) ||
        (model?.completed && <Tag color="green">Completed</Tag>)}
    </Space>
  );

  const genPersona = () => (
    <Space size="middle">
      <Button
        type="primary"
        onClick={showModal}
        htmlType="button"
        className="r-10"
        icon={<PlusOutlined />}
      >
        Create New Persona
      </Button>
      {/* <Tag color="red">Pending</Tag> */}
    </Space>
  );

  const handleFileInputModel = (e: any) => {
    setModelSource(e.target.files[0]);
    setIsModelChanged(true);
  };

  const handleFileInputData = (e: any) => {

    if (e.target.files[0].type != "text/csv" && e.target.files[0].type != "application/zip") {
      message.error("Invalid Dataset file! Only CSV and Zip Files are accepted");
      return false;
    }

    setModelData(e.target.files[0]);
    setIsModelChanged(true);

    Papa.parse(e.target.files[0], {
      header: true,
      preview: 1,
      skipEmptyLines: true,
      complete: function (results) {
        // console.log(results.meta.fields);

        let uploaded_attributes: { name: string; datatype: string; min: string; max: string; min_raw: string; max_raw: string; target: boolean; values: [any] }[] = [];

        // Validate Attributes Based on Dataset Type
        // 1. Image Data
        if (settings?.dataset_type == "http://www.w3id.org/iSeeOnto/explainer#image") {

          // 1.1 Image Data CSV 
          if (e.target.files[0].type == "text/csv") {
            const image = { name: "image_csv", datatype: "image", min: '', min_raw: '0', max: '', max_raw: '255', target: false, values: [], shape: "", shape_raw: "" }
            uploaded_attributes.push(image)
          } else {
            const image = { name: "image_zip", datatype: "image", min: '', min_raw: '0', max: '', max_raw: '255', target: false, values: [], shape: "", shape_raw: "", mean_raw: "", std_raw: "" }
            uploaded_attributes.push(image)
          }

          const label = { name: "label", datatype: "categorical", min: '', max: '', max_raw: '', target: true, values: [] }
          uploaded_attributes.push(label)

        } else {
          // Todo: Other Validations
          results.meta.fields?.forEach(function (key) {
            const v = { name: key, datatype: "numerical", min: '', max: '', min_raw: '', max_raw: '', target: false, values: [] }
            uploaded_attributes.push(v)
          })

        }


        let modelres = modelForm.getFieldsValue()
        modelres.attributes = uploaded_attributes;
        modelForm.setFieldsValue(modelres)

        console.log(modelForm.getFieldValue('attributes')[0])

      },
    });

  };

  return (
    <>
      {pageStatus == '404' && (
        <Result
          status="404"
          title="404"
          subTitle="Sorry, we couldn't find the Usecase"
          extra={
            <Button type="primary" onClick={() => (window.location.pathname = '/')}>
              Back Home
            </Button>
          }
        />
      )}
      {pageStatus == '200' && (
        <PageHeaderWrapper>
          <PageHeader
            key="head2"
            ghost={false}
            title={usecase.name}
            subTitle={
              usecase.published ? (
                <><Text code>v{usecase.version}</Text> <Tag color="green">Published</Tag></>
              ) : (
                <Tag color="red">Unpublished</Tag>
              )
            }
            extra={[
              <div key="head3">
                Publish &nbsp;&nbsp;
                <Switch
                  onChange={async (checked, event) => {
                    const json = await api_get_casestructure(usecase._id || '');
                    if (json) {
                      await api_publish(usecase._id || '', checked);
                      setUsecase({ ...usecase, published: checked });
                    } else {
                      event.preventDefault();
                      event.stopPropagation();
                    }
                  }}
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                  defaultChecked={usecase.published}
                  checked={usecase.published}
                />
                <Button
                  type="primary"
                  style={{ margin: '0 1rem' }}
                  onClick={async () => {
                    const json = await api_get_casestructure(usecase._id || '');
                    if (json) {
                      const json_formatted = JSON.stringify(json, null, 2);

                      notification.open({
                        message: json.length + ' Cases - ' + 'iSee Case Structure Export',
                        description: (
                          <div>
                            <pre style={{ marginBottom: 0 }}>
                              <code>{json_formatted}</code>
                            </pre>
                            <div
                              style={{
                                display: 'flex',
                                float: 'right',
                              }}
                            >
                              <Button
                                onClick={() => {
                                  navigator.clipboard.writeText(json_formatted);
                                  message.success('Copied to Clipboard');
                                }}
                                icon={<CopyOutlined />}
                              >
                                Copy
                              </Button>
                              &nbsp;
                              <Button
                                type="primary"
                                onClick={() => {
                                  var a = document.createElement('a');
                                  a.href = URL.createObjectURL(
                                    new Blob([json_formatted], { type: 'application/json' }),
                                  );
                                  a.download = 'isee-export-' + usecaseId + '.json';
                                  a.click();
                                }}
                                icon={<DownloadOutlined />}
                              >
                                Download
                              </Button>
                            </div>
                          </div>
                        ),
                        duration: 0,
                        onClick: () => {
                          console.log('Export Clicked!');
                        },
                        style: {
                          width: '80%',
                        },
                        placement: 'top',
                      });
                    }

                  }}
                  htmlType="button"
                  icon={<SaveOutlined />}
                >
                  Export JSON
                </Button>{' '}
                <Popconfirm
                  title={'Are you sure to delete?'}
                  onConfirm={async () => {
                    await api_delete(usecase._id || '');
                    window.location.pathname = '/usecases';
                  }}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    danger={true}
                    className="dynamic-delete-button"
                    icon={<DeleteOutlined />}
                  />
                </Popconfirm>
              </div>,
            ]}
          />

          {/* AI MODEL SETTINGS  */}
          <Card
            title={
              <h4>
                <SettingOutlined /> AI Model Settings
              </h4>
            }
            extra={genExtra()}
            headStyle={{ backgroundColor: '#fafafa', border: '1px solid #d9d9d9' }}
          >
            <Form
              name="basic"
              labelCol={{ span: 0 }}
              onFieldsChange={() => {
                SetIsSettingChanged(true);
                const updateSettings: UsecaseSettings = settingsForm.getFieldsValue();
                setSettings(updateSettings);
              }}
              form={settingsForm}
              autoComplete="off"
            >
              <Row gutter={20}>
                <Col span={16} className="gutter-row">
                  <div hidden={settings?.ai_method}>
                    <Alert message={TOOL_TIPS.ai_settings_info} type="info" />
                    <br></br>
                  </div>
                  <Form.Item
                    label="AI Task"
                    name="ai_task"
                    tooltip={TOOL_TIPS.ai_task}
                    rules={[{ required: false, message: 'Input is required!' }]}
                  >
                    <Cascader
                      fieldNames={{ label: 'label', value: 'key', children: 'children' }}
                      options={ontoValues?.AI_TASK.children}
                      showSearch={{ filterCascader }}
                      placeholder="Search AI Tasks..."
                      changeOnSelect
                    />
                  </Form.Item>

                  <Form.Item
                    label="AI Method"
                    name="ai_method"
                    tooltip={TOOL_TIPS.ai_method}
                    hidden={!settings?.ai_task}
                    rules={[{ required: false, message: 'Input is required!' }]}
                  >
                    <Cascader
                      fieldNames={{ label: 'label', value: 'key', children: 'children' }}
                      options={ontoValues?.AI_METHOD.children}
                      showSearch={{ filterCascader }}
                      placeholder="Search AI Methods..."
                      changeOnSelect
                      multiple
                      maxTagCount="responsive"
                    />
                  </Form.Item>

                  <div hidden={!settings?.ai_method}>
                    <Divider>Data Settings</Divider>
                    <div hidden={settings?.num_instances}>
                      <Alert message={TOOL_TIPS.data_info} type="info" />
                      <br></br>
                    </div>
                  </div>

                  <Form.Item
                    label={<>
                      Dataset Type
                      <Popover placement='right' content={
                        <>
                          <table style={{ width: 400 }}>
                            <tbody>
                              <tr>
                                <td style={{ paddingRight: 5 }}><strong>Tabular</strong></td>
                                <td>Tabular data includes any data presented in a table format (i.e. structured into rows and columns). This includes univariate (data with a single attribute/features) or multivariate (data with multiple attributes/features).
                                  For example: billing information, census information or bioinformatic information.
                                  <hr></hr>
                                </td>
                              </tr>
                              <tr>
                                <td style={{ paddingRight: 5 }}><strong>Image</strong></td>
                                <td>Image data includes any static or dynamic visual data.
                                  For example: photographs, medical images or video.
                                  <hr></hr>
                                </td>
                              </tr>
                              <tr>
                                <td style={{ paddingRight: 5 }}><strong>Timeseries</strong></td>
                                <td>Timeseries data includes any data with temporal features, where subsequent features/attributes are reliant on previous features/attributes.
                                  For example: weather sensor data, wearable sensor data or power metering.
                                  <hr></hr>
                                </td>
                              </tr>
                              <tr>
                                <td style={{ paddingRight: 5 }}><strong>Text</strong></td>
                                <td>Text data includes any natural language or machine textual data. This can be structured or unstructured.
                                  For example: online reviews, code documentation or auditing reports.
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </>
                      } title="Dataset Types" trigger="click">
                        <Button style={{
                          marginLeft: 5,
                          marginRight: 5
                        }} size="small"
                          icon={<QuestionCircleOutlined />}
                        >
                          More Info
                        </Button>
                      </Popover>
                    </>}
                    name="dataset_type"
                    hidden={!settings?.ai_method}
                    // tooltip={TOOL_TIPS.dataset_type}
                    rules={[{ required: false, message: 'Input is required!' }]}
                  >
                    <Radio.Group>
                      {ontoValues?.DATASET_TYPE.map((option) => (
                        <Radio key={option.key} value={option.key}>
                          {option.label}
                        </Radio>
                      ))}
                    </Radio.Group>
                  </Form.Item>

                  <Form.Item
                    label={<>
                      Data Type
                      <Popover placement='right' content={
                        <>
                          <table style={{ width: 400 }}>
                            <tbody>
                              <tr>
                                <td style={{ paddingRight: 5 }}><strong>Categorical</strong></td>
                                <td>Categorical data includes data which can be divided into groups. For example: Nationality, membership or non-membership, or country tax codes.
                                  <hr></hr>
                                </td>
                              </tr>
                              <tr>
                                <td style={{ paddingRight: 5 }}><strong>Image</strong></td>
                                <td>Image data includes any static or dynamic visual data. For example: photographs, medical images or video.
                                  <hr></hr>
                                </td>
                              </tr>
                              <tr>
                                <td style={{ paddingRight: 5 }}><strong>Numerical</strong></td>
                                <td>Numerical data includes any data stored as continuous whole or floating-point numbers.
                                  For example: age, blood pressure or gross income.
                                  <hr></hr>
                                </td>
                              </tr>
                              <tr>
                                <td style={{ paddingRight: 5 }}><strong>Text</strong></td>
                                <td>Text data includes any natural language or machine textual data. This can be structured or unstructured.
                                  For example: online reviews, code documentation or auditing reports.
                                  <hr></hr>
                                </td>
                              </tr>
                              <tr>
                                <td style={{ paddingRight: 5 }}><strong>Ordinal</strong></td>
                                <td>Ordinal data includes any categorical data which is hierarchical or rankable in nature.
                                  For example: academic grades, likert scale responses or income.
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </>
                      } title="Data Types" trigger="click">
                        <Button style={{
                          marginLeft: 5,
                          marginRight: 5
                        }} size="small"
                          icon={<QuestionCircleOutlined />}
                        >
                          More Info
                        </Button>
                      </Popover>
                    </>}
                    name="data_type"
                    hidden={!settings?.dataset_type}
                    // tooltip={TOOL_TIPS.data_type}
                    rules={[{ required: false, message: 'Input is required!' }]}
                  >

                    <Checkbox.Group>
                      {ontoValues?.DATA_TYPE.map((option) => (
                        <Checkbox key={option.key} value={option.key}>
                          {option.label}
                        </Checkbox>
                      ))}
                    </Checkbox.Group>
                  </Form.Item>

                  <Form.Item
                    hidden={!settings?.data_type}
                    label="Number of Features"
                    name="num_features"
                    tooltip={TOOL_TIPS.num_features}
                  // rules={[{ required: true, message: 'Input is required!' }]}
                  >
                    <Select placeholder="Number of Features">
                      {ontoValues?.FEATURE_RANGE.map((option) => (
                        <Select.Option key={option.key} value={option.key}>
                          {option.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    hidden={!settings?.num_features}
                    label="Number of Instances"
                    name="num_instances"
                    tooltip={TOOL_TIPS.num_instances}
                  // rules={[{ required: true, message: 'Input is required!' }]}
                  >
                    <Select placeholder="Number of Instances">
                      {ontoValues?.INSTANCE_RANGE.map((option) => (
                        <Select.Option key={option.key} value={option.key}>
                          {option.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <div hidden={!settings?.num_instances}>
                    <Divider>(Optional) Model Performance</Divider>
                    <div hidden={settings?.completed}>
                      <Alert
                        message={TOOL_TIPS.assesment_info}
                        type="info"
                      />
                      <br></br>
                    </div>
                    <AssetmentField types={ontoValues?.AI_MODEL_A_METRIC} />
                    <br></br>
                    <Button
                      type="primary"
                      onClick={() => saveSettings()}
                      disabled={!isSettingChanged}
                      htmlType="button"
                      className="r-10"
                      icon={<SaveOutlined />}
                    >
                      Save AI Model Settings
                    </Button>
                  </div>
                </Col>
                <Col span={8} className="gutter-row">
                  {/* <AssetmentField types={ontoValues?.AI_MODEL_A_METRIC} /> */}
                </Col>
              </Row>
            </Form>
          </Card>

          {/* AI MODEL UPLAOD */}
          <Card
            hidden={!settings?.completed}
            title={
              <h4>
                <ExperimentOutlined /> AI Model Upload
              </h4>
            }
            extra={genExtraUpload()}
            headStyle={{ backgroundColor: '#fafafa', border: '1px solid #d9d9d9' }}
          >
            <Form
              name="basic"
              labelCol={{ span: 0 }}
              onFieldsChange={() => {
                setIsModelChanged(true);
                const updateModel: UsecaseModel = modelForm.getFieldsValue();
                setModel(updateModel);
              }}
              form={modelForm}
              layout="vertical"
              autoComplete="off"
            >
              <Row gutter={20}>
                <Col span={24} className="gutter-row">
                  <div hidden={model?.completed}>
                    <Alert
                      message={TOOL_TIPS.model_info}
                      type="info"
                    />
                    <br></br>
                  </div>

                  <Form.Item
                    label="Model Upload Method"
                    tooltip={TOOL_TIPS.model_mode}
                    name="mode"
                    rules={[{ required: false, message: 'Input is required!' }]}
                  >
                    <Radio.Group buttonStyle="solid">
                      <Tooltip title={TOOL_TIPS.model_mode_file}>
                        <Radio.Button key="file" value="file" >
                          Model File Upload (.h5, .pkl..)
                        </Radio.Button>
                      </Tooltip>
                      <Tooltip title={TOOL_TIPS.model_mode_api}>
                        <Radio.Button key="api" value="api">
                          Provide API URL
                        </Radio.Button>
                      </Tooltip>
                    </Radio.Group>
                  </Form.Item>
                  {model?.mode == 'file' && (
                    <>
                      <Form.Item
                        label="Implementation Framework"
                        name="backend"
                        tooltip={TOOL_TIPS.model_backend}
                      >
                        <Select placeholder="Implementation Framework">
                          {ontoValues?.IMPLEMENTATION_FRAMEWORK.map((option) => (
                            <Select.Option key={option.key} value={option.key}>
                              {option.label}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>

                      {/* {(!settings?.ai_method && !settings?.mo)} */}
                      <Form.Item
                        label="Model File"
                        tooltip={TOOL_TIPS.model_file}
                      >
                        <Space direction="horizontal">
                          <input
                            placeholder="Select .h5 or .pkl file"
                            type="file"
                            accept=".h5,.pkl"
                            onChange={handleFileInputModel}
                          />
                          <Button
                            onClick={handleModelUpload}
                            type="primary"
                          >
                            <ThunderboltOutlined /> Upload Model File
                          </Button>
                        </Space>
                        {model?.source_file && <Tag color="green">Model Uploaded</Tag>}
                      </Form.Item>

                      <Form.Item
                        label="Sample Dataset File"
                        tooltip={TOOL_TIPS.model_dataset}
                      >
                        <Space direction="horizontal">
                          <input
                            placeholder="Select .csv or .zip file"
                            type="file"
                            accept=".csv,.zip"
                            onChange={handleFileInputData}
                            disabled={!modelUploaded}
                          />
                          <Button
                            type="primary"
                            disabled={!modelUploaded}
                            onClick={handleDatasetUpload}
                          >
                            <FileTextOutlined />Upload Dataset File
                          </Button>
                        </Space>
                        {model?.dataset_file &&
                          <>
                            <Tag color="green">Dataset Uploaded</Tag>
                            <Button icon={<ExperimentOutlined />} type="primary" ghost onClick={async () => {
                              const json = await api_get_model_instance_count(usecase._id || '');
                              const json_formatted = JSON.stringify(json, null, 2);
                              // message.info(json_formatted)
                              notification.info({
                                message: 'Instance Count Validation',
                                description: (
                                  <div>
                                    <pre style={{ marginBottom: 0 }}>
                                      <code>{json_formatted}</code>
                                    </pre>
                                  </div>
                                ),
                                duration: 0,

                                style: {
                                  width: '80%',
                                },
                                placement: 'top',
                              });
                            }}>
                              Validate Instance Count
                            </Button>
                            &nbsp;
                            <Button type="primary" icon={<CodeOutlined />} ghost onClick={async () => {

                              // Get Model Prediction
                              message.open({
                                type: 'loading',
                                content: 'Getting Random Instance...',
                                duration: 0,
                              });
                              const instance = await api_get_model_random_instance(usecase._id || '');
                              const json_formatted = JSON.stringify(instance, null, 0);
                              message.destroy();

                              // Get Model Prediction
                              message.open({
                                type: 'loading',
                                content: 'Getting Model Prediction...',
                                duration: 0,
                              });

                              const prediction = await api_get_model_prediction(usecase._id || '', instance);
                              message.destroy();
                              const json_formatted_prediction = JSON.stringify(prediction, null, 2);

                              message.destroy()
                              notification.info({
                                message: 'Model Prediction',
                                description: (
                                  <div>
                                    {instance.type == "image" &&
                                      <img width="250" src={"data:image/png;base64," + instance.instance}></img>
                                    }
                                    <pre style={{ marginBottom: 0, marginTop: 10 }}>
                                      <code>{json_formatted}</code>
                                      Prediction: <code>{json_formatted_prediction}</code>

                                    </pre>

                                  </div>
                                ),
                                duration: 0,

                                style: {
                                  width: '80%',
                                },
                                placement: 'top',
                              });
                            }}>
                              Validate Model Prediction
                            </Button>

                          </>

                        }
                      </Form.Item>

                      <Collapse defaultActiveKey={[isModelChanged ? '1' : '0']}>
                        <CollapsePanel header="Configure Data Features" key="1">
                          <Card size='small' title="" >
                            <Form.List name="attributes">
                              {(fields, { add, remove }) => (
                                <>
                                  {fields.map(({ key, name, ...restField }) => (
                                    <>
                                      <Divider orientation="left" plain orientationMargin={0}>
                                        <Tag color="blue" style={{ fontWeight: 'bold' }}>{modelForm.getFieldValue('attributes')[key].name}</Tag>
                                      </Divider>
                                      <Space key={key} style={{ display: 'flex', marginBottom: -20 }} align="baseline">
                                        <Form.Item
                                          {...restField}
                                          name={[name, 'name']}
                                          label="&nbsp;"
                                          hidden
                                          rules={[{ required: false, message: 'Missing name' }]}
                                        >
                                          <Input style={{ color: 'black', fontWeight: 500, backgroundColor: 'white', borderColor: 'white' }} disabled placeholder="Feature Name" />
                                        </Form.Item>

                                        <Form.Item
                                          {...restField}
                                          name={[name, 'datatype']}
                                          label="Type"
                                          rules={[{ required: true, message: 'Missing feature datatype' }]}
                                        >
                                          <Select
                                            placeholder="Select feature datatype"
                                          >
                                            <Option value="numerical">Numerical</Option>
                                            <Option value="categorical">Categorical</Option>
                                            <Option value="image">Image</Option>
                                          </Select>

                                        </Form.Item>

                                        {modelForm.getFieldValue('attributes')[key].datatype == "numerical" && (
                                          <>
                                            <Form.Item
                                              {...restField}
                                              name={[name, 'target']}
                                              valuePropName="checked"
                                              label="Target"
                                            >
                                              <Checkbox style={{ marginLeft: 10 }}></Checkbox>
                                            </Form.Item>

                                            <Form.Item
                                              label="Min"

                                              {...restField}
                                              name={[name, 'min']}
                                              rules={[{ required: true, message: 'Missing min' }]}
                                            >
                                              <Input placeholder="0" />
                                            </Form.Item>

                                            <Form.Item
                                              {...restField}
                                              name={[name, 'max']}
                                              label="Max"
                                              rules={[{ required: true, message: 'Missing max' }]}
                                            >
                                              <Input placeholder="1" />
                                            </Form.Item>

                                            <Form.Item
                                              {...restField}
                                              name={[name, 'min_raw']}
                                              label="Min Raw"
                                              rules={[{ required: true, message: 'Missing min' }]}
                                            >
                                              <Input placeholder="40" />
                                            </Form.Item>

                                            <Form.Item
                                              {...restField}
                                              name={[name, 'max_raw']}
                                              label="Max Raw"
                                              rules={[{ required: true, message: 'Missing max' }]}
                                            >
                                              <Input placeholder="2000" />
                                            </Form.Item>
                                          </>
                                        )
                                        }

                                        {modelForm.getFieldValue('attributes')[key].datatype == "categorical" && (
                                          <>
                                            <Form.Item
                                              {...restField}
                                              name={[name, 'target']}
                                              valuePropName="checked"
                                              label="Target"
                                            >
                                              <Checkbox style={{ marginLeft: 10 }}></Checkbox>
                                            </Form.Item>

                                            <Text style={{ fontWeight: 'bold' }}>Value Mapping</Text>
                                            <Form.List name={[name, 'values']} >
                                              {(fields, { add, remove }) => (
                                                <>
                                                  {fields.map(({ key, name, ...restField }) => (
                                                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                                      <Form.Item
                                                        {...restField}
                                                        name={[name, 'value']}
                                                        label="Value"
                                                      >
                                                        <Input placeholder="0" />
                                                      </Form.Item>
                                                      <Form.Item
                                                        {...restField}
                                                        name={[name, 'raw']}
                                                        label="Value Raw"
                                                      >
                                                        <Input placeholder="Negative" />
                                                      </Form.Item>
                                                      <MinusCircleOutlined onClick={() => remove(name)} />
                                                    </Space>
                                                  ))}
                                                  <Form.Item>
                                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                                      Add Value
                                                    </Button>
                                                  </Form.Item>
                                                </>
                                              )}
                                            </Form.List>
                                          </>
                                        )
                                        }

                                        {modelForm.getFieldValue('attributes')[key].datatype == "image" && (
                                          <>
                                            <Form.Item
                                              label="Min"

                                              {...restField}
                                              name={[name, 'min']}
                                              rules={[{ required: true, message: 'Missing min' }]}
                                            >
                                              <Input placeholder="0" />
                                            </Form.Item>

                                            <Form.Item
                                              {...restField}
                                              name={[name, 'max']}
                                              label="Max"
                                              rules={[{ required: true, message: 'Missing max' }]}
                                            >
                                              <Input placeholder="255" />
                                            </Form.Item>

                                            <Form.Item
                                              {...restField}
                                              name={[name, 'shape']}
                                              label="Shape"
                                              rules={[{ required: true, message: 'Missing shape' }]}
                                            >
                                              <Input placeholder="28,28,1" />
                                            </Form.Item>

                                            <Form.Item
                                              {...restField}
                                              name={[name, 'shape_raw']}
                                              label="Shape Raw"
                                              rules={[{ required: true, message: 'Missing shape raw' }]}
                                            >
                                              <Input placeholder="28,28" />
                                            </Form.Item>

                                            {modelForm.getFieldValue('attributes')[key].name == "image_zip" && (
                                              <>

                                                <Form.Item
                                                  {...restField}
                                                  name={[name, 'mean_raw']}
                                                  label="Mean"
                                                  rules={[{ required: true, message: 'Missing Mean raw' }]}
                                                >
                                                  <Input placeholder="45.01" />
                                                </Form.Item>
                                                <Form.Item
                                                  {...restField}
                                                  name={[name, 'std_raw']}
                                                  label="STD"
                                                  rules={[{ required: true, message: 'Missing std_raw raw' }]}
                                                >
                                                  <Input placeholder="45.01" />
                                                </Form.Item>
                                              </>
                                            )}
                                          </>

                                        )
                                        }
                                      </Space>
                                    </>
                                  ))}
                                </>
                              )}
                            </Form.List>
                          </Card>
                        </CollapsePanel>
                      </Collapse>
                    </>
                  )}
                  {model?.mode == 'api' && (
                    <Form.Item
                      label="ML Model API URL (POST)"
                      name="source_api"
                      tooltip="More instructions in the future"
                      rules={[{ required: false, message: 'Input is required!' }]}
                    >
                      <Input />
                    </Form.Item>
                  )}
                </Col>

              </Row>
            </Form>
          </Card>

          {/* USER PERSONAS */}
          <Card
            // hidden={!model?.completed}
            hidden={!settings?.completed}
            title={
              <h4>
                <UserSwitchOutlined /> User Personas
              </h4>
            }
            extra={genPersona()}
            headStyle={{ backgroundColor: '#fafafa', border: '1px solid #d9d9d9' }}
          >
            <div hidden={personas.length > 0}>
              <Alert
                message={TOOL_TIPS.persona_info}
                type="info"
                style={{ marginBottom: 10 }}

              />
              <Alert
                message={TOOL_TIPS.persona_create_info}
                type="info"
                style={{ marginBottom: 10 }}
              />
            </div>
            <PersonaTabs
              key={'pt-' + usecaseId}
              usecaseId={usecaseId}
              setPersonas={setPersonas}
              personas={personas}
              ontoValues={ontoValues}
              ontoExplainers={ontoExplainers}
            />
          </Card>

          {/* New Persona Popup  */}
          <Modal
            title="Create new Persona"
            visible={isModalVisible}
            destroyOnClose={true}
            onCancel={handleCancel}
            footer={[
              <Button key="back" onClick={handleCancel}>
                Cancel
              </Button>,
              <Button form="createpersona" key="submit" htmlType="submit" type="primary">
                Create
              </Button>,
            ]}
          >
            <Form
              id="createpersona"
              name="createpersona"
              layout="vertical"
              labelCol={{ span: 0 }}
              initialValues={{ remember: true }}
              onFinish={onFinishPersona}
              autoComplete="off"
              preserve={false}
            >
              <Form.Item
                label="Name of the Persona"
                tooltip={TOOL_TIPS.persona_name}
                name="name"
                rules={[{ required: true, message: 'Input is required!' }]}
              >
                <Input />
              </Form.Item>
            </Form>
          </Modal>
        </PageHeaderWrapper>
      )}
    </>
  );
};

export default Create;
