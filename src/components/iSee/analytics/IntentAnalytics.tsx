import { Button, Card, Col, Descriptions, Modal, notification, Row } from 'antd';

import DataVisualizer from '@/components/iSee/analytics/DataVisualizer';

import { api_intent_stat } from '@/services/isee/usecases';
import { CopyOutlined } from '@ant-design/icons';
import Meta from 'antd/lib/card/Meta';
import { useEffect, useState } from 'react';

const IntentAnalytics: React.FC<{
  persona: string;
  usecase: string;
  intent: string;
}> = ({ persona, usecase, intent }) => {
  const [data, setData] = useState<
    {
      question: string;
      dimension: string;
      responseType: string;
      values: Record<string, string | number>[];
    }[]
  >([]);

  useEffect(() => {
    (async () => {
      const stats = await api_intent_stat(usecase, persona, intent);
      setData(stats);
    })();
  }, [intent, persona, usecase]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentDiagram, setcurrentDiagram] = useState<Record<string, any>[]>();

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

  /**
   *
   *
   *
   *  Likert  [Gauge, Column, Pie]
   */

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
            <Card
              title={'Question ' + (index + 1)}
              extra={<Button onClick={() => showModal(item.values)}>Export CSV</Button>}
            >
              <Descriptions.Item label={item.question}>
                {item.question.replaceAll(/<\/*div>/g, '')}
              </Descriptions.Item>
              <Meta description={'(' + item.dimension + ')'} />
              <DataVisualizer
                defaultType="Pie"
                data={item.values}
                autorizedType={
                  item.responseType === 'Free-Text'
                    ? ['Wordcloud']
                    : item.responseType === 'Number'
                    ? ['Column', 'Gauge', 'pie', 'Wordcloud']
                    : item.responseType === 'Radio'
                    ? ['Pie', 'Column']
                    : item.responseType === 'Checkbox'
                    ? ['Pie', 'Column']
                    : item.responseType === 'Likert'
                    ? ['Column', 'Pie']
                    : ['Pie', 'Column', 'Gauge', 'Wordcloud', 'Area']
                }
              />
            </Card>

            <br />
          </Col>
        ))}
      </Row>
      <Modal
        title={'Export'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCloseModal}
        footer={
          <>
            {
              <Button onClick={addToClipboard} icon={<CopyOutlined />}>
                Copy to clipboard
              </Button>
            }

            <Button type="primary" onClick={handleOk}>
              Close
            </Button>
          </>
        }
      >
        <pre>{<code onClick={(e) => console.dir(e.target)}>{diagramToCSV()}</code>}</pre>
      </Modal>
    </Card>
  );
};

export default IntentAnalytics;
