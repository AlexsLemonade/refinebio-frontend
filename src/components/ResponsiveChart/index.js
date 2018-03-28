import React from 'react';
import PieChart from '../PieChart';

const ResponsiveChart = props => {
  const { type, title, data } = props;

  const renderChart = (type, data) => {
    switch (type.toLowerCase()) {
      case 'text': {
        return <h3>{data}</h3>;
      }
      case 'pie': {
        return <PieChart data={data} />;
      }
      default: {
        return null;
      }
    }
  };

  return (
    <div
      style={{
        paddingBottom: '100%',
        width: '100%',
        position: 'relative',
        height: 0
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%'
        }}
      >
        <h2>{title}</h2>
        {renderChart(type, data)}
      </div>
    </div>
  );
};

export default ResponsiveChart;
