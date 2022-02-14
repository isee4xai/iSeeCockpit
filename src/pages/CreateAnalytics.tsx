import { Persona } from "@/models/usecase";
import { PageHeaderWrapper } from "@ant-design/pro-layout";
import { Area, Gauge, Pie } from '@ant-design/plots';

import { Card, Col, Collapse, Empty, Form, PageHeader, Row, Tag } from "antd";
import PersonaAnalytics from "@/components/iSee/analytics/PersonaAnalytics";
import { UserSwitchOutlined } from "@ant-design/icons";

const personas: Persona[] =
    [{
        id: "123", name: "Doctor", status: "Completed"
    },
    {
        id: "234", name: "Patient", status: "Completed",
        intent: 'Trust',
        intent_questions: ['How confident is the AI model?', "How does this outcome affect my health?", "Are there adverse effects of taking AI's decision?"],
        // todo
        evaluation_questionnaire: {
            questions: [
                {
                    question_category: "Trust",
                    question_text: "Are you now able to trust the AI model?",
                    question_metric: "radio",
                    metric_values: ["Yes", "No"]
                },
                {
                    question_category: "Trust",
                    question_text: "Next time, would you like the explanation with the AI model's decision?",
                    question_metric: "radio",
                    metric_values: ["Yes", "No"]
                }]
        }
    }];

const overall_usage = {
    data: [{
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
    }],
    xField: 'week',
    yField: 'interactions',
    point: {
        size: 5,
        shape: 'diamond',
        style: {
            fill: 'white',
            stroke: '#5B8FF9',
            lineWidth: 2,
        },
    },
    areaStyle: () => {
        return {
            fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff',
        };
    },
    tooltip: {
        showMarkers: true,
    },
    state: {
        active: {
            style: {
                shadowBlur: 4,
                stroke: '#000',
                fill: 'red',
            },
        },
    },
    interactions: [
        {
            type: 'marker-active',
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

const usage_by_persona_data =
    [{
        persona: "Doctor",
        value: 23
    },
    {
        persona: "Patient",
        value: 12
    },
    {
        persona: "Radiologist",
        value: 2
    }];
const usage_by_persona = {
    appendPadding: 10,
    angleField: 'value',
    colorField: 'persona',
    radius: 0.9,
    label: {
        type: 'inner',
        offset: '30%',
        content: ({ percent }: { percent: any }) => `${(percent * 100).toFixed(0)}%`,
        style: {
            fontSize: 14,
            textAlign: 'center',
        },
    },
    interactions: [
        {
            type: 'element-active',
        },
    ],
};

const CreateAnalytics: React.FC = () => {
    const { Panel } = Collapse;

    return (
        <PageHeaderWrapper>
            <PageHeader
                key="head2"
                ghost={false}
                title="Radiology Fracture Detection"
                subTitle={<Tag color="green">Published</Tag>}
            />
            <Card>

                <Row gutter={10}>
                    <Col span={8}>
                        <Card title="Overall Usage">
                            <Area height={200}
                                {...overall_usage} />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card title="Usage by Persona">
                            <Pie height={200}
                                {...usage_by_persona}
                                data={usage_by_persona_data} />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card title="Overall Feedback">
                            <Gauge height={200}
                                {...overall_feedback} />
                        </Card>
                    </Col>
                </Row>
            </Card>
            <div>
                <Collapse>
                    {personas?.map((persona, index) => (
                        <Panel header={<div>
                            <h3>
                                <UserSwitchOutlined /> {persona.name}
                            </h3>
                        </div>}
                            key={"panel-" + persona.id}>
                            <PersonaAnalytics />
                        </Panel>
                    ))}
                </Collapse>
                {personas?.length == 0 ? (
                    <Card>
                        <Form.Item >
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description="No Personas" />
                        </Form.Item>
                    </Card>
                ) : null}
            </div>
        </PageHeaderWrapper >
    );
};

export default CreateAnalytics;