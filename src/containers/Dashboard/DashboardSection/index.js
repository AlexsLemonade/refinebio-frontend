import React from 'react';
import DashboardItem from '../DashboardItem';
import './DashboardSection.scss';

const DashboardSection = props => {
  const { title, charts, isLoading } = props;

  return (
    <section className="dashboard-section">
      <h2 className="dashboard-section__title">{title}</h2>
      <div className="dashboard-section__grid">
        {charts.map((chart, i) => {
          const { type, title, data, size, series } = chart;
          return (
            <DashboardItem
              key={i}
              type={type}
              data={data}
              title={title}
              size={size}
              series={series}
              isLoading={isLoading}
            />
          );
        })}
      </div>
    </section>
  );
};

export default DashboardSection;
