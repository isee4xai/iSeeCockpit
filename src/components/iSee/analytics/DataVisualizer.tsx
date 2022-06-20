import { Area, Column, Gauge, Line, Pie, WordCloud } from '@ant-design/plots';
import { useState } from 'react';

import {
  AreaChartOutlined,
  BarChartOutlined,
  CloudOutlined,
  DashboardOutlined,
  LineChartOutlined,
  PieChartOutlined,
} from '@ant-design/icons';

import './DataVisualizer.less';

const AreaSettings = {
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
  smooth: true,
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
  smooth: true,
};

const WordCloudSettings = {
  color: '#122c6a',
  wordStyle: {
    fontFamily: 'Verdana',
    // fontSize: [24, 80],
  },
  interactions: [
    {
      type: 'element-active',
    },
  ],
  state: {
    active: {
      style: {
        lineWidth: 3,
      },
    },
  },
};

const DataVisualizer: React.FC<{
  // Record create an object with any key that has a value of string or number
  data: Record<string, any>[] | number;
  defaultType?: string;
  height?: number;
  autorizedType?: string[];
}> = ({
  defaultType = 'Pie',
  data,
  height = 200,
  autorizedType = ['Pie', 'Line', 'Column', 'Area', 'Gauge', 'Wordcloud'],
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
      case 'Wordcloud':
        console.log('wordCLoud');
        if (data instanceof Array) {
          const wordData: Record<string, number> = data
            .map((option) => {
              const key = Object.keys(option);
              return (option[key[0]] + ' ').repeat(option[key[1]]);
            })
            .join('')
            .replace(/  +/g, ' ')
            .split(' ')
            .reduce((acc, cur) => {
              if (cur.trim() !== '') {
                if (acc[cur]) {
                  acc[cur]++;
                } else {
                  acc[cur] = 1;
                }
              }
              return acc;
            }, {});

          const finalData: { x: string; value: number }[] = Object.entries(wordData).map(
            ([word, frequency]) => {
              return { x: word, value: frequency };
            },
          );

          return (
            <WordCloud
              {...WordCloudSettings}
              wordField={'x'}
              weightField={'value'}
              height={height}
              data={finalData}
            />
          );
        }
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
        if (data instanceof Array) {
          const total = [...data].reverse().reduce(
            (acc, curr, idx) => {
              return [
                acc[0] + idx * (1 / (data.length - 1)) * curr[Object.keys(curr)[1]],
                acc[1] + curr[Object.keys(curr)[1]],
              ];
            },
            [0, 0],
          );

          return <Gauge {...GaugeSettings} percent={total[0] / total[1]} height={height} />;
        }

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
          {autorizedType.includes('Wordcloud') && (
            <button
              className={type === 'Wordcloud' ? 'activeType' : ''}
              onClick={() => setType('Wordcloud')}
            >
              <CloudOutlined />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DataVisualizer;
