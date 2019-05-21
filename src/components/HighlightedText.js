import React from 'react';

/**
 * Hightlight portions of a text.
 * thanks to https://stackoverflow.com/a/43235785/763705
 */
export default function HighlightedText({ text, highlight }) {
  if (!highlight) return text;

  // Split on highlight term and include term into parts, ignore case
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  return parts.map((part, i) =>
    part && part.toLowerCase() === highlight.toLowerCase() ? (
      <span key={i} className="text-highlight">
        {part}
      </span>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  );
}

const HightlightContext = React.createContext();

export function Hightlight({ match, children }) {
  return (
    <HightlightContext.Provider value={match}>
      {children}
    </HightlightContext.Provider>
  );
}

export function HText({ children }) {
  const match = React.useContext(HightlightContext);
  if (!match) {
    return children;
  }
  return <HighlightedText text={children} highlight={match} />;
}
