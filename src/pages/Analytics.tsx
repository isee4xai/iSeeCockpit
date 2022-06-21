import DataVisualizer from '@/components/iSee/analytics/DataVisualizer';
import IntentAnalytics from '@/components/iSee/analytics/IntentAnalytics';
import type { Usecase } from '@/models/usecase';
import { api_get, api_usecase_stat } from '@/services/isee/usecases';
import { UserSwitchOutlined } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Col, Collapse, DatePicker, Empty, Form, PageHeader, Row, Tag } from 'antd';
import { useEffect, useState } from 'react';

import locale from 'antd/es/date-picker/locale/en_GB';
import 'moment/locale/en-gb';

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
  const [globalStat, setGlobalStat] = useState<Record<string, any>>({});
  const [statDate, setStatDate] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const res_usecase = await api_get(props.match.params.id);
      setUsecase(res_usecase);
    })();
  }, [props.match.params.id]);

  useEffect(() => {
    (async () => {
      const global_stat = await api_usecase_stat(props.match.params.id, statDate);
      setGlobalStat(global_stat);
    })();
  }, [props.match.params.id, statDate]);

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
        extra={
          <DatePicker.RangePicker
            locale={locale}
            onCalendarChange={(x) => {
              const dates: string[] =
                x?.map((date) => {
                  return date?.format('DD-MM-YYYY') || '';
                }) || [];
              setStatDate(dates);
            }}
          />
        }
      />
      <Card>
        <Row gutter={10}>
          <Col span={8}>
            <Card title="Overall Usage">
              <DataVisualizer
                defaultType="Area"
                data={globalStat.interactions_per_date}
                autorizedType={['Pie', 'Area', 'Column']}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Usage by Persona">
              <DataVisualizer
                defaultType="Pie"
                data={globalStat.usage_per_persona}
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
                      persona={persona._id || ''}
                      usecase={props.match.params.id}
                      statDate={statDate}
                    />
                  </Panel>
                ))}
              </Collapse>
            </Panel>
          ))}
        </Collapse>
        {usecase.personas?.length == 0 ? (
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
