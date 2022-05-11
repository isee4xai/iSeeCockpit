import type { Persona } from '@/models/persona';
import { api_delete_persona } from '@/services/isee/usecases';
import { DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Collapse, Empty, message, Popconfirm, Tag } from 'antd';
import PersonaDetailsForm from './PersonaDetailsForm';
import PersonaIntents from './PersonaIntents';

const { Panel } = Collapse;

export type PersonaType = {
  usecaseId: string;
  personas: Persona[];
  setPersonas: any;
};

const PersonaTabs: React.FC<PersonaType> = (props) => {
  const { personas, setPersonas, usecaseId } = props;

  const COLORS = ['#52c41a', '#fa8c16', '#722ed1', '#eb2f96'];

  const genExtra2 = (persona: Persona) => (
    <div>
      {!persona.completed && <Tag color="red">Incomplete Persona</Tag>}
      {persona.completed && <Tag color="success">Completed Persona</Tag>}

      <Popconfirm
        title={'Are you sure to delete?'}
        onConfirm={async () => {
          console.log(persona);
          await api_delete_persona(usecaseId, persona.id);
          setPersonas(personas.filter((p) => p.id !== persona.id));
          message.error('Deleted Persona ' + persona.details.name);
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
    const delta = COLORS.length - 1;
    if (val > delta) return COLORS[0];
    return COLORS[val];
  }

  const getHeader = (name: string, index: number) => (
    <>
      {' '}
      <Avatar style={{ backgroundColor: getColor(index) }} icon={<UserOutlined />} />
      <strong style={{ margin: '5px' }}>{name}</strong>
    </>
  );

  function updatePersona(n_persona: Persona) {
    console.log(n_persona);
  }

  return (
    <div>
      {personas.length != 0 ? (
        <Collapse>
          {personas.map((persona, index) => (
            <Panel
              header={getHeader(persona.details.name, index)}
              key={'panel-' + persona.id}
              style={{ borderColor: getColor(index) }}
              extra={genExtra2(persona)}
            >
              <PersonaDetailsForm persona={persona} usecaseId={usecaseId} />

              <PersonaIntents
                usecaseId={usecaseId}
                persona={persona}
                updatePersona={updatePersona}
              />
            </Panel>
          ))}
        </Collapse>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Personas" />
      )}
    </div>
  );
};

export default PersonaTabs;
