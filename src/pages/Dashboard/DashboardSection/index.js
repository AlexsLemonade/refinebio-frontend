import React from 'react';
import DashboardItem from '../DashboardItem';
import './DashboardSection.scss';

const DashboardSection = props => {
  const { title, charts, isLoading, range } = props;

  return (
    <section className="dashboard-section">
      <h2 className="dashboard-section__title">{title}</h2>
      <div className="dashboard-section__grid">
        {charts.map((chart, i) => {
          return (
            <DashboardItem
              key={i}
              {...chart}
              isLoading={isLoading}
              range={range}
            />
          );
        })}
      </div>
    </section>
  );
};

export default DashboardSection;
