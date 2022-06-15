import type { Persona } from '@/models/persona';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

import IntentAnalytics from '@/components/iSee/analytics/IntentAnalytics';
import { UserSwitchOutlined } from '@ant-design/icons';
import { Card, Col, Collapse, Empty, Form, PageHeader, Row, Tag } from 'antd';

import DataVisualizer from '@/components/iSee/analytics/DataVisualizer';
import type { Usecase } from '@/models/usecase';
import { api_get } from '@/services/isee/usecases';
import { useEffect, useState } from 'react';

const personas: Persona[] = [
  {
    _id: '123',
    details: { name: 'Loan Applicant' },
    completed: true,
  },
  {
    _id: '234',
    details: { name: 'Loan Officer' },
    completed: true,
  },
  {
    _id: '345',
    details: { name: 'Govenment' },
    completed: true,
  },
];

const overall_usage = {
  data: [
    {
      week: 'week 1',
      interactions: 3,
    },
    {
      week: 'week 2',
      interactions: 2,
    },
    {
      week: 'week 3',
      interactions: 6,
    },
    {
      week: 'week 4',
      interactions: 6,
    },
    {
      week: 'week 5',
      interactions: 7,
    },
    {
      week: 'week 6',
      interactions: 10,
    },
    {
      week: 'week 7',
      interactions: 12,
    },
    {
      week: 'week 8',
      interactions: 6,
    },
  ],
};

const overall_feedback = {
  percent: 0.63,
  type: 'meter',
  innerRadius: 0.75,
  range: {
    ticks: [0, 1 / 3, 2 / 3, 1],
    color: ['#F4664A', '#FAAD14', '#30BF78'],
  },
  indicator: {
    pointer: {
      style: {
        stroke: '#D0D0D0',
      },
    },
    pin: {
      style: {
        stroke: '#D0D0D0',
      },
    },
  },
  statistic: {
    content: {
      style: {
        fontSize: '24px',
        lineHeight: '24px',
      },
    },
  },
};

const usage_by_persona_data = [
  {
    persona: 'Loan Applicant',
    value: 23,
  },
  {
    persona: 'Loan officer',
    value: 12,
  },
  {
    persona: 'Govenment',
    value: 2,
  },
];

export type Params = {
  match: {
    params: {
      id: string;
    };
  };
};

const Analytics: React.FC<Params> = (props) => {
  const { Panel } = Collapse;

  const [usecase, setUsecase] = useState<Usecase>({ _id: '0', name: '', published: false });

  useEffect(() => {
    (async () => {
      const res_usecase = await api_get(props.match.params.id);
      setUsecase(res_usecase);
    })();
  }, [props.match.params.id]);

  return (
    <PageHeaderWrapper>
      <PageHeader
        key="head2"
        ghost={false}
        title={usecase.name}
        subTitle={
          usecase.published ? (
            <Tag color="green">Published</Tag>
          ) : (
            <Tag color="red">Unpublished</Tag>
          )
        }
      />
      <Card>
        <Row gutter={10}>
          <Col span={8}>
            <Card title="Overall Usage">
              <DataVisualizer
                defaultType="Area"
                data={overall_usage.data}
                autorizedType={['Pie', 'Area', 'Column']}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Usage by Persona">
              <DataVisualizer
                defaultType="Pie"
                data={usage_by_persona_data}
                autorizedType={['Pie', 'Column']}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Overall Feedback">
              <DataVisualizer
                defaultType="Gauge"
                data={overall_feedback.percent}
                autorizedType={['Gauge']}
              />
            </Card>
          </Col>
        </Row>
      </Card>
      <div>
        <Collapse>
          {usecase.personas?.map((persona) => (
            <Panel
              header={
                <div>
                  <h3>
                    <UserSwitchOutlined /> {persona.details.name}
                  </h3>
                </div>
              }
              key={'panel-' + persona._id}
            >
              <Collapse>
                {persona.intents?.map((intent) => (
                  <Panel
                    header={
                      <div>
                        <h3>
                          <UserSwitchOutlined /> {intent.name}
                        </h3>
                      </div>
                    }
                    key={'panel-' + intent.name}
                  >
                    <IntentAnalytics
                      intent={intent.name}
                      persona={persona.details.name || ''}
                      usecase={props.match.params.id}
                    />
                  </Panel>
                ))}
              </Collapse>
            </Panel>
          ))}
        </Collapse>
        {personas?.length == 0 ? (
          <Card>
            <Form.Item>
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Personas" />
            </Form.Item>
          </Card>
        ) : null}
      </div>
    </PageHeaderWrapper>
  );
};

export default Analytics;
