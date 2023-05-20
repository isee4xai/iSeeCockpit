/* eslint-disable react/no-array-index-key */
import {
  LikeOutlined,
  LineChartOutlined,
  RocketOutlined,
  SettingOutlined,
  CommentOutlined,
  RocketFilled
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Button,
  Card,
  Col,
  Empty,
  PageHeader,
  Row,
  Statistic,
  Tag,
  Typography,
} from 'antd';
import Meta from 'antd/lib/card/Meta';
import React, { useEffect, useState } from 'react';

import type { Usecase } from '@/models/usecase';
const { Text } = Typography;
import { api_enduser_get_all } from '@/services/isee/enduser';

const Welcome: React.FC = () => {
  const style = {
    boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.2)',
    border: '1px solid #e8e8e8',
  };

  const [useCases, setUseCases] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await api_enduser_get_all();
      setUseCases(data);
    })();
  }, []);

  return (
    <PageContainer>

      <PageHeader
        ghost={false}
        key="head1"
        title="My Usecases"
        subTitle="Displaying all usecases"
      />
      <Card>
        <Row gutter={20}>
          {useCases.map((usecase: Usecase, index: number) => (
            <Col
              key={index}
              span={10}
            >
              <Card
                style={style}
                key={'card' + index}
                title={usecase.name}
                extra={
                  <Text keyboard>v{usecase.version}</Text>
                }
              >
                <Meta description={"Goal:" + usecase.goal} />
                <br />
                <Button href={'/enduser/dialogue/' + usecase._id} block type="primary" shape="round" icon={<RocketOutlined />}>
                  Evaluate Usecase
                </Button>
              </Card>
              <br />
            </Col>
          ))}

          <Col
            hidden={useCases.length > 0}
            span={12}
            offset={6}
          >
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="There are currently no available use cases. In order to access them, you will need to receive an invitation." />
          </Col>
        </Row>
      </Card>
    </PageContainer >
  );
};

export default Welcome;
