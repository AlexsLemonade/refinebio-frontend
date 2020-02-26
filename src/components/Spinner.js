import React from 'react';

export default function Spinner({
  helixColor = '#002f6c',
  basePairColor = '#dace00',
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

  // helix curve as points for [start, control, control, end]
  const bezierPoints = [
    [0, 0],
    [0, sHeight / 2],
    [sWidth, sHeight / 2],
    [sWidth, sHeight],
  ];

  // generic function for defining a cubic bezier timing function returns [x(t), y(t)]
  const getBezier = (p0, p1, p2, p3) => {
    return [0, 1].map(axis => {
      return t =>
        (1 - t) ** 3 * p0[axis] +
        3 * (1 - t) ** 2 * t * p1[axis] +
        3 * (1 - t) * t ** 2 * p2[axis] +
        t ** 3 * p3[axis];
    });
  };

  // split the bezier points to be consumed by svg path
  const [m, ...c] = bezierPoints;

  const helixPath = {
    d: `M ${m.join(' ')} C ${[].concat(...c).join(', ')}`,
    stroke: helixColor,
    strokeWidth: sStrokeWidth,
    strokeLinecap: 'round',
    fill: 'transparent',
  };

  // get the helix position at % of x
  const [getOffsetX] = getBezier(...bezierPoints);

  const basePairLines = [...Array(5)].map((i, index, lines) => {
    const y = index * (sHeight / (lines.length * 2 + 1));
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
    };
  });

  // transforms to flip over center
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
        {basePairLines.map((line, index) => (
          <line
            {...line}
            style={{
              animationName: `spinner-pair-${index}`,
            }}
          />
        ))}
        {[...basePairLines].reverse().map((line, index) => (
          <line
            {...line}
            {...{ transform: flipY }}
            style={{
              animationName: `spinner-pair-reverse-${index}`,
            }}
          />
        ))}
      </svg>
    </div>
  );
}
