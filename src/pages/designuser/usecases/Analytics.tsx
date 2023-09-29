import DataVisualizer from '@/components/iSee/analytics/DataVisualizer';
import PersonaAnalytics from '@/components/iSee/analytics/PersonaAnalytics';
import type { Usecase } from '@/models/usecase';
import { api_get, api_usecase_analytics } from '@/services/isee/usecases';
import { UserSwitchOutlined } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Col, Collapse, Empty, Form, PageHeader, Row, Select, Tag } from 'antd';
import { useEffect, useState } from 'react';

import 'moment/locale/en-gb';
import { api_get_interactions } from '@/services/isee/dialog';
import './Analytics.less';
import { Analytic } from '@/models/analytics';

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
  const [analytics, setAnalytics] = useState<Analytic>({});
  const [versions, setVersions] = useState<string[]>([]);
  const [version, setVersion] = useState<string>();

  useEffect(() => {
    (async () => {
      const res_usecase = await api_get(props.match.params.id);
      const res_usecase_interactions = await api_get_interactions(props.match.params.id);
      setUsecase(res_usecase);
      const res_versions = findVersions(res_usecase_interactions);
      setVersions(res_versions);
      setVersion(res_versions ? res_versions[0] : '');
    })();
  }, [props.match.params.id]);

  useEffect(() => {
    (async () => {
      const res_analytics = await api_usecase_analytics(props.match.params.id, version);
      setAnalytics(res_analytics);
      console.log(res_analytics);
    })();
  }, [props.match.params.id, version]);

  function findVersions(data: any[]) {
    const uniqueVersions = [...new Set(data.map(item => item.usecase_version))];
    return uniqueVersions;
  }

  function versionChanged(evt: any) {
    setVersion(evt.replace(/V/g, ''));
  }

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
          <Select placeholder="Version" value={version ? `V${version}` : ''} onChange={versionChanged}>
            {versions.map((option) => (
              <Select.Option key={option} value={`V${option}`} >
                {`V${option}`}
              </Select.Option>
            ))}
          </Select>
        }
      />
      < Card >
        <Row gutter={10}>
          <Col span={8}>
            <Card title="Overall Interactions">
              <DataVisualizer
                defaultType="Column"
                data={analytics?.interactions_per_date || []}
                autorizedType={['Pie', 'Area', 'Column']}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Interactions by Persona">
              <DataVisualizer
                defaultType="Pie"
                data={analytics?.interactions_per_persona || []}
                autorizedType={['Pie', 'Column']}
              />
            </Card>
          </Col>
          {analytics?.overall_experience ? (
            <Col span={8}>
              <Card title="Overall Feedback">
                <DataVisualizer
                  defaultType="Gauge"
                  data={analytics?.overall_experience}
                  autorizedType={['Gauge']}
                />
              </Card>
            </Col>
          ) : <></>}
        </Row>
      </Card >


      <div>
        <Collapse>
          {Object.entries(analytics?.personas || {}).map(([persona, content]) => (

            <Panel
              header={
                <div>
                  <h3>
                    <UserSwitchOutlined /> {persona}
                  </h3>
                </div>
              }
              key={'panel-' + persona}
            >
              <PersonaAnalytics
                analytics={content}
              />
            </Panel>
          ))}
        </Collapse>
        {Object.entries(analytics?.personas || {}).length == 0 ? (
          <Card>
            <Form.Item>
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Personas" />
            </Form.Item>
          </Card>
        ) : null}
      </div>
    </PageHeaderWrapper >
  );
};

export default Analytics;
