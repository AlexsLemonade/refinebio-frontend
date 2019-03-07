import React from 'react';
import PieChart from '../../../components/PieChart';
import LineChart from '../../../components/LineChart';
import AreaChart from '../../../components/AreaChart';
import './DashboardItem.scss';
import moment from 'moment';

const formatTimeLabel = range => label => {
  const format =
    {
      day: 'HH:00',
      week: 'dddd',
      month: 'MMM Do',
      year: 'MMMM'
    }[range] || null;
  return moment(label).format(format);
};

const DashboardItem = props => {
  const { type, title, data, size = 'small', series, range } = props;

  const renderChart = (type, data) => {
    switch (type.toLowerCase()) {
      case 'text': {
        return <h3 className="responsive-chart__text">{data}</h3>;
      }
      case 'pie': {
        return <PieChart data={data} />;
      }
      case 'line': {
        return <LineChart data={data} series={series} />;
      }
      case 'area': {
        return <AreaChart data={data} series={series} />;
      }
      default: {
        return null;
      }
    }
  };

  const isChart = type !== 'text';

  return (
    <div className={`responsive-chart responsive-chart--${size}`}>
      <h2 className="responsive-chart__title">{title}</h2>
      <div
        className={`responsive-chart__container responsive-chart__container--${size}`}
      >
        <div className={isChart ? 'responsive-chart__absolute' : null}>
          {renderChart(type, data)}
        </div>
      </div>
    </div>
  );
};

export default DashboardItem;
