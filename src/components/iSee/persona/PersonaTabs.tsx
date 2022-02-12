import { Persona } from '@/models/usecase';
import { DeleteOutlined } from '@ant-design/icons';
import {
    Button,
    Collapse,
    Empty,
    Popconfirm,
    Tabs,
    Tag,
} from 'antd';
import QuestionnaireForm from '../question/QuestionnaireForm';

import PersonaForm from './PersonaForm';

const { Panel } = Collapse;

export type PersonaType = {
    personas: Persona[],
    setPersonas: any
};

const PersonaTabs: React.FC<PersonaType> = (props) => {
    const { personas, setPersonas } = props

    const genExtra2 = (persona: Persona, index: number) => (

        <div>
            {persona.status == "Incomplete" && <Tag color="red">Incomplete</Tag>}
            {persona.status == "Completed" && <Tag color="success">Completed</Tag>}

            <Popconfirm
                title={'Are you sure to delete?'}
                onConfirm={() => {
                    console.log(persona)
                    setPersonas(personas.filter(p => p.id !== persona.id));
                }}
                okText="Yes"
                cancelText="No"
            >
                <Button
                    danger={true}
                    size="small"
                    className="dynamic-delete-button"
                    icon={<DeleteOutlined />}
                />
            </Popconfirm>

        </div>
    );

    return (


        <div>

            {
                personas.length != 0 ? (
                    <Collapse>

                        {personas.map((persona, index) => (
                            <Panel header={persona.name} key={"panel-" + persona.id}
                                extra={genExtra2(persona, index)}>
                                <Tabs type="card" size="middle" tabPosition='top' >
                                    <Tabs.TabPane
                                        key={"key-" + persona.id}
                                        tab={'Details'}
                                    >
                                        <PersonaForm persona={persona} />
                                    </Tabs.TabPane>
                                    <Tabs.TabPane tab="Questionaire" key="2">
                                        <QuestionnaireForm
                                            questionnaire={persona.evaluation_questionnaire || {}} />
                                    </Tabs.TabPane>
                                    <Tabs.TabPane tab="Explanation Strategy" key="3">
                                        Explanation Strategy here
                                    </Tabs.TabPane>
                                </Tabs>

                            </Panel>
                        ))}
                    </Collapse>

                ) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Personas" />
            }
        </div>


    );
};

export default PersonaTabs;
