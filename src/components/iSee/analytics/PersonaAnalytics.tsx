import { Button, Card, Col, Collapse, Descriptions, Modal, notification, Row } from 'antd';
import { Bar } from '@ant-design/plots';
import DataVisualizer from '@/components/iSee/analytics/DataVisualizer';

import { CopyOutlined, UserSwitchOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

const PersonaAnalytics: React.FC<{ analytics: any; }> = ({ analytics }) => {
  const { Panel } = Collapse;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentDiagram, setcurrentDiagram] = useState<Record<string, any>[]>();

  useEffect(() => {
    console.log(analytics);
  }, []);

  const barConfig = {
    isStack: true,
    xField: 'diff',
    yField: 'user',
    seriesField: 'type',
    label: {
      position: 'middle',
      layout: [
        {
          type: 'interval-adjust-position',
        },
        {
          type: 'interval-hide-overlap',
        },
        {
          type: 'adjust-color',
        },
      ],
    },
    meta: {
      user: {
        alias: 'User',
      },
      diff: {
        alias: 'Time elapsed',
      },
      type: {
        alias: 'Interaction',
      }
    },
  };

  const showModal = (jsonData: any) => {
    setcurrentDiagram(jsonData);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };
  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const diagramToCSV = () => {
    if (!currentDiagram) return '';
    if (currentDiagram.length <= 0) return '';

    let csv = '';
    csv += Object.keys(currentDiagram[0]) + '\r\n';

    currentDiagram?.forEach((item) => {
      csv +=
        Object.entries(item)
          .map((i) => i[1])
          .join(',') + '\r\n';
    });
    return csv;
  };

  const addToClipboard = () => {
    navigator.clipboard.writeText(diagramToCSV()).then(
      () => {
        notification.success({
          message: `Success`,
          duration: 3,
          description: 'The questionnaire json has been added to the clipboard',
          placement: 'bottomRight',
        });
      },
      () => {
        notification.error({
          message: `Error`,
          duration: 3,
          description: 'An error occured, the json was not added to the clipboard',
          placement: 'bottomRight',
        });
      },
    );
  };

  return (
    <div>
      <Row gutter={10}>
        <Card title="Intents and Explainers" style={{ width: '100%' }}>
          <Row>
            <Col
              key='intents'
              span={8}
              xs={{ order: 1 }}
              sm={{ order: 2 }}
              md={{ order: 3 }}
              lg={{ order: 4 }}
            >
              <Card title='Intent Questions'
              // extra={<Button onClick={() => showModal(values)}>Export CSV</Button>}
              >

                <DataVisualizer
                  defaultType="Column"
                  data={analytics.intents}
                  autorizedType={['Column', 'Pie']}
                />
              </Card>

              <br />
            </Col>
            <Col
              key={'explainers'}
              span={8}
              xs={{ order: 1 }}
              sm={{ order: 2 }}
              md={{ order: 3 }}
              lg={{ order: 4 }}
            >
              <Card title='Explanation Techniques'
              // extra={<Button onClick={() => showModal(values)}>Export CSV</Button>}
              >
                <DataVisualizer
                  defaultType="Column"
                  data={analytics.explainers}
                  autorizedType={['Column', 'Pie']}
                />
              </Card>
            </Col>
          </Row>
        </Card>
      </Row>
      <Row gutter={10}>
        <Card title="Evaluation Strategy Outcomes" style={{ width: '100%' }}>
          <Collapse defaultActiveKey={0}>
            {Object.entries(analytics?.evaluations || {}).map(([dimension, content], index) => (
              <Panel
                header={
                  <div>
                    <h4>
                      {dimension}
                    </h4>
                  </div>
                }
                key={index}
              >
                <Row>
                  {(content || []).map((q) => (
                    <Col
                      key={q.question}
                      span={8}
                      xs={{ order: 1 }}
                      sm={{ order: 2 }}
                      md={{ order: 3 }}
                      lg={{ order: 4 }}
                    >
                      <Card
                      // extra={<Button onClick={() => showModal(values)}>Export CSV</Button>}
                      >
                        <Descriptions.Item label={q.question}>{q.question}</Descriptions.Item>

                        <DataVisualizer
                          defaultType=
                          {q.type === 'Free-Text'
                            ? 'Wordcloud'
                            : q.type === 'Number'
                              ? 'Gauge'
                              : q.type === 'Radio'
                                ? 'Column'
                                : q.type === 'Checkbox'
                                  ? 'Column'
                                  : q.type === 'Likert'
                                    ? 'Column'
                                    : 'Pie'}
                          data={q.values}
                          autorizedType={
                            q.type === 'Free-Text'
                              ? ['Wordcloud']
                              : q.type === 'Number'
                                ? ['Column', 'Gauge', 'pie']
                                : q.type === 'Radio'
                                  ? ['Pie', 'Column']
                                  : q.type === 'Checkbox'
                                    ? ['Pie', 'Column']
                                    : q.type === 'Likert'
                                      ? ['Column', 'Pie']
                                      : ['Pie', 'Column', 'Gauge', 'Area']
                          }
                        />
                      </Card>

                      <br />
                    </Col>

                  ))}
                </Row>
              </Panel>
            ))}
          </Collapse>
        </Card>
      </Row>
      <Row gutter={10}>
        <Card title="Individual Experiences" style={{ width: '100%' }}>
          <Bar {...barConfig} data={analytics.experiences} />
        </Card>
      </Row>
    </div >

  );
};

export default PersonaAnalytics;
