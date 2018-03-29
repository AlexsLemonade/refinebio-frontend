import React from 'react';
import PieChart from '../PieChart';
import './ResponsiveChart.scss';

const ResponsiveChart = props => {
  const { type, title, data } = props;

  const renderChart = (type, data) => {
    switch (type.toLowerCase()) {
      case 'text': {
        return <h3 className="responsive-chart__text">{data}</h3>;
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
    <div className="responsive-chart">
      <h2 className="responsive-chart__title">{title}</h2>
      <div className="responsive-chart__container">
        <div className="responsive-chart__absolute">
          {renderChart(type, data)}
        </div>
      </div>
    </div>
  );
};

export default ResponsiveChart;
