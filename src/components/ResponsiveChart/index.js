import React from 'react';
import PieChart from '../PieChart';
import * as styles from './ResponsiveChart.module.scss';

const ResponsiveChart = props => {
  const { type, title, data } = props;

  const renderChart = (type, data) => {
    switch (type.toLowerCase()) {
      case 'text': {
        return <h3 className={styles.text}>{data}</h3>;
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
    <div className={styles.chart}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.container}>
        <div className={styles.absolute}>{renderChart(type, data)}</div>
      </div>
    </div>
  );
};

export default ResponsiveChart;
