import { Card, Col, Descriptions, Row } from 'antd';

import DataVisualizer from '@/components/iSee/analytics/DataVisualizer';

import { api_intent_stat } from '@/services/isee/usecases';
import Meta from 'antd/lib/card/Meta';
import { useEffect, useState } from 'react';

const IntentAnalytics: React.FC<{
  persona: string;
  usecase: string;
  intent: string;
}> = ({ persona, usecase, intent }) => {
  const [data, setData] = useState<
    { question: string; dimension: string; values: Record<string, string | number>[] }[]
  >([]);

  useEffect(() => {
    (async () => {
      const stats = await api_intent_stat(usecase, persona, intent);
      setData(stats);
    })();
  }, [intent, persona, usecase]);

  return (
    <Card>
      <Row gutter={20}>
        {data.map((item, index) => (
          <Col
            key={item.question}
            span={8}
            xs={{ order: 1 }}
            sm={{ order: 2 }}
            md={{ order: 3 }}
            lg={{ order: 4 }}
          >
            <Card title={'Question ' + (index + 1)}>
              <Descriptions.Item label={item.question}>{item.question}</Descriptions.Item>
              <Meta description={'(' + item.dimension + ')'} />
              <DataVisualizer
                defaultType="Pie"
                data={item.values}
                autorizedType={['Pie', 'Column']}
              />
            </Card>

            <br />
          </Col>
        ))}
      </Row>
      {/* <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
            // initialValues={questions}
            // onFinish={onFinish}
            // onChange={onChange}
            >

                <Row gutter={10}>
                    <Col span={24} style={{ textAlign: 'center' }}>
                        <Button
                            type="primary"
                            htmlType="submit">
                            Save
                        </Button>
                    </Col>
                </Row>
            </Form> */}
    </Card>
  );
};

export default IntentAnalytics;
