import React from 'react';
import './Spinner.scss';

export default function Spinner({
  helixColor = '#143f77',
  basePairColor = '#dcd011',
  scale = 1,
  width = 24,
  height = 50,
  strokeWidth = 2,
  ...props
}) {
  // scaled properties
  const [sWidth, sHeight, sStrokeWidth, sPadding] = [
    width,
    height,
    strokeWidth,
    2 * strokeWidth,
  ].map(value => value * scale);

  // shape of the helix origin is 0, 0
  const bezierPoints = [
    [0, sHeight / 2],
    [sWidth, sHeight / 2],
    [sWidth, sHeight],
  ];

  // get a function to get position of the helix
  const getBezier = (p0, p1, p2, p3) => {
    return [0, 1].map(axis => {
      return t =>
        Math.pow(1 - t, 3) * p0[axis] +
        3 * Math.pow(1 - t, 2) * t * p1[axis] +
        3 * (1 - t) * Math.pow(t, 2) * p2[axis] +
        Math.pow(t, 3) * p3[axis];
    });
  };

  // get the helix position at % of x or y
  const [getOffsetX] = getBezier([0, 0], ...bezierPoints);

  const helixPath = {
    d: ['M 0 0', 'C', [].concat(...bezierPoints).join(', ')].join(' '),
    stroke: helixColor,
    strokeWidth: sStrokeWidth,
    strokeLinecap: 'round',
    fill: 'transparent',
  };

  const basePairLines = [...Array(10)]
    .map((val, i, lines) => {
      // change value to index to help with animation
      // looks like [0,1,2,3,4,4,3,2,1,0]
      const half = lines.length / 2;
      return i < half ? i : half - ((i % half) + 1);
    })
    .map((i, index, lines) => {
      const y = i * (sHeight / (lines.length + 1));
      const x = getOffsetX(1 - (sHeight - y) / sHeight) + sPadding;

      return {
        key: `pair-${index}`,
        x1: x,
        y1: y,
        x2: sWidth - x,
        y2: y,
        stroke: basePairColor,
        strokeWidth: sStrokeWidth,
        strokeLinecap: 'round',
        style: {
          opacity: i === index ? 1 : 0,
          animationName: `spinner-pair${i === index ? '' : '-reverse'}-${i}`,
        },
      };
    });

  // short hand
  const flipX = `scale(-1, 1) translate(${-sWidth}, 0)`;
  const flipY = `scale(1, -1) translate(0, ${-sHeight})`;

  return (
    <div className="spinner" {...props}>
      <svg
        width={sWidth}
        height={sHeight}
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path {...helixPath} />
        <path {...helixPath} {...{ transform: flipX }} />
        {basePairLines.map((line, index, pairs) => (
          <line
            {...line}
            {...{ transform: index < pairs.length / 2 ? undefined : flipY }}
          />
        ))}
      </svg>
    </div>
  );
}
