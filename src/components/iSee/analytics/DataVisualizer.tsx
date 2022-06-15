import { Area, Column, Gauge, Line, Pie } from '@ant-design/plots';
import { useState } from 'react';

import {
  AreaChartOutlined,
  BarChartOutlined,
  DashboardOutlined,
  LineChartOutlined,
  PieChartOutlined,
} from '@ant-design/icons';

import './DataVisualizer.less';

const AreaSettings = {
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
const PieSettings = {
  appendPadding: 10,
  radius: 0.9,
  label: {
    type: 'inner',
    offset: '30%',
    content: ({ percent }: any) => `${(percent * 100).toFixed(0)}%`,
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
const GaugeSettings = {
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
const ColumnSettings = {
  label: {
    style: {
      fill: '#FFFFFF',
      opacity: 1,
    },
  },
  xAxis: {
    label: {
      autoHide: true,
      autoRotate: false,
    },
  },
};

const DataVisualizer: React.FC<{
  // Record create an object with any key that has a value of string or number
  data: Record<string, string | number>[] | number;
  defaultType?: string;
  height?: number;
  autorizedType?: string[];
}> = ({
  defaultType = 'Pie',
  data,
  height = 200,
  autorizedType = ['Pie', 'Line', 'Column', 'Area', 'Gauge'],
}) => {
  const [type, setType] = useState(defaultType);

  console.log(data instanceof Array, data);

  const generateVisualizer = () => {
    let label = 'label',
      value = 'value';

    if (data instanceof Array && data?.length === 0) {
      return <p style={{ textAlign: 'center' }}>no data to use !</p>;
    }

    if (data instanceof Array) {
      label = Object.keys(data?.[0])[0];
      value = Object.keys(data?.[0])[1];
    }

    switch (type) {
      case 'Pie':
        if (data instanceof Array) {
          return (
            <Pie
              {...PieSettings}
              colorField={label}
              angleField={value}
              data={data}
              height={height}
            />
          );
        }
      case 'Line':
        if (data instanceof Array) {
          return (
            <Line {...ColumnSettings} xField={label} yField={value} data={data} height={height} />
          );
        }
      case 'Column':
        if (data instanceof Array) {
          return (
            <Column {...ColumnSettings} xField={label} yField={value} data={data} height={height} />
          );
        }
      case 'Area':
        if (data instanceof Array) {
          return (
            <Area {...AreaSettings} xField={label} yField={value} data={data} height={height} />
          );
        }
      case 'Gauge':
        if (typeof data === 'number') {
          return <Gauge {...GaugeSettings} percent={data} height={height} />;
        }
      default:
        return <div>No visualizer found</div>;
    }
  };

  return (
    <div className={'dataVisualisation-container'}>
      {generateVisualizer()}

      {!(data instanceof Array && data?.length === 0) && (
        <div className={'changeVisualisation'}>
          {autorizedType.includes('Pie') && (
            <button className={type === 'Pie' ? 'activeType' : ''} onClick={() => setType('Pie')}>
              <PieChartOutlined />
            </button>
          )}
          {autorizedType.includes('Column') && (
            <button
              className={type === 'Column' ? 'activeType' : ''}
              onClick={() => setType('Column')}
            >
              <BarChartOutlined />
            </button>
          )}
          {autorizedType.includes('Area') && (
            <button className={type === 'Area' ? 'activeType' : ''} onClick={() => setType('Area')}>
              <AreaChartOutlined />
            </button>
          )}
          {autorizedType.includes('Line') && (
            <button className={type === 'line' ? 'activeType' : ''} onClick={() => setType('Line')}>
              <LineChartOutlined />
            </button>
          )}
          {autorizedType.includes('Gauge') && (
            <button
              className={type === 'Gauge' ? 'activeType' : ''}
              onClick={() => setType('Gauge')}
            >
              <DashboardOutlined />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DataVisualizer;
