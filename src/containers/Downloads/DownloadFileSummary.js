import React from 'react';

const DownloadFileSummary = ({ summaryData }) => {
  return (
    <section className="downloads__section">
      <h2>Download Files Summary</h2>
      <div className="downloads__cards">
        {summaryData.map((card, i) => (
          <div className="downloads__card" key={i}>
            <h4>{card.title}</h4>
            <p>{card.description}</p>
            <div className="downloads__card-stats">
              <p className="downloads__card-stat">Total Size: {card.size}</p>
              <p className="downloads__card-stat">Format: {card.format}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DownloadFileSummary;
