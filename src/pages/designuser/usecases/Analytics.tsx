import DataVisualizer from '@/components/iSee/analytics/DataVisualizer';
import IntentAnalytics from '@/components/iSee/analytics/IntentAnalytics';
import type { Usecase } from '@/models/usecase';
import { api_get, api_usecase_stat } from '@/services/isee/usecases';
import { CopyOutlined, DownloadOutlined, SaveOutlined, UserSwitchOutlined } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Avatar, Button, Card, Col, Collapse, DatePicker, Empty, Form, PageHeader, Row, Table, Tag, message, notification } from 'antd';
import { useEffect, useState } from 'react';

import locale from 'antd/es/date-picker/locale/en_GB';
import 'moment/locale/en-gb';
import { api_get_interactions } from '@/services/isee/dialog';
import moment from 'moment';
import Meta from 'antd/lib/card/Meta';

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
  const [interactions, setInteractions] = useState([]);

  useEffect(() => {
    (async () => {
      const res_usecase = await api_get(props.match.params.id);
      const res_usecase_interactions = await api_get_interactions(props.match.params.id);
      setInteractions(res_usecase_interactions)
      setUsecase(res_usecase);
    })();
  }, [props.match.params.id]);

  useEffect(() => {
    (async () => {
      const global_stat = await api_usecase_stat(props.match.params.id, statDate);
      setGlobalStat(global_stat);
    })();
  }, [props.match.params.id, statDate]);

  const columns = [
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
      render: (record: any) => {
        return (
          <>
            <Meta
              avatar={<Avatar style={{ backgroundColor: '#fde3cf', color: '#f56a00' }}>{record.name[0]}</Avatar>}
              title={record.name}
              description={record.email}
            />
          </>
        );
      },
    },
    {
      title: 'Version',
      dataIndex: 'usecase_version',
      key: 'usecase_version',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (record: string) => {
        return (
          <div>
            <p>{moment(record).locale('en_us').format('LLL')}</p>
          </div>
        );
      },
    },
    {
      title: 'View JSON',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: any, obj: any) => {
        return (
          <Button
            type="primary"
            style={{ margin: '0 1rem' }}
            onClick={async () => {
              if (obj.interaction) {
                const json_formatted = JSON.stringify(obj.interaction, null, 2);

                notification.open({
                  message: ' Interaction Export -  ',
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
                            a.download = 'isee-export-interaction-' + obj._id + '.json';
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
          </Button>
        );
      },
    },

  ];

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

      <Card title="All Interactions">
        <Table dataSource={interactions} columns={columns} />


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
