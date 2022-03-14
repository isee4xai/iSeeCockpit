import { Persona } from '@/models/persona';
import { DeleteOutlined, PlusOutlined, RocketFilled, SaveOutlined, UserOutlined, UserSwitchOutlined } from '@ant-design/icons';
import {
    Avatar,
    Button,
    Card,
    Collapse,
    Empty,
    Popconfirm,
    Tag,
} from 'antd';
import PersonaForm from './PersonaForm';
import PersonaTab from './PersonaTab';

const { Panel } = Collapse;

export type PersonaType = {
    personas: Persona[],
    setPersonas: any
};

const PersonaTabs: React.FC<PersonaType> = (props) => {
    const { personas, setPersonas } = props

    const COLORS = ["#52c41a", "#fa8c16", "#722ed1", "#eb2f96"]

    const genExtra2 = (persona: Persona, index: number) => (

        <div>
            {!persona.completed && <Tag color="red">Incomplete Persona</Tag>}
            {persona.completed && <Tag color="success">Completed Persona</Tag>}

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

    function getColor(val: number) {
        var delta = COLORS.length - 1;
        if (val > delta)
            return COLORS[0];
        return COLORS[val];
    }

    const getHeader = (name: string, index: number) => (
        <>    <Avatar style={{ backgroundColor: getColor(index) }} icon={<UserOutlined />} />
            <strong style={{ margin: "5px" }}>{name}</strong></>
    );

    function updatePersona(n_persona: Persona) {
        console.log(n_persona)
    }

    return (
        <div>

            {
                personas.length != 0 ? (
                    <Collapse>

                        {personas.map((persona, index) => (
                            <Panel header={getHeader(persona.name, index)} key={"panel-" + persona.id}
                                style={{ borderColor: getColor(index) }}

                                extra={genExtra2(persona, index)}>

                                <Card title="Details" type="inner"
                                    extra={<Button
                                        type="primary"
                                        // onClick={showModal}
                                        htmlType="button"
                                        icon={<SaveOutlined />}
                                    >
                                        Save Details
                                    </Button>}
                                >
                                    <PersonaForm persona={persona} updatePersona={updatePersona} />
                                </Card>

                                <PersonaTab persona={persona} updatePersona={updatePersona}></PersonaTab>
                            </Panel>
                        ))}
                    </Collapse>
                ) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Personas" />
            }
        </div>


    );
};

export default PersonaTabs;
